import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import images from '../../component/contants';
import styles from './login_Style';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {useDispatch} from 'react-redux';
import {setUserData} from '../../redux/slice_index';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen: React.FC = ({}) => {
  const [username, setUsername] = React.useState('admin');
  const [password, setPassword] = React.useState('1234');
  const [isVisible, setIsVisible] = React.useState(true);
  const dispatch = useDispatch();
  const isLoginEnabled = username.length > 0 && password.length > 0;

  const handleLogin = async () => {
    try {
      const respone = await fetch(
        'https://pos.foxai.com.vn:8123/api/Auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        },
      );
      const dataLogin = await respone.json();
      if (respone.ok && dataLogin.accessToken) {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.setItem('accessToken', dataLogin.accessToken);

        //dispatch
        dispatch(setUserData({userData: dataLogin}));

        console.log('login success', dataLogin);
      } else {
        Alert.alert(
          'Login failed',
          dataLogin.message || 'Sai tên đăng nhập hoặc mật khẩu',
        );
      }

      // if (dataLogin?.refreshToken) {
      //   try {
      //     await AsyncStorage.removeItem('userToken');
      //   } catch (e) {
      //     console.log('Erro:', e);
      //   }
      //   try {
      //     const jsonValue = JSON.stringify(dataLogin);
      //     await AsyncStorage.setItem('userToken', jsonValue);
      //   } catch (e) {
      //     console.log('eeeeeeee.', e);
      //   }
      //   try {
      //     dispatch(
      //       setUserData({
      //         userData: dataLogin,
      //       }),
      //     ),
      //       console.log('Login successful:', dataLogin);
      //   } catch (e) {
      //     console.log('Error:', e);
      //   }
      // } else {
      //   Alert.alert('Error', dataLogin.message || 'Login failed');
      // }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Something went wrong. Please try again late111r.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.content}>
          <Image source={images.dk_pharma} style={styles.image}></Image>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.content}>
          <View style={styles.inputGroup}>
            <View style={styles.inputItem}>
              <TextInput
                placeholder="Tên Đăng nhập"
                style={styles.textInput}
                value={username}
                onChangeText={setUsername}
              />
              <TouchableOpacity onPress={() => setUsername('')}>
                <Image
                  source={images.close}
                  style={[
                    styles.icon,
                    {display: username.length == 0 ? 'none' : 'flex'},
                  ]}></Image>
              </TouchableOpacity>
            </View>
            <View style={styles.inputItem}>
              <TextInput
                placeholder="Mật khẩu"
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={isVisible}
              />
              <View style={styles.iconGroup}>
                <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                  <Image
                    source={isVisible ? images.hide : images.view}
                    style={[
                      styles.iconItem,
                      {display: password.length == 0 ? 'none' : 'flex'},
                    ]}></Image>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setPassword('')}>
                  <Image
                    source={images.close}
                    style={[
                      styles.iconItem,
                      {display: password.length == 0 ? 'none' : 'flex'},
                    ]}></Image>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: isLoginEnabled ? '#007BFF' : '#CCCCCC'},
            ]}
            onPress={() => handleLogin()}
            disabled={!isLoginEnabled}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.content}></View>
      </View>
    </View>
  );
};

export default LoginScreen;
