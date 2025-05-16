import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  Image,
} from 'react-native';
import styles from '../Transfer/transfer_styles'; // Đảm bảo rằng các style tương ứng được import

// import { Container } from './styles';
interface ItemCodeProps {
  visible: boolean;
  listDatas: any;
  onClose: () => void;
  onSelectedItemsChange: (selectedItems: string[]) => void; // callback nhận dữ liệu đã chọn
}

const ItemCodeModal: React.FC<ItemCodeProps> = ({
  visible,
  listDatas,
  onClose,
  onSelectedItemsChange,
}) => {
  const [dataList, setDataList] = useState(listDatas);
  const [uniqueItemCodes, setUniqueItemCodes] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<string[]>([]);

  useEffect(() => {
    if (listDatas?.apP_OIGN_R_Line) {
      const map = new Map();
      listDatas.apP_OIGN_R_Line.forEach((item: any) => {
        if (!map.has(item.itemCode)) {
          map.set(item.itemCode, item);
        }
      });
      setUniqueItemCodes(Array.from(map.values()));
    }
  }, [listDatas]);

  const toggleSelectItem = (itemCode: string) => {
    setSelectedItem(prev => {
      if (prev.includes(itemCode)) {
        return prev.filter(i => i !== itemCode);
      }
      return [...prev, itemCode];
    });
  };
  const isAllSelected =
    uniqueItemCodes.length > 0 &&
    selectedItem.length === uniqueItemCodes.length;

  // Toggle chọn tất cả hoặc bỏ chọn tất cả
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItem([]);
    } else {
      setSelectedItem(uniqueItemCodes.map(item => item.itemCode));
    }
  };

  const renderItemId = ({item}: any) => {
    const isSelected = selectedItem.includes(item.itemCode);

    return (
      <View style={{flex: 1, width: '100%'}}>
        <TouchableOpacity
          onPress={() => {
            toggleSelectItem(item.itemCode);
          }}
          style={isSelected ? styles.buttonOnSelected : styles.buttonOnNormal}>
          <Text style={styles.headerText}>{item.itemCode}</Text>
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
            width: '40%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 15,
            alignContent: 'center',
            height: '55%',
          }}>
          <FlatList
            data={uniqueItemCodes}
            renderItem={renderItemId}
            keyExtractor={(item, index) => item.itemCode + index.toString()}
            ListHeaderComponent={() => (
              <TouchableOpacity
                onPress={() => {
                  toggleSelectAll();
                }}
                style={
                  isAllSelected
                    ? styles.buttonOnSelected
                    : styles.buttonOnNormal
                }>
                <Text style={[styles.headerText]}>Chọn tất cả</Text>
              </TouchableOpacity>
            )}
            style={{
              flex: 1,
              width: '100%',
              borderRadius: 5,
            }}
          />
          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
              // backgroundColor: 'red',
              // width: '100%',
            }}>
            <TouchableOpacity
              onPress={() => {
                onSelectedItemsChange(selectedItem);
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

export default ItemCodeModal;
