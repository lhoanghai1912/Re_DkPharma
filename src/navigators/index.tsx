import {Alert, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import LoginStack from './login_Stack'; // Adjust the path as needed
import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {navigationRef} from './root_navigators';
import AppStackScreen from './app_stack';
import {login, logout, setUserData} from '../redux/slice_index';

const RootNavigator = () => {
  const dispatch = useDispatch();
  const {refreshToken, refreshTokenExpire, isAuthenticated, userData} =
    useSelector((state: any) => state.user);
  const currentTime = Date.now();

  // useEffect(() => {
  //   if (currentTime > refreshTokenExpire) {
  //     dispatch(logout());
  //     Alert.alert('Session expired', 'Please log in again.');
  //   }
  // }, [refreshTokenExpire, dispatch]);
  console.log('token==================', userData?.accessToken);

  return (
    <NavigationContainer ref={navigationRef}>
      {userData?.accessToken ? <AppStackScreen /> : <LoginStack />}
    </NavigationContainer>
  );
};
export default RootNavigator;
