import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import styles from './weight_styles';
import images from '../../component/contants';
// import { Container } from './styles';

const WeightScreen: React.FC = () => {
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
          }}>
          <Image source={images.add} style={styles.icon}></Image>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={styles.bodyHeader}>
          <Text style={[styles.bodyHeaderCol, {flex: 0.4}]}>STT</Text>
          <Text style={[styles.bodyHeaderCol, {flex: 0.8}]}>Mã NVL</Text>
          <Text style={[styles.bodyHeaderCol, {flex: 1}]}>Tên NVL</Text>
          <Text style={[styles.bodyHeaderCol, {flex: 0.4}]}>Số lô</Text>
          <Text style={[styles.bodyHeaderCol, {flex: 0.8}]}>Số lượng cân</Text>
          <Text style={[styles.bodyHeaderCol, {flex: 0.1}]}>Đơn vị tính</Text>
          <Text style={[styles.bodyHeaderCol, {flex: 0.8}]}>Ghi chú</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text>abc</Text>
      </View>
    </View>
  );
};

export default WeightScreen;
