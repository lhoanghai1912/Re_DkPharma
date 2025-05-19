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
import ItemCodeModal from '../Modal/itemCode_modal';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../redux/slice_index';

// import { Container } from './styles';

const RestoreScreen = ({route}: {route: any}) => {
  const dataProp = route.params.dataProp;
  const [listDatas, setListDatas] = useState<any>();
  const [isSelecting, setIsSelecting] = useState(false);
  const [selecteditemCode, setSelecteditemCode] = useState('');
  const [modalItemCodeVisible, setModalItemCodeVisible] = useState(false);
  const [modalCalendarVisible, setModalCalendarVisible] = useState(false);
  const {userData} = useSelector((state: any) => state.user);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]); // Mảng để lưu các item sau khi lọc
  const dispatch = useDispatch();
  const [docDate, setDocDate] = useState(moment().format('YYYY-MM-DD'));
  const [isSynced, setisSynced] = useState(false);

  const fetchItemData = async () => {
    try {
      const response = await fetch(
        `https://pos.foxai.com.vn:8123/api/Production/getGoodIssue${dataProp.docEntry}?docDate=${docDate}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData?.accessToken}`,
          },
        },
      );
      const details = await response.json();
      if (response.ok) {
        setListDatas(details);
        if (details?.items?.status === 'ĐỒNG BỘ') {
          setisSynced(true);
        } else {
          setisSynced(false);
        }
      }
    } catch (e) {
      console.log('erro1', e);
    }
  };

  useEffect(() => {
    if (userData?.accessToken) {
      fetchItemData();
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

  const handleConfirm = async () => {
    try {
      setisSynced(!isSynced);
      listDatas.items.docDate = docDate;
      console.log('data day len api ', listDatas);
      const response = await fetch(
        `https://pos.foxai.com.vn:8123/api/Production/addGoodIssue`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData?.accessToken}`,
          },
          body: JSON.stringify(listDatas.items),
        },
      );
      console.log('response1231231232 ', response);
      const dataBack = await response.json();
      if (response.ok) {
        console.log('API Confirm response', dataBack);
        fetchItemData();
      } else {
        console.log('Fail to sync data', dataBack);
        return;
      }
    } catch (e) {
      console.log('error1:', e);
    }
  };
  useEffect(() => {
    if (selectedItems.length === 0) {
      setFilteredItems(listDatas?.items?.apP_OIGE_Line || []);
    } else {
      const filtered = listDatas?.items?.apP_OIGE_Line.filter((item: any) =>
        selectedItems.includes(item.itemCode),
      );
      console.log('filtered', filtered);
      setFilteredItems(filtered || []);
    }
  }, [selectedItems, listDatas]);
  const handleLogout = async () => {
    dispatch(logout());
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

  const onChangedText = (index: number, field: string, value: string) => {
    if (field === 'note') {
      const updateData = {...listDatas};
      const updatedItems = [...updateData.items.apP_OIGE_Line];
      const updatedItem = {...updatedItems[index]};

      updatedItem[field] = value; // Cập nhật giá trị của trường note
      updatedItems[index] = updatedItem;

      updateData.items.apP_OIGN_R_Line = updatedItems;
      setListDatas(updateData);
    } else {
      const validated = validateQuantity(value);
      if (value === '') {
        return '0';
      }
      if (validated !== undefined) {
        const updateData = {...listDatas};
        const updatedItems = [...updateData.items.apP_OIGE_Line];
        const updatedItem = {...updatedItems[index]};

        updatedItem[field] = value;
        updatedItems[index] = updatedItem;

        updateData.items.apP_OIGE_Line = updatedItems;
        setListDatas(updateData);
        // console.log('update data : ', updatedItems);
      }
    }
  };
  console.log('listdata', listDatas);

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
        <Text
          style={[
            styles.mainContentHeaderText,
            {backgroundColor: isSynced ? 'lightgray' : 'white'},
          ]}>
          {item.expDate ? moment(item.expDate).format('DD-MM-YYYY') : ''}
        </Text>
        <TextInput
          keyboardType="numeric"
          editable={!isSynced}
          onChangeText={text => onChangedText(index, 'scrapQty', text)} // Gọi hàm onChangedText
          style={[
            styles.mainContentHeaderText,
            {backgroundColor: isSynced ? 'lightgray' : 'white'},
          ]}
          value={`${item.scrapQty}`}></TextInput>
        <TextInput
          keyboardType="numeric"
          editable={!isSynced}
          onChangeText={text => onChangedText(index, 'scrapPO', text)} // Gọi hàm onChangedText
          style={[
            styles.mainContentHeaderText,
            {backgroundColor: isSynced ? 'lightgray' : 'white'},
          ]}
          value={`${item.scrapPO}`}></TextInput>
        <TextInput
          keyboardType="numeric"
          editable={!isSynced}
          onChangeText={text => onChangedText(index, 'savingQty', text)} // Gọi hàm onChangedText
          style={[
            styles.mainContentHeaderText,
            {backgroundColor: isSynced ? 'lightgray' : 'white'},
          ]}
          value={`${item.savingQty}`}></TextInput>
        <TextInput
          keyboardType="numeric"
          editable={!isSynced}
          onChangeText={text => onChangedText(index, 'backupQty', text)} // Gọi hàm onChangedText
          style={[
            styles.mainContentHeaderText,
            {backgroundColor: isSynced ? 'lightgray' : 'white'},
          ]}
          value={`${item.backupQty}`}></TextInput>
        <Text
          style={[
            styles.mainContentHeaderText,
            {backgroundColor: 'lightgray'},
          ]}>
          {(parseFloat(item.scrapQty) || 0) + (parseFloat(item.savingQty) || 0)}
        </Text>
        <Text
          style={[
            styles.mainContentHeaderText,
            {backgroundColor: 'lightgray'},
          ]}>
          {item.uomCode}
        </Text>
        <TextInput
          editable={!isSynced}
          onChangeText={text => onChangedText(index, 'note', text)} // Gọi hàm onChangedText
          style={[
            styles.mainContentHeaderText,
            {backgroundColor: isSynced ? 'lightgray' : 'white'},
          ]}>
          {item.note || ''}
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
              <Text style={[styles.mainContentHeaderText]}>Hạn sử dụng</Text>
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
            style={[styles.footerButton, {opacity: isSynced ? 0.5 : 1}]}
            disabled={isSynced} // disabled={isSynced}
            onPress={() => {
              handleConfirm();
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
        listDatas={listDatas}
        onSelectedItemsChange={handleSelectedItemCode}
        onClose={() => {
          setModalItemCodeVisible(!ItemCodeModal), setIsSelecting(!isSelecting);
        }}
      />
    </View>
  );
};
export default RestoreScreen;
