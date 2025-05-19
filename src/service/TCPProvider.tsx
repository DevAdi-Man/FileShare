import 'react-native-get-random-values';
import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';
import {useChunkStore} from '../DB/chunkStore';
import TcpSocket from 'react-native-tcp-socket';
import DeviceInfo from 'react-native-device-info';
import {Alert, Platform} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import {produce} from 'immer';
import {Buffer} from 'buffer';
import RNFS from 'react-native-fs';
import {receivedChunkAck, receivedFileACk, sendChunkAck} from './TCPUtils';

interface TCPContextType {
  server: any;
  client: any;
  isConnected: boolean;
  connectedDevice: any;
  sendFile: any;
  receivedFile: any;
  totalSendBytes: number;
  totalReceivedBytes: number;
  startServer: (port: number) => void;
  connectedToServer: (host: string, port: number, deviceName: string) => void;
  sendMessage: (message: string | Buffer) => void;
  sendFileACk: (file: any, type: 'file' | 'image') => void;
  disconnect: () => void;
}

const TCPContext = createContext<TCPContextType | undefined>(undefined);

export const useTCP = (): TCPContextType => {
  const context = useContext(TCPContext);
  if (!context) {
    throw new Error('useTCP must be used withina TCPProvider');
  }

  return context;
};

const options = {
  keystore: require('../../tls_certs/server-keystore.p12'),
};

