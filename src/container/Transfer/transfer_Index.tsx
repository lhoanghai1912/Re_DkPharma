import React, {act, useEffect, useState} from 'react';
import {
  Alert,
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
import {logout} from '../../redux/slice_index';
import {SCREEN_NAMES} from '../../navigators/screen_names';
import {navigate} from '../../navigators/root_navigators';
import moment from 'moment';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import WeightModal from '../Modal/weight_modal';
import CalendarModal from '../Modal/calendar_modal';
import {callApi} from '../../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../../component/loading_index';

const TransferScreen: React.FC = () => {
  const [selectedDocDate] = useState(moment().format('YYYY-MM-DD'));
  const {getSelectedItem, listDatasSelected} = useSelector(
    (state: any) => state.item,
  );
  const {userData, itemData} = useSelector((state: any) => state.user);
  const [isSynced, setIsSynced] = useState(false);
  const [isBlocked, setIsBlocked] = useState<string | null>('');
  const [isCameraOn, setIsCameraOn] = useState(false); // State for camera activation
  const {hasPermission, requestPermission} = useCameraPermission();
  const [qrData, setQrData] = useState<any>();
  const [isSelecting, setIsSelecting] = useState(false);
  const [modalCalendarVisible, setModalCalendarVisible] = useState(false);
  const [modalWeightVisible, setModalWeightVisible] = useState(false);
  const device = useCameraDevice('back');
  const [selectedTranferId, setSelectedTranferId] = useState(
    getSelectedItem?.tranferId[0],
  );
  const [selectedData1, setSelectedData1] = useState<any>();
  const [docDate, setDocDate] = useState(selectedDocDate);
  const [listDatas, setListData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  if (listDatas?.items) {
    listDatas.items.creator = userData?.user?.fullName;
  }
  // console.log('aaaaa111111111111', listDatas.items.status);
  useEffect(() => {
    if (
      listDatas?.items?.status === 'DONG BO' ||
      listDatas?.items?.status === 'ĐỒNG BỘ'
    ) {
      setIsSynced(true);
    } else {
      setIsSynced(false);
    }
  }, [listDatas]); // Chỉ cập nhật khi userData.status thay đổi
  const fetchItemData = async () => {
    try {
      const url = `https://pos.foxai.com.vn:8123/api/Production/getTranferRequest${selectedTranferId}?DocEntry=${getSelectedItem.docEntry}&docDate=${docDate}`;

      const data = await callApi(url, {method: 'GET'}, setIsLoading, () => {
        dispatch(logout());
      });
      setListData(data);
    } catch (e) {
      console.log('erro: ', e);
    }
  };
  useEffect(() => {
    if (userData?.accessToken && selectedTranferId) {
      fetchItemData();
    }
  }, [docDate, selectedTranferId, itemData.docEntry, itemData.quantity]);
  console.log('listdataaa', listDatas);

  const handleBack = async () => {
    try {
      navigate(SCREEN_NAMES.MENU_SCREEN);
    } catch (e) {
      console.log('error: ', e);
    }
  };
  const handleLogout = async () => {
    dispatch(logout());
  };

  const handleQR = async () => {
    requestPermission();

    if (hasPermission == true) {
      console.log('Request Permission Accecpted');
      setIsCameraOn(true);

      // setModalWeightVisible(!modalWeightVisible);

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
  useEffect(() => {
    console.log('selectedData1', selectedData1);
  }, [selectedData1?.apP_WTQ1_Sub?.id]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (code: any) => {
      setQrData(code[0]?.value);
      const formattedValue = `${selectedData1?.itemCode}''${selectedData1?.batchNumber}`;
      console.log('form', formattedValue);
      console.log('qrdata', qrData);

      if (qrData === formattedValue) {
        console.log('QR hợp lệ');
        setIsCameraOn(false);
        setModalWeightVisible(!modalWeightVisible);
        setIsBlocked(listDatasSelected?.itemCode);
      } else {
        console.log('QR k hợp lệ');
        setIsCameraOn(false);
        setIsBlocked(listDatasSelected?.proCode);
      }
    },
  });
  console.log('data day len api', listDatas?.items);

  const handleDateSelect = (date: string) => {
    setDocDate(date);
    setModalCalendarVisible(false);
  };

  const handleSetting = async () => {
    navigate(SCREEN_NAMES.SETTING_SCREEN);
  };
  const handleSaveData = async (updateData: any) => {
    setSelectedData1(updateData);
  };

  const handleGoBack = async () => {
    setIsCameraOn(false);
    console.log('back to tranfer screen');
  };
  const renderTranferId = ({item}: any) => (
    <TouchableOpacity
      style={styles.mainContentHeader}
      onPress={() => {
        setSelectedTranferId(item);
        setIsSelecting(!isSelecting);
      }}>
      <Text style={[styles.mainConTentBodyText, {flex: 1}]}>{item}</Text>
    </TouchableOpacity>
  );
  const handleConfirm = async (action: 'save' | 'sync') => {
    let apiStatus = '';
    if (action === 'save') {
      apiStatus = 'NHAP';
    } else if (action === 'sync') {
      apiStatus = 'DONG BO';
    }
    console.log('action', action);
    console.log('apistatus', apiStatus);
    console.log();

    try {
      const url = `https://pos.foxai.com.vn:8123/api/Production/addIssue?Status=${apiStatus}`;
      const dataBack = await callApi(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await AsyncStorage.getItem(
              'accessToken',
            )}`,
          },
          body: JSON.stringify(listDatas.items),
        },
        setIsLoading,
        () => dispatch(logout()),
      );
      if (dataBack) {
        console.log('API response', dataBack);
        fetchItemData();
        if (action === 'save') {
          Alert.alert('Success', 'Save data success');
        } else if (action === 'sync') {
          setIsSynced(true);
          Alert.alert('Success', 'Sync data success');
        }
        return;
      } else {
        if (action === 'save') {
          console.log('error: ', dataBack);
          // Alert.alert('Error', `Failed to save data: ${errors.errors}`);
        } else if (action === 'sync') {
          console.log('error: ', dataBack);
          Alert.alert('Error', 'Failed to sync data ');
        }
        return;
      }
    } catch (e) {
      console.log('erro11111111111111111111: ', e);
    }
  };
  const renderItem = ({item, index}: any) => {
    return (
      <View style={styles.mainContentHeader}>
        <Text style={[styles.mainConTentBodyText, {flex: 0.4}]}>
          {index + 1}
        </Text>
        <Text style={[styles.mainConTentBodyText, {flex: 1}]}>
          {item.itemCode}
        </Text>
        <Text style={[styles.mainConTentBodyText, {flex: 1}]}>
          {item.itemName}
        </Text>
        <Text style={[styles.mainConTentBodyText, {flex: 0.6}]}>
          {item.batchNumber}
        </Text>
        <Text style={[styles.mainConTentBodyText, {flex: 1.2}]}>
          {moment(item.expiryDate).format('DD-MM-YYYY')}
        </Text>
        <TouchableOpacity
          onPress={() => {
            // dispatch(setDetailsItemSelected(item));
            setSelectedData1(item);
            handleQR();
          }}
          style={[
            styles.mainConTentBodyText,
            {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isSynced ? 0.5 : 1,
              backgroundColor: isSynced ? 'lightgrey' : 'white',
              borderWidth: 1,
              borderRightWidth: 0,
            },
          ]}
          disabled={isSynced}>
          <Image source={images.qr_code} style={styles.icon}></Image>
        </TouchableOpacity>
        <Text style={[styles.mainConTentBodyText, {flex: 0.8}]}>
          {item.requiredQuantity}
        </Text>
        <Text
          style={[
            styles.mainConTentBodyText,
            {
              borderWidth: 1,
              borderRightWidth: 0,
              flex: 0.8,
              backgroundColor:
                isBlocked === item.itemCode ? '#CCCCCC' : 'white',
            },
          ]}>
          {item.quantity}
        </Text>
        <Text style={[styles.mainConTentBodyText, {flex: 0.8}]}>
          {item.calculatedQuantity | item.quantity}
        </Text>
        <Text style={[styles.mainConTentBodyText, {flex: 0.8}]}>
          {(item.remainingQuantity = item.requiredQuantity - item.quantity)}
        </Text>
        <Text style={[styles.mainConTentBodyText, {flex: 0.8}]}>
          {item.uomCode}
        </Text>
        <TextInput
          editable={
            isBlocked === item.itemCode || isSynced
              ? false
              : true
              ? false
              : true
          }
          style={[
            styles.mainConTentBodyText,
            {
              flex: 1,
              backgroundColor:
                isSynced || isBlocked === item.itemCode ? '#CCCCCC' : 'white',
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
              handleSetting();
            }}>
            <Image source={images.account} style={styles.icon as ImageStyle} />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          {isLoading ? (
            <LoadingScreen></LoadingScreen>
          ) : (
            <View style={{flex: 1}}>
              <View style={styles.headerContent}>
                <View style={styles.headerContentCol}>
                  <View style={styles.headerContentItem}>
                    <Text style={styles.normalText}>{`Mã CT: ${
                      listDatas?.items?.docCode || null
                    }`}</Text>
                  </View>
                  <View
                    style={[
                      styles.headerContentItem,
                      {
                        flexDirection: 'row',
                        alignContent: 'center',
                        alignItems: 'center',
                      },
                    ]}>
                    <Text style={styles.normalText}>{`Ngày xuất kho: `}</Text>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        {
                          width: 'auto',
                          paddingVertical: 0,
                          paddingHorizontal: 5,
                          alignItems: 'center',
                          marginBottom: 0,
                        },
                      ]}
                      onPress={() => {
                        setModalCalendarVisible(true);
                        console.log('modal press');
                        console.log('modal visible: ', modalWeightVisible);
                      }}>
                      <Text style={[styles.bottonText, {fontSize: 20}]}>{`${
                        moment(docDate).format('DD-MM-YYYY') || null
                      }`}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.headerContentItem}>
                    <Text style={styles.normalText}>{`Trạng thái: ${
                      listDatas?.items?.status || null
                    }`}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.headerContentCol,
                    {flex: 1.2, alignItems: 'center'},
                  ]}>
                  <View style={styles.headerContentItem}>
                    <Text
                      style={[
                        styles.normalText,
                        {textAlign: 'center'},
                      ]}>{`Lệnh sản xuất: ${
                      listDatas?.items?.productionCode || null
                    }`}</Text>
                  </View>
                  <View style={styles.headerContentItem}>
                    <Text
                      style={[
                        styles.normalText,
                        {textAlign: 'center'},
                      ]}>{`Tên thành phẩm: ${
                      listDatas?.items?.itemName || null
                    }`}</Text>
                  </View>
                  <View style={styles.headerContentItem}>
                    <Text
                      style={[
                        styles.normalText,
                        {textAlign: 'center'},
                      ]}>{`Kho xuất: ${
                      listDatas?.items?.whsCode || null
                    }`}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.headerContentCol,
                    {
                      flexDirection: 'row',
                      padding: 5,
                    },
                  ]}>
                  <View
                    style={{
                      flex: 1,
                      height: '100%',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={[
                        styles.headerContentItem,
                        {
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                        },
                      ]}>
                      <Text
                        style={[
                          styles.normalText,
                          {textAlign: 'right'},
                        ]}>{`Mã yêu cầu ck: `}</Text>
                      <TouchableOpacity
                        style={[
                          styles.button,
                          {
                            flexDirection: 'row',
                            width: 'auto',
                            paddingHorizontal: 5,
                            paddingVertical: 0,
                            alignItems: 'center',
                            marginBottom: 0,
                          },
                        ]}
                        onPress={() => {
                          setIsSelecting(!isSelecting);
                          // renderTranferId();
                        }}>
                        <Text style={[styles.bottonText, {fontSize: 20}]}>
                          {`${selectedTranferId || null}`}
                        </Text>
                        <Image
                          source={
                            isSelecting ? images.up_white : images.down_white
                          }
                          style={[styles.iconArrow, {marginLeft: 5}]}
                        />
                      </TouchableOpacity>
                    </View>

                    <View
                      style={[
                        styles.headerContentItem,
                        {alignItems: 'flex-end'},
                      ]}>
                      <Text style={styles.normalText}>{`Mã thành phẩm: ${
                        listDatas?.items?.itemCode || null
                      }`}</Text>
                    </View>
                    <View
                      style={[
                        styles.headerContentItem,
                        {alignItems: 'flex-end'},
                      ]}>
                      <Text style={styles.normalText}>{`Người nhập: ${
                        listDatas?.items?.creator || null
                      }`}</Text>
                    </View>
                  </View>

                  <View
                    style={[
                      // styles.pickerBody,
                      {
                        flex: 0.2,
                        flexDirection: 'column',
                        display: isSelecting ? 'flex' : 'none',
                      },
                    ]}>
                    <FlatList
                      data={listDatas?.items?.tranferId}
                      renderItem={renderTranferId}
                      keyExtractor={item => item.proCode}
                      style={{
                        flex: 1,
                      }}
                    />
                  </View>
                </View>
              </View>

              <View style={[styles.mainContent]}>
                <View
                  style={[
                    styles.mainContentHeader,
                    {backgroundColor: 'green'},
                  ]}>
                  <Text style={[styles.mainConTentHeaderText, {flex: 0.4}]}>
                    STT
                  </Text>
                  <Text style={[styles.mainConTentHeaderText, {flex: 1}]}>
                    Mã NVL
                  </Text>
                  <Text style={[styles.mainConTentHeaderText, {flex: 1}]}>
                    Tên NVL
                  </Text>
                  <Text style={[styles.mainConTentHeaderText, {flex: 0.6}]}>
                    Số lô
                  </Text>
                  <Text style={[styles.mainConTentHeaderText, {flex: 1.2}]}>
                    Hạn sử dụng
                  </Text>
                  <Text style={[styles.mainConTentHeaderText, {flex: 1}]}>
                    Kiểm tra QR
                  </Text>
                  <Text style={[styles.mainConTentHeaderText, {flex: 0.8}]}>
                    SL theo yc
                  </Text>
                  <Text style={[styles.mainConTentHeaderText, {flex: 0.8}]}>
                    SL xuất tt
                  </Text>
                  <Text style={[styles.mainConTentHeaderText, {flex: 0.8}]}>
                    Sl lũy kế
                  </Text>
                  <Text style={[styles.mainConTentHeaderText, {flex: 0.8}]}>
                    SL còn lại
                  </Text>
                  <Text style={[styles.mainConTentHeaderText, {flex: 0.8}]}>
                    ĐVT
                  </Text>
                  <TextInput
                    editable={false}
                    style={[styles.mainConTentHeaderText, {flex: 1}]}>
                    Ghi chú
                  </TextInput>
                </View>
                <View style={styles.mainContentBody}>
                  <FlatList
                    data={listDatas?.items?.apP_WTQ1 || []}
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
          )}
        </View>
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => {
                handleLogout();
              }}>
              <Text style={styles.bottonText}>Đăng xuất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.footerButton, {opacity: isSynced ? 0.5 : 1}]}
              disabled={isSynced}
              onPress={() => {
                handleConfirm('save');
              }}>
              <Text style={[styles.bottonText]}>Lưu Phiếu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.footerButton, {opacity: isSynced ? 0.5 : 1}]}
              disabled={isSynced}
              onPress={() => {
                handleConfirm('sync');
              }}>
              <Text style={[styles.bottonText]}>Đồng bộ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Camera */}
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
      <CalendarModal
        visible={modalCalendarVisible}
        selectedDate={docDate}
        onDateSelect={handleDateSelect}
        onClose={() => setModalCalendarVisible(!modalCalendarVisible)}
      />
      <WeightModal
        visible={modalWeightVisible}
        selectedData={[selectedData1]}
        onClose={() => setModalWeightVisible(!modalWeightVisible)}
        listDatas={listDatas}
        onSave={handleSaveData}
      />
    </View>
  );
};

export default TransferScreen;
