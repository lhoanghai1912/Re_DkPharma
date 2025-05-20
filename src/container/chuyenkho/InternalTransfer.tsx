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

  const {userData} = useSelector((state: any) => state.user);

  const fetchReasonData = async () => {
    try {
      const response = await fetch(
        `https://pos.foxai.com.vn:8123/api/Production/reason?type=false`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData?.accessToken}`,
          },
        },
      );
      const details = await response.json();
      console.log('responseReason', response);
      console.log('detailsReason', details);
      if (response.ok) {
        setListReason(details);
      }
    } catch (e) {
      console.log('erroReason', e);
    }
  };
  const fetchDepartmentData = async () => {
    try {
      const response = await fetch(
        `https://pos.foxai.com.vn:8123/api/Production/department`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData?.accessToken}`,
          },
        },
      );
      const details = await response.json();
      console.log('responseDepartment', response);
      console.log('detailsDepartment', details);
      if (response.ok) {
        setListDepartment(details);
      }
    } catch (e) {
      console.log('erroDepartment', e);
    }
  };
  const fetchWareHouseData = async () => {
    try {
      const response = await fetch(
        `https://pos.foxai.com.vn:8123/api/Production/Warehouse`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData?.accessToken}`,
          },
        },
      );
      const details = await response.json();
      console.log('responseWareHouse', response);
      console.log('detailsWareHouse', details);
      if (response.ok) {
        setListWareHouse(details);
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
          <Image source={images.account} style={styles.icon as ImageStyle} />
        </TouchableOpacity>
      </View>
      <View style={[styles.body, {marginVertical: 0}]}>
        <View style={{flex: 1}}>
          <View style={styles.headerContent}>
            <View
              style={[
                styles.headerContentCol,
                {
                  flex: 0.7,
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
                      width: 'auto',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 0,
                      justifyContent: 'flex-start',
                      paddingHorizontal: 5,
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
                      isSelectingReason ? images.down_white : images.up_white
                    }
                    style={[styles.iconArrow]}></Image>
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
                  {alignItems: 'center', justifyContent: 'center'},
                ]}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      width: 'auto',
                      height: 'auto',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      margin: 0,
                    },
                  ]}
                  onPress={() => {
                    setIsSelectingDepartment(!isSelectingDepartment);
                    setModalDepartmentVisible(true);
                  }}>
                  <Text
                    style={[
                      styles.buttonText,
                      {
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
                    style={[styles.iconArrow]}></Image>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={[
                styles.headerContentCol,
                {
                  flex: 0.5,
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
                  {alignItems: 'flex-end', flex: 1, justifyContent: 'center'},
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
              <Text style={[styles.mainContentHeaderText]}>Hạn sử dụng</Text>
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
            style={[styles.footerButton, {opacity: 0.5}]}
            disabled={true} // disabled={isSynced}
            onPress={() => {
              //   handleConfirm();
            }}>
            <Text style={[styles.bottonText]}>Đồng bộ</Text>
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
  );
};

export default InternalTransferScreen;
