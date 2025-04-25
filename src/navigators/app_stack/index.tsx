import {createStackNavigator} from '@react-navigation/stack';
import {SCREEN_NAMES} from './../screen_names';
const Stack = createStackNavigator();

const AppStackScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      initialRouteName={SCREEN_NAMES.HOME_SCREEN}
      {/* <Stack.Screen name={SCREEN_NAMES.HOME_SCREEN} component={HomeScreen} /> */}
    </Stack.Navigator>
  );
};
export default AppStackScreen;
