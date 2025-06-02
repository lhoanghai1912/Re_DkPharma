import { Button, StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column',
        marginVertical:20,
    },
    //dùng chung

    //header
    header:{
        flex: 0.15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height:'auto%',
        width:'auto%',
        backgroundColor: '#87cefa',
        alignContent:'center',
        alignItems: 'center',
    },

    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        marginHorizontal: 10,
    },
    headerText:{
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    icon:{
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },

    body:{
        flex:1.5,
        marginVertical:10,
    },

    normalText:{
        fontSize: 22,
        color: 'black',
        fontWeight: 'bold',
    },

    button:{
        backgroundColor:'blue',
        width:'90%',
        height:'15%',
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:10,
        marginBottom:'5%',
    },

    bottonText:{
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
    },

})

export default styles;