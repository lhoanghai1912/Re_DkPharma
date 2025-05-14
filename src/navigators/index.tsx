import {Alert, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import LoginStack from './login_Stack'; // Adjust the path as needed
import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {navigationRef} from './root_navigators';
import AppStackScreen from './app_stack';
import {logout} from '../redux/slice_index';

const RootNavigator = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector((state: any) => state.user);
  const currentTime = Date.now();
  console.log('expiries', userData?.expiresIn);
  const refreshTokenExpiry = currentTime + userData?.expiresIn * 1000;
  useEffect(() => {
    console.log('Current Time:', currentTime); // Log current time
    console.log('Refresh Token Expiry:', refreshTokenExpiry); // Log refreshTokenExpiry

    if (currentTime > refreshTokenExpiry) {
      console.log('Token hết hạn, mời đăng nhập lại');
      dispatch(logout());
      Alert.alert('Session expired', 'Please log in again.');
    }
  }, [refreshTokenExpiry, dispatch, currentTime]);

  // console.log('currentime1', currentTime);
  // console.log('refreshTokenExpire', refreshTokenExpiry);

  return (
    <NavigationContainer ref={navigationRef}>
      {userData?.accessToken ? <AppStackScreen /> : <LoginStack />}
    </NavigationContainer>
  );
};
export default RootNavigator;
