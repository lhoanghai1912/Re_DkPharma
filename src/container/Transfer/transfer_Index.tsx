import React, {useEffect, useState} from 'react';
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
import {Calendar} from 'react-native-calendars';

const TransferScreen: React.FC = () => {
  const [selectedDocDate, SetSelectedDocDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const {getSelectedItem, listDatasSelected} = useSelector(
    (state: any) => state.item,
  );
  const {userData, itemData} = useSelector((state: any) => state.user);
  const [isBlocked, setIsBlocked] = useState<string | null>('');
  const [isCameraOn, setIsCameraOn] = useState(false); // State for camera activation
  const [isWeighOn, setIsWeighOn] = useState(false); // State for camera activation
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
        console.log('respon ok');
        // dispatch(setDetailsItem(details)); //Luw vao storee
        setListData(details.items);
      }
    } catch {}
  };
  useEffect(() => {
    if (userData?.accessToken && selectedTranferId) {
      fetchItemData();
    }
  }, [docDate, selectedTranferId, itemData.docEntry]);

  console.log('listDataslistDatas', listDatas);

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
    console.log('san pham co qr duoc chon', selectedData1);

    if (hasPermission == true) {
      console.log('Request Permission Accecpted');
      // setIsCameraOn(true);
      //   navigate(SCREEN_NAMES.WEIGHT_SCREEN, {
      //     dataProps: listDatas,
      //     dataSelected: selectedData1,
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

  const handleSetting = async () => {
    navigate(SCREEN_NAMES.SETTING_SCREEN);
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
        // console.log('selectedTranferId', selectedTranferId);
        setIsSelecting(!isSelecting);
      }}>
      <Text style={[styles.mainConTentText, {flex: 1}]}>{item}</Text>
    </TouchableOpacity>
  );

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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalCalendarVisible}
        onResponderEnd={() => {
          Alert.alert('Modal has been closed');
          setModalCalendarVisible(!modalCalendarVisible);
        }}>
        <View
          style={[
            styles.wrapModal,
            {
              flex: 1,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <Calendar
            style={[styles.calendar, {borderWidth: 1, marginTop: '7%'}]}
            onDayPress={day => {
              SetSelectedDocDate(day.dateString);
            }}
            markedDates={{
              [selectedDocDate]: {
                selected: true,
                disableTouchEvent: true,
                dotColor: 'orange',
              },
            }}></Calendar>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'space-around',
              width: '40%',
              marginTop: 15,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => {
                setDocDate(moment(selectedDocDate).format('YYYY-MM-DD')),
                  setModalCalendarVisible(!modalCalendarVisible);
              }}>
              <Text style={styles.normalText}>Xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() => {
                setModalCalendarVisible(false), SetSelectedDocDate(docDate);
              }}>
              <Text style={styles.normalText}>Hủy bỏ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalWeightVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalWeightVisible(!modalWeightVisible);
        }}>
        <View style={styles.wrapModal}>
          <View style={styles.wrapWeightModal}>
            <View style={styles.modalWeightHeader}>
              <TouchableOpacity></TouchableOpacity>
              <Text>Can chi tiet</Text>
              <TouchableOpacity onPress={() => {}}>
                <Image source={images.add_list} style={styles.icon}></Image>
              </TouchableOpacity>
            </View>
            <View style={styles.modalWeightBody}>
              <View style={styles.modalWeightBodyConten}>
                <Text style={[styles.modalColLable, {flex: 0.2}]}>STT</Text>
                <Text style={[styles.modalColLable, {flex: 0.8}]}>Mã NVL</Text>
                <Text style={[styles.modalColLable, {flex: 1}]}>Tên NVL</Text>
                <Text style={[styles.modalColLable, {flex: 0.4}]}>Số lô</Text>
                <TextInput
                  style={[styles.modalColLable, {flex: 0.6}]}
                  editable={false}>
                  Số lượng cân
                </TextInput>
                <Text style={[styles.modalColLable, {flex: 0.4}]}>
                  Đơn vị tính
                </Text>
                <TextInput style={[styles.modalColLable, {flex: 0.6}]}>
                  Ghi chú
                </TextInput>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
                    listDatas?.docCode || ''
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
                      moment(docDate).format('DD-MM-YYYY') || ''
                    }`}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.headerContentItem}>
                  <Text style={styles.normalText}>{`Trạng thái: ${
                    listDatas?.status || ''
                  }`}</Text>
                </View>
              </View>
              <View style={[styles.headerContentCol, {flex: 1.2}]}>
                <View style={styles.headerContentItem}>
                  <Text style={styles.normalText}>{`Lệnh sản xuất: ${
                    listDatas?.productionCode || ''
                  }`}</Text>
                </View>
                <View style={styles.headerContentItem}>
                  <Text style={styles.normalText}>{`Tên thành phẩm: ${
                    listDatas?.itemName || ''
                  }`}</Text>
                </View>
                <View style={styles.headerContentItem}>
                  <Text style={styles.normalText}>{`Kho xuất: ${
                    listDatas?.whsCode || ''
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
                    style={[styles.headerContentItem, {flexDirection: 'row'}]}>
                    <Text style={styles.normalText}>{`Mã yêu cầu ck: `}</Text>
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
                        {`${selectedTranferId || ''}`}
                      </Text>
                      <Image
                        source={
                          isSelecting ? images.up_white : images.down_white
                        }
                        style={[styles.iconArrow, {marginLeft: 5}]}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.headerContentItem}>
                    <Text style={styles.normalText}>{`Mã thành phẩm: ${
                      listDatas?.itemCode || ''
                    }`}</Text>
                  </View>
                  <View style={styles.headerContentItem}>
                    <Text style={styles.normalText}>{`Người nhập: ${
                      listDatas?.creator || ''
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
                    data={listDatas?.tranferId}
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
                  data={listDatas?.apP_WTQ1 || []}
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
    </View>
  );
};

export default TransferScreen;
