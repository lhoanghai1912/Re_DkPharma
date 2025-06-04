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
import {callApi} from '../../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../../component/loading_index';
import LinearGradient from 'react-native-linear-gradient';

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
  const [isLoading, setIsLoading] = useState(false);

  const fetchItemData = async () => {
    try {
      if (!dataProp?.docEntry) return;
      const url = `https://pos.foxai.com.vn:8123/api/Production/getGoodIssue${dataProp.docEntry}?docDate=${docDate}`;
      const data = await callApi(url, {method: 'GET'}, setIsLoading, () =>
        dispatch(logout()),
      );
      if (data) {
        data.items.docDate = docDate;

        setListDatas(data);
        if (data.items.status === 'ĐỒNG BỘ') {
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
      const url = `https://pos.foxai.com.vn:8123/api/Production/addGoodIssue`;
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
      if (databack) {
        console.log('API response:', databack);
        setisSynced(!isSynced);
        fetchItemData();
      } else {
        console.log('Fail to sync data', databack);
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

      updateData.items.apP_OIGE_Line = updatedItems;
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

  const changeQuantity = (index: number, field: string, increment: number) => {
    const updateData = {...listDatas}; // Tạo bản sao của listDatas để tránh thay đổi trực tiếp
    const updatedItems = [...updateData.items.apP_OIGE_Line]; // Lấy bản sao của các item
    const currentItem = {...updatedItems[index]}; // Lấy item cần sửa

    // Kiểm tra và cập nhật giá trị của trường cần thay đổi
    const currentValue = parseFloat(currentItem[field]) || 0; // Lấy giá trị hiện tại, nếu không có thì mặc định là 0
    const newValue = currentValue + increment; // Tính giá trị mới

    // Đảm bảo giá trị không âm
    if (newValue >= 0) {
      currentItem[field] = newValue.toString(); // Cập nhật giá trị mới cho trường
    }

    // Cập nhật lại item trong mảng
    updatedItems[index] = currentItem;

    // Cập nhật lại state với dữ liệu mới
    updateData.items.apP_OIGE_Line = updatedItems;
    setListDatas(updateData); // Cập nhật lại state với bản sao mới của listDatas

    console.log('Updated data:', updateData);
  };

  const renderItem = ({item, index}: any) => {
    return (
      <View style={[styles.mainContentHeader]}>
        <Text style={[styles.mainContentBodyText, {flex: 0.5}]}>
          {index + 1}
        </Text>
        <Text style={[styles.mainContentBodyText, {}]}>{item.itemCode}</Text>
        <Text style={[styles.mainContentBodyText, {}]}>{item.itemName}</Text>
        <Text style={[styles.mainContentBodyText, {}]}>
          {item.batchNum || ''}
        </Text>
        <Text style={[styles.mainContentBodyText, {}]}>
          {item.expDate ? moment(item.expDate).format('DD-MM-YYYY') : ''}
        </Text>
        <View
          style={[
            styles.mainContentBodyText,
            {
              flex: 0.8,
              backgroundColor: isSynced ? 'lightgrey' : 'none',
              flexDirection: 'column',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            },
          ]}>
          <TouchableOpacity
            onPress={() => changeQuantity(index, 'scrapQty', 1)}
            style={{
              justifyContent: 'center',
              display: isSynced ? 'none' : 'flex',
            }}>
            <Image source={images.up} style={{width: 30, height: 30}} />
          </TouchableOpacity>
          <TextInput
            keyboardType="numeric"
            editable={!isSynced}
            onChangeText={text => onChangedText(index, 'scrapQty', text)} // Gọi hàm onChangedText
            style={[
              styles.mainContentHeaderTextContent,
              {backgroundColor: isSynced ? 'lightgray' : 'none', flex: 0.8},
            ]}
            value={`${item.scrapQty}`}
          />
          <TouchableOpacity
            onPress={() => changeQuantity(index, 'scrapQty', -1)}
            style={{
              justifyContent: 'center',
              display: isSynced ? 'none' : 'flex',
            }}>
            <Image source={images.down} style={{width: 30, height: 30}} />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.mainContentBodyText,
            {
              flex: 0.8,
              backgroundColor: isSynced ? 'lightgrey' : 'none',
              flexDirection: 'column',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            },
          ]}>
          <TouchableOpacity
            onPress={() => changeQuantity(index, 'scrapPO', 1)}
            style={{
              justifyContent: 'center',
              display: isSynced ? 'none' : 'flex',
            }}>
            <Image source={images.up} style={{width: 30, height: 30}} />
          </TouchableOpacity>
          <TextInput
            keyboardType="numeric"
            editable={!isSynced}
            onChangeText={text => onChangedText(index, 'scrapPO', text)} // Gọi hàm onChangedText
            style={[
              styles.mainContentHeaderTextContent,
              {backgroundColor: isSynced ? 'lightgray' : 'none', flex: 0.8},
            ]}
            value={`${item.scrapPO}`}
          />
          <TouchableOpacity
            onPress={() => changeQuantity(index, 'scrapPO', -1)}
            style={{
              justifyContent: 'center',
              display: isSynced ? 'none' : 'flex',
            }}>
            <Image source={images.down} style={{width: 30, height: 30}} />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.mainContentBodyText,
            {
              flex: 0.8,
              backgroundColor: isSynced ? 'lightgrey' : 'none',
              flexDirection: 'column',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            },
          ]}>
          <TouchableOpacity
            onPress={() => changeQuantity(index, 'savingQty', 1)}
            style={{
              justifyContent: 'center',
              display: isSynced ? 'none' : 'flex',
            }}>
            <Image source={images.up} style={{width: 30, height: 30}} />
          </TouchableOpacity>
          <TextInput
            keyboardType="numeric"
            editable={!isSynced}
            onChangeText={text => onChangedText(index, 'savingQty', text)} // Gọi hàm onChangedText
            style={[
              styles.mainContentHeaderTextContent,
              {backgroundColor: isSynced ? 'lightgray' : 'none', flex: 0.8},
            ]}
            value={`${item.savingQty}`}
          />
          <TouchableOpacity
            onPress={() => changeQuantity(index, 'savingQty', -1)}
            style={{
              justifyContent: 'center',
              display: isSynced ? 'none' : 'flex',
            }}>
            <Image source={images.down} style={{width: 30, height: 30}} />
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.mainContentBodyText,
            {
              flex: 0.8,
              backgroundColor: isSynced ? 'lightgrey' : 'none',
              flexDirection: 'column',
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            },
          ]}>
          <TouchableOpacity
            onPress={() => changeQuantity(index, 'backupQty', 1)}
            style={{
              justifyContent: 'center',
              display: isSynced ? 'none' : 'flex',
            }}>
            <Image source={images.up} style={{width: 30, height: 30}} />
          </TouchableOpacity>
          <TextInput
            keyboardType="numeric"
            editable={!isSynced}
            onChangeText={text => onChangedText(index, 'backupQty', text)} // Gọi hàm onChangedText
            style={[
              styles.mainContentHeaderTextContent,
              {backgroundColor: isSynced ? 'lightgray' : 'none', flex: 0.8},
            ]}
            value={`${item.backupQty}`}
          />
          <TouchableOpacity
            onPress={() => changeQuantity(index, 'backupQty', -1)}
            style={{
              justifyContent: 'center',
              display: isSynced ? 'none' : 'flex',
            }}>
            <Image source={images.down} style={{width: 30, height: 30}} />
          </TouchableOpacity>
        </View>
        <Text
          style={[
            styles.mainContentBodyText,
            {backgroundColor: 'lightgray', flex: 0.8},
          ]}>
          {(parseFloat(item.backupQty) || 0) +
            (parseFloat(item.savingQty) || 0)}
        </Text>
        <Text
          style={[
            styles.mainContentBodyText,
            {backgroundColor: 'lightgray', flex: 0.7},
          ]}>
          {item.uomCode}
        </Text>
        <TextInput
          editable={!isSynced}
          onChangeText={text => onChangedText(index, 'note', text)} // Gọi hàm onChangedText
          style={[
            styles.mainContentBodyText,
            {backgroundColor: isSynced ? 'lightgray' : 'none', flex: 0.8},
          ]}>
          {item.note || ''}
        </TextInput>
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
          {isLoading ? (
            <LoadingScreen></LoadingScreen>
          ) : (
            <View style={{flex: 1}}>
              <View style={[styles.headerContent, {}]}>
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
                      style={[
                        styles.button,
                        {
                          flexDirection: 'row',
                          width: 'auto',
                          alignSelf: 'flex-start',
                        },
                      ]}
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
                          style={
                            styles.buttonText
                          }>{`${selecteditemCode}`}</Text>
                        <Image
                          source={
                            isSelecting ? images.up_white : images.down_white
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
                      {alignItems: 'center', justifyContent: 'center'},
                    ]}>
                    <Text
                      style={[
                        styles.normalText,
                        {textAlign: 'center'},
                      ]}>{`Lệnh sản xuất: \n${
                      listDatas?.items?.productionCode || ''
                    }`}</Text>
                  </View>
                </View>
                <View style={[styles.headerContentCol, {}]}>
                  <View
                    style={[
                      styles.headerContentItem,
                      {
                        justifyContent: 'flex-end',
                        flexDirection: 'row',
                        alignContent: 'center',
                        alignItems: 'center',
                      },
                    ]}>
                    <Text style={styles.normalText}>{`Ngày nhập kho:`}</Text>
                    <TouchableOpacity
                      style={[styles.button]}
                      onPress={() => {
                        setModalCalendarVisible(true);
                      }}>
                      <Text style={[styles.buttonText]}>{`${
                        moment(docDate).format('DD-MM-YYYY') || null
                      }`}</Text>
                    </TouchableOpacity>
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
                    <Text style={styles.normalText}>
                      {`Trạng thái: ${
                        listDatas?.items?.status || 'Nhập bản ghi'
                      }`}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.mainContent}>
                <View
                  style={[
                    styles.mainContentHeader,
                    {backgroundColor: '#87cefa'},
                  ]}>
                  <Text style={[styles.mainContentHeaderText, {flex: 0.5}]}>
                    STT
                  </Text>
                  <Text style={[styles.mainContentHeaderText]}>Mã NVL</Text>
                  <Text style={[styles.mainContentHeaderText]}>Tên NVL</Text>
                  <Text style={[styles.mainContentHeaderText]}>Số lô</Text>
                  <Text style={[styles.mainContentHeaderText]}>
                    {'Hạn sử \ndụng'}
                  </Text>
                  <View style={[styles.mainContentHeaderText, {flex: 0.8}]}>
                    <Text style={[styles.mainContentHeaderTextContent]}>
                      Phế phẩm NCC
                    </Text>
                  </View>
                  <View style={[styles.mainContentHeaderText, {flex: 0.8}]}>
                    <Text style={[styles.mainContentHeaderTextContent]}>
                      Phế phẩm sản xuất
                    </Text>
                  </View>
                  <View style={[styles.mainContentHeaderText, {flex: 0.8}]}>
                    <Text style={[styles.mainContentHeaderTextContent]}>
                      Số mẫu lưu
                    </Text>
                  </View>
                  <View style={[styles.mainContentHeaderText, {flex: 0.8}]}>
                    <Text style={[styles.mainContentHeaderTextContent]}>
                      Dư phẩm
                    </Text>
                  </View>
                  <Text style={[styles.mainContentHeaderText, {flex: 0.8}]}>
                    Tổng số lượng
                  </Text>
                  <Text style={[styles.mainContentHeaderText, {flex: 0.7}]}>
                    Đơn vị
                  </Text>
                  <TextInput
                    multiline={true}
                    editable={false}
                    style={[styles.mainContentHeaderText, {flex: 0.8}]}>
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
        <ItemCodeModal
          visible={modalItemCodeVisible}
          listDatas={listDatas}
          onSelectedItemsChange={handleSelectedItemCode}
          onClose={() => {
            setModalItemCodeVisible(!ItemCodeModal),
              setIsSelecting(!isSelecting);
          }}
        />
      </View>
    </LinearGradient>
  );
};
export default RestoreScreen;