export const TCPProvider: FC<{children: React.ReactNode}> = ({children}) => {
  const [server, setServer] = useState<any>(null);
  const [client, setClient] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  const [serverSocket, setServerSocket] = useState<any>(null);
  const [sendFile, setSendFile] = useState<any>([]);
  const [receivedFile, setReceivedFile] = useState<any>([]);
  const [totalSendBytes, setTotalSendBytes] = useState<number>(0);
  const [totalReceivedBytes, setTotalReceivedBytes] = useState<number>(0);

  const {currentChunkSet, setCurrentChunkSet, setChunkStore} = useChunkStore();

  // Disconnet
  const disconnect = useCallback(() => {
    if (client) {
      client.destroy();
    }
    if (server) {
      server.close();
    }
    setReceivedFile([]);
    setSendFile([]);
    setCurrentChunkSet(null);
    setTotalReceivedBytes(0);
    setChunkStore(null);
    setIsConnected(false);
  }, [client, server, setChunkStore, setCurrentChunkSet]);

  //Start server
  const startServer = useCallback(
    (port: number) => {
      if (server) {
        console.log('Server is running');
        return;
      }
      const newServer = TcpSocket.createTLSServer(options, socket => {
        console.log('Client Connected: ', socket.address());

        setServerSocket(socket);
        socket.setNoDelay(true);
        socket.readableHighWaterMark = 1024 * 1024 * 1;
        socket.writableHighWaterMark = 1024 * 1024 * 1;

        socket.on('data', async data => {
          const parsedData = JSON.parse(data?.toString());
          if (parsedData?.event === 'connect') {
            setIsConnected(true);
            setConnectedDevice(parsedData?.deviceName);
          }

          if (parsedData.event === 'file_ack') {
            receivedFileACk(parsedData?.file, socket, setReceivedFile);
          }

          if (parsedData.event === 'send_chunk_ack') {
            sendChunkAck(
              parsedData?.chunkNo,
              socket,
              setTotalSendBytes,
              setSendFile,
            );
          }

          if (parsedData.event === 'receive_chunk_ack') {
            receivedChunkAck(
              parsedData?.chunk,
              parsedData?.chunkNo,
              socket,
              setTotalSendBytes,
              generateFile,
            );
          }
        });
        socket.on('close', () => {
          console.log('Client Disconnected');
          setReceivedFile([]);
          setSendFile([]);
          setCurrentChunkSet(null);
          setTotalReceivedBytes(0);
          setChunkStore(null);
          setIsConnected(false);
          disconnect();
        });

        socket.on('error', err => console.error('Socket Error: ', err));
      });

      newServer.listen({port, host: '0.0.0.0'}, () => {
        const address = newServer.address();
        console.log(
          `Server is running on ${address?.address}:${address?.port}`,
        );
      });

      newServer.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          console.error(`Port ${port} is already in use.`);
          Alert.alert(
            'Port in Use',
            `Port ${port} is already in use. Try a different port.`,
          );
        } else {
          console.error('Server error:', err);
        }
      });

      setServer(newServer);
    },
    [disconnect, server, setChunkStore, setCurrentChunkSet],
  );

  // Start client
  const connectedToServer = useCallback(
    (host: string, port: number, deviceName: string) => {
      const newClient = TcpSocket.connectTLS(
        {
          host,
          port,
          cert: true,
          ca: require('../../tls_certs/server-cert.pem'),
        },
        () => {
          setIsConnected(true);
          setConnectedDevice(deviceName);
          const myDeviceName = DeviceInfo.getDeviceNameSync();
          newClient.write(
            JSON.stringify({event: 'connect', deviceName: myDeviceName}),
          );
        },
      );
      newClient.setNoDelay(true);
      newClient.readableHighWaterMark = 1024 * 1024 * 1;
      newClient.writableHighWaterMark = 1024 * 1024 * 1;

      newClient.on('data', async data => {
        const parsedData = JSON.parse(data?.toString());

        if (parsedData.event === 'file_ack') {
          receivedFileACk(parsedData?.file, newClient, setReceivedFile);
        }

        if (parsedData.event === 'send_chunk_ack') {
          sendChunkAck(
            parsedData?.chunkNo,
            newClient,
            setTotalSendBytes,
            setSendFile,
          );
        }

        if (parsedData.event === 'receive_chunk_ack') {
          receivedChunkAck(
            parsedData?.chunk,
            parsedData?.chunkNo,
            newClient,
            setTotalSendBytes,
            generateFile,
          );
        }
      });
      newClient.on('close', () => {
        console.log('Connection Closed');
        setReceivedFile([]);
        setSendFile([]);
        setCurrentChunkSet(null);
        setTotalReceivedBytes(0);
        setChunkStore(null);
        setIsConnected(false);
        disconnect();
      });
      newClient.on('error', err => console.error('Client Error', err));
      setClient(newClient);
    },
    [disconnect, setChunkStore, setCurrentChunkSet],
  );

  // generateFile
  const generateFile = async () => {
    const {chunkStore, resetChunkStore} = useChunkStore.getState();

    if (!chunkStore) {
      console.log('No Chunks or files to process');
      return;
    }
    if (chunkStore?.totalchunk !== chunkStore.chunkArray.length) {
      console.error('Not all chunks have been received.');
      return;
    }

    try {
      const combinedChunks = Buffer.concat(chunkStore.chunkArray);
      const platformPath =
        Platform.OS === 'ios'
          ? `${RNFS.DocumentDirectoryPath}`
          : `${RNFS.DownloadDirectoryPath}`;
      const filePath = `${platformPath}/${chunkStore.name}`;

      await RNFS.writeFile(
        filePath,
        combinedChunks?.toString('base64'),
        'base64',
      );

      setReceivedFile((prevFile: any) =>
        produce(prevFile, (draftFiles: any) => {
          const fileIndex = draftFiles?.findIndex(
            (f: any) => f.id === chunkStore.id,
          );
          if (fileIndex !== -1) {
            draftFiles[fileIndex] = {
              ...draftFiles[fileIndex],
              uri: filePath,
              available: true,
            };
          }
        }),
      );
      console.log('File saved SuccessFully', filePath);
      resetChunkStore();
    } catch (err) {
      console.error('Error combining chunk or saving file: ', err);
    }
  };

  //SEND MESSAGE
  const sendMessage = useCallback(
    (message: string | Buffer) => {
      if (client) {
        client.write(JSON.stringify(message));
        console.log('Send from client:', message);
      } else if (server) {
        serverSocket.write(JSON.stringify(message));
        console.log('Send from server:', message);
      } else {
        console.error('No Client or server Socket available.');
      }
    },
    [client, server, serverSocket],
  );

  //Send file ack
  const sendFileACk = async (file: any, type: 'image' | 'file') => {
    if (currentChunkSet !== null) {
      Alert.alert('Wait for current file to be send!');
      return;
    }
    const normalizedPath =
      Platform.OS === 'ios' ? file?.uri?.replace('file://', '') : file?.uri;
    const fileData = await RNFS.readFile(normalizedPath, 'base64');
    const buffer = Buffer.from(fileData, 'base64');
    const CHUNK_SIZE = 1024 * 8;

    let totalChunks = 0;
    let offset = 0;
    let chunkArray = [];

    while (offset < buffer.length) {
      const chunk = buffer.slice(offset, offset + CHUNK_SIZE);
      totalChunks += 1;
      chunkArray.push(chunk);
      offset += chunk.length;
    }

    const rawData = {
      id: uuidv4(),
      name: type === 'file' ? file?.name : file?.fileName,
      size: type === 'file' ? file?.size : file?.fileSize,
      mimeType: type === 'file' ? 'file' : '.jpg',
      totalChunks,
    };
    setCurrentChunkSet({id: rawData?.id, chunkArray, totalChunks});

    setSendFile((prevData: any) =>
      produce(prevData, (draft: any) => {
        draft.push({
          ...rawData,
          uri: file?.uri,
        });
      }),
    );

    const socket = client || serverSocket;
    if (!socket) {
      return;
    }

    try {
      console.log('FILE ACKNOWLEDGE DONE');
      socket.write(JSON.stringify({event: 'file_ack', file: rawData}));
    } catch (error) {
      console.log('Error Sending File:', error);
    }
  };
  return (
    <TCPContext.Provider
      value={{
        server,
        client,
        isConnected,
        connectedDevice,
        sendFile,
        receivedFile,
        totalSendBytes,
        totalReceivedBytes,
        startServer,
        connectedToServer,
        disconnect,
        sendFileACk,
        sendMessage,
      }}>
      {children}
    </TCPContext.Provider>
  );
};
