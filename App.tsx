import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import LoginScreen from './src/container/Login/login_index';
import Toast from 'react-native-toast-message'; // Import Toast component
import {NavigationContainer} from '@react-navigation/native'; // Import NavigationContainer
import {createStackNavigator} from '@react-navigation/stack'; // Import createStackNavigator
import RootNavigator from './src/navigators';
import {Provider} from 'react-redux';
import store from './src/redux/store'; // Import your Redux store

function App(): React.JSX.Element {
  return (
    // <View style={{flex: 1}}>
    //   <StatusBar barStyle={'light-content'} />
    //   <RootNavigator />
    //   <Toast />
    // </View>
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}

export default App;
