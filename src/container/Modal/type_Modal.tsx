import React, {useState} from 'react';
import {Modal, Text, TouchableOpacity, View} from 'react-native';
import styles from '../Transfer/transfer_styles';

// import { Container } from './styles';
interface ItemTypeProps {
  visible: boolean;
  onClose: () => void;
  onSelectAll: () => void;
  onSelectNVL: () => void;
  onSelectTPBTP: () => void;
  onConfirm: () => void;
}
const TypeModal: React.FC<ItemTypeProps> = ({
  visible,
  onClose,
  onSelectAll,
  onSelectNVL,
  onSelectTPBTP,
  onConfirm,
}) => {
  const [selectedItem, setSelectedItem] = useState<string>('');

  const toggleSelectItem = (value: string) => {
    if (selectedItem === value) {
      setSelectedItem(''); // If already selected, unselect
    } else {
      setSelectedItem(value); // Select the value
    }
  };
  const getButtonStyle = (value: string) => {
    return selectedItem === value
      ? styles.buttonOnSelected
      : styles.buttonOnNormal;
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
            height: '50%',
            width: '50%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 15,
          }}>
          <TouchableOpacity
            onPress={() => {
              onSelectAll(); // Tất cả
              toggleSelectItem('All');
            }}
            style={[getButtonStyle('All'), {width: '60%'}]}>
            <Text style={styles.bottonText}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onSelectNVL(); // NVL
              toggleSelectItem('Nvl');
            }}
            style={[getButtonStyle('Nvl'), {width: '60%'}]}>
            <Text style={styles.bottonText}>NVL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onSelectTPBTP(); // NVL
              toggleSelectItem('TP/BTP');
            }}
            style={[getButtonStyle('TP/BTP'), {width: '60%', marginBottom: 0}]}>
            <Text style={styles.bottonText}>TP/BTP</Text>
          </TouchableOpacity>
          <View
            style={{
              marginTop: 50,
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
              style={[styles.button, {width: '30%', marginBottom: 0}]}>
              <Text style={[styles.bottonText]}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onConfirm();
                onClose();
              }}
              style={[styles.button, {width: '30%', marginBottom: 0}]}>
              <Text style={[styles.bottonText]}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TypeModal;
