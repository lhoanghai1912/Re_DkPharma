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

const Login: React.FC = () => {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isVisible, setIsVisible] = React.useState(true);
  const isLoginEnabled = username.length > 0 && password.length > 0;
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
            onPress={() => Alert.alert('Login Button Pressed')}
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

export default Login;
