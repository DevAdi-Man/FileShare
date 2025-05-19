import {View, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import {optionStyles} from '../../styles/optionsStyles';
import Icons from '../global/Icons';
import {Colors} from '../../utils/Constants';
import CustomeText from '../global/CustomeText';
import {useTCP} from '../../service/TCPProvider';
import {navigate} from '../../utils/NavigationUtil';
import {pickDocument, pickImage} from '../../utils/libraryHelpers';

const Options: FC<{
  isHome?: boolean;
  onMediaPickedUp?: (media: any) => void;
  onFilePickedUp?: (file: any) => void;
}> = ({isHome, onFilePickedUp, onMediaPickedUp}) => {
  const {isConnected} = useTCP();

  const handleUniversalPicker = async (type: string) => {
    if (isHome) {
      if (isConnected) {
        navigate('ConnectionScreen');
      } else {
        navigate('SendScreen');
      }
      return;
    }

    if (type === 'images' && onMediaPickedUp) {
      pickImage(onMediaPickedUp);
    }

    if (type === 'file' && onFilePickedUp) {
      pickDocument(onFilePickedUp);
    }
  };
  return (
    <View style={optionStyles.container}>
      <TouchableOpacity
        style={optionStyles.subContainer}
        onPress={() => handleUniversalPicker('images')}>
        <Icons
          name="image"
          iconsFamily="Ionicons"
          color={Colors.primary}
          size={20}
        />
        <CustomeText
          fontFamily="Okra-Medium"
          style={{marginTop: 4, textAlign: 'center'}}>
          Photo
        </CustomeText>
      </TouchableOpacity>
      <TouchableOpacity
        style={optionStyles.subContainer}
        onPress={() => handleUniversalPicker('file')}>
        <Icons
          name="musical-notes-sharp"
          iconsFamily="Ionicons"
          color={Colors.primary}
          size={20}
        />
        <CustomeText
          fontFamily="Okra-Medium"
          style={{marginTop: 4, textAlign: 'center'}}>
          Audio
        </CustomeText>
      </TouchableOpacity>
      <TouchableOpacity
        style={optionStyles.subContainer}
        onPress={() => handleUniversalPicker('file')}>
        <Icons
          name="folder-open"
          iconsFamily="Ionicons"
          color={Colors.primary}
          size={20}
        />
        <CustomeText
          fontFamily="Okra-Medium"
          style={{marginTop: 4, textAlign: 'center'}}>
          Files
        </CustomeText>
      </TouchableOpacity>
      <TouchableOpacity
        style={optionStyles.subContainer}
        onPress={() => handleUniversalPicker('file')}>
        <Icons
          name="contacts"
          iconsFamily="MaterialCommunityIcons"
          color={Colors.primary}
          size={20}
        />
        <CustomeText
          fontFamily="Okra-Medium"
          style={{marginTop: 4, textAlign: 'center'}}>
          Contacts
        </CustomeText>
      </TouchableOpacity>
    </View>
  );
};

export default Options;
