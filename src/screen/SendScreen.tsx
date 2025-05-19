/* eslint-disable @typescript-eslint/no-unused-vars */
import {Animated, Easing, Image, TouchableOpacity, View} from 'react-native';
import React, {FC, useEffect, useState} from 'react';
import {useTCP} from '../service/TCPProvider';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import QRScannerModel from '../components/models/QRScannerModel';
import {sendStyles} from '../styles/sendStyles';
import Icons from '../components/global/Icons';
import CustomeText from '../components/global/CustomeText';
import BreakerText from '../components/ui/BreakerText';
import {Colors, screenWidth} from '../utils/Constants';
import LottieView from 'lottie-react-native';
import {goBack, navigate} from '../utils/NavigationUtil';
import dgram from 'react-native-udp';

const devicesNames = [
  'Oppo',
  'Vivo X1',
  'Redmi',
  'Samsung S56',
  'iphone 16',
  'OnePlus 9',
];

const SendScreen:FC = () => {
  const {connectedToServer, isConnected} = useTCP();

  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [nearbyDevices, setNearbyDevices] = useState<any[]>([]);

  const handleScan = (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const [connectionData, devicesNames] = data
      .replace('tcp://', '')
      .split('|');
    const [host, port] = connectionData.split(':');
    connectedToServer(host, parseInt(port, 10), devicesNames);
  };

  const handleGoBack = () => {
    goBack();
  };

  const listenForDevices = async () => {
    const server = dgram.createSocket({
      type: 'udp4',
      reusePort: true,
    });
    const port = 57143;
    server.bind(port, () => {
      console.log('Listening for nearby devices...');
    });

    server.on('message', (msg, rinfo) => {
      const [connectionData, otherDevices] = msg
        ?.toString()
        ?.replace('tcp://', '')
        ?.split('|');

      setNearbyDevices(prevDevices => {
        const deviceExists = prevDevices?.some(
          device => device?.name === otherDevices,
        );
        if (!deviceExists) {
          const newDevice = {
            id: `${Date.now()}_${Math.random()}`,
            name: otherDevices,
            image: require('../assets/icons/device.jpeg'),
            fullAddress: msg?.toString(),
            position: getRandomPosition(
              150,
              prevDevices?.map(d => d.position),
              50,
            ),
            scale: new Animated.Value(0),
          };
          Animated.timing(newDevice.scale, {
            toValue: 1,
            duration: 1500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start();
          return [...prevDevices, newDevice];
        }
        return prevDevices;
      });
    });
  };

  const getRandomPosition = (
    radius: number,
    exisitingPosition: {x: number; y: number}[],
    minDistance: number,
  ) => {
    let position: {x: number; y: number};
    let isOverlapping: boolean;

    do {
      const angle = Math.random() * 360;
      const distance = Math.random() * (radius - 50) + 50;
      const x = distance * Math.cos((angle + Math.PI) / 180);
      const y = distance * Math.sin((angle + Math.PI) / 180);

      position = {x, y};
      isOverlapping = exisitingPosition.some(pos => {
        const dx = pos.x - position.x;
        const dy = pos.y - position.y;
        return Math.sqrt(dx * dx + dy * dy) < minDistance;
      });
    } while (isOverlapping);

    return position;
  };

  useEffect(() => {
    if (isConnected) {
      navigate('ConnectionScreen');
    }
  }, [isConnected]);

  useEffect(() => {
    let udpServer: any;
    const setupServer = async () => {
      udpServer = await listenForDevices();
    };
    setupServer();

    return () => {
      if (udpServer) {
        udpServer.close(() => {
          console.log('UDP server closed.');
        });
      }
      setNearbyDevices([]);
    };
  }, []);
  return (
    <LinearGradient colors={['#FFFFFF', '#B689ED', '#A066E5']} style={sendStyles.container} start={{x:0,y:1}} end={{x:0,y:0}}>
      <SafeAreaView />

      <View style={sendStyles.mainContainer}>
        <View style={sendStyles.infoContainer}>
          <Icons name="search" iconsFamily="Ionicons" color="#fff" size={40} />

          <CustomeText
            fontFamily="Okra-Bold"
            color="#fff"
            fontSize={16}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{marginTop: 20}}>
            Looking for nearby devices.
          </CustomeText>

          <CustomeText
            fontFamily="Okra-Medium"
            color="#fff"
            fontSize={12}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{textAlign: 'center'}}>
            Ensure your device's hotspot is active and receiver device is
            connected to it.
          </CustomeText>
          <BreakerText text="or" />

          <TouchableOpacity
            style={sendStyles.qrButton}
            onPress={() => setIsScannerVisible(true)}>
            <Icons
              name="qrcode-scan"
              iconsFamily="MaterialCommunityIcons"
              size={16}
              color={Colors.primary}
            />
            <CustomeText fontFamily="Okra-Bold" color={Colors.primary}>
              Scan QR
            </CustomeText>
          </TouchableOpacity>
        </View>

        <View style={sendStyles.animationContainer}>
          <View style={sendStyles.lottieContainer}>
            <LottieView
              style={sendStyles.lottie}
              autoPlay
              loop={true}
              hardwareAccelerationAndroid
              source={require('../assets/animations/scanner.json')}
            />
            {nearbyDevices?.map(device => (
              <Animated.View
                key={device?.id}
                style={[
                  sendStyles.deviceDot,
                  {
                    transform: [{scale: device.scale}],
                    left: screenWidth / 2.33 + device.position?.x,
                    top: screenWidth / 2.2 + device.position?.y,
                  },
                ]}>
                <TouchableOpacity
                  style={sendStyles.popup}
                  onPress={() => handleScan(device?.fullAddress)}>
                  <Image source={device.image} style={sendStyles.deviceImage} />
                  <CustomeText
                    numberOfLines={1}
                    color="#333"
                    fontFamily="Okra-Bold"
                    fontSize={8}
                    style={sendStyles.deviceText}>
                    {device.name}
                  </CustomeText>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
          <Image
            source={require('../assets/images/profile.jpg')}
            style={sendStyles.profileImage}
          />
        </View>
        <TouchableOpacity onPress={handleGoBack} style={sendStyles.backButton}>
          <Icons
            name="arrow-back"
            iconsFamily="Ionicons"
            size={16}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      {isScannerVisible && (
        <QRScannerModel
          visible={isScannerVisible}
          onClose={() => setIsScannerVisible(false)}
        />
      )}
    </LinearGradient>
  );
};

export default SendScreen;
