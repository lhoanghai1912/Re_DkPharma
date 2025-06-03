import React, {useState} from 'react';
import {FlatList, Modal, Text, TouchableOpacity, View} from 'react-native';
import styles from '../Transfer/transfer_styles';

// import { Container } from './styles';
interface ItemWareHouseProp {
  visible: boolean;
  onClose: () => void;
  onSelectedWareHouseIn: (value: string) => void;
  onSelectedWareHouseOut: (value: string) => void;
  listWareHouse: any;
}
const WareHouseModal: React.FC<ItemWareHouseProp> = ({
  visible,
  onClose,
  onSelectedWareHouseIn,
  onSelectedWareHouseOut,
  listWareHouse,
}) => {
  const [selectedWareHouseIn, setSelectedWareHouseIn] = useState<any>('');
  const [selectedWareHouseOut, setSelectedWareHouseOut] = useState<any>('');
  const [isSelectingIn, setIsSelectingIn] = useState(false);
  const [isSelectingOut, setIsSelectingOut] = useState(false);
  const handleConfirm = async () => {
    try {
      onSelectedWareHouseIn(selectedWareHouseIn);
      onSelectedWareHouseOut(selectedWareHouseOut);
    } catch (e) {
      console.log('error: ', e);
    }
  };
  const renderDepartment = ({item}: any) => {
    const isSelectedIn = selectedWareHouseIn === item; // hoặc item.name tùy bạn muốn so sánh trường nào
    const isSelectedOut = selectedWareHouseOut === item; // hoặc item.name tùy bạn muốn so sánh trường nào

    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            if (isSelectingIn) {
              setSelectedWareHouseIn(item);
              setIsSelectingIn(!isSelectingIn);
            } else if (isSelectingOut) {
              setSelectedWareHouseOut(item);
              setIsSelectingOut(!isSelectingOut);
            }
          }}
          style={[
            {
              flex: 1,
              width: '100%',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 5,
            },
          ]}>
          <Text
            style={[
              isSelectedIn || isSelectedOut
                ? styles.buttonOnSelected
                : styles.buttonOnNormal,
              {
                backgroundColor: isSelectedIn
                  ? 'blue'
                  : isSelectedOut
                  ? 'darkred'
                  : 'white',
                fontSize: 22,
                borderWidth: 1,
                width: '100%',
                marginBottom: 0,

                textAlign: 'center',
                color: isSelectedIn || isSelectedOut ? 'white' : 'black',
              },
            ]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.wrapModal}>
        <View
          style={{
            paddingHorizontal: 10,
            width: '50%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 15,
            // alignContent: 'center',
            height: '70%',
          }}>
          <TouchableOpacity
            onPress={() => {
              setIsSelectingIn(!isSelectingIn);
            }}
            style={[
              styles.button,
              {
                borderWidth: 1,
                width: '80%',
                paddingHorizontal: 10,
                alignItems: 'flex-start',
                borderRadius: 10,
                marginBottom: 10,
                backgroundColor: selectedWareHouseIn ? 'blue' : 'lightgray',
              },
            ]}>
            <Text
              style={[
                styles.buttonText,
                {color: selectedWareHouseIn ? 'white' : 'black'},
              ]}>{`Từ kho: ${selectedWareHouseIn?.name || ''}`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsSelectingOut(!isSelectingOut);
            }}
            style={[
              styles.button,
              {
                borderWidth: 1,
                width: '80%',
                paddingHorizontal: 10,
                alignItems: 'flex-start',
                borderRadius: 10,
                marginBottom: 10,
                backgroundColor: selectedWareHouseOut ? 'darkred' : 'lightgray',
              },
            ]}>
            <Text
              style={[
                styles.buttonText,
                {color: selectedWareHouseIn ? 'white' : 'black'},
              ]}>{`Đến kho: ${selectedWareHouseOut?.name || ''}`}</Text>
          </TouchableOpacity>
          <View
            style={{
              // display: 'none',
              opacity: isSelectingIn || isSelectingOut ? 1 : 0,
              borderWidth: 1,
              width: '80%',
              alignItems: 'center',
              height: '60%',
              borderRadius: 15,
            }}>
            <FlatList
              data={listWareHouse?.items}
              renderItem={renderDepartment}
              keyExtractor={(item, index) => item.code + index.toString()}
              style={{
                flex: 1,
                width: '100%',
                marginVertical: 15,
                borderRadius: 5,
              }}
            />
          </View>
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              //   backgroundColor: 'red',
              // width: '100%',
            }}>
            <TouchableOpacity
              onPress={() => {
                onClose();
              }}
              style={[styles.button, {width: '20%', marginBottom: 0}]}>
              <Text style={[styles.buttonText]}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleConfirm();
                onClose();
              }}
              style={[styles.button, {width: '20%', marginBottom: 0}]}>
              <Text style={[styles.buttonText]}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default WareHouseModal;
