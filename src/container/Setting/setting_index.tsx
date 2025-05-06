import React, {useEffect, useState} from 'react';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import styles from './setting_styles';
import {RadioButton, TextInput} from 'react-native-paper';
import images from '../../component/contants';
import {navigate} from '../../navigators/root_navigators';
import {SCREEN_NAMES} from '../../navigators/screen_names';
import {useDispatch, useSelector} from 'react-redux';
import {
  logout,
  setUserData,
  setUserDataInformation,
} from '../../redux/slice_index';

const SettingScreen: React.FC = () => {
  const [checked, setChecked] = useState('first');
  const {userData} = useSelector((state: any) => state.user);
  const [userInfo, setUserInfo] = useState(userData.user);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordRef, setNewPasswordRef] = useState<string>('');
  const [isOldPasswordVisible, setIsOldPasswordVisible] =
    useState<boolean>(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] =
    useState<boolean>(false);
  const [isNewPasswordRefVisible, setIsNewPasswordRefVisible] =
    useState<boolean>(false);

  const dispatch = useDispatch();

  const handleBack = async () => {
    navigate(SCREEN_NAMES.HOME_SCREEN);
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
        const respone = await fetch('https://pos.foxai.com.vn:8123/api/Auth', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData.user.accessToken}`,
          },
          body: JSON.stringify({
            id: userInfo?.id,
            fullName: userInfo?.fullName,
            center: userInfo?.center,
            department: userInfo?.department,
          }),
        });
        console.log('respone', respone);

        const data = await respone.json();

        console.log('dataaaaaaaaaaaaaa', data);
        if (respone.status === 200) {
          try {
            dispatch(setUserDataInformation({user: userInfo}));
            console.log('update thanh cong');

            // navigate(SCREEN_NAMES.HOME_SCREEN);
          } catch (e) {
            console.log('loi: ', e);
          }
        } else {
          console.log('loiiiii');
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
      const respone = await fetch(
        `https://pos.foxai.com.vn:8123/api/Auth/changePassword`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData?.user?.accessToken}`,
          },
          body: JSON.stringify({
            id: userData?.user?.id,
            oldPassword: oldPassword,
            password: newPassword,
            refPassword: newPasswordRef,
          }),
        },
      );
      console.log('ressss', respone);
      const data = await respone.json();
      if (respone.status === 200) {
        Alert.alert('Password changed, please login again');
        dispatch(logout());
      } else {
        Alert.alert(
          'faild to change password',
          data?.status,
          data?.message || 'Please try again later',
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
                value={userInfo?.username}
                editable={false}
                placeholder="Username"
                style={styles.readonly}
              />
              <Text style={styles.lableStyle}>Center</Text>
              <TextInput
                value={userInfo?.center}
                placeholder="Center"
                style={styles.textInput}
                onChangeText={text => handleInputChange(text, 'center')}
              />
            </View>
            <View style={styles.mainContent}>
              <Text style={styles.lableStyle}>Full Name</Text>
              <TextInput
                value={userInfo?.fullName}
                placeholder="Full Name"
                style={styles.textInput}
                onChangeText={text => handleInputChange(text, 'fullName')}
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
            <View style={styles.mainContent}>
              <View style={styles.passwordField}>
                <Text style={styles.lableStyle}>New Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    placeholder="New Password"
                    style={styles.textInput}
                    onChangeText={setNewPassword}
                    secureTextEntry={!isNewPasswordVisible}
                  />
                  <TouchableOpacity
                    onPress={() => togglePasswordVisibility(2)}
                    style={styles.eyeIcon}>
                    <Image
                      source={isNewPasswordVisible ? images.hide : images.view}
                      style={styles.eyeIconImage}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.passwordField}>
                <Text style={styles.lableStyle}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    placeholder="Confirm Password"
                    style={styles.textInput}
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
                      style={styles.eyeIconImage}
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
