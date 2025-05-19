/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useTCP} from '../service/TCPProvider';
import Icons from '../components/global/Icons';
import {resetAndNavigate} from '../utils/NavigationUtil';
import LinearGradient from 'react-native-linear-gradient';
import {sendStyles} from '../styles/sendStyles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connectionStyles} from '../styles/connectionStyles';
import CustomeText from '../components/global/CustomeText';
import Options from '../components/home/Options';
import {formatFileSize} from '../utils/libraryHelpers';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {Colors} from '../utils/Constants';

const ConnectionScreen = () => {
  const {
    connectedDevice,
    disconnect,
    sendFileACk,
    sendFile,
    receivedFile,
    totalReceivedBytes,
    totalSendBytes,
    isConnected,
  } = useTCP();

  const [activeTab, setActiveTab] = useState<'SENT' | 'RECEIVED'>('SENT');

  const renderThumbnail = (mimeType: string) => {
    switch (mimeType) {
      case '.mp3':
        return (
          <Icons
            name="musical-notes"
            size={16}
            color="blue"
            iconsFamily="Ionicons"
          />
        );
      case '.mp4':
        return (
          <Icons
            name="videocam"
            size={16}
            color="green"
            iconsFamily="Ionicons"
          />
        );
      case '.jpg':
        return (
          <Icons name="image" size={16} color="orange" iconsFamily="Ionicons" />
        );
      case '.pdf':
        return (
          <Icons name="document" size={16} color="red" iconsFamily="Ionicons" />
        );
      default:
        return (
          <Icons name="folder" size={16} color="gray" iconsFamily="Ionicons" />
        );
    }
  };

  const onMediaPickedUp = (image: any) => {
    console.log('Picked image:', image);
    sendFileACk(image, 'image');
  };
  const onFilePickedUp = (file: any) => {
    console.log('Picked image:', file);
    sendFileACk(file, 'file');
  };

  useEffect(() => {
    if (!isConnected) {
      resetAndNavigate('HomeScreen');
    }
  }, [isConnected]);

  const handleTabChange = (tab: 'SENT' | 'RECEIVED') => {
    setActiveTab(tab);
  };

  const renderItem = ({item}: any) => {
    return (
      <View style={connectionStyles.fileItem}>
        <View style={connectionStyles.fileInfoContainer}>
          {renderThumbnail(item?.mimeType)}
          <View style={connectionStyles?.fileDetails}>
            <CustomeText numberOfLines={1} fontFamily="Okra-Bold" fontSize={10}>
              {item?.name}
            </CustomeText>
            <CustomeText numberOfLines={1}>
              {item?.mimeType} | {formatFileSize(item.size)}
            </CustomeText>
          </View>
        </View>

        {item?.available ? (
          <TouchableOpacity
            onPress={() => {
              const normalizePath =
                Platform.OS === 'ios' ? `file://${item?.uri}` : item?.uri;

              if (Platform.OS === 'ios') {
                ReactNativeBlobUtil.ios
                  .openDocument(normalizePath)
                  .then(() => console.log('File Open SuccesFully'))
                  .catch(err => console.error('Error opening File : ', err));
              } else {
                ReactNativeBlobUtil.android
                  .actionViewIntent(normalizePath, '*/*')
                  .then(() => console.log('File Open SuccesFully'))
                  .catch(err => console.error('Error opening File : ', err));
              }
            }}
            style={connectionStyles.openButton}>
            <CustomeText
              numberOfLines={1}
              fontFamily="Okra-Bold"
              color="#FFF"
              fontSize={9}>
              Open
            </CustomeText>
          </TouchableOpacity>
        ) : (
          <ActivityIndicator color={Colors.primary} size="small" />
        )}
      </View>
    );
  };
  return (
    <LinearGradient
      colors={['#FFFFFF', '#CDDAEE', '#8DBAFF']}
      style={sendStyles.container}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 0}}>
      <SafeAreaView />
      <View style={sendStyles.mainContainer}>
        <View style={connectionStyles.container}>
          <View style={connectionStyles.connectionContainer}>
            <View style={{width: '55%'}}>
              <CustomeText numberOfLines={1} fontFamily="Okra-Medium">
                Connect with
              </CustomeText>
              <CustomeText
                numberOfLines={1}
                fontFamily="Okra-Bold"
                fontSize={14}>
                {' '}
                {connectedDevice || 'Unknown'}
              </CustomeText>
            </View>

            <TouchableOpacity
              onPress={() => disconnect()}
              style={connectionStyles.disconnectButton}>
              <Icons
                name="remove-circle"
                size={12}
                color="red"
                iconsFamily="Ionicons"
              />
              <CustomeText
                numberOfLines={1}
                fontFamily="Okra-Bold"
                fontSize={10}>
                Disconnect
              </CustomeText>
            </TouchableOpacity>
          </View>

          <Options
            onMediaPickedUp={onMediaPickedUp}
            onFilePickedUp={onFilePickedUp}
          />

          <View style={connectionStyles.fileContainer}>
            <View style={connectionStyles.sendReceiveContainer}>
              <View style={connectionStyles.sendReceiveButtonContainer}>
                <TouchableOpacity
                  onPress={() => handleTabChange('SENT')}
                  style={[
                    connectionStyles.sendReceiveButton,
                    activeTab === 'SENT'
                      ? connectionStyles.activeButton
                      : connectionStyles.inactiveButton,
                  ]}>
                  <Icons
                    name="cloud-upload"
                    size={12}
                    color={activeTab === 'SENT' ? '#fff' : 'blue'}
                    iconsFamily="Ionicons"
                  />
                  <CustomeText
                    numberOfLines={1}
                    fontFamily="Okra-Bold"
                    fontSize={9}
                    color={activeTab === 'SENT' ? '#fff' : '#000'}>
                    SENT
                  </CustomeText>
                </TouchableOpacity>{' '}
                <TouchableOpacity
                  onPress={() => handleTabChange('RECEIVED')}
                  style={[
                    connectionStyles.sendReceiveButton,
                    activeTab === 'RECEIVED'
                      ? connectionStyles.activeButton
                      : connectionStyles.inactiveButton,
                  ]}>
                  <Icons
                    name="cloud-upload"
                    size={12}
                    color={activeTab === 'RECEIVED' ? '#fff' : 'blue'}
                    iconsFamily="Ionicons"
                  />
                  <CustomeText
                    numberOfLines={1}
                    fontFamily="Okra-Bold"
                    fontSize={9}
                    color={activeTab === 'RECEIVED' ? '#fff' : '#000'}>
                    RECEIVED
                  </CustomeText>
                </TouchableOpacity>
              </View>

              <View style={connectionStyles.sendReceiveDataContainer}>
                <CustomeText fontFamily="Okra-Bold" fontSize={9}>
                  {formatFileSize(
                    (activeTab === 'SENT'
                      ? totalSendBytes
                      : totalReceivedBytes) || 0,
                  )}
                </CustomeText>
                <CustomeText fontFamily="Okra-Bold" fontSize={12}>
                  /
                </CustomeText>
                <CustomeText fontFamily="Okra-Bold" fontSize={10}>
                  {activeTab === 'SENT'
                    ? formatFileSize(
                        sendFile?.reduce(
                          (total: number, file: any) => total + file.size,
                          10,
                        ),
                      )
                    : formatFileSize(
                        receivedFile?.reduce(
                          (total: number, file: any) => total + file.size,
                          0,
                        ),
                      )}
                </CustomeText>
              </View>
            </View>

            {(activeTab === 'SENT' ? sendFile?.length : receivedFile?.length) >
            0 ? (
              <FlatList
                data={activeTab === 'SENT' ? sendFile : receivedFile}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={connectionStyles.fileList}
              />
            ) : (
              <View style={connectionStyles.noDataContainer}>
                <CustomeText
                  numberOfLines={1}
                  fontFamily="Okra-Medium"
                  fontSize={11}>
                  {activeTab === 'SENT'
                    ? 'No files sent yet'
                    : 'No files received yet.'}
                </CustomeText>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => resetAndNavigate('HomeScreen')}
          style={sendStyles.backButton}>
          <Icons
            name="arrow-back"
            iconsFamily="Ionicons"
            size={16}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      <Text>ConnectionScreen</Text>
    </LinearGradient>
  );
};

export default ConnectionScreen;
