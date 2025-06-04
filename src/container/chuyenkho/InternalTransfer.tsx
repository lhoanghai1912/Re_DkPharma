import React, {useEffect, useState} from 'react';
import {
  Image,
  ImageStyle,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../Restore/restore_styles';
import images from '../../component/contants';
import moment from 'moment';
import {navigate} from '../../navigators/root_navigators';
import {SCREEN_NAMES} from '../../navigators/screen_names';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../redux/slice_index';
import ReasonModal from '../Modal/reason_modal';
import DepartmentModal from '../Modal/department_modal';
import WareHouseModal from '../Modal/wareHouse_modal';
import {callApi} from '../../api/apiClient';
import LoadingScreen from '../../component/loading_index';
import LinearGradient from 'react-native-linear-gradient';

const InternalTransferScreen = ({route}: {route: any}) => {
  const dataProp = route.params.dataProp;
  const dispatch = useDispatch();
  const [modalReasonVisible, setModalReasonVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState<any>([]);
  const [isSelectingReason, setIsSelectingReason] = useState(false);
  const [listReason, setListReason] = useState<any>();
  const [modalDepartmentVisible, setModalDepartmentVisible] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<any>([]);
  const [isSelectingDepartment, setIsSelectingDepartment] = useState(false);
  const [listDepartment, setListDepartment] = useState<any>();
  const [modalWareHouseVisible, setModalWareHouseVisible] = useState(false);
  const [selectedWareHouseIn, setSelectedWareHouseIn] = useState<any>([]);
  const [selectedWareHouseOut, setSelectedWareHouseOut] = useState<any>([]);
  const [listWareHouse, setListWareHouse] = useState<any>();
  const [isLoading, setIsloading] = useState(false);
  const {userData} = useSelector((state: any) => state.user);

  const fetchReasonData = async () => {
    try {
      const url = `https://pos.foxai.com.vn:8123/api/Production/reason?type=false`;
      const databack = await callApi(
        url,
        {
          method: 'GET',
        },
        setIsloading,
        () => dispatch(logout()),
      );
      if (databack) {
        setListReason(databack);
        console.log('reason::::::', databack);
      }
    } catch (e) {
      console.log('erroReason', e);
    }
  };
  const fetchDepartmentData = async () => {
    try {
      const url = `https://pos.foxai.com.vn:8123/api/Production/department`;
      const databack = await callApi(
        url,
        {
          method: 'GET',
        },
        setIsloading,
        () => dispatch(logout()),
      );
      if (databack) {
        setListDepartment(databack);
      }
    } catch (e) {
      console.log('erroDepartment', e);
    }
  };
  const fetchWareHouseData = async () => {
    try {
      const url = `https://pos.foxai.com.vn:8123/api/Production/Warehouse`;
      const databack = await callApi(
        url,
        {
          method: 'GET',
        },
        setIsloading,
        () => dispatch(logout()),
      );
      if (databack) {
        setListWareHouse(databack);
      }
    } catch (e) {
      console.log('erroWareHouse', e);
    }
  };
  useEffect(() => {
    if (userData?.accessToken) {
      fetchReasonData();
      fetchDepartmentData();
      fetchWareHouseData();
    }
  }, [userData?.accessToken]);
  const handleBack = async () => {
    try {
      navigate(SCREEN_NAMES.MENU_SCREEN);
    } catch (e) {
      console.log('error', e);
    }
  };
  const handleSetting = async () => {
    try {
      navigate(SCREEN_NAMES.SETTING_SCREEN);
    } catch (e) {
      console.log('error', e);
    }
  };
  const handleLogout = async () => {
    dispatch(logout());
  };

  const handleSelectedReason = (selectedReason: any) => {
    setSelectedReason(selectedReason);
    console.log('selectedReason11111', selectedReason);
    // listDatas.items.reason = selectedReason.name;
    // listDatas.items.reason = selectedReason.code;
    setModalReasonVisible(false);
  };
  const handleSelectedDepartment = (selectedDepartment: any) => {
    setSelectedDepartment(selectedDepartment);
    console.log('selectedDepartment11111', selectedDepartment);
    // listDatas.items.reason = selectedDepartment.name;
    // listDatas.items.reason = selectedDepartment.code;
    setModalDepartmentVisible(false);
  };
  console.log('dataprop', dataProp);

  const handleSelectedWareHouseIn = (selectedWareHouseIn: any) => {
    setSelectedWareHouseIn(selectedWareHouseIn);
    console.log('selectedWareHouseIn', selectedWareHouseIn);
    // listDatas.items.reason = selectedDepartment.name;
    // listDatas.items.reason = selectedDepartment.code;
    setModalWareHouseVisible(false);
  };
  const handleSelectedWareHouseOut = (selectedWareHouseOut: any) => {
    setSelectedWareHouseOut(selectedWareHouseOut);
    console.log('selectedWareHouseOut', selectedWareHouseOut);
    // listDatas.items.reason = selectedDepartment.name;
    // listDatas.items.reason = selectedDepartment.code;
    setModalWareHouseVisible(false);
  };
  return (
    <LinearGradient
      colors={['#3B82F6', '#BFDBFE']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.container} // giữ nguyên style
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              handleBack();
            }}
            style={[styles.headerButtons, styles.icon]}>
            <Image style={styles.icon} source={images.back_white}></Image>
          </TouchableOpacity>
          <Text style={styles.headerText}>{'Trả lại NVL thừa'}</Text>
          <TouchableOpacity
            style={styles.headerButtons}
            onPress={() => {
              handleSetting();
            }}>
            <Image
              source={images.account}
              style={styles.iconSetting as ImageStyle}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.body, {marginVertical: 0}]}>
          {isLoading ? (
            <LoadingScreen></LoadingScreen>
          ) : (
            <View style={{flex: 1}}>
              <View style={styles.headerContent}>
                <View
                  style={[
                    styles.headerContentCol,
                    {
                      flex: 0.8,
                      marginStart: 0,
                    },
                  ]}>
                  <View
                    style={[
                      styles.headerContentItem,
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                      },
                    ]}>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        {
                          width: selectedReason.name ? '90%' : 'auto',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                        },
                      ]}
                      onPress={() => {
                        setIsSelectingReason(!isSelectingReason);
                        setModalReasonVisible(true);
                      }}>
                      <Text
                        style={[styles.buttonText, {width: 'auto'}]}
                        numberOfLines={1}
                        ellipsizeMode="tail">{`Lý do xuất: ${
                        selectedReason?.name || ''
                      }`}</Text>
                      <Image
                        source={
                          isSelectingReason
                            ? images.down_white
                            : images.up_white
                        }
                        style={[
                          styles.iconArrow,
                          {display: selectedReason?.name ? 'none' : 'flex'},
                        ]}></Image>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[
                      styles.headerContentItem,
                      {
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        paddingLeft: 5,
                      },
                    ]}>
                    <Text
                      style={
                        styles.normalText
                      }>{`Lệnh sản xuất: ${dataProp?.proCode}`}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.headerContentCol,
                    {
                      alignItems: 'center',
                      flex: 1.2,
                    },
                  ]}>
                  <View
                    style={[
                      styles.headerContentItem,
                      {
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                        width: '100%',
                      },
                    ]}>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        {
                          width: selectedDepartment?.name ? '95%' : 'auto',
                          flexDirection: 'row',
                          margin: 0,
                        },
                      ]}
                      onPress={() => {
                        setIsSelectingDepartment(!isSelectingDepartment);
                        setModalDepartmentVisible(true);
                      }}>
                      <Text
                        ellipsizeMode="tail"
                        style={[
                          styles.buttonText,
                          {
                            alignItems: 'center',
                            width: 'auto',
                            textAlign: 'center',
                          },
                        ]}>{`Bộ phận bán hàng: ${
                        selectedDepartment.code
                          ? `\n${selectedDepartment?.name}`
                          : ``
                      }`}</Text>
                      <Image
                        source={
                          isSelectingDepartment
                            ? images.down_white
                            : images.up_white
                        }
                        style={[
                          styles.iconArrow,
                          {display: selectedDepartment?.name ? 'none' : 'flex'},
                        ]}></Image>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={[
                    styles.headerContentCol,
                    {
                      flex: 0.8,
                    },
                  ]}>
                  <View
                    style={[
                      styles.headerContentItem,
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                      },
                    ]}>
                    <Text style={styles.normalText}>{`Ngày xuất kho: `}</Text>
                    <TouchableOpacity
                      style={[styles.button, {marginBottom: 0, width: 'auto'}]}>
                      <Text style={styles.buttonText}>{`${moment().format(
                        'YYYY-MM-DD',
                      )}`}</Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={[
                      styles.headerContentItem,
                      {
                        alignItems: 'flex-end',
                        flex: 1,
                        justifyContent: 'center',
                      },
                    ]}>
                    <TouchableOpacity
                      onPress={() => {
                        setModalWareHouseVisible(true);
                      }}
                      style={[styles.button, {width: 'auto', marginBottom: 0}]}>
                      <Text style={styles.buttonText}>Quét QR</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.mainContent}>
                <View style={styles.mainContentHeader}>
                  <Text style={[styles.mainContentHeaderText, {flex: 0.5}]}>
                    STT
                  </Text>
                  <Text style={[styles.mainContentHeaderText]}>Mã hàng</Text>
                  <Text style={[styles.mainContentHeaderText]}>Tên hàng</Text>
                  <Text style={[styles.mainContentHeaderText]}>Số lô</Text>
                  <Text style={[styles.mainContentHeaderText]}>
                    Hạn sử dụng
                  </Text>
                  <TextInput style={[styles.mainContentHeaderText]}>
                    Số lượng
                  </TextInput>
                  <Text style={[styles.mainContentHeaderText]}>Đơn vị</Text>
                  <Text style={[styles.mainContentHeaderText]}>Từ kho</Text>
                  <Text style={[styles.mainContentHeaderText]}>Đến kho</Text>
                  <TextInput style={[styles.mainContentHeaderText]}>
                    Ghi chú
                  </TextInput>
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
              <Text style={styles.buttonText}>Đăng xuất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.footerButton, {opacity: 0.5}]}
              disabled={true} // disabled={isSynced}
              onPress={() => {
                //   handleConfirm();
              }}>
              <Text style={[styles.buttonText]}>Đồng bộ</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ReasonModal
          visible={modalReasonVisible}
          onClose={() => setModalReasonVisible(false)}
          onSelectedReason={handleSelectedReason}
          listReason={listReason}
        />
        <DepartmentModal
          visible={modalDepartmentVisible}
          onClose={() => setModalDepartmentVisible(false)}
          onSelectedDepartment={handleSelectedDepartment}
          listDepartment={listDepartment}
        />
        <WareHouseModal
          visible={modalWareHouseVisible}
          onClose={() => setModalWareHouseVisible(false)}
          onSelectedWareHouseIn={handleSelectedWareHouseIn}
          onSelectedWareHouseOut={handleSelectedWareHouseOut}
          listWareHouse={listWareHouse}
        />
      </View>
    </LinearGradient>
  );
};

export default InternalTransferScreen;
