import {
  View,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {modalStyles} from '../../styles/modalStyles';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import CustomeText from '../global/CustomeText';
import Icons from '../global/Icons';
import {Camera, CodeScanner, useCameraDevice} from 'react-native-vision-camera';
import { useTCP } from '../../service/TCPProvider';
import { navigate } from '../../utils/NavigationUtil';
interface ModelProps {
  visible: boolean;
  onClose: () => void;
}

const QRScannerModel: FC<ModelProps> = ({visible, onClose}) => {
  const {connectedToServer,isConnected} = useTCP();
  const [loading, setLoading] = useState(true);

  const [codeFound, setCodeFound] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const device = useCameraDevice('back') as any;
  const shimmerTranslateX = useSharedValue(-300);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{translateX: shimmerTranslateX.value}],
  }));

  useEffect(() => {
    const checkPermissions = async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      setHasPermission(cameraPermission === 'granted');
    };

    checkPermissions();

    if (visible) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  useEffect(() => {
    shimmerTranslateX.value = withRepeat(
      withTiming(300, {duration: 1500, easing: Easing.linear}),
      -1,
      false,
    );
  }, [shimmerTranslateX, visible]);

  const handleScan = (data:any)=>{
    const [connectionData,deviceName] = data.replace('tcp://','').split('|');
    const [host,port] = connectionData?.split(':');
    //connect to server
    connectedToServer(host,parseInt(port,10),deviceName);
  };

  const codeScanner = useMemo<CodeScanner>(()=>({
    codeTypes:['qr','codabar'],
    onCodeScanned:(codes)=>{
        if(codeFound){
            return;
        }
        console.log(`Scanner ${codes?.length} codes!`);
        if(codes?.length > 0){
            const scannedData = codes[0].value;
            console.log(scannedData);
            setCodeFound(true);
            handleScan(scannedData);
        }
    },
  }),[codeFound]);

  useEffect(()=>{
    if(isConnected){
      onClose();
      navigate('ConnectionScreen');
    }
  },[isConnected]);
  return (
    <Modal
      animationType="slide"
      visible={visible}
      presentationStyle="formSheet"
      onRequestClose={onClose}
      onDismiss={onClose}>
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.qrContainer}>
          {loading ? (
            <View style={modalStyles.skeleton}>
              <Animated.View style={[modalStyles.shimmerOverlay, shimmerStyle]}>
                <LinearGradient
                  colors={['#f3f3f3', '#fff', '#f3f3f3']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={modalStyles.shimmerGradient}
                />
              </Animated.View>
            </View>
          ) : (
            <>
              {!device || !hasPermission ? (
                <View style={modalStyles.skeleton}>
                  <Image
                    source={require('../../assets/images/no_camera.png')}
                  />
                </View>
              ) : (
                <View style={modalStyles.skeleton}>
                  <Camera
                    style={modalStyles.camera}
                    isActive={visible}
                    device={device}
                    codeScanner={codeScanner}
                  />
                </View>
              )}
            </>
          )}
        </View>
        <View style={modalStyles.info}>
          <CustomeText style={modalStyles.infoText1}>
            Ensure you are on same Wi-Fi Newtwork.
          </CustomeText>
          <CustomeText style={modalStyles.infoText2}>
            Ask the receiver to show QR code to connect and transfer files.
          </CustomeText>
        </View>

        <ActivityIndicator
          size="small"
          color="#000"
          style={{alignSelf: 'center'}}
        />
        <TouchableOpacity
          onPress={() => onClose()}
          style={modalStyles.closeButton}>
          <Icons name="close" iconsFamily="Ionicons" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default QRScannerModel;
