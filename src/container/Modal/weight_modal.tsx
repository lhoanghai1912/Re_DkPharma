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
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import styles from '../Transfer/transfer_styles'; // Đảm bảo rằng các style tương ứng được import
import images from '../../component/contants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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
  const [dataList, setDataList] = useState(listDatas);
  const [tempData, setTempData] = useState<any>([]); // Để lưu trữ tạm các bản ghi thêm mới

  const handleAddWeight = () => {
    console.log('addWeight pressed');
    console.log('apP_WTQ1_sub', selectedData[0].apP_WTQ1_Sub);
    console.log('selectedData', selectedData[0]);
    console.log('creatorrrrrrrrrrrr', listDatas?.items?.creator);

    const updateData = {...selectedData};
    if (!updateData[0].apP_WTQ1_Sub) {
      updateData[0].apP_WTQ1_Sub = []; // Khởi tạo apP_WTQ1_Sub nếu chưa có
    }
    const newSubItem: SubItem = {
      id: 0,
      fatherId: selectedData[0].id,
      itemCode: selectedData[0].itemCode,
      itemName: selectedData[0].itemName,
      batchNumber: selectedData[0].batchNumber,
      quantity: 0,
      uomCodeId: selectedData[0].uomCodeId,
      uomCode: selectedData[0].uomCode,
      note: '',
      creator: listDatas?.items?.creator,
    };
    // Cập nhật trạng thái editableMap cho bản ghi mới

    updateData[0].apP_WTQ1_Sub.push(newSubItem);

    setTempData([
      ...tempData,
      {...newSubItem, index: updateData[0].apP_WTQ1_Sub.length - 1},
    ]);

    setDataList(dataList);
  };
  console.log('data tong', dataList);
  console.log('selecteddata', selectedData);
  // console.log('data2', listDatas.items);
  // console.log('data3', listDatas.items.selectedData);

  const isQuantityZero = () => {
    return selectedData[0]?.apP_WTQ1_Sub?.some(
      (item: SubItem) => item.quantity === 0,
    );
  };

  const handleSave = async () => {
    console.log('save pressed');

    const totalQuantity = selectedData[0]?.apP_WTQ1_Sub.reduce(
      (sum: number, item: SubItem) =>
        sum + (parseFloat(item.quantity.toString()) || 0),
      0,
    );

    //update father quantity
    const updateData = selectedData;
    updateData[0].quantity = totalQuantity;

    //send data to TranferScreen
    setDataList(updateData);
    onSave(updateData);
    setTempData([]);
    onClose();
  };

  const handleCancel = async () => {
    if (
      !selectedData[0]?.apP_WTQ1_Sub ||
      selectedData[0]?.apP_WTQ1_Sub?.length === 0
    ) {
      // Nếu không có item, vẫn gọi onClose
      onClose();
    }

    const updateData = selectedData;
    updateData[0].apP_WTQ1_Sub = updateData[0].apP_WTQ1_Sub.filter(
      (item: SubItem, index: number) =>
        !tempData.some(
          (tempItem: SubItem & {index?: number}) => tempItem.index === index,
        ),
    );
    setDataList(updateData);
    setTempData([]);
    onClose();

    console.log('close pressed');
  };

  const validateQuantity = (text: string) => {
    if (text.split('.').length > 2) {
      return;
    }
    // Kiểm tra xem chuỗi chỉ chứa số và dấu chấm
    const regex = /^\d*\.?\d*$/;
    return regex.test(text);
  };
  const renderWeight = ({item, index}: any) => {
    const changeQuantity = (delta: number) => {
      const newQty = Math.max(0, (item.quantity || 0) + delta);
      // Cập nhật quantity trong selectedData
      const updateData = {...selectedData[0]};
      if (!updateData.apP_WTQ1_Sub) updateData.apP_WTQ1_Sub = [];
      updateData.apP_WTQ1_Sub[index] = {
        ...updateData.apP_WTQ1_Sub[index],
        quantity: newQty,
      };
      setDataList(updateData);
    };
    return (
      <View style={styles.modalWeightBody}>
        <View
          style={[
            styles.modal_HeaderBodyContent,
            // {backgroundColor: 'red'},
          ]}>
          <Text style={[styles.bodyHeaderCol, {flex: 0.2, borderLeftWidth: 0}]}>
            {index + 1}
          </Text>
          <Text style={[styles.bodyHeaderCol, {flex: 0.8}]}>
            {item?.itemCode}
          </Text>
          <Text style={[styles.bodyHeaderCol, {flex: 1}]}>
            {item?.itemName}
          </Text>
          <Text style={[styles.bodyHeaderCol, {flex: 0.4}]}>
            {item?.batchNumber || ''}
          </Text>
          <View
            style={[
              styles.bodyHeaderCol,
              {
                flex: 0.6,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
            ]}>
            <TouchableOpacity
              onPress={() => changeQuantity(-1)}
              style={{
                marginLeft: 5,
                paddingHorizontal: 8,
                paddingVertical: 1,
                backgroundColor: '#ddd',
                borderRadius: 20,
                marginRight: 5,
              }}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={{fontSize: 18}}
              value={String(item?.quantity)}
              onChangeText={text => {
                if (validateQuantity(text)) {
                  const updateData = {...selectedData[0]};
                  if (!updateData.apP_WTQ1_Sub) {
                    updateData.apP_WTQ1_Sub = []; // Khởi tạo apP_WTQ1_Sub nếu chưa có
                  }
                  const subItem = updateData.apP_WTQ1_Sub[index];

                  if (subItem) {
                    subItem.quantity = parseFloat(text) || 0;
                  }
                  setDataList(updateData);
                }
              }}
              keyboardType="numeric"
            />
            <TouchableOpacity
              onPress={() => changeQuantity(1)}
              style={{
                marginRight: 5,
                paddingHorizontal: 8,
                paddingVertical: 1,
                backgroundColor: '#ddd',
                borderRadius: 20,
                marginLeft: 5,
              }}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.bodyHeaderCol, {flex: 0.4}]}>
            {item?.uomCode}
          </Text>

          <TextInput
            style={[styles.bodyHeaderCol, {flex: 0.6, borderRightWidth: 1}]}
            value={item?.note}
            onChangeText={text => {
              const updateData = {...selectedData[0]};
              if (!updateData.apP_WTQ1_Sub) {
                updateData.apP_WTQ1_Sub = []; // Khởi tạo apP_WTQ1_Sub nếu chưa có
              }
              const subItem = updateData.apP_WTQ1_Sub[index];

              if (subItem) {
                subItem.note = text;
              }
              setDataList(updateData);
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
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <View style={styles.wrapModal}>
          <KeyboardAwareScrollView
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
              padding: 20,
            }}
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={Platform.OS === 'ios' ? 20 : 100}>
            <View
              style={{
                borderRadius: 15,
                width: '90%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                alignContent: 'center',
                maxHeight: '90%',
              }}>
              <View
                style={[
                  styles.modalWeightHeader,
                  {
                    backgroundColor: 'tomato',
                    borderBottomWidth: 1,
                    borderTopStartRadius: 15,
                    borderTopEndRadius: 15,
                  },
                ]}>
                <TouchableOpacity></TouchableOpacity>
                <Text style={[styles.headerText]}>Phiếu cân chi tiết</Text>
                <TouchableOpacity
                  onPress={() => {
                    handleAddWeight();
                  }}>
                  <Image
                    source={images.add_list}
                    style={[styles.icon, {marginRight: 5}]}></Image>
                </TouchableOpacity>
              </View>
              <View style={styles.wrapWeightModal}>
                <View style={styles.modal_HeaderBodyContent}>
                  <Text
                    style={[
                      styles.bodyHeaderCol,
                      {flex: 0.2, borderLeftWidth: 0},
                    ]}>
                    STT
                  </Text>
                  <Text style={[styles.bodyHeaderCol, {flex: 0.8}]}>
                    Mã NVL
                  </Text>
                  <Text style={[styles.bodyHeaderCol, {flex: 1}]}>Tên NVL</Text>
                  <Text style={[styles.bodyHeaderCol, {flex: 0.4}]}>Số lô</Text>
                  <View style={[styles.bodyHeaderCol, {flex: 0.6}]}>
                    <Text
                      style={[
                        styles.bodyHeaderCol,
                        {flex: 1, borderLeftWidth: 0, borderBottomWidth: 0},
                      ]}>
                      Số lượng cân
                    </Text>
                  </View>
                  <Text style={[styles.bodyHeaderCol, {flex: 0.4}]}>
                    Đơn vị tính
                  </Text>
                  <TextInput
                    editable={false}
                    style={[
                      styles.bodyHeaderCol,
                      {flex: 0.6, borderRightWidth: 1},
                    ]}>
                    Ghi chú
                  </TextInput>
                </View>
                <FlatList
                  data={selectedData[0]?.apP_WTQ1_Sub || []}
                  renderItem={renderWeight}
                  keyExtractor={(item, index) => index.toString()}
                  style={{flex: 1, maxHeight: 300}}
                  scrollEnabled={false}
                />
              </View>

              <View style={styles.modalWeightFooter}>
                <TouchableOpacity
                  onPress={() => handleCancel()}
                  style={[
                    styles.button,
                    {
                      width: '20%',
                      height: 'auto',
                      backgroundColor: 'blue',
                      marginTop: 10,
                    },
                  ]}>
                  <Text style={styles.buttonText}>Đóng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleSave()}
                  disabled={isQuantityZero()}
                  style={[
                    styles.button,
                    {
                      opacity: isQuantityZero() ? 0.5 : 1,
                      width: '20%',
                      backgroundColor: 'blue',
                      marginTop: 10,
                    },
                  ]}>
                  <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default WeightModal;
