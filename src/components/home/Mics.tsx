import { View,  StyleSheet, Image } from 'react-native';
import React from 'react';
import CustomeText from '../global/CustomeText';
import { commonStyles } from '../../styles/commonStyles';

const Mics = () => {
  return (
    <View style={styles.container}>
      <CustomeText fontSize={30} fontFamily="Okra-Bold">
        Explore
      </CustomeText>
      <Image source={require('../../assets/icons/adbanner.png')} style={styles.adBanner} />
      <View style={commonStyles.flexRowBetween}>
        <CustomeText fontFamily="Okra-Bold" style={styles.text} fontSize={22}>
          #1 World Best File Sharing App!
        </CustomeText>
        <Image source={require('../../assets/icons/share_logo.jpg')} style={styles.image}/>
      </View>
      <CustomeText fontFamily="Okra-Bold" style={styles.text2}>
        Made with ❤︎ - Dev.Adi_Man
      </CustomeText>
    </View>
  );
};

export default Mics;

const styles = StyleSheet.create({
  container:{
    paddingVertical:20,
  },
  adBanner:{
    width:'100%',
    height:120,
    resizeMode:'cover',
    borderRadius:10,
    marginVertical:25,
  },
  text:{
    opacity:0.5,
    width:'60%',
  },
  text2:{
    opacity:0.5,
    marginTop:10,
  },
  image:{
    resizeMode:'contain',
    height:120,
    width:'35%',
  },
});
