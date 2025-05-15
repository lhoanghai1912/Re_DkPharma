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
  selectedItemCode: any;
}

const ItemCodeModal: React.FC<ItemCodeProps> = ({
  visible,
  selectedItemCode,
  listDatas,
  onClose,
}) => {
  const [dataList, setDataList] = useState(listDatas);
  const [uniqueItemCodes, setUniqueItemCodes] = useState<any[]>([]);

  useEffect(() => {
    if (listDatas?.apP_OIGN_R_Line) {
      console.log('aaaaaaaaaaaaaa', listDatas.apP_OIGN_R_Line);

      const map = new Map();
      listDatas.apP_OIGN_R_Line.forEach((item: any) => {
        if (!map.has(item.itemCode)) {
          map.set(item.itemCode, item);
        }
      });
      setUniqueItemCodes(Array.from(map.values()));
    }
  }, [listDatas]);
  console.log('abc', uniqueItemCodes);

  const renderItemId = ({item, index}: any) => {
    return (
      <View style={{flex: 1, width: '100%'}}>
        <TouchableOpacity
          onPress={() => {
            //   handleAddWeight();
          }}
          style={{
            flex: 1,
            borderWidth: 1,
            backgroundColor: 'lightgray',
            borderRadius: 5,
            marginBottom: 5,
          }}>
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
            padding: 10,
            width: '50%',
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'red',

            borderRadius: 5,
            alignContent: 'center',
            height: '50%',
          }}>
          {/* <TouchableOpacity
            onPress={() => {
              //   handleAddWeight();
            }}
            style={{
              backgroundColor: 'blue',
              //   flex: 1,
              width: '100%',
              borderRadius: 5,
              marginBottom: 5,
            }}>
            <Text style={[styles.headerText]}>Phiếu cân chi tiết</Text>
          </TouchableOpacity> */}
          <FlatList
            data={uniqueItemCodes}
            renderItem={renderItemId}
            keyExtractor={(item, index) => item.itemCode + index.toString()}
            ListHeaderComponent={() => (
              <TouchableOpacity
                onPress={() => {
                  //   handleAddWeight();
                }}
                style={{
                  backgroundColor: 'blue',
                  //   flex: 1,
                  width: '100%',
                  borderRadius: 5,
                  marginBottom: 5,
                }}>
                <Text style={[styles.headerText]}>Chọn tất cả</Text>
              </TouchableOpacity>
            )}
            style={{
              flex: 1,
              width: '100%',
              borderRadius: 5,
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ItemCodeModal;
