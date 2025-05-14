import React, {act, useEffect, useState} from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Image,
  ImageStyle,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './transfer_styles';
import images from '../../component/contants';
import {useSelector, useDispatch} from 'react-redux';
import {
  logout,
  setDetailsItem,
  setDetailsItemSelected,
} from '../../redux/slice_index';
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
      const response = await fetch(
        `https://pos.foxai.com.vn:8123/api/Production/getTranferRequest${selectedTranferId}?DocEntry=${getSelectedItem.docEntry}&docDate=${docDate}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData?.accessToken}`,
          },
        },
      );
      const details = await response.json();
      console.log('response', response);

      console.log('detailsssssssssssssssssssss', details);
      if (response.ok) {
        setListData(details);
      }
    } catch {}
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
      // setIsCameraOn(true);
      //   navigate(SCREEN_NAMES.WEIGHT_SCREEN, {
      //     dataProps: listDatas,
      // dataSelected: selectedData1,
      //   }
      // );
      setModalWeightVisible(!modalWeightVisible);

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
      const formattedValue = `${listDatasSelected.itemCode}''${listDatasSelected.batchNumber}`;
      if (qrData === formattedValue) {
        console.log('QR hợp lệ');
        setIsCameraOn(false);
        setIsBlocked(listDatasSelected.itemCode);
        navigate(SCREEN_NAMES.WEIGHT_SCREEN);
      } else {
        console.log('QR k hợp lệ');
        setIsCameraOn(false);
        // setIsBlocked(listDatasSelected.proCode);
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
      <Text style={[styles.mainConTentText, {flex: 1}]}>{item}</Text>
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
    console.log(
      `API: https://pos.foxai.com.vn:8123/api/Production/addIssue?Status=${apiStatus}`,
    );

    try {
      const response = await fetch(
        `https://pos.foxai.com.vn:8123/api/Production/addIssue?Status=${apiStatus}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData?.accessToken}`,
          },
          body: JSON.stringify(listDatas.items),
        },
      );
      console.log('resss', response);

      const data = await response.json();
      console.log('API response', data);

      if (response.ok) {
        console.log('data api back: ', data);
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
          console.log('error: ', data);
          // Alert.alert('Error', `Failed to save data: ${errors.errors}`);
        } else if (action === 'sync') {
          console.log('error: ', data);
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
            // dispatch(setDetailsItemSelected(item));
            setSelectedData1(item);
            handleQR();
          }}
          style={[
            styles.mainConTentText,
            {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isSynced ? 0.5 : 1,
              backgroundColor: isSynced ? 'lightgrey' : 'white',
            },
          ]}
          disabled={isSynced}>
          <Image source={images.qr_code} style={styles.icon}></Image>
        </TouchableOpacity>
        <Text style={[styles.mainConTentText, {flex: 0.8}]}>
          {item.requiredQuantity}
        </Text>
        <Text
          style={[
            styles.mainConTentText,
            {
              flex: 0.8,
              backgroundColor:
                isBlocked === item.itemCode ? '#CCCCCC' : 'white',
            },
          ]}>
          {item.quantity}
        </Text>
        <Text style={[styles.mainConTentText, {flex: 0.8}]}>
          {item.calculatedQuantity | item.quantity}
        </Text>
        <Text style={[styles.mainConTentText, {flex: 0.8}]}>
          {(item.remainingQuantity = item.requiredQuantity - item.quantity)}
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
              handleSetting();
            }}>
            <Image source={images.account} style={styles.icon as ImageStyle} />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <View style={{flex: 1}}>
            <View style={styles.headerContent}>
              <View style={styles.headerContentCol}>
                <View style={styles.headerContentItem}>
                  <Text style={styles.normalText}>{`Mã CT: ${
                    listDatas?.items?.docCode || null
                  }`}</Text>
                </View>
                <View
                  style={[styles.headerContentItem, {flexDirection: 'row'}]}>
                  <Text style={styles.normalText}>{`Ngày xuất kho: `}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalCalendarVisible(true);
                      console.log('modal press');
                      console.log('modal visible: ', modalWeightVisible);
                    }}>
                    <Text
                      style={[styles.normalText, {backgroundColor: 'red'}]}>{`${
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
                    ]}>{`Kho xuất: ${listDatas?.items?.whsCode || null}`}</Text>
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
                        backgroundColor: 'red',
                        justifyContent: 'flex-end',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.normalText,
                        {textAlign: 'right'},
                      ]}>{`Mã yêu cầu ck: `}</Text>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        backgroundColor: 'red',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        setIsSelecting(!isSelecting);
                        // renderTranferId();
                      }}>
                      <Text style={styles.normalText}>
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
                <Text style={[styles.mainConTentText, {flex: 0.8}]}>
                  SL xuất tt
                </Text>
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
