import { View,  StyleSheet } from 'react-native';
import React, { FC } from 'react';
import CustomeText from '../global/CustomeText';

const BreakerText:FC<{text:string}> = ({text}) => {
  return (
    <View style={styles.breakercontainer}>
        <View  style={styles.horizontalLine}/>
        <CustomeText style={styles.breakerText} fontFamily="Okra-Medium" fontSize={12}>
            {text}
        </CustomeText>
        <View style={styles.horizontalLine} />
    </View>
  );
};

export default BreakerText;

const styles = StyleSheet.create({
    breakercontainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginVertical:20,
        width:'80%',
    },
    horizontalLine:{
        flex:1,
        height:1,
        backgroundColor:'#ccc',
    },
    breakerText:{
        marginHorizontal:10,
        color:'#fff',
        opacity:0.8,
        textAlign:'center',
    },
});
