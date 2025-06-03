import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ImageStyle,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import styles from './stored_styles';
import images from '../../component/contants';
import {navigate} from '../../navigators/root_navigators';
import {SCREEN_NAMES} from '../../navigators/screen_names';
import moment from 'moment';
import CalendarModal from '../Modal/calendar_modal';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../redux/slice_index';
import {callApi} from '../../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../../component/loading_index';
import LinearGradient from 'react-native-linear-gradient';

const StoreScreen = ({route}: {route: any}) => {
  const dataProp = route.params.dataProp;
  const [modalCalendarVisible, setModalCalendarVisible] = useState(false);
  const [docDate, setDocDate] = useState(moment().format('YYYY-MM-DD'));
  const [listDatas, setListData] = useState<any>();
  const [isSynced, setIsSynced] = useState(false);
  const dispatch = useDispatch();
  const {userData} = useSelector((state: any) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const fetchItemData = async () => {
    console.log('userdata', userData);

    try {
      if (!dataProp?.docEntry) return;
      const url = `https://pos.foxai.com.vn:8123/api/Production/getReceiptPO${dataProp.docEntry}?docDate=${docDate}`;

      const data = await callApi(url, {method: 'GET'}, setIsLoading, () =>
        dispatch(logout()),
      );
      console.log('data response', data);

      if (data.items.status === null) {
        data.items.status = '';
        setIsSynced(false);
      } else if (data.items.status === 'ĐỒNG BỘ') {
        setIsSynced(true);
      }

      setListData(data);
    } catch (e) {
      console.log('error: ', e);
    }
  };
  useEffect(() => {
    if (userData?.accessToken) {
      fetchItemData();
      console.log('listdataaaaaaaa', listDatas);
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
  const handleDateSelect = (date: string) => {
    setDocDate(date);
    setModalCalendarVisible(false);
  };
  const handleLogout = async () => {
    dispatch(logout());
  };
  const handleConfirm = async () => {
    console.log('Sync Pressed');
    listDatas.items.docDate = docDate;
    console.log('data lên api', listDatas?.items);

    try {
      const url = `https://pos.foxai.com.vn:8123/api/Production/addReceiptForPO`;
      // const token =
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
        () => {
          dispatch(logout());
        },
      );
      if (dataBack) {
        setIsSynced(!isSynced);

        console.log('API respone', dataBack);
        fetchItemData();
      } else {
        console.log('fail to sync data', dataBack);
        return;
      }
    } catch (e) {
      console.log('error1', e);
    }
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

  const onChangedText = (field: string, value: string) => {
    if (field === 'note' || 'uomStatistic') {
      const updateData = {...listDatas};
      updateData.items.apP_OIGN_Line[field] = value;
      setListData(updateData);
    } else {
      const validated = validateQuantity(value);
      if (value === '') {
        return '0';
      }
      if (validated !== undefined) {
        const updateData = {...listDatas};
        updateData.items.apP_OIGN_Line[field] = value;
        setListData(updateData);
        console.log(listDatas);
      }
    }
  };

  const renderItem = ({item, index}: any) => {
    const changeQuantity = (field: string, delta: number) => {
      if (isSynced) return;
      const updatedData = {...listDatas};
      if (!Array.isArray(updatedData.items.apP_OIGN_Line)) return;
      const line = {...updatedData.items.apP_OIGN_Line[index]};
      let currentValue = parseInt(line[field], 10);
      if (isNaN(currentValue)) currentValue = 0;
      let newValue = currentValue + delta;
      if (newValue < 0) newValue = 0;
      line[field] = newValue.toString();
      updatedData.items.apP_OIGN_Line[index] = line;
      setListData(updatedData);
    };
    const onChangedText = (field: string, value: string) => {
      if (field === 'note' || 'uomStatistic') {
        const updateData = {...listDatas};
        updateData.items.apP_OIGN_Line[field] = value;
        setListData(updateData);
      } else {
        const validated = validateQuantity(value);
        if (value === '') {
          return '0';
        }
        if (validated !== undefined) {
          const updateData = {...listDatas};
          updateData.items.apP_OIGN_Line[field] = value;
          setListData(updateData);
          console.log(listDatas);
        }
      }
    };
    return (
      <View style={styles.mainContentHeader}>
        <Text style={[styles.mainContentBodyText]}>{item.itemCode}</Text>
        <Text style={[styles.mainContentBodyText]}>{item.itemName}</Text>
        <Text style={[styles.mainContentBodyText]}>{item.uomCode}</Text>
        <Text style={[styles.mainContentBodyText, {flex: 1.2}]}>
          {moment(item.expDate).format('DD-MM-YYYY')}
        </Text>
        <View
          style={[
            styles.mainContentBodyText,
            {
              flexDirection: 'column',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'space-around',
            },
          ]}>
          <TouchableOpacity
            onPress={() => changeQuantity('evenPackage', -1)}
            style={{
              justifyContent: 'center',
            }}>
            <Image source={images.up} style={{width: 30, height: 30}} />
          </TouchableOpacity>
          <TextInput
            editable={isSynced ? false : true}
            multiline={true}
            keyboardType="phone-pad"
            style={[
              styles.normalText,
              {
                textAlign: 'center',
              },
            ]}
            value={`${item.evenPackage?.toString() || '0'}`}
            onChangeText={text => onChangedText('evenPackage', text)} // Gọi hàm onChangedText
          />
          <TouchableOpacity
            onPress={() => changeQuantity('evenPackage', 1)}
            style={{
              justifyContent: 'center',
            }}>
            <Image source={images.down} style={{width: 30, height: 30}} />
          </TouchableOpacity>
        </View>
        <TextInput
          editable={isSynced ? false : true}
          multiline={true}
          keyboardType="phone-pad"
          style={[
            styles.mainContentBodyText,
            {backgroundColor: isSynced ? 'lightgrey' : 'none'},
          ]}
          value={`${item.boxPerCase}`}
          onChangeText={text => onChangedText('boxPerCase', text)} // Gọi hàm onChangedText
        />
        <TextInput
          editable={isSynced ? false : true}
          multiline={true}
          keyboardType="phone-pad"
          style={[
            styles.mainContentBodyText,
            {backgroundColor: isSynced ? 'lightgrey' : 'none'},
          ]}
          value={`${item.oddBox}`}
          onChangeText={text => onChangedText('oddBox', text)} // Gọi hàm onChangedText
        />
        <TextInput
          multiline={true}
          editable={false}
          style={[styles.mainContentBodyText, {backgroundColor: '#CCCCCC'}]}>
          {(parseFloat(item.evenPackage) || 0) *
            (parseFloat(item.boxPerCase) || 0) +
            (parseFloat(item.oddBox) || 0)}
        </TextInput>
        <TextInput
          editable={isSynced ? false : true}
          multiline={true}
          keyboardType="phone-pad"
          style={[
            styles.mainContentBodyText,
            {backgroundColor: isSynced ? 'lightgrey' : 'none'},
          ]}
          value={`${item.qtyStatistic}`}
          onChangeText={text => onChangedText('qtyStatistic', text)} // Gọi hàm onChangedText
        />
        <TextInput
          editable={isSynced ? false : true}
          multiline={true}
          keyboardType="default"
          style={[
            styles.mainContentBodyText,
            {backgroundColor: isSynced ? 'lightgrey' : 'none'},
          ]}
          value={`${item.uomStatistic || ''}`}
          onChangeText={text => onChangedText('uomStatistic', text)} // Gọi hàm onChangedText
        />
        <TextInput
          editable={isSynced ? false : true}
          multiline={true}
          keyboardType="ascii-capable"
          style={[
            styles.mainContentBodyText,
            {backgroundColor: isSynced ? 'lightgrey' : 'none'},
          ]}
          value={`${item.note || ''}`}
          onChangeText={text => onChangedText('note', text)} // Gọi hàm onChangedText
        />
      </View>
    );
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
          <Text style={styles.headerText}>
            {dataProp?.proType === 'TP'
              ? 'Nhập kho thành phẩm'
              : 'Nhập kho bán thành phẩm'}
          </Text>
          <TouchableOpacity
            style={styles.headerButtons}
            onPress={() => {
              handleSetting();
            }}>
            <Image
              source={images.account}
              style={[
                styles.icon as ImageStyle,
                {width: 60, height: 60, marginRight: -10},
              ]}
            />
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
                    <Text style={[styles.normalText]}>{`Mã CT: ${
                      listDatas?.items?.docCode || ''
                    }`}</Text>
                  </View>
                  <View
                    style={[
                      styles.headerContentItem,
                      {flexDirection: 'row', alignItems: 'center'},
                    ]}>
                    <Text style={styles.normalText}>{`Ngày nhập kho: `}</Text>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        {
                          width: 'auto',
                          marginBottom: 0,
                          padding: 0,
                          paddingHorizontal: 5,
                        },
                      ]}
                      onPress={() => {
                        setModalCalendarVisible(true);
                        console.log('modal press');
                      }}>
                      <Text style={[styles.buttonText]}>{`${
                        moment(docDate).format('DD-MM-YYYY') || null
                      }`}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.headerContentItem}>
                    <Text style={styles.normalText}>
                      {`Trạng thái: ${listDatas?.items?.status || ''}`}
                    </Text>
                  </View>
                </View>
                <View style={[styles.headerContentCol]}>
                  <View
                    style={[styles.headerContentItem, {alignItems: 'center'}]}>
                    <Text
                      style={[
                        styles.normalText,
                        {textAlign: 'center'},
                      ]}>{`Lệnh sản xuất: `}</Text>
                  </View>
                  <View style={styles.headerContentItem}>
                    <Text style={[styles.normalText, {textAlign: 'center'}]}>
                      {`${listDatas?.items?.productionCode || ''}`}
                    </Text>
                  </View>
                  <View
                    style={[styles.headerContentItem, {alignItems: 'center'}]}>
                    <Text style={styles.normalText}>
                      {`Kho nhập: ${listDatas?.items?.whsCode}` || ''}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setModalCalendarVisible(true);
                        console.log('modal press');
                      }}></TouchableOpacity>
                  </View>
                </View>
                <View style={[styles.headerContentCol, {}]}>
                  <View
                    style={[
                      styles.headerContentItem,
                      {alignItems: 'flex-end'},
                    ]}>
                    <Text style={styles.normalText}>{`Số lô: ${
                      listDatas?.items?.productionId || ''
                    }`}</Text>
                  </View>
                  <View
                    style={[
                      styles.headerContentItem,
                      {alignItems: 'flex-end'},
                    ]}>
                    <Text style={styles.normalText}>{`Người nhập: ${
                      listDatas?.items?.creator || ''
                    }`}</Text>
                  </View>
                  <View
                    style={[
                      styles.headerContentItem,
                      {alignItems: 'flex-end'},
                    ]}>
                    <Text style={styles.normalText}>Quy cách: proCode</Text>
                  </View>
                </View>
              </View>
              <View style={styles.mainContent}>
                <View style={styles.mainContentHeader}>
                  <Text style={[styles.mainContentHeaderText]}>
                    Mã thành phẩm
                  </Text>
                  <Text style={[styles.mainContentHeaderText]}>
                    Tên thành phẩm
                  </Text>
                  <Text style={[styles.mainContentHeaderText]}>Đơn vị</Text>
                  <Text style={[styles.mainContentHeaderText, {flex: 1.2}]}>
                    Hạn sử dụng
                  </Text>
                  <View style={[styles.mainContentHeaderText]}>
                    <Text
                      style={[styles.mainContentHeaderText, {borderWidth: 0}]}>
                      Số kiện chẵn
                    </Text>
                  </View>
                  <TextInput
                    multiline={true}
                    editable={false}
                    style={[styles.mainContentHeaderText]}>
                    Số hộp trên kiện
                  </TextInput>
                  <TextInput
                    multiline={true}
                    editable={false}
                    style={[styles.mainContentHeaderText]}>
                    Số hộp lẻ
                  </TextInput>
                  <TextInput
                    multiline={true}
                    editable={false}
                    style={[styles.mainContentHeaderText]}>
                    Tổng số hộp
                  </TextInput>
                  <TextInput
                    multiline={true}
                    editable={false}
                    style={[styles.mainContentHeaderText]}>
                    SL thống kê
                  </TextInput>
                  <TextInput
                    multiline={true}
                    editable={false}
                    style={[styles.mainContentHeaderText]}>
                    Đơn vị thống kê
                  </TextInput>
                  <TextInput
                    multiline={true}
                    editable={false}
                    style={[styles.mainContentHeaderText]}>
                    Ghi chú
                  </TextInput>
                </View>
                <View style={[styles.mainContentBody]}>
                  <FlatList
                    data={[listDatas?.items?.apP_OIGN_Line || []]}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={[
                      {
                        flex: 1,
                        width: '100%',
                      },
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
              <Text style={styles.buttonText}>Đăng xuất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.footerButton, {opacity: isSynced ? 0.5 : 1}]}
              disabled={isSynced}
              onPress={() => {
                handleConfirm();
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
      </View>
    </LinearGradient>
  );
};

export default StoreScreen;
