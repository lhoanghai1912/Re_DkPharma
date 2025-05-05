import React, {useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import styles from './setting_styles';
import {RadioButton, TextInput} from 'react-native-paper';
import images from '../../component/contants';
import {navigate} from '../../navigators/root_navigators';
import {SCREEN_NAMES} from '../../navigators/screen_names';
import {UseSelector, useDispatch, useSelector} from 'react-redux';
import {setUserData} from '../../redux/slice_index';

// import { Container } from './styles';

const SettingScreen: React.FC = () => {
  const [checked, setChecked] = useState('first');
  const {userData} = useSelector((state: any) => state.user);
  const [oldPassword, setOldPassword] = useState<string>('');

  const [isOldPasswordVisible, setIsOldPasswordVisible] =
    useState<boolean>(false);
  console.log('userdata', userData);

  const handleBack = async () => {
    navigate(SCREEN_NAMES.HOME_SCREEN);
  };

  //hide show password
  const togglePasswordVisibility = (type: number) => {
    if (type === 1) setIsOldPasswordVisible(!isOldPasswordVisible);
    if (type === 2) setIsOldPasswordVisible(!isOldPasswordVisible);
    if (type === 3) setIsOldPasswordVisible(!isOldPasswordVisible);
  };

  //Text change
  const handleInputChange = (value: string, type: number) => {
    const newArr = {
      ...userData,
      user: {
        ...userData?.user,
        ...(type === 1 && {center: value}), // Nếu type là 1, cập nhật trường center
        ...(type === 2 && {fullName: value}), // Nếu type là 2, cập nhật trường fullName
        ...(type === 3 && {department: value}),
      },
    };
    setUserData(newArr);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            handleBack();
          }}
          style={[styles.headerButtons, styles.icon]}>
          <Image style={styles.icon} source={images.back_white}></Image>
        </TouchableOpacity>
        <Text style={styles.headerText}>Xuất kho sản xuất</Text>
        <TouchableOpacity style={styles.headerButtons} onPress={() => {}}>
          <Image source={images.account} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={styles.buttonGroup}>
          <View style={styles.radioGroup}>
            <Text style={styles.lableStyle}>Update User Information</Text>
            <RadioButton
              value="first"
              status={checked === 'first' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('first')}
            />
          </View>
          <View style={styles.radioGroup}>
            <Text style={styles.lableStyle}>Change Password</Text>
            <RadioButton
              value="second"
              status={checked === 'second' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('second')}
            />
          </View>
        </View>
        <View style={styles.mainBody}>
          <View
            style={[
              styles.updateInfo,
              {display: checked === 'first' ? 'flex' : 'none'},
            ]}>
            <View style={styles.mainContent}>
              <Text style={styles.lableStyle}>UserName</Text>
              <TextInput
                value={userData?.user.username}
                editable={false}
                placeholder="Username"
                style={styles.readonly}
              />
              <Text style={styles.lableStyle}>Center</Text>
              <TextInput
                value={userData?.user.Center}
                placeholder="Center"
                style={styles.textInput}
                onChangeText={text => handleInputChange(text, 1)}
              />
            </View>
            <View style={styles.mainContent}>
              <Text style={styles.lableStyle}>Full Name</Text>
              <TextInput
                value={userData?.user.fullName}
                placeholder="Full Name"
                style={styles.textInput}
                onChangeText={text => handleInputChange(text, 2)}
              />
              <Text style={styles.lableStyle}>Department</Text>
              <TextInput
                value={userData?.user.fullName}
                placeholder="Department"
                style={styles.textInput}
                onChangeText={text => handleInputChange(text, 3)}
              />
            </View>
          </View>
          <View
            style={[
              styles.changePassword,
              {display: checked == 'second' ? 'flex' : 'none'},
            ]}>
            <View style={styles.mainContent}>
              <View style={styles.passwordField}>
                <Text style={styles.lableStyle}>Old Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    placeholder="Old Password"
                    style={styles.textInput}
                    onChangeText={setOldPassword}
                    secureTextEntry={!isOldPasswordVisible}
                  />
                  <TouchableOpacity
                    onPress={() => togglePasswordVisibility(1)}
                    style={styles.eyeIcon}>
                    <Image
                      source={isOldPasswordVisible ? images.hide : images.view}
                      style={styles.eyeIconImage}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.footer}></View>
    </View>
  );
};

export default SettingScreen;
