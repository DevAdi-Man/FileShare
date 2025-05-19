import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {FC} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
interface IconsProps {
  color?: string;
  size: number;
  name: string;
  iconsFamily: 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons';
}

const Icons: FC<IconsProps> = ({color, size, name, iconsFamily}) => {
  return (
    <>
      {iconsFamily === 'Ionicons' && (
        <Ionicons name={name} size={RFValue(size)} color={color} />
      )}

      {iconsFamily === 'MaterialIcons' && (
        <MaterialIcons name={name} size={RFValue(size)} color={color} />
      )}

      {iconsFamily === 'MaterialCommunityIcons' && (
        <MaterialCommunityIcons
          name={name}
          size={RFValue(size)}
          color={color}
        />
      )}
    </>
  );
};

export default Icons;
