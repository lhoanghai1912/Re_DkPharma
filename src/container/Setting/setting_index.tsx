import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import styles from './setting_styles';
import {RadioButton} from 'react-native-paper';
import images from '../../component/contants';
import {useDispatch, useSelector} from 'react-redux';
import {logout, setUserDataInformation} from '../../redux/slice_index';
import {callApi} from '../../api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../../component/loading_index';

const SettingScreen: React.FC = ({navigation}: any) => {
  const [checked, setChecked] = useState('first');
  const {userData} = useSelector((state: any) => state.user);
  const [userInfo, setUserInfo] = useState(userData?.user);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordRef, setNewPasswordRef] = useState<string>('');
  const [isOldPasswordVisible, setIsOldPasswordVisible] =
    useState<boolean>(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] =
    useState<boolean>(false);
  const [isNewPasswordRefVisible, setIsNewPasswordRefVisible] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleBack = async () => {
    navigation.goBack();
  };

  //hide show password
  const togglePasswordVisibility = (type: number) => {
    if (type === 1) setIsOldPasswordVisible(!isOldPasswordVisible);
    if (type === 2) setIsNewPasswordVisible(!isNewPasswordVisible);
    if (type === 3) setIsNewPasswordRefVisible(!isNewPasswordRefVisible);
  };

  //Text change
  const handleInputChange = (value: string, field: string) => {
    const newArr = {
      ...userInfo,
      user: {
        ...userInfo,
        [field]: value,
      },
    };
    setUserInfo(newArr.user);
  };

  //button update user
  const handldSubmitInfo = async () => {
    if (!userInfo.fullName || !userInfo.center || !userInfo.department) {
      Alert.alert('Please enter all information');
      return;
    } else {
      if (!userData.accessToken) {
        Alert.alert('please login again');
        dispatch(logout());
        return;
      }
      try {
        const url = 'https://pos.foxai.com.vn:8123/api/Auth';
        const databack = await callApi(
          url,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${await AsyncStorage.getItem(
                'accessToken',
              )}`,
            },
            body: JSON.stringify({
              id: userInfo?.id,
              fullName: userInfo?.fullName,
              center: userInfo?.center,
              department: userInfo?.department,
            }),
          },
          setIsLoading,
          () => dispatch(logout()),
        );
        if (databack) {
          try {
            dispatch(setUserDataInformation({user: userInfo}));
            console.log('Update successful');
            Alert.alert('Update successful');
          } catch (e) {
            Alert.alert('Lỗi');
            console.log('error: ', e);
          }
        } else {
          console.log('Lỗi');
        }
      } catch (e) {
        console.log('error', e);
      }
    }
  };

  //button update password
  const handleSubmitPassword = async () => {
    if (!oldPassword || !newPassword || !newPasswordRef) {
      Alert.alert('Please fill in all fields');
      return;
    }
    if (newPassword !== newPasswordRef) {
      Alert.alert('New password and confirm password need to match');
      return;
    }
    try {
      const url = `https://pos.foxai.com.vn:8123/api/Auth/changePassword`;
      const databack = await callApi(
        url,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await AsyncStorage.getItem(
              'accessToken',
            )}`,
          },
          body: JSON.stringify({
            id: userData?.user?.id,
            oldPassword: oldPassword,
            password: newPassword,
            refPassword: newPasswordRef,
          }),
        },
        setIsLoading,
        () => dispatch(logout()),
      );
      if (databack) {
        Alert.alert('Password changed, please login again');
        dispatch(logout());
      } else {
        Alert.alert(
          'faild to change password',
          databack?.status,
          databack?.message || 'Please try again later',
        );
      }
    } catch (e) {
      console.log('error', e);
    }
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
        <Text style={styles.headerText}>Thông tin người dùng</Text>
        <TouchableOpacity></TouchableOpacity>
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
          {isLoading ? (
            <LoadingScreen></LoadingScreen>
          ) : (
            <View
              style={[
                styles.updateInfo,
                {
                  paddingHorizontal: 10,
                  display: checked === 'first' ? 'flex' : 'none',
                },
              ]}>
              <View
                style={
                  // styles.mainContent
                  {
                    borderWidth: 0,
                    flex: 0.5,
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // backgroundColor: 'red',
                  }
                }>
                <Image
                  source={images.male}
                  style={{
                    height: '95%',
                    width: '95%',
                    borderRadius: 200,
                  }}></Image>
              </View>
              <View style={{flex: 1, backgroundColor: ''}}>
                <View
                  style={[
                    styles.mainContent,
                    {backgroundColor: '', borderWidth: 1, marginBottom: 5},
                  ]}>
                  <Text style={styles.lableStyle}>UserName</Text>
                  <TextInput
                    value={userInfo?.username}
                    editable={false}
                    placeholder="Username"
                    style={styles.readonly}
                  />
                  <Text style={styles.lableStyle}>Full Name</Text>
                  <TextInput
                    value={userInfo?.fullName}
                    placeholder="Full Name"
                    style={styles.textInput}
                    onChangeText={text => handleInputChange(text, 'fullName')}
                  />
                </View>
                <View
                  style={[
                    styles.mainContent,
                    {backgroundColor: '', borderWidth: 1, marginTop: 5},
                  ]}>
                  <Text style={styles.lableStyle}>Center</Text>
                  <TextInput
                    value={userInfo?.center}
                    placeholder="Center"
                    style={styles.textInput}
                    onChangeText={text => handleInputChange(text, 'center')}
                  />
                  <Text style={styles.lableStyle}>Department</Text>
                  <TextInput
                    value={userInfo?.department}
                    placeholder="Department"
                    style={styles.textInput}
                    onChangeText={text => handleInputChange(text, 'department')}
                  />
                </View>
              </View>
            </View>
          )}
          <View
            style={[
              styles.changePassword,
              {display: checked == 'second' ? 'flex' : 'none'},
            ]}>
            <View style={[styles.mainContent, {alignItems: 'center'}]}>
              <View style={styles.passwordField}>
                <Text style={styles.lableStyle}>Old Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    placeholder="Old Password"
                    style={[
                      styles.textInput,
                      {borderRadius: 10, backgroundColor: '#f0f0f0'},
                    ]}
                    onChangeText={setOldPassword}
                    secureTextEntry={!isOldPasswordVisible}
                  />
                  <TouchableOpacity
                    onPress={() => togglePasswordVisibility(1)}
                    style={styles.eyeIcon}>
                    <Image
                      source={isOldPasswordVisible ? images.hide : images.view}
                      style={[
                        styles.eyeIconImage,
                        {display: oldPassword.length > 0 ? 'flex' : 'none'},
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.passwordField}>
                <Text style={styles.lableStyle}>New Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    placeholder="New Password"
                    style={[
                      styles.textInput,
                      {borderRadius: 10, backgroundColor: '#f0f0f0'},
                    ]}
                    onChangeText={setNewPassword}
                    secureTextEntry={!isNewPasswordVisible}
                  />
                  <TouchableOpacity
                    onPress={() => togglePasswordVisibility(2)}
                    style={styles.eyeIcon}>
                    <Image
                      source={isNewPasswordVisible ? images.hide : images.view}
                      style={[
                        styles.eyeIconImage,
                        {display: newPassword.length > 0 ? 'flex' : 'none'},
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.passwordField}>
                <Text style={styles.lableStyle}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    placeholder="Confirm Password"
                    style={[
                      styles.textInput,
                      {borderRadius: 10, backgroundColor: '#f0f0f0'},
                    ]}
                    onChangeText={setNewPasswordRef}
                    secureTextEntry={!isNewPasswordRefVisible}
                  />
                  <TouchableOpacity
                    onPress={() => togglePasswordVisibility(3)}
                    style={styles.eyeIcon}>
                    <Image
                      source={
                        isNewPasswordRefVisible ? images.hide : images.view
                      }
                      style={[
                        styles.eyeIconImage,
                        {display: newPasswordRef.length > 0 ? 'flex' : 'none'},
                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View
        style={[
          styles.footer,
          {display: checked === 'first' ? 'flex' : 'none'},
        ]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleBack();
            console.log('back button pressed');
          }}>
          <Text style={styles.buttonText}>Quay lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handldSubmitInfo();
            console.log('confirm info change pressed');
          }}>
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
      <View
        style={[
          styles.footer,
          {display: checked === 'second' ? 'flex' : 'none'},
        ]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleBack();
            console.log('back pressed');
          }}>
          <Text style={styles.buttonText}>Quay lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleSubmitPassword();
            console.log('confirm password change pressed');
          }}>
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingScreen;
