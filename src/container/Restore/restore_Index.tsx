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
import styles from './restore_styles';
import images from '../../component/contants';
import {navigate} from '../../navigators/root_navigators';
import {SCREEN_NAMES} from '../../navigators/screen_names';
import moment from 'moment';
import CalendarModal from '../Modal/calendar_modal';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../redux/slice_index';
import ItemCodeModal from '../Modal/itemCode_modal';

// import { Container } from './styles';

const RestoreScreen = ({route}: {route: any}) => {
  const dataProp = route.params.dataProp;
  const [listDatas, setListDatas] = useState<any>();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selecteditemCode, setSelecteditemCode] = useState('');
  const [modalItemCodeVisible, setModalItemCodeVisible] = useState(false);
  const {userData} = useSelector((state: any) => state.user);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]); // Mảng để lưu các item sau khi lọc
  const dispatch = useDispatch();
  const [isIn, setIsIn] = useState(false);

  const testData = [
    {itemCode: 'Test1'},
    {itemCode: 'Test2'},
    {itemCode: 'Test3'},
  ];
  const [modalCalendarVisible, setModalCalendarVisible] = useState(false);
  const [docDate, setDocDate] = useState(moment().format('YYYY-MM-DD'));

  const fetchItemData = async () => {
    try {
      const response = await fetch(
        `https://pos.foxai.com.vn:8123/api/Production/getReturn${dataProp.docEntry}?docDate=${docDate}&IsIn=${isIn}`,
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
      console.log('details', details);
      if (response.ok) {
        setListDatas(details);
      }
    } catch (e) {
      console.log('erro1', e);
    }
  };

  useEffect(() => {
    if (userData?.accessToken) {
      fetchItemData();
      //   console.log('listdataaaaaaaa', listDatas);
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
  const handleSelectedItemCode = (selectedItems: any[]) => {
    setSelectedItems(selectedItems);
    setModalItemCodeVisible(false);
  };
  useEffect(() => {
    if (selectedItems.length === 0) {
      setFilteredItems(listDatas?.items?.apP_OIGN_R_Line || []);
    } else {
      const filtered = listDatas?.items?.apP_OIGN_R_Line.filter((item: any) =>
        selectedItems.includes(item.itemCode),
      );
      setFilteredItems(filtered || []);
    }
  }, [selectedItems, listDatas]);
  const handleLogout = async () => {
    dispatch(logout());
  };
  console.log('datarender', listDatas?.items?.apP_OIGN_R_Line);

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
    const validated = validateQuantity(value);
    if (validated !== undefined) {
      const updateData = {...listDatas};
      console.log('updateData', updateData);

      updateData.items.apP_OIGN_Line.field = value;
      setListDatas(updateData);
      console.log(listDatas);
    }
    if (value === '') {
      return '0';
    }
  };
  const renderItem = ({item, index}: any) => {
    return (
      <View style={styles.mainContentHeader}>
        <Text style={[styles.mainContentHeaderText, {flex: 0.5}]}>
          {index + 1}
        </Text>
        <Text style={[styles.mainContentHeaderText]}>{item.itemCode}</Text>
        <Text style={[styles.mainContentHeaderText]}>{item.itemName}</Text>
        <Text style={[styles.mainContentHeaderText]}>
          {item.batchNum || 'null'}
        </Text>
        <TextInput
          keyboardType="numeric"
          // onChangeText={text => onChangedText('expDate', text)} // Gọi hàm onChangedText
          style={[styles.mainContentHeaderText]}>
          {item.expDate ? moment(item.expDate).format('DD-MM-YYYY') : 'null'}
        </TextInput>
        <TextInput
          keyboardType="numeric"
          // onChangeText={text => onChangedText('rejectSupplier', text)} // Gọi hàm onChangedText
          style={[styles.mainContentHeaderText]}>
          {item.rejectSupplier || '0'}
        </TextInput>
        <TextInput
          keyboardType="numeric"
          // onChangeText={text => onChangedText('rejectProduction', text)} // Gọi hàm onChangedText
          style={[styles.mainContentHeaderText]}>
          {item.rejectProduction || '0'}
        </TextInput>
        <TextInput
          keyboardType="numeric"
          // onChangeText={text => onChangedText('sampleQty', text)} // Gọi hàm onChangedText
          style={[styles.mainContentHeaderText]}>
          {item.sampleQty || '0'}
        </TextInput>
        <TextInput
          keyboardType="numeric"
          // onChangeText={text => onChangedText('remnant', text)} // Gọi hàm onChangedText
          style={[styles.mainContentHeaderText]}>
          {item.remnant || '0'}
        </TextInput>
        <Text style={[styles.mainContentHeaderText]}>
          {(item.quantity = item.rejectSupplier + item.sampleQty || 0)}
        </Text>
        <Text style={[styles.mainContentHeaderText]}>{item.uomCode}</Text>
        <TextInput
          keyboardType="numeric"
          // onChangeText={text => onChangedText('note', text)} // Gọi hàm onChangedText
          style={[styles.mainContentHeaderText]}>
          {item.note || '0'}
        </TextInput>
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
        <Text style={styles.headerText}>{'Trả lại NVL thừa'}</Text>
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
            <View style={[styles.headerContentCol, {marginStart: 0}]}>
              <View style={styles.headerContentItem}>
                <Text style={styles.normalText}>{`Mã CT: ${
                  listDatas?.items?.docCode || ''
                }`}</Text>
              </View>
              <View style={[styles.headerContentItem]}>
                <Text style={styles.normalText}>
                  {`Kho nhập: ${dataProp?.whsCode}` || ''}
                </Text>
              </View>
              <View style={[styles.headerContentItem]}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    backgroundColor: 'blue',
                    width: 'auto',
                    alignSelf: 'flex-start',
                  }}
                  onPress={() => {
                    setIsSelecting(!isSelecting);
                    setModalItemCodeVisible(true);
                    console.log('modal', modalItemCodeVisible);
                  }}>
                  <Text
                    style={[
                      styles.buttonText,
                      {paddingRight: 5},
                    ]}>{`Mã NVL: `}</Text>
                  <TouchableOpacity
                    style={[
                      {
                        height: 'auto',
                        flexDirection: 'row',
                        alignItems: 'center',
                      },
                    ]}
                    onPress={() => {
                      setIsSelecting(!isSelecting);
                      setModalItemCodeVisible(true);
                    }}>
                    <Text
                      style={styles.buttonText}>{`${selecteditemCode}`}</Text>
                    <Image
                      source={isSelecting ? images.up_white : images.down_white}
                      style={[styles.iconArrow, {marginLeft: 5}]}></Image>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.headerContentCol, {}]}>
              <View style={[styles.headerContentItem, {alignItems: 'center'}]}>
                <Text style={styles.normalText}>{`Lệnh sản xuất: ${
                  listDatas?.items?.productionCode || 'undefind'
                }`}</Text>
              </View>

              <View style={styles.headerContentItem}>
                <Text></Text>
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

                    console.log('modal press');
                  }}>
                  <Text
                    style={[styles.normalText, {backgroundColor: 'red'}]}>{`${
                    moment(docDate).format('DD-MM-YYYY') || null
                  }`}</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[styles.headerContentItem, {alignItems: 'flex-end'}]}>
                <Text style={styles.normalText}>{`Người nhập: ${
                  listDatas?.items?.creator || 'undefind'
                }`}</Text>
              </View>
              <View
                style={[styles.headerContentItem, {alignItems: 'flex-end'}]}>
                <Text style={styles.normalText}>
                  {`Trạng thái: ${listDatas?.items?.status || 'undefind'}`}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.mainContent}>
            <View style={styles.mainContentHeader}>
              <Text style={[styles.mainContentHeaderText, {flex: 0.5}]}>
                STT
              </Text>
              <Text style={[styles.mainContentHeaderText]}>Mã NVL</Text>
              <Text style={[styles.mainContentHeaderText]}>Tên NVL</Text>
              <Text style={[styles.mainContentHeaderText]}>Số lô</Text>
              <TextInput
                multiline={true}
                editable={false}
                style={[styles.mainContentHeaderText]}>
                Hạn sử dụng
              </TextInput>
              <TextInput
                multiline={true}
                editable={false}
                style={[styles.mainContentHeaderText]}>
                Phế phẩm NCC
              </TextInput>
              <TextInput
                multiline={true}
                editable={false}
                style={[styles.mainContentHeaderText]}>
                Phế phẩm sản xuất
              </TextInput>
              <TextInput
                multiline={true}
                editable={false}
                style={[styles.mainContentHeaderText]}>
                Số mẫu lưu
              </TextInput>
              <TextInput
                multiline={true}
                editable={false}
                style={[styles.mainContentHeaderText]}>
                Dư phẩm
              </TextInput>
              <Text style={[styles.mainContentHeaderText]}>Tổng số lượng</Text>
              <Text style={[styles.mainContentHeaderText]}>Đơn vị</Text>
              <TextInput
                multiline={true}
                editable={false}
                style={[styles.mainContentHeaderText]}>
                Ghi chú
              </TextInput>
            </View>
            <View style={[styles.mainContentBody]}>
              <FlatList
                data={filteredItems}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.itemCode + index.toString()}
                style={{
                  flex: 1,
                  width: '100%',
                  // backgroundColor: 'red',
                }}
              />
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
            style={styles.footerButton}
            // disabled={isSynced}
            onPress={() => {
              //   handleConfirm();
              console.log('confirm pressed');
            }}>
            <Text style={[styles.bottonText]}>Đồng bộ</Text>
          </TouchableOpacity>
        </View>
      </View>
      <CalendarModal
        visible={modalCalendarVisible}
        selectedDate={docDate}
        onDateSelect={handleDateSelect}
        onClose={() => setModalCalendarVisible(!modalCalendarVisible)}
      />
      <ItemCodeModal
        visible={modalItemCodeVisible}
        listDatas={listDatas?.items}
        onSelectedItemsChange={handleSelectedItemCode}
        onClose={() => {
          setModalItemCodeVisible(!ItemCodeModal), setIsSelecting(!isSelecting);
        }}
      />
    </View>
  );
};
export default RestoreScreen;
