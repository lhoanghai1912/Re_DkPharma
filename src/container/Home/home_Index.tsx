import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ImageStyle,
} from 'react-native';
import styles from './home_Style';
import images from '../../component/contants';
import {setItemData, logout, setInfoItem} from '../../redux/slice_index';
import {useSelector, useDispatch} from 'react-redux';
import {navigate} from '../../navigators/root_navigators';
import {SCREEN_NAMES} from '../../navigators/screen_names';
import {callApi} from '../../api/apiClient';
import LoadingScreen from '../../component/loading_index';

type ItemType = {
  proCode: string;
  itemCode?: string;
  itemName?: string;
  // Add other properties as needed
};

const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {userData, itemData} = useSelector((state: any) => state.user);
  const [selectedItem, setSelectedItem] = useState<ItemType | undefined>(
    undefined,
  );
  const [isSelecting, SetIsSelecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const showItem = isSelecting === false && selectedItem;
  const isPressabled = selectedItem!;

  const fetchDataApi = async () => {
    try {
      const url = 'https://pos.foxai.com.vn:8123/api/Production/getProduction';
      const databack = await callApi(url, {method: 'POST'}, setIsLoading, () =>
        dispatch(logout()),
      );
      if (databack) {
        console.log('API response', databack);
        dispatch(setItemData(databack.items));
      }
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  };
  useEffect(() => {
    if (userData?.accessToken) {
      fetchDataApi();
    }
  }, [userData]);
  console.log('selec', selectedItem);

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        style={styles.itemBox}
        onPress={() => {
          setSelectedItem(item);
          SetIsSelecting(!isSelecting);
        }}>
        <Text style={styles.normalText}>{item.proCode}</Text>
      </TouchableOpacity>
    );
  };

  const handleLogout = () => {
    // Đặt lại trạng thái người dùng trong Redux
    try {
      dispatch(logout());
      console.log('Logout successful!');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleConfirm = () => {
    try {
      dispatch(setInfoItem(selectedItem));
      console.log('dispatch data');

      navigate(SCREEN_NAMES.MENU_SCREEN);
    } catch (e) {
      console.log('erro', e);
    }
  };

  const handleSetting = async () => {
    navigate(SCREEN_NAMES.SETTING_SCREEN);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerButtons, styles.icon]}></TouchableOpacity>
        <Text style={styles.headerText}>Chọn ca làm việc</Text>
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
            <Text style={styles.welcomeText}>
              {`hello: ${userData?.user?.fullName}`}
            </Text>
            <View style={styles.bodyContent}>
              <View style={styles.pickerBox}>
                <TouchableOpacity
                  style={[
                    styles.pickerHeader,
                    {marginBottom: isSelecting ? 0 : 50},
                  ]}
                  onPress={() => SetIsSelecting(!isSelecting)}>
                  <TouchableOpacity></TouchableOpacity>
                  <Text style={styles.normalText}>
                    {selectedItem?.proCode || 'Chọn mã lệnh'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => SetIsSelecting(!isSelecting)}>
                    <Image
                      source={isSelecting ? images.up_white : images.down_white}
                      style={styles.icon as ImageStyle}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
                <View
                  style={[
                    styles.pickerBody,
                    {display: isSelecting ? 'flex' : 'none'},
                  ]}>
                  <FlatList
                    data={itemData}
                    renderItem={renderItem}
                    keyExtractor={item => item.proCode}
                    style={{
                      flex: 1,
                    }}
                  />
                </View>
                <View
                  style={[
                    styles.bodyItem,
                    {display: showItem ? 'flex' : 'none'},
                  ]}>
                  <View
                    style={[
                      styles.pickerHeader,
                      {marginBottom: isSelecting ? 0 : 50},
                    ]}>
                    <TouchableOpacity></TouchableOpacity>
                    <Text
                      style={[
                        styles.normalText,
                        {justifyContent: 'center', alignItems: 'center'},
                      ]}>{`Mã sản phẩm: ${selectedItem?.itemCode}`}</Text>
                    <TouchableOpacity></TouchableOpacity>
                  </View>
                  <View
                    style={[
                      styles.pickerHeader,
                      {marginBottom: isSelecting ? 0 : 50},
                    ]}>
                    <TouchableOpacity></TouchableOpacity>

                    <Text
                      style={
                        styles.normalText
                      }>{`Tên sản phẩm: ${selectedItem?.itemName}`}</Text>
                    <TouchableOpacity></TouchableOpacity>
                  </View>
                </View>
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
            <Text style={styles.bottonText}>Đăng xuất</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.footerButton,
              {backgroundColor: isPressabled ? 'blue' : '#CCCCCC'},
            ]}
            disabled={!isPressabled}
            onPress={() => {
              handleConfirm();
            }}>
            <Text style={styles.bottonText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
