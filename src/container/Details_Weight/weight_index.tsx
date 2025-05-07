import React, {useEffect, useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import styles from './weight_styles';
import images from '../../component/contants';
import {useSelector} from 'react-redux';
// import { Container } from './styles';

const WeightScreen: React.FC = ({route}: any) => {
  const {dataProps, dataSelected} = route.params;
  const {getDetailsItemSelected} = useSelector((state: any) => state.item);

  console.log('dataProps-------->', dataProps);
  console.log('3143412SSS');

  const [selectedData, setSelectedData] = useState(dataSelected);
  const [totalWeight, setTotalWeight] = useState(0); // Tổng số lượng cân

  const handleAddRow = () => {
    const newRow = {
      itemCode: selectedData[0].itemCode,
      itemName: selectedData[0].itemName,
      batchNumber: selectedData[0].batchNumber,
      quantity: '',
      uomCode: selectedData[0].uomCode,
      note: '',
    };
    setSelectedData([...selectedData, newRow]);
  };

  const handleInputChange = (value: string, index: number, field: string) => {
    if (field === 'quantity') {
      const regex = /^[0-9]*\.?[0-9]*$/; // Số nguyên và số thập phân với dấu chấm chỉ xuất hiện 1 lần

      if (value === '' || regex.test(value)) {
        const updateData = selectedData.map((item, i) => {
          if (i === index) {
            return {...item, [field]: value};
          }
          return item;
        });
        setSelectedData(updateData);
      } else {
        Alert.alert('Error, only number');
        const updateData = selectedData.map((item, i) => {
          if (i === index) {
            return {...item, [field]: ''};
          }
          return item;
        });
        setSelectedData(updateData);
      }
    } else {
      const updateData = selectedData.map((item, i) => {
        if (i === index) {
          return {...item, [field]: value};
        }
        return item;
      });
      setSelectedData(updateData);
    }
  };

  const renderItem = ({item, index}: any) => {
    return (
      <View style={styles.bodyHeader}>
        <Text style={[styles.bodyHeaderCol, {flex: 0.2}]}>{index + 1}</Text>
        <Text style={[styles.bodyHeaderCol, {flex: 0.8}]}>{item.itemCode}</Text>
        <Text style={[styles.bodyHeaderCol, {flex: 1}]}>{item.itemName}</Text>
        <Text style={[styles.bodyHeaderCol, {flex: 0.4}]}>
          {item.batchNumber}
        </Text>
        <TextInput
          style={[styles.bodyHeaderCol, {flex: 0.6}]}
          placeholder="Số lượng cân"
          value={item.quantity || ''}
          onChangeText={text =>
            handleInputChange(text, index, 'quantity')
          }></TextInput>
        <Text style={[styles.bodyHeaderCol, {flex: 0.4}]}>{item.uomCode}</Text>
        <TextInput
          placeholder="Ghi chú"
          value={item.note}
          keyboardType="decimal-pad"
          onChangeText={text => handleInputChange(text, index, 'note')}
          style={[styles.bodyHeaderCol, {flex: 0.6}]}></TextInput>
      </View>
    );
  };
  const calculateTotalWeight = () => {
    const total = selectedData.reduce((sum, item) => {
      return sum + (parseInt(item.quantity || '0') || 0);
    }, 0);
    console.log('total', total);

    Alert.alert(`Tổng số lượng cân`, `Tổng số lượng: ${total}`);
    setTotalWeight(total);
  };

  useEffect(() => {
    // Khi totalWeight thay đổi, gọi Alert
    console.log('data111111111123', selectedData);

    if (totalWeight > 0) {
      // Alert.alert(`Tổng số lượng cân`, `Tổng số lượng: ${totalWeight}`);
    }
  }, [totalWeight]); // useEffect chỉ chạy khi totalWeight thay đổi

  const handleConfirm = () => {
    calculateTotalWeight(); // Tính toán và cập nhật totalWeight
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity></TouchableOpacity>
        <Text style={styles.headerText}>
          Danh sách cân chi tiết theo mã hàng
        </Text>
        <TouchableOpacity
          onPress={() => {
            console.log('pressed');
            handleAddRow();
          }}>
          <Image source={images.add_list} style={styles.icon}></Image>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyHeader}>
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
        <View style={styles.bodyMain}>
          <FlatList
            data={selectedData || []}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={[
              {
                flex: 1,
                width: '100%',
              },
            ]}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => {
            handleConfirm();
          }}></TouchableOpacity>
      </View>
    </View>
  );
};

export default WeightScreen;
