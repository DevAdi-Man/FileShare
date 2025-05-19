import {View,  TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {bottomTabStyles} from '../../styles/bottomTabStyle';
import Icons from '../global/Icons';
import {navigate} from '../../utils/NavigationUtil';
import QRScannerModel from '../models/QRScannerModel';

const AbsoluteQRBottom = () => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <>
      <View style={bottomTabStyles.container}>
        <TouchableOpacity onPress={() => navigate('ReceivedFileScreen')}>
          <Icons
            name="apps-sharp"
            iconsFamily="Ionicons"
            color="#333"
            size={24}
          />
        </TouchableOpacity>
        <TouchableOpacity style={bottomTabStyles.qrCode} onPress={() => setIsVisible(true)}>
          <Icons
            name="qrcode-scan"
            iconsFamily="MaterialCommunityIcons"
            color="#fff"
            size={26}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icons
            name="beer-sharp"
            iconsFamily="Ionicons"
            color="#333"
            size={24}
          />
        </TouchableOpacity>
      </View>

      {isVisible && (<QRScannerModel visible={isVisible} onClose={()=> setIsVisible(false )} />)}
    </>
  );
};

export default AbsoluteQRBottom;
