import {
CommonActions,createNavigationContainerRef,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: any, params?: any) {
    if(navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
    }
}
 
// export function navigateToScreenAndReset(name){
//     return navigationRef.current?.dispatch(
//         CommonActions.reset({
//             index: 0,
//             routes: [{ name }],
//         }),
//     );
// }