import { Image , View} from 'react-native';
import React, {FC, useEffect} from 'react';
import {navigate} from '../utils/NavigationUtil';
import { commonStyles } from '../styles/commonStyles';

const SplashScreen: FC = () => {
  const navigateHome = () => {
    navigate('HomeScreen');
  };

  useEffect(() => {
    const timeoutID = setTimeout(navigateHome, 1500);
    return () => clearTimeout(timeoutID);
  },[]);
  return (
    <View style={commonStyles.container }>
      <Image style={commonStyles.img} source={require('../assets/images/logo_text.png')} />
    </View>
  );
};

export default SplashScreen;

