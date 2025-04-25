import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_NAMES} from './screen_names';
import Login from '../container/Login/login_index';
const Stack = createNativeStackNavigator();

const LoginStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName={SCREEN_NAMES.LOGIN_SCREEN}>
      <Stack.Screen name={SCREEN_NAMES.LOGIN_SCREEN} component={Login} />
    </Stack.Navigator>
  );
};

export default LoginStack;
