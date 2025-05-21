import {Alert, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import LoginStack from './login_Stack'; // Adjust the path as needed
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {navigationRef} from './root_navigators';
import AppStackScreen from './app_stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout, setUserData} from '../redux/slice_index';
import {tokens} from 'react-native-paper/lib/typescript/styles/themes/v3/tokens';

const RootNavigator = () => {
  const dispatch = useDispatch();
  const [hasToken, setHasToken] = useState(false);
  const {userData} = useSelector((state: any) => state.user);
  console.log('expiries', userData?.expiresIn);
  console.log('token1111123', AsyncStorage.getItem('accessToken'));

  useEffect(() => {
    const checkToken = async () => {
      console.log('token1111124', await AsyncStorage.getItem('accessToken'));
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        setHasToken(false);
      } else {
        setHasToken(true);
      }
    };
    checkToken();
  }, [userData, dispatch]);
  console.log('hastoken2', hasToken);
  // console.log('currentime1', currentTime);
  // console.log('refreshTokenExpire', refreshTokenExpiry);

  return (
    <NavigationContainer ref={navigationRef}>
      {hasToken ? <AppStackScreen /> : <LoginStack />}
    </NavigationContainer>
  );
};
export default RootNavigator;
