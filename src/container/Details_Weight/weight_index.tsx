import React from 'react';
import {View} from 'react-native';
import styles from './weight_styles';
// import { Container } from './styles';

const WeightScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.body}></View>
      <View style={styles.footer}></View>
    </View>
  );
};

export default WeightScreen;
