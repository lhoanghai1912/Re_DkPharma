import React from 'react';
import {Image, ImageStyle, Text, TouchableOpacity, View} from 'react-native';
import styles from './menu_Styles';
import images from '../../component/contants';
import {useSelector, UseSelector} from 'react-redux';
import {SCREEN_NAMES} from '../../navigators/screen_names';
import {navigate} from '../../navigators/root_navigators';
import LinearGradient from 'react-native-linear-gradient';
const MenuScreen: React.FC = () => {
  const {getSelectedItem} = useSelector((state: any) => state.item);
  console.log(
    'selectedItem:',
    getSelectedItem,
    'docentry',
    getSelectedItem.docEntry,
  );

  const isTP = getSelectedItem.proType === 'TP' ? true : false;
  console.log('isTP', isTP);

  const handleBack = async () => {
    try {
      navigate(SCREEN_NAMES.HOME_SCREEN);
    } catch (e) {
      console.log('error: ', e);
    }
  };

  const handleGoStored = async () => {
    try {
      navigate(SCREEN_NAMES.STORE_SCREEN, {dataProp: getSelectedItem});
      console.log('data truyen qua ', getSelectedItem);
    } catch (e) {
      console.log('error', e);
    }
  };
  const handleGoRestore = async () => {
    try {
      navigate(SCREEN_NAMES.RESTORE_SCREEN, {dataProp: getSelectedItem});
    } catch (e) {
      console.log('error', e);
    }
  };
  const handleGoEdit = async (field: string) => {
    try {
      navigate(SCREEN_NAMES.EDITSTOCK_SCREEN, {
        dataProp: {getSelectedItem, field},
      });
    } catch (e) {
      console.log('erro', e);
    }
  };
  const handleGoInternalTransfer = async () => {
    try {
      navigate(SCREEN_NAMES.INTERNALTRANSFER_SCREEN, {
        dataProp: getSelectedItem,
      });
    } catch (e) {
      console.log('erro: ', e);
    }
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
                onPress={() => {
                  handleGoStored();
                }}
                style={[
                  styles.button,
                  {backgroundColor: isTP ? 'blue' : '#CCCCCC'},
                ]}
                disabled={isTP ? false : true}>
                <Text style={styles.bottonText}>Nhập kho thành phẩm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleGoInternalTransfer()}
                style={styles.button}>
                <Text style={styles.bottonText}>Chuyển kho nội bộ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  handleGoEdit('Xuat');
                }}>
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
                onPress={() => {
                  handleGoStored();
                }}
                style={[
                  styles.button,
                  {backgroundColor: isTP ? '#CCCCCC' : 'blue'},
                ]}
                disabled={isTP ? true : false}>
                <Text style={styles.bottonText}>Nhập kho bán thành phẩm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleGoRestore()}
                style={styles.button}>
                <Text style={styles.bottonText}>Trả lại NVL thừa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleGoEdit('Nhap');
                }}
                style={styles.button}>
                <Text style={styles.bottonText}>Nhập kho điều chỉnh</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button]} disabled={true}>
                <Text style={styles.bottonText}>Nhập kho điều chỉnh</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default MenuScreen;
