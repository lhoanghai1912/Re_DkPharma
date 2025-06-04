// src/api/apiClient.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

export async function callApi(
  url: string,
  options: RequestInit = {},
  setIsLoading: (isLoading: boolean) => void,
  onLogout?: () => void, // callback logout truyền từ component
) {
  const token = await AsyncStorage.getItem('accessToken');
  try {
    setIsLoading(true);

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? {Authorization: `Bearer ${token}`} : {}),
      ...options.headers,
    };
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      await AsyncStorage.removeItem('accessToken');
      // Có thể dispatch logout redux ở đây nếu muốn
      console.log('tokenremoved?', await AsyncStorage.getItem('accessToken'));
      console.log(token);
      if (onLogout) onLogout();
      Alert.alert('token hết hạn');
      setIsLoading(false);
      throw new Error('Token hết hạn, vui lòng đăng nhập lại');
    }
    const data = await response.json();

    if (response.status === 200 && data?.accessToken) {
      await AsyncStorage.setItem('accessToken', data?.accessToken);
    }

    if (!response.ok) {
      // Alert.alert(data.errors.Reason);
      console.log('erros:', data?.title);
      Alert.alert(`Lỗi: ${data?.title} `);
      throw new Error(`Lỗi: ${response.status}`);
    }
    setIsLoading(false);
    return data;
  } catch (error) {
    setIsLoading(false);
    throw error;
  }
}
