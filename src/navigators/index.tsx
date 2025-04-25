import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import LoginStack from './login_Stack'; // Adjust the path as needed
import {NavigationContainerRef} from '@react-navigation/native';
import React, {createRef} from 'react';

const navigationRef = createRef<NavigationContainerRef<any>>();

const RootNavigator = () => {
  return (
    <View style={{flex: 1}}>
      <NavigationContainer ref={navigationRef}>
        <LoginStack />
      </NavigationContainer>
    </View>
  );
};
export default RootNavigator;
