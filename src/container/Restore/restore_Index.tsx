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

  const dispatch = useDispatch();
  const [isIn, setIsIn] = useState(false);

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
        setListDatas(details.items);
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
    if (selectedItems.length > 0) {
      setSelecteditemCode(selectedItems[0]);
    }
    setModalItemCodeVisible(false);
  };
  const handleLogout = async () => {
    dispatch(logout());
  };
  console.log(listDatas);

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
                  listDatas?.docCode || ''
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
                  listDatas?.productionCode || ''
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
                  listDatas?.creator || ''
                }`}</Text>
              </View>
              <View
                style={[styles.headerContentItem, {alignItems: 'flex-end'}]}>
                <Text style={styles.normalText}>
                  {`Trạng thái: ${listDatas?.status || ''}`}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.mainContent}>
            <View style={styles.mainContentHeader}>
              <Text style={[styles.mainContentHeaderText]}>Mã thành phẩm</Text>
              <Text style={[styles.mainContentHeaderText]}>Tên thành phẩm</Text>
              <Text style={[styles.mainContentHeaderText]}>Đơn vị</Text>
              <Text style={[styles.mainContentHeaderText]}>Hạn sử dụng</Text>
              <TextInput
                multiline={true}
                editable={false}
                style={[styles.mainContentHeaderText]}>
                Số kiện chẵn
              </TextInput>
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
            {/* <View style={[styles.mainContentBody]}>
              <FlatList
                data={[listDatas?.items?.apP_OIGN_Line || []]}
                renderItem={renderItem}
                keyExtractor={item => item.expDate}
                style={[
                  {
                    flex: 1,
                    width: '100%',
                  },
                ]}
              />
            </View> */}
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
            // style={[styles.footerButton, {opacity: isSynced ? 0.5 : 1}]}
            // disabled={isSynced}
            onPress={() => {
              //   handleConfirm();
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
        selectedItemCode={[selecteditemCode]}
        onClose={() => setModalItemCodeVisible(!ItemCodeModal)}
        listDatas={listDatas}
      />
    </View>
  );
};
export default RestoreScreen;
