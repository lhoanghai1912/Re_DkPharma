import React, {useState} from 'react';
import {FlatList, Modal, TouchableOpacity, View, Text} from 'react-native';
import styles from '../Transfer/transfer_styles'; // Đảm bảo rằng các style tương ứng được import

// import { Container } from './styles';
interface ItemDepartmentProp {
  visible: boolean;
  onClose: () => void;
  onSelectedDepartment: (value: string) => void;
  listDepartment: any;
}

const DepartmentModal: React.FC<ItemDepartmentProp> = ({
  visible,
  onClose,
  onSelectedDepartment,
  listDepartment,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const renderDepartment = ({item}: any) => {
    const isSelected = selectedDepartment === item; // hoặc item.name tùy bạn muốn so sánh trường nào

    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            setSelectedDepartment(item);
            console.log('selectedDepartment', selectedDepartment);
          }}
          style={[
            isSelected ? styles.buttonOnSelected : styles.buttonOnNormal,
            {
              flex: 1,
              width: '100%',
            },
          ]}>
          <Text
            style={[
              isSelected ? styles.bottonText : styles.normalText,
              {fontSize: 22, textAlign: 'center'},
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
            data={listDepartment?.items}
            renderItem={renderDepartment}
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
                onSelectedDepartment(selectedDepartment);
                onClose();
              }}
              style={[styles.button, {width: '20%', marginBottom: 0}]}>
              <Text style={[styles.bottonText]}>Xác nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onClose();
              }}
              style={[styles.button, {width: '20%', marginBottom: 0}]}>
              <Text style={[styles.bottonText]}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DepartmentModal;
