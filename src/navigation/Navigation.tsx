import React, {FC} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from '../screen/splashScreen';
import HomeScreen from '../screen/HomeScreen';
import SendScreen from '../screen/SendScreen';
import {navigationRef} from '../utils/NavigationUtil';
import ConnectionScreen from '../screen/ConnectionScreen';
import {StatusBar} from 'react-native';
import ReceiveScreen from '../screen/ReceiveScreen';
import ReceivedFileScreen from '../screen/ReceivedFileScreen';
import {TCPProvider} from '../service/TCPProvider';

const Stack = createNativeStackNavigator();

const Navigation: FC = () => {
  return (
    <TCPProvider>
      <NavigationContainer ref={navigationRef}>
        <StatusBar
          hidden
          animated={true}
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="SendScreen" component={SendScreen} />
          <Stack.Screen name="ReceiveScreen" component={ReceiveScreen} />
          <Stack.Screen name="ConnectionScreen" component={ConnectionScreen} />
          <Stack.Screen
            name="ReceivedFileScreen"
            component={ReceivedFileScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TCPProvider>
  );
};

export default Navigation;
