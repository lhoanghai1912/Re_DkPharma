import React, {use, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import styles from '../Transfer/transfer_styles'; // Đảm bảo rằng các style tương ứng được import
import images from '../../component/contants';
import {useSelector} from 'react-redux';

interface SubItem {
  id: number;
  fatherId: number;
  itemCode: string;
  itemName: string;
  batchNumber: string;
  quantity: number;
  uomCodeId: number;
  uomCode: string;
  note: string;
  creator: string;
}

interface WeightModalProps {
  visible: boolean;
  selectedData: any;
  onClose: () => void;
  onSave: (updateData: any) => void;
  listDatas: any;
}

const WeightModal: React.FC<WeightModalProps> = ({
  visible,
  selectedData,
  onClose,
  onSave,
  listDatas,
}) => {
  const [nextId, setNextId] = useState(0);
  const {userData} = useSelector((state: any) => state.user);

  const handleAddWeight = () => {
    console.log('addWeight pressed');
    console.log('apP_WTQ1_sub', selectedData[0].apP_WTQ1_Sub);
    console.log('selectedData', selectedData[0]);

    const updateData = {...selectedData};
    if (!updateData[0].apP_WTQ1_Sub) {
      updateData[0].apP_WTQ1_Sub = []; // Khởi tạo apP_WTQ1_Sub nếu chưa có
    }
    const newSubItem: SubItem = {
      id: nextId,
      fatherId: selectedData[0].id,
      itemCode: selectedData[0].itemCode,
      itemName: selectedData[0].itemName,
      batchNumber: selectedData[0].batchNumber,
      quantity: 0,
      uomCodeId: selectedData[0].uomCodeId,
      uomCode: selectedData[0].uomCode,
      note: '',
      creator: selectedData[0].creator,
    };

    updateData[0].apP_WTQ1_Sub.push(newSubItem);
    setNextId(nextId + 1);
    onSave(updateData[0]);
  };
  console.log('data tong', listDatas);
  console.log('selecteddata', selectedData);
  // console.log('data2', listDatas.items);
  // console.log('data3', listDatas.items.selectedData);

  const handleSave = async () => {
    console.log('save pressed');

    const totalQuantity = listDatas.items.selectedData[0].apP_WTQ1_Sub.reduce(
      (sum: number, item: SubItem) =>
        sum + (parseFloat(item.quantity.toString()) || 0),
      0,
    );

    //update father quantity
    const updateData = {...selectedData};

    updateData.quantity = totalQuantity;
    console.log('totalQuantity', totalQuantity);

    try {
      const response = await fetch(
        'https://pos.foxai.com.vn:8123/api/Production/addIssue',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData.accessToken}`,
          },
          body: JSON.stringify(updateData),
        },
      );
      const data = await response.json();
      console.log('dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', data);

      if (response.ok) {
        onSave(data);
        Alert.alert('Succes');
      } else {
        Alert.alert('erro');
      }
    } catch (e) {
      console.log('erro', e);
    }
    //send data to TranferScreen
    // onSave(updateData);
    onClose();
  };
  const validateQuantity = (value: string) => {
    const regex = /^[0-9]+(\.[0-9]+)?$/; // Biểu thức chính quy kiểm tra số thập phân hợp lệ
    if (regex.test(value) || value === '') {
      return true;
    } else {
      Alert.alert('Error', 'Only Number');
      return false;
    }
  };
  const renderWeight = ({item, index}: any) => {
    return (
      <View style={styles.modalWeightBody}>
        <View style={styles.modal_HeaderBodyContent}>
          <Text style={[styles.bodyHeaderCol, {flex: 0.2}]}>{index + 1}</Text>
          <Text style={[styles.bodyHeaderCol, {flex: 0.8}]}>
            {item?.itemCode}
          </Text>
          <Text style={[styles.bodyHeaderCol, {flex: 1}]}>
            {item?.itemName}
          </Text>
          <Text style={[styles.bodyHeaderCol, {flex: 0.4}]}>
            {item?.batchNumber || 'null'}
          </Text>
          <TextInput
            style={[styles.bodyHeaderCol, {flex: 0.6}]}
            value={String(item?.quantity)}
            onChangeText={text => {
              if (validateQuantity(text)) {
                const updateData = {...selectedData[0]};
                if (!updateData.apP_WTQ1_Sub) {
                  updateData.apP_WTQ1_Sub = []; // Khởi tạo apP_WTQ1_Sub nếu chưa có
                }
                const subItem = updateData.apP_WTQ1_Sub.find(
                  (sub: SubItem) => sub.id === item.id,
                );

                if (subItem) {
                  subItem.quantity = parseFloat(text) || 0;
                }
                onSave(updateData);
              }
            }}
            keyboardType="numeric"
          />
          <Text style={[styles.bodyHeaderCol, {flex: 0.4}]}>
            {item?.uomCode}
          </Text>
          <TextInput
            style={[styles.bodyHeaderCol, {flex: 0.6}]}
            value={item?.note}
            onChangeText={text => {
              const updateData = {...selectedData[0]};
              if (!updateData.apP_WTQ1_Sub) {
                updateData.apP_WTQ1_Sub = []; // Khởi tạo apP_WTQ1_Sub nếu chưa có
              }
              const subItem = updateData.apP_WTQ1_Sub.find(
                (sub: SubItem) => sub.id === item.id,
              );

              if (subItem) {
                subItem.note = text;
              }
              onSave(updateData);
            }}
          />
        </View>
      </View>
    );
  };
  console.log();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.wrapModal}>
        <View style={styles.modalWeightHeader}>
          <TouchableOpacity></TouchableOpacity>
          <Text style={styles.headerText}>Phiếu cân chi tiết</Text>
          <TouchableOpacity
            onPress={() => {
              handleAddWeight();
            }}>
            <Image source={images.add_list} style={styles.icon}></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.wrapWeightModal}>
          <View style={styles.modal_HeaderBodyContent}>
            <Text style={[styles.bodyHeaderCol, {flex: 0.2}]}>STT</Text>
            <Text style={[styles.bodyHeaderCol, {flex: 0.8}]}>Mã NVL</Text>
            <Text style={[styles.bodyHeaderCol, {flex: 1}]}>Tên NVL</Text>
            <Text style={[styles.bodyHeaderCol, {flex: 0.4}]}>Số lô</Text>
            <TextInput
              style={[styles.bodyHeaderCol, {flex: 0.6}]}
              editable={false}>
              Số lượng cân
            </TextInput>
            <Text style={[styles.bodyHeaderCol, {flex: 0.4}]}>Đơn vị tính</Text>
            <TextInput style={[styles.bodyHeaderCol, {flex: 0.6}]}>
              Ghi chú
            </TextInput>
          </View>
          <FlatList
            data={selectedData[0]?.apP_WTQ1_Sub || []}
            renderItem={renderWeight}
            keyExtractor={item => item.id}
            // style={{backgroundColor: 'red'}}
          />
        </View>
        <View style={styles.modalWeightFooter}>
          <TouchableOpacity onPress={() => handleSave()} style={styles.button}>
            <Text style={styles.bottonText}>Lưu</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onClose()} style={styles.button}>
            <Text style={styles.bottonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default WeightModal;
