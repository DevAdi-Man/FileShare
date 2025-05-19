import { ScrollView, View} from 'react-native';
import React from 'react';
import {commonStyles} from '../styles/commonStyles';
import HomeHeader from '../components/home/HomeHeader';
import Mics from '../components/home/Mics';
import Options from '../components/home/Options';
import SendReceiveButton from '../components/home/SendReceiveButton';
import AbsoluteQRBottom from '../components/home/AbsoluteQRBottom';

const HomeScreen = () => {
  return (
    <View style={commonStyles.baseContainer}>
      <HomeHeader />
      <ScrollView contentContainerStyle={{paddingBottom:100,padding:15}} showsVerticalScrollIndicator={false} >
            <SendReceiveButton />
            <Options isHome />
            <Mics />
      </ScrollView>

      <AbsoluteQRBottom />
    </View>
  );
};

export default HomeScreen;


