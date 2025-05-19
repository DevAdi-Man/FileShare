import {produce} from 'immer';
import {Alert} from 'react-native';
import {useChunkStore} from '../DB/chunkStore';
import {Buffer} from 'buffer';

export const receivedFileACk = async (
  data: any,
  socket: any,
  setReceivedFile: any,
) => {
  const {setChunkStore, chunkStore} = useChunkStore.getState();
  if (chunkStore) {
    Alert.alert('There are files which need to be received wait Bro!');
    return;
  }

  setReceivedFile((prevData: any) =>
    produce(prevData, (draft: any) => {
      draft.push(data);
    }),
  );

  setChunkStore({
    id: data?.id,
    totalChnks: data?.totalChunks,
    name: data?.name,
    size: data?.size,
    mimeType: data?.mimeType,
    chunkArray: [],
  });

  if (!socket) {
    console.log('Socket not available');
    return;
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 10));
    console.log('FILE RECEIVED');
    socket.write(JSON.stringify({event: 'send_chunk_ack', chunkNo: 0}));
    console.log('REQUESTED FOR FIRST CHUNK.');
  } catch (error) {
    console.error('Error sending file:', error);
  }
};
export const sendChunkAck = async (
  chunkIndex: number,
  socket: any,
  setTotalSendBytes: (fn: (prev: number) => number) => void,
  setSendFile: (fn: (prevFiles: any) => any) => void,
) => {
  const {currentChunkSet, resetCurrentChunkSet} = useChunkStore.getState();

  if (!currentChunkSet) {
    Alert.alert('There are no chunks to be sent');
    return;
  }

  if (!socket) {
    console.error('Socket not available');
    return;
  }

  const {chunkArray, totalChunk, id} = currentChunkSet;

  if (!chunkArray || chunkIndex >= chunkArray.length) {
    console.error('Invalid chunk index');
    return;
  }

  try {
    await new Promise(resolve => setTimeout(resolve, 10));

    socket.write(
      JSON.stringify({
        event: 'receive_chunk_ack',
        chunk: chunkArray[chunkIndex].toString('base64'),
        chunkNo: chunkIndex,
      }),
    );

    setTotalSendBytes(prev => prev + chunkArray[chunkIndex].length);

    if (chunkIndex + 2 > totalChunk) {
      console.log('All chunks sent successfully.');
      setSendFile(prevFiles =>
        produce(prevFiles, (draftFiles: any[]) => {
          const fileIndex = draftFiles?.findIndex((f: any) => f.id === id);
          if (fileIndex !== -1) {
            draftFiles[fileIndex].available = true;
          }
        }),
      );
      resetCurrentChunkSet();
    }
  } catch (error) {
    console.error('Error sending file:', error);
  }
};

export const receivedChunkAck = async (
  chunk: any,
  chunkNo: any,
  socket: any,
  setTotalReceivedBytes: any,
  generateFile: any,
) => {
  const {chunkStore, resetChunkStore, setChunkStore} = useChunkStore.getState();

  if (!chunkStore) {
    console.log('Chunk Store is null');

    return;
  }

  try {
    const bufferChunk = Buffer.from(chunk, 'base64');

    const updatedChunkArray = [...(chunkStore.chunkArray || [])];

    updatedChunkArray[chunkNo] = bufferChunk;

    setChunkStore({
      ...chunkStore,

      chunkArray: updatedChunkArray,
    });

    setTotalReceivedBytes(
      (prevValue: number) => prevValue + bufferChunk.length,
    );
  } catch (error) {
    console.log('error updating chunk', error);
  }
  if (!socket) {
    console.log('Socket not available');
    return;
  }

  if (chunkNo + 1 === chunkStore?.totalchunk) {
    console.log('All Chunks Received ');
    generateFile();
    resetChunkStore();
    return;
  }
  try {
    await new Promise(resolve => setTimeout(resolve, 10));
    console.log('REQUESTED FOR NEXT CHUNK', chunkNo + 1);
    socket.write(JSON.stringify({event: 'send_chunk_ack', chunkNo: chunkNo + 1}));
  } catch (error) {
    console.error('Error sending file:', error);
  }
};
