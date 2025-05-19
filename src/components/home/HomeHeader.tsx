import {View, SafeAreaView, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {homeHeaderStyles} from '../../styles/homeHeaderStyles';
import {commonStyles} from '../../styles/commonStyles';
import Icons from '../global/Icons';
import Svg, {Path, Defs, LinearGradient, Stop} from 'react-native-svg';
import {screenHeight, screenWidth, svgPath} from '../../utils/Constants';
import QRGenrateModel from '../models/QRGenrateModel';
const HomeHeader = () => {
  const [isVisible, setvisible] = useState(false);
  return (
    <View style={homeHeaderStyles.mainContainer}>
      <SafeAreaView style={styles.safe}/>
      <View style={[commonStyles.flexRowBetween, homeHeaderStyles.container]}>
        <TouchableOpacity>
          <Icons iconsFamily="Ionicons" name="menu" size={22} color="#fff" />
        </TouchableOpacity>
        <Image
          source={require('../../assets/images/logo_t.png')}
          style={homeHeaderStyles.logo}
        />
        <TouchableOpacity onPress={() => setvisible(true)}>
          <Image
            source={require('../../assets/images/profile.jpg')}
            style={homeHeaderStyles.profile}
          />
        </TouchableOpacity>
      </View>
      <Svg
        height={screenHeight * 0.175}
        width={screenWidth}
        viewBox="0 0 1440 220"
        style={homeHeaderStyles.curve}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#007AFF" stopOpacity="1" />
            <Stop offset="100%" stopColor="#80BFFF" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        <Path fill="#80BFFF" d={svgPath} />
        <Path fill="url(#grad)" d={svgPath} />
      </Svg>

      {isVisible && (
        <QRGenrateModel visible={isVisible} onClose={() => setvisible(false)} />
      )}
    </View>
  );
};

export default HomeHeader;
const styles = StyleSheet.create({
  safe: {
    marginTop: 14,
  },
});
