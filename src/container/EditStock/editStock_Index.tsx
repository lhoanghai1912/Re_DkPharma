import React, {use, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  ImageStyle,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CalendarModal from '../Modal/calendar_modal';
import {navigate} from '../../navigators/root_navigators';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../redux/slice_index';
import {SCREEN_NAMES} from '../../navigators/screen_names';
import images from '../../component/contants';
import moment from 'moment';
import TypeModal from '../Modal/type_Modal';
import ReasonModal from '../Modal/reason_modal';
import {callApi} from '../../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../../component/loading_index';
import styles from './editStock_style';

// import { Container } from './styles';
const EditStockScreen = ({route}: {route: any}) => {
  const dataProp = route.params.dataProp;
  const dispatch = useDispatch();
  const [listDatas, setListDatas] = useState<any>();
  const [listReason, setListReason] = useState<any>();
  const [modalTypeCodeVisible, setModalTypeCodeVisible] = useState(false);
  const [modalReasonCodeVisible, setModalReasonCodeVisible] = useState(false);
  const [modalCalendarVisible, setModalCalendarVisible] = useState(false);
  const [isSelectingType, setIsSelectingType] = useState(false);
  const [isSelectingReason, setIsSelectingReason] = useState(false);
  const [docDate, setDocDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const {userData} = useSelector((state: any) => state.user);
  const [isIn] = useState(dataProp.field === 'Nhap' ? true : false);
  const [isSynced, setisSynced] = useState(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]); // Items đã lọc
  const [goodType, setGoodType] = useState('');
  const [tempData, setTempData] = useState('');
  const [selectedReason, setSelectedReason] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchItemData = async () => {
    try {
      const url = `https://pos.foxai.com.vn:8123/api/Production/getReturn${dataProp.getSelectedItem.docEntry}?docDate=${docDate}&IsIn=${isIn}`;
      const data = await callApi(url, {method: 'GET'}, setIsLoading, () =>
        dispatch(logout()),
      );
      if (data) {
        data.items.isIn = isIn;
        setListDatas(data);
        console.log('listdata', listDatas);
        data.items.docDate = docDate;
        setFilteredItems(data.items.apP_OIGN_R_Line);
        if (data.items.status === 'ĐỒNG BỘ') {
          setisSynced(true);
        } else setisSynced(false);
      }
    } catch (e) {
      console.log('erroItem', e);
    }
  };
  useEffect(() => {
    if (userData?.accessToken) {
      fetchItemData();
    }
  }, [docDate, dataProp.docEntry]);

  console.log('dataProp', dataProp);

  const fetchReasonData = async () => {
    console.log('fetchreasonnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn');
    try {
      const url = `https://pos.foxai.com.vn:8123/api/Production/reason?type=false`;
      const data = await callApi(url, {method: 'GET'}, setIsLoading, () =>
        dispatch(logout()),
      );
      if (data) {
        setListReason(data);
      } else {
        console.log('khong nhan duoc', data);
      }
    } catch (e) {
      console.log('erroReason', e);
    }
  };
  useEffect(() => {
    if (userData?.accessToken) {
      fetchReasonData();
      console.log('listReason:', listReason);
    }
  }, [docDate, dataProp.docEntry]);

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

  const handleDateSelect = (date: string) => {
    setDocDate(date);
    setModalCalendarVisible(false);
  };

  const validateQuantity = (text: string) => {
    if (text.trim() === '') {
      return '0';
    }

    const regex = /^\d+$/;

    if (!regex.test(text)) {
      return undefined; // không hợp lệ thì trả về undefined
    }

    const formatted = text.replace(/^0+/, '');

    return formatted === '' ? '0' : formatted;
  };
  const handleSelectedReason = (selectedReason: any) => {
    setSelectedReason(selectedReason);
    console.log('selectedReason11111', selectedReason);
    listDatas.items.reason = selectedReason.name;
    listDatas.items.reasonCode = selectedReason.code;
    setModalReasonCodeVisible(false);
  };
  const handleSelectAll = () => {
    setSelectedItems(listDatas?.items?.apP_OIGN_R_Line);
    setTempData('Tất cả');
  };
  const handleSelectNVL = () => {
    setSelectedItems(
      listDatas?.items?.apP_OIGN_R_Line.filter(
        (item: any) => item.type === 'NVL',
      ),
    );
    setTempData('NVL');
  };
  const handleSelectTPBTP = () => {
    setSelectedItems(
      listDatas?.items?.apP_OIGN_R_Line.filter(
        (item: any) => item.type === 'BTP' || item.type === 'TP',
      ),
    );
    setTempData('TP/BTP');
  };

  const handleSyncData = async () => {
    try {
      const url = `https://pos.foxai.com.vn:8123/api/Production/addReturn`;
      const databack = await callApi(
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

      console.log('databackdataback=>', databack);

      if (databack) {
        fetchItemData();
        setisSynced(!isSynced);
      } else {
        console.log('Fail to sync data', databack.error);
        Alert.alert(databack.errors.Reason);
        return;
      }
    } catch (e) {
      console.log('error1:', e);
    }
  };
  console.log('selectedItem', selectedItems);

  // Hàm xử lý khi chọn một item
  const handleConfirmSelection = () => {
    console.log('Selected items: ', selectedItems);
    {
      setFilteredItems(selectedItems);
      setGoodType(tempData);
      setIsSelectingType(!isSelectingType);
    }
  };
  console.log('filteredItems', filteredItems);

  const onChangedText = (index: number, field: string, value: string) => {
    if (field === 'note') {
      const updateData = {...listDatas};
      const updatedItems = [...updateData.items.apP_OIGN_R_Line];
      const updatedItem = {...updatedItems[index]};

      updatedItem[field] = value; // Cập nhật giá trị của trường note
      updatedItems[index] = updatedItem;

      updateData.items.apP_OIGN_R_Line = updatedItems;
      setListDatas(updateData);
      setFilteredItems(updatedItems);
    } else {
      const validated = validateQuantity(value);
      if (value === '') {
        return '0';
      }
      if (validated !== undefined) {
        const updateData = {...listDatas};
        const updatedItems = [...updateData.items.apP_OIGN_R_Line];
        const updatedItem = {...updatedItems[index]};

        updatedItem[field] = value;
        updatedItems[index] = updatedItem;

        updateData.items.apP_OIGN_R_Line = updatedItems;
        setListDatas(updateData);
        setFilteredItems(updatedItems);
        console.log('update data : ', updatedItems);
      }
    }
  };

  const renderItem = ({item, index}: any) => {
    return (
      <View style={styles.mainContentHeader}>
        <Text
          style={[
            styles.mainContentBodyText,
            {flex: 0.4, backgroundColor: 'lightgray'},
          ]}>
          {index + 1}
        </Text>
        <Text
          style={[styles.mainContentBodyText, {backgroundColor: 'lightgray'}]}>
          {item.itemCode}
        </Text>
        <Text
          style={[styles.mainContentBodyText, {backgroundColor: 'lightgray'}]}>
          {item.itemName}
        </Text>
        <Text
          style={[styles.mainContentBodyText, {backgroundColor: 'lightgray'}]}>
          {item.whsCode}
        </Text>
        <Text
          style={[styles.mainContentBodyText, {backgroundColor: 'lightgray'}]}>
          {item.batchNum}
        </Text>
        <Text
          style={[styles.mainContentBodyText, {backgroundColor: 'lightgray'}]}>
          {item.expDate ? moment(item.expDate).format('DD-MM-YYYY') : ''}
        </Text>
        <Text
          style={[styles.mainContentBodyText, {backgroundColor: 'lightgray'}]}>
          {item.plannedQty}
        </Text>
        <Text
          style={[styles.mainContentBodyText, {backgroundColor: 'lightgray'}]}>
          {item.quantity}
        </Text>
        <TextInput
          value={`${item.requireQty}`}
          keyboardType="numeric"
          onChangeText={text => onChangedText(index, 'requireQty', text)} // Gọi hàm onChangedText
          style={[
            styles.mainContentBodyText,
            {backgroundColor: isSynced ? 'lightgray' : 'white'},
          ]}></TextInput>
        <Text
          style={[styles.mainContentBodyText, {backgroundColor: 'lightgray'}]}>
          {item.uomCode}
        </Text>
        <TextInput
          onChangeText={text => onChangedText(index, 'note', text)} // Gọi hàm onChangedText
          value={`${item.note || ''}`}
          style={[
            styles.mainContentBodyText,
            {backgroundColor: isSynced ? 'lightgray' : 'white'},
          ]}></TextInput>
      </View>
    );
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
        <Text style={styles.headerText}>
          {dataProp.field === 'Nhap'
            ? 'Nhập kho điều chỉnh'
            : 'Xuất kho điều chỉnh'}
        </Text>
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
              <View style={[styles.headerContentCol, {marginStart: 0}]}>
                <View style={styles.headerContentItem}>
                  <Text style={styles.normalText}>{`Mã CT: ${
                    listDatas?.items?.docCode || ''
                  }`}</Text>
                </View>
                <View style={[styles.headerContentItem]}>
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 5,
                      borderRadius: 5,
                      flexDirection: 'row',
                      backgroundColor: 'blue',
                      width: 'auto',
                      alignSelf: 'flex-start',
                    }}
                    onPress={() => {
                      setIsSelectingType(!isSelectingType);
                      setModalTypeCodeVisible(true);
                    }}>
                    <Text
                      style={[
                        styles.buttonText,
                        {paddingRight: 5},
                      ]}>{`Loại hàng:  ${goodType}`}</Text>
                    <TouchableOpacity
                      style={[
                        {
                          height: 'auto',
                          flexDirection: 'row',
                          alignItems: 'center',
                        },
                      ]}
                      onPress={() => {
                        setIsSelectingType(!isSelectingType);
                        setModalTypeCodeVisible(true);
                      }}>
                      <Text style={styles.buttonText}></Text>
                      <Image
                        source={
                          isSelectingType ? images.up_white : images.down_white
                        }
                        style={[styles.iconArrow, {marginLeft: 5}]}></Image>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
                <View style={[styles.headerContentItem]}>
                  <Text style={styles.normalText}>{`Trạng thái: ${
                    listDatas?.items?.status || ''
                  } `}</Text>
                </View>
              </View>
              <View style={[styles.headerContentCol, {flex: 1.8}]}>
                <View
                  style={[styles.headerContentItem, {alignItems: 'center'}]}>
                  <Text style={styles.normalText}>{`Lệnh sản xuất: ${
                    listDatas?.items?.productionCode || 'undefind'
                  }`}</Text>
                </View>

                <View
                  style={[styles.headerContentItem, {alignItems: 'center'}]}>
                  <Text style={styles.normalText}>{`Tên thành phẩm: ${
                    listDatas?.items?.itemName || null
                  }`}</Text>
                </View>

                <View style={[styles.headerContentItem]}>
                  <TouchableOpacity
                    disabled={isSynced ? true : false}
                    style={{
                      flexDirection: 'row',
                      backgroundColor: 'blue',
                      width: 'auto',
                      alignSelf: 'center',
                      paddingHorizontal: 5,
                      borderRadius: 5,
                      opacity: isSynced ? 0.5 : 1,
                    }}
                    onPress={() => {
                      setIsSelectingReason(!isSelectingReason);
                      setModalReasonCodeVisible(true);
                    }}>
                    <Text
                      style={[
                        styles.buttonText,
                        {paddingRight: 5},
                      ]}>{`Lý do nhập: ${
                      listDatas?.items?.reason
                        ? listDatas?.items?.reason
                        : selectedReason?.name || ''
                    }`}</Text>
                    <TouchableOpacity
                      style={[
                        {
                          height: 'auto',
                          flexDirection: 'row',
                          alignItems: 'center',
                        },
                      ]}
                      onPress={() => {
                        setIsSelectingReason(!isSelectingReason);
                        setModalReasonCodeVisible(true);
                      }}>
                      <Text style={styles.buttonText}></Text>
                      <Image
                        source={
                          isSelectingType ? images.up_white : images.down_white
                        }
                        style={[styles.iconArrow, {marginLeft: 5}]}></Image>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.headerContentCol, {}]}>
                <View
                  style={[
                    styles.headerContentItem,
                    {justifyContent: 'flex-end', flexDirection: 'row'},
                  ]}>
                  <Text style={styles.normalText}>{`Ngày nhập kho:`}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setModalCalendarVisible(true);
                    }}>
                    <Text
                      style={[
                        styles.buttonText,
                        {
                          backgroundColor: 'blue',
                          width: 'auto',
                          alignSelf: 'center',
                          paddingHorizontal: 5,
                          borderRadius: 5,
                        },
                      ]}>{`${
                      moment(docDate).format('DD-MM-YYYY') || null
                    }`}</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={[styles.headerContentItem, {alignItems: 'flex-end'}]}>
                  <Text style={styles.normalText}>{`Mã thành phẩm: ${
                    listDatas?.items?.itemCode || 'undefind'
                  }`}</Text>
                </View>
                <View
                  style={[styles.headerContentItem, {alignItems: 'flex-end'}]}>
                  <Text style={styles.normalText}>
                    {`Người nhập: ${listDatas?.items?.creator || 'undefind'}`}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.mainContent}>
              <View style={styles.mainContentHeader}>
                <Text style={[styles.mainContentHeaderText, {flex: 0.4}]}>
                  STT
                </Text>
                <Text style={[styles.mainContentHeaderText]}>Mã hàng</Text>
                <Text style={[styles.mainContentHeaderText]}>Tên hàng</Text>
                <Text style={[styles.mainContentHeaderText]}>Kho</Text>
                <Text style={[styles.mainContentHeaderText]}>Số lô</Text>
                <Text style={[styles.mainContentHeaderText]}>Hạn sử dụng</Text>
                <Text style={[styles.mainContentHeaderText]}>
                  SL theo yêu cầu
                </Text>
                <Text style={[styles.mainContentHeaderText]}>
                  Sl đã xuất kho
                </Text>
                <TextInput style={[styles.mainContentHeaderText]}>
                  Sl điều chỉnh
                </TextInput>

                <Text style={[styles.mainContentHeaderText]}>DVT</Text>
                <TextInput style={[styles.mainContentHeaderText]}>
                  Ghi chú
                </TextInput>
              </View>
              <View style={[styles.mainContentBody]}>
                <FlatList
                  data={filteredItems}
                  renderItem={renderItem}
                  keyExtractor={(item, index) =>
                    item.itemCode + index.toString()
                  }
                  style={{
                    flex: 1,
                    width: '100%',
                    // backgroundColor: 'red',
                  }}
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
            <Text style={styles.buttonText}>Đăng xuất</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.footerButton, {opacity: isSynced ? 0.5 : 1}]}
            disabled={isSynced}
            onPress={() => {
              handleSyncData();
            }}>
            <Text style={[styles.buttonText]}>Đồng bộ</Text>
          </TouchableOpacity>
        </View>
      </View>
      <CalendarModal
        visible={modalCalendarVisible}
        selectedDate={docDate}
        onDateSelect={handleDateSelect}
        onClose={() => setModalCalendarVisible(!modalCalendarVisible)}
      />
      <TypeModal
        visible={modalTypeCodeVisible}
        onConfirm={handleConfirmSelection}
        onSelectAll={handleSelectAll}
        onSelectNVL={handleSelectNVL}
        onSelectTPBTP={handleSelectTPBTP}
        onClose={() => setModalTypeCodeVisible(false)}
      />
      <ReasonModal
        visible={modalReasonCodeVisible}
        onClose={() => setModalReasonCodeVisible(false)}
        onSelectedReason={handleSelectedReason}
        listReason={listReason}
      />
    </View>
  );
};

export default EditStockScreen;
