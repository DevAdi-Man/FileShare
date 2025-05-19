import {
  View,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import RNFS from 'react-native-fs';
import Icons from '../components/global/Icons';
import LinearGradient from 'react-native-linear-gradient';
import {sendStyles} from '../styles/sendStyles';
import CustomeText from '../components/global/CustomeText';
import {Colors} from '../utils/Constants';
import {connectionStyles} from '../styles/connectionStyles';
import {formatFileSize} from '../utils/libraryHelpers';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {goBack} from '../utils/NavigationUtil';

const ReceivedFileScreen: FC = () => {
  const [receivedFile, setReceivedFile] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getFilesFromDirectory = async () => {
    setIsLoading(true);
    const platformPath =
      Platform.OS === 'android'
        ? `${RNFS.DownloadDirectoryPath}/`
        : `${RNFS.DocumentDirectoryPath}/`;

    try {
      const exist = await RNFS.exists(platformPath);
      if (!exist) {
        setReceivedFile([]);
        setIsLoading(false);
        return;
      }
      const files = await RNFS.readDir(platformPath);

      const formatFile = files.map(file => ({
        id: file.name,
        name: file.name,
        size: file.size,
        uri: file.path,
        mimeTypes: file.name.split('.').pop() || 'unknown',
      }));
      setReceivedFile(formatFile);
    } catch (err) {
      console.error(`Error fetching Files ${err}`);
      setReceivedFile([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFilesFromDirectory();
  }, []);

  const renderThumnail = (mimeType: string) => {
    switch (mimeType) {
      case 'mp3':
        return (
          <Icons
            name="musical-notes"
            size={16}
            color="blue"
            iconsFamily="Ionicons"
          />
        );
      case 'mp4':
        return (
          <Icons
            name="videocam"
            size={16}
            color="green"
            iconsFamily="Ionicons"
          />
        );
      case 'jpg':
        return (
          <Icons name="image" size={16} color="orange" iconsFamily="Ionicons" />
        );
      case 'pdf':
        return (
          <Icons name="document" size={16} color="red" iconsFamily="Ionicons" />
        );
      default:
        return (
          <Icons name="folder" size={16} color="gray" iconsFamily="Ionicons" />
        );
    }
  };

  const renderItem = ({item}: any) => (
    <View style={connectionStyles.fileItem}>
      <View style={connectionStyles.fileInfoContainer}>
        {renderThumnail(item?.mimeType)}
        <View style={connectionStyles.fileDetails}>
          <CustomeText numberOfLines={1} fontFamily="Okra-Bold" fontSize={10}>
            {item.name}
          </CustomeText>
          <CustomeText numberOfLines={1} fontFamily="Okra-Medium" fontSize={8}>
            {item.mimeType} • {formatFileSize(item.size)}
          </CustomeText>
        </View>
      </View>

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
    </View>
  );
  return (
    <LinearGradient
      colors={['#FFFFFF', '#CDDAEE', '#8DBAFF']}
      style={sendStyles.container}
      start={{x: 0, y: 1}}
      end={{x: 0, y: 0}}>
      <SafeAreaView style={styles.safe} />

      <View style={sendStyles.mainContainer}>
        <CustomeText
          fontFamily="Okra-Bold"
          fontSize={15}
          color="#fff"
          style={{textAlign: 'center', margin: 10}}>
          All Received Files
        </CustomeText>

        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : receivedFile.length > 0 ? (
          <View style={{flex: 1}}>
            <FlatList
              data={receivedFile}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              contentContainerStyle={connectionStyles.fileList}
            />
          </View>
        ) : (
          <View style={connectionStyles.noDataContainer}>
            <CustomeText
              numberOfLines={1}
              fontFamily="Okra-Medium"
              fontSize={11}>
              No files received yet.
            </CustomeText>
          </View>
        )}
      </View>
      <TouchableOpacity style={[sendStyles.backButton,styles.safe]} onPress={goBack}>
        <Icons
          name="arrow-back"
          iconsFamily="Ionicons"
          size={18}
          color="#000"
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default ReceivedFileScreen;
const styles = StyleSheet.create({
  safe: {
    marginTop: 16,
  },
});
