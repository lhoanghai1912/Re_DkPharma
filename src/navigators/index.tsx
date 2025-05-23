import {Alert, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import LoginStack from './login_Stack'; // Adjust the path as needed
import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {navigationRef} from './root_navigators';
import AppStackScreen from './app_stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../component/loading_index';

const RootNavigator = () => {
  const dispatch = useDispatch();
  const [hasToken, setHasToken] = useState(false);
  const {userData} = useSelector((state: any) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('token1111124', await AsyncStorage.getItem('accessToken'));
      if (!token) {
        setHasToken(false);
      } else if (token) {
        setHasToken(true);
      }
      setIsLoading(false);
    };
    checkToken();
  }, [userData]);

  const onNavigationStateChange = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };
  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={onNavigationStateChange}>
        {hasToken ? <AppStackScreen /> : <LoginStack />}
      </NavigationContainer>
      {isLoading && <LoadingScreen />}
    </>
  );
};
export default RootNavigator;
