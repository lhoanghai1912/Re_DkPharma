import React, {useState} from 'react';
import {
  Alert,
  Image,
  Linking,
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
import {logout, setUserData} from '../../redux/slice_index';
import {callApi} from '../../api/apiClient';
import LinearGradient from 'react-native-linear-gradient';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

const LoginScreen: React.FC = ({}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1234');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const isLoginEnabled = username.length > 0 && password.length > 0;
  const handleLogin = async () => {
    try {
      const url = 'https://pos.foxai.com.vn:8123/api/Auth/login';
      const databack = await callApi(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username, password}),
        },
        setIsLoading,
        () => dispatch(logout()),
      );
      if (databack) {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.setItem('accessToken', databack.accessToken);

        dispatch(setUserData({userData: databack}));
        console.log('login success', databack);
      } else {
        Alert.alert(
          'login failed',
          databack.message || 'Sai tên đăng nhập hoặc mật khẩu',
        );
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Something went wrong. Please try again late111r.');
    }
  };

  return (
    <LinearGradient
      colors={['#3B82F6', '#BFDBFE']}
      start={{x: 1, y: 0}}
      end={{x: 0, y: 1}}
      style={styles.container}>
      {/* <View style={styles.container}> */}
      <View style={styles.wrapContent}>
        <View
          style={[styles.mainContent, {flex: 0.7, backgroundColor: 'white'}]}>
          <Image source={images.company} style={styles.logo}></Image>
          <View style={styles.info}>
            <Text style={styles.textInfo}> About Us </Text>
            <View style={styles.line}></View>
            <View style={styles.iconBar}>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL('https://www.facebook.com/fox.ai.vn/');
                }}>
                <Image
                  source={images.facebook}
                  style={[styles.iconItem, {top: '30%'}]}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL('https://fox.ai.vn/');
                }}>
                <Image
                  source={images.web}
                  style={[styles.iconItem, {top: '30%'}]}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL('https://www.linkedin.com/in/foxaivn/');
                }}>
                <Image
                  source={images.linkedin}
                  style={[styles.iconItem, {top: '30%'}]}></Image>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL('https://www.youtube.com/@FOXAI-technology');
                }}>
                <Image
                  source={images.youtube}
                  style={[styles.iconItem, {top: '30%'}]}></Image>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <LinearGradient
          colors={['#5fabf0', '#e8f4ff']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.mainContent} // giữ nguyên style
        >
          <View style={[styles.header, {backgroundColor: ''}]}>
            <View style={styles.content}>
              <Image source={images.dk_pharma} style={styles.image}></Image>
            </View>
          </View>
          <View style={[styles.body, {backgroundColor: ''}]}>
            <View style={styles.content}>
              <View style={styles.inputGroup}>
                <View style={[styles.inputItem, {marginTop: 20}]}>
                  <TextInput
                    placeholder="Tên Đăng nhập"
                    style={styles.textInput}
                    value={username}
                    onChangeText={setUsername}
                  />
                  <Image
                    source={images.user}
                    style={[
                      {
                        width: 30,
                        height: 30,
                        left: 0,
                        top: '30%',
                        position: 'absolute',
                      },
                    ]}
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
                  <Image
                    source={images.password}
                    style={[
                      {
                        width: 30,
                        height: 30,
                        left: 0,
                        top: '30%',
                        position: 'absolute',
                      },
                    ]}
                  />
                  <View style={styles.iconGroup}>
                    <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
                      <Image
                        source={isVisible ? images.hide : images.view}
                        style={[
                          styles.iconLoginItem,
                          {display: password.length == 0 ? 'none' : 'flex'},
                        ]}></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setPassword('')}>
                      <Image
                        source={images.close}
                        style={[
                          styles.iconLoginItem,
                          {display: password.length == 0 ? 'none' : 'flex'},
                        ]}></Image>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={[styles.footer, {backgroundColor: ''}]}>
            <View style={styles.content}>
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
        </LinearGradient>
      </View>
      {/* </View> */}
    </LinearGradient>
  );
};

export default LoginScreen;
