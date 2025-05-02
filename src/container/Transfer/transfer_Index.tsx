import React, {useEffect, useState} from 'react';
import {
  Animated,
  FlatList,
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './transfer_styles';
import images from '../../component/contants';
import {useSelector, useDispatch} from 'react-redux';
import {setDetailsItem, setDetailsItemSelected} from '../../redux/slice_index';
import {SCREEN_NAMES} from '../../navigators/screen_names';
import {navigate} from '../../navigators/root_navigators';
import moment from 'moment';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

const TransferScreen: React.FC = () => {
  const [docDate, selectedDocDate] = useState(moment().format('YYYY-MM-DD'));
  const dispatch = useDispatch();
  const {getDetailsItem, getSelectedItem, getDetailsItemSelected} = useSelector(
    (state: any) => state.item,
  );
  const {userData, itemData} = useSelector((state: any) => state.user);
  const [isBlocked, setIsBlocked] = useState<string | null>('');
  const [isCameraOn, setIsCameraOn] = useState(false); // State for camera activation
  const [isWeighOn, setIsWeighOn] = useState(false); // State for camera activation
  const {hasPermission, requestPermission} = useCameraPermission();
  const [qrData, setQrData] = useState<any>();

  const device = useCameraDevice('back');

  const fetchItemData = async () => {
    try {
      const response = await fetch(
        `https://pos.foxai.com.vn:8123/api/Production/getTranferRequest${getSelectedItem.tranferId}?DocEntry=${getSelectedItem.docEntry}&docDate=${docDate}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData?.accessToken}`,
          },
        },
      );
      const details = await response.json();
      console.log('detailsssssssssssssssssssss', details);
      if (response.ok) {
        console.log('respon ok');
        dispatch(setDetailsItem(details)); //Luw vao storee
      }
    } catch {}
  };
  useEffect(() => {
    if (userData?.accessToken) {
      fetchItemData();
    }
  }, [docDate, itemData.tranferId, itemData.docEntry]);

  const handleBack = async () => {
    try {
      console.log('handleback pressed');
      navigate(SCREEN_NAMES.MENU_SCREEN);
    } catch (e) {
      console.log('error: ', e);
    }
  };

  const handleQR = async () => {
    requestPermission();
    if (hasPermission == true) {
      console.log('Request Permission Accecpted');
      setIsCameraOn(true);
      if (device == null) {
        console.log('device not found');
        return (
          <View>
            <Text>Device not found</Text>
          </View>
        );
      }
    } else {
      console.log('request permission denied');
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (code: any) => {
      setQrData(code[0]?.value);
      const formattedValue = `${getDetailsItemSelected.itemCode}''${getDetailsItemSelected.batchNumber}`;
      if (qrData === formattedValue) {
        console.log('QR hợp lệ');
        setIsCameraOn(false);
        setIsBlocked(getDetailsItemSelected.itemCode);
      } else {
        console.log('QR k hợp lệ');
        setIsCameraOn(false);
        // setIsBlocked(getDetailsItemSelected.proCode);
      }
    },
  });

  console.log('abcacwacpawdawdawd', isBlocked);
  const handleGoBack = async () => {
    setIsCameraOn(false);
    console.log('back to tranfer screen');
  };
  const renderItem = ({item, index}: any) => {
    return (
      <View style={styles.mainContentHeader}>
        <Text style={[styles.mainConTentText, {flex: 0.4}]}>{index + 1}</Text>
        <Text style={[styles.mainConTentText, {flex: 1}]}>{item.itemCode}</Text>
        <Text style={[styles.mainConTentText, {flex: 1}]}>{item.itemName}</Text>
        <Text style={[styles.mainConTentText, {flex: 0.6}]}>
          {item.batchNumber}
        </Text>
        <Text style={[styles.mainConTentText, {flex: 1.2}]}>
          {moment(item.expiryDate).format('DD-MM-YYYY')}
        </Text>
        <TouchableOpacity
          onPress={() => {
            dispatch(setDetailsItemSelected(item));
            handleQR();
          }}
          style={[
            styles.mainConTentText,
            {flex: 1, alignItems: 'center', justifyContent: 'center'},
          ]}>
          <Image source={images.qr_code} style={styles.icon}></Image>
        </TouchableOpacity>
        <Text style={[styles.mainConTentText, {flex: 0.8}]}>
          {item.requiredQuantity}
        </Text>
        <TextInput
          editable={isBlocked === item.itemCode ? false : true}
          style={[
            styles.mainConTentText,
            {
              flex: 0.8,
              backgroundColor:
                isBlocked === item.itemCode ? '#CCCCCC' : 'white',
            },
          ]}>
          {item.quantity}
        </TextInput>
        <Text style={[styles.mainConTentText, {flex: 0.8}]}>
          {item.calculatedQuantity}
        </Text>
        <Text style={[styles.mainConTentText, {flex: 0.8}]}>
          {item.remainingQuantity}
        </Text>
        <Text style={[styles.mainConTentText, {flex: 0.8}]}>
          {item.uomCode}
        </Text>
        <TextInput
          editable={isBlocked === item.itemCode ? false : true}
          style={[
            styles.mainConTentText,
            {
              flex: 1,
              backgroundColor:
                isBlocked === item.itemCode ? '#CCCCCC' : 'white',
            },
          ]}>
          {item.note}
        </TextInput>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          // {backgroundColor: 'red', display: 'none'},
          {display: isCameraOn ? 'none' : 'flex', flex: isCameraOn ? 0 : 1},
          // {display: isWeighOn ? 'none' : 'flex', flex: isWeighOn ? 0 : 1},
        ]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              handleBack();
            }}
            style={[styles.headerButtons, styles.icon]}>
            <Image style={styles.icon} source={images.back_white}></Image>
          </TouchableOpacity>
          <Text style={styles.headerText}>Xuất kho sản xuất</Text>
          <TouchableOpacity
            style={styles.headerButtons}
            onPress={() => {
              console.log('Button Pressed!');
            }}>
            <Image source={images.account} style={styles.icon as ImageStyle} />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <View style={styles.headerContent}>
            <View style={styles.headerContentCol}>
              <View style={styles.headerContentItem}>
                <Text style={styles.normalText}>{`Mã CT: ${
                  getDetailsItem?.docCode || ''
                }`}</Text>
              </View>
              <View style={styles.headerContentItem}>
                <Text style={styles.normalText}>{`Ngày xuất kho: ${
                  moment(getDetailsItem?.docDate).format('DD-MM-YYYY') || ''
                }`}</Text>
              </View>
              <View style={styles.headerContentItem}>
                <Text style={styles.normalText}>{`Trạng thái: ${
                  getDetailsItem?.status || ''
                }`}</Text>
              </View>
            </View>
            <View style={styles.headerContentCol}>
              <View style={styles.headerContentItem}>
                <Text style={styles.normalText}>{`Lệnh sản xuất: ${
                  getDetailsItem?.productionCode || ''
                }`}</Text>
              </View>
              <View style={styles.headerContentItem}>
                <Text style={styles.normalText}>{`Tên thành phẩm: ${
                  getDetailsItem?.itemName || ''
                }`}</Text>
              </View>
              <View style={styles.headerContentItem}>
                <Text style={styles.normalText}>{`Kho xuất: ${
                  getDetailsItem?.whsCode || ''
                }`}</Text>
              </View>
            </View>
            <View style={styles.headerContentCol}>
              <View style={styles.headerContentItem}>
                <Text style={styles.normalText}>{`Mã yêu cầu ck: ${
                  getDetailsItem?.tranferId || ''
                }`}</Text>
              </View>
              <View style={styles.headerContentItem}>
                <Text style={styles.normalText}>{`Mã thành phẩm: ${
                  getDetailsItem?.itemCode || ''
                }`}</Text>
              </View>
              <View style={styles.headerContentItem}>
                <Text style={styles.normalText}>{`Người nhập: ${
                  getDetailsItem?.creator || ''
                }`}</Text>
              </View>
            </View>
          </View>
          <View style={styles.mainContent}>
            <View style={styles.mainContentHeader}>
              <Text style={[styles.mainConTentText, {flex: 0.4}]}>STT</Text>
              <Text style={[styles.mainConTentText, {flex: 1}]}>Mã NVL</Text>
              <Text style={[styles.mainConTentText, {flex: 1}]}>Tên NVL</Text>
              <Text style={[styles.mainConTentText, {flex: 0.6}]}>Số lô</Text>
              <Text style={[styles.mainConTentText, {flex: 1.2}]}>
                Hạn sử dụng
              </Text>
              <Text style={[styles.mainConTentText, {flex: 1}]}>
                Kiểm tra QR
              </Text>
              <Text style={[styles.mainConTentText, {flex: 0.8}]}>
                SL theo yc
              </Text>
              <TextInput
                editable={false}
                style={[styles.mainConTentText, {flex: 0.8}]}>
                SL xuất tt
              </TextInput>
              <Text style={[styles.mainConTentText, {flex: 0.8}]}>
                Sl lũy kế
              </Text>
              <Text style={[styles.mainConTentText, {flex: 0.8}]}>
                SL còn lại
              </Text>
              <Text style={[styles.mainConTentText, {flex: 0.8}]}>ĐVT</Text>
              <TextInput
                editable={false}
                style={[styles.mainConTentText, {flex: 1}]}>
                Ghi chú
              </TextInput>
            </View>
            <View style={styles.mainContentBody}>
              <FlatList
                data={getDetailsItem?.apP_WTQ1 || []}
                renderItem={renderItem}
                keyExtractor={item => item.itemCode}
                style={[
                  {
                    flex: 1,
                    width: '100%',
                  },
                  // {display:modalVisible ? 'none' : 'flex'},
                ]}
              />
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => {
                // handleLogout();
              }}>
              <Text style={styles.bottonText}>Đăng xuất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.footerButton,
                // {backgroundColor: isPressabled ? 'blue' : '#CCCCCC'},
              ]}
              // disabled={!isPressabled}
              onPress={() => {
                // handleConfirm();
              }}>
              <Text style={styles.bottonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={[
          {display: isCameraOn ? 'flex' : 'none', flex: isCameraOn ? 1 : 0},
        ]}>
        <View style={{flex: 1}}>
          {device && (
            <Camera
              style={[
                StyleSheet.absoluteFill,
                {display: isCameraOn ? 'flex' : 'none', flex: 1},
              ]}
              device={device}
              isActive={isCameraOn}
              codeScanner={codeScanner}
            />
          )}
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            // {zIndex: 1},
            {
              display: isCameraOn ? 'flex' : 'none',
              width: 'auto',
              alignItems: 'center',
            },
          ]}
          onPress={handleGoBack}>
          <Text>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TransferScreen;
