import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SCREEN_NAMES} from './../screen_names';
import HomeScreen from '../../container/Home/home_Index';
import MenuScreen from '../../container/Menu/menu_Index';
import TransferScreen from '../../container/Transfer/transfer_Index';
const Stack = createNativeStackNavigator();

const AppStackScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName={SCREEN_NAMES.HOME_SCREEN}>
      <Stack.Screen name={SCREEN_NAMES.HOME_SCREEN} component={HomeScreen} />
      <Stack.Screen name={SCREEN_NAMES.MENU_SCREEN} component={MenuScreen} />
      <Stack.Screen
        name={SCREEN_NAMES.TRANSFER_CREEN}
        component={TransferScreen}
      />
    </Stack.Navigator>
  );
};

export default AppStackScreen;
