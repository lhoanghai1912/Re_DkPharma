import React from 'react';
import {Image, ImageStyle, Text, TouchableOpacity, View} from 'react-native';
import styles from './menu_Styles';
import images from '../../component/contants';
import {useSelector, UseSelector} from 'react-redux';
import {SCREEN_NAMES} from '../../navigators/screen_names';
import {navigate} from '../../navigators/root_navigators';
const MenuScreen: React.FC = () => {
  const {getSelectedItem} = useSelector((state: any) => state.item);
  console.log(
    'selectedItem:',
    getSelectedItem,
    'docentry',
    getSelectedItem.docEntry,
  );

  const isBTP = getSelectedItem.proType === 'BTP' ? true : false;

  const handleBack = async () => {
    try {
      console.log('handleback pressed');
      navigate(SCREEN_NAMES.HOME_SCREEN);
    } catch (e) {
      console.log('error: ', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            handleBack();
          }}
          style={[styles.headerButtons, styles.icon]}>
          <Image
            source={images.back_white}
            style={styles.icon as ImageStyle}></Image>
        </TouchableOpacity>
        <Text style={styles.headerText}>Menu</Text>
        <TouchableOpacity
          style={styles.headerButtons}
          onPress={() => {
            console.log('Go to setting screen');
            navigate(SCREEN_NAMES.SETTING_SCREEN);
          }}>
          <Image source={images.account} style={styles.icon as ImageStyle} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={{flexDirection: 'row', flex: 1}}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigate(SCREEN_NAMES.TRANSFER_CREEN);
              }}>
              <Text style={styles.bottonText}>Xuất kho sản xuất</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: isBTP ? '#CCCCCC' : 'blue'},
              ]}
              disabled={isBTP ? true : false}>
              <Text style={styles.bottonText}>Nhập kho thành phẩm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.bottonText}>Chuyển kho nội bộ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.bottonText}>Xuất kho điều chỉnh</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: isBTP ? 'blue' : '#CCCCCC'},
              ]}
              disabled={isBTP ? false : true}>
              <Text style={styles.bottonText}>Nhập kho bán thành phẩm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.bottonText}>Trả lại NVL thừa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.bottonText}>Nhập kho điều chỉnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: 'white'}]}
              disabled={true}>
              <Text style={styles.bottonText}>Nhập kho điều chỉnh</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MenuScreen;
