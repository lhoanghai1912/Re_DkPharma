import React from 'react';
import {Image, ImageStyle, Text, TouchableOpacity, View} from 'react-native';
import styles from './menu_Styles';
import images from '../../component/contants';

// import { Container } from './styles';

const MenuScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerButtons, styles.icon]}></TouchableOpacity>
        <Text style={styles.headerText}>Chọn ca làm việc</Text>
        <TouchableOpacity
          style={styles.headerButtons}
          onPress={() => {
            console.log('Button Pressed!');
          }}>
          <Image source={images.account} style={styles.icon as ImageStyle} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MenuScreen;
