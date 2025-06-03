import React, {useState} from 'react';
import {FlatList, Modal, TouchableOpacity, View, Text} from 'react-native';
import styles from '../Transfer/transfer_styles'; // Đảm bảo rằng các style tương ứng được import

// import { Container } from './styles';
interface ItemReasonProp {
  visible: boolean;
  onClose: () => void;
  onSelectedReason: (value: string) => void;
  listReason: any;
}

const ReasonModal: React.FC<ItemReasonProp> = ({
  visible,
  onClose,
  onSelectedReason,
  listReason,
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const renderReason = ({item}: any) => {
    const isSelected = selectedReason === item; // hoặc item.name tùy bạn muốn so sánh trường nào

    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            setSelectedReason(item);
            console.log('selectedReason', selectedReason);
          }}
          style={[
            styles.button,
            {
              flex: 1,
              width: '100%',
              backgroundColor: isSelected ? 'blue' : 'lightgray',
            },
          ]}>
          <Text
            style={[
              isSelected ? styles.buttonText : styles.normalText,
              {fontSize: 22},
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
            padding: 20,
            width: '50%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 15,
            alignContent: 'center',
            height: '70%',
          }}>
          <FlatList
            data={listReason?.items}
            renderItem={renderReason}
            keyExtractor={(item, index) => item.code + index.toString()}
            style={{
              flex: 1,
              width: '80%',
              marginVertical: 15,
              borderRadius: 5,
            }}
          />
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
                onSelectedReason(selectedReason);
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

export default ReasonModal;
