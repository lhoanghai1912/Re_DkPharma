import { Button, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column',
        // marginVertical:20,
    },
    //dùng chung

    //header
    header:{
        flex: 0.2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height:'auto%',
        width:'auto%',
        alignContent:'center',
        alignItems: 'center',
        borderWidth:1,
        borderColor:'white',
        borderRadius:20,
    },

    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        marginHorizontal: 10,
    },
    headerText:{
        fontSize: 38,
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    icon:{
        width: 60,
        height: 60,
        resizeMode: 'contain',

    },

    body:{
        flex: 1.5,
        // backgroundColor:'white'
    },
    welcomeText:{
        textAlign: 'left', 
        fontSize: 24, 
        fontWeight: 'bold', 
        margin: 20,
        marginVertical:20,
    },
    bodyContent:
    {
        flex:1,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo:{
        flex:1,
        width: '90%',
        height: '90%',
        // right:'40%',
        resizeMode: 'contain',
        position: 'absolute',
    },
    pickerBox:{
        flex:1,        
        justifyContent:'center',
        alignContent:'center',
    }, 
    pickerHeader:{
        paddingHorizontal:5,
        width:'80%',
        flexDirection:'row',
        backgroundColor:'lightgray',
        justifyContent:'space-between',
        alignItems:'center',
        borderWidth: 1,
        borderRadius:20,
        height:'20%',
    },

    pickerBody:{
        borderWidth: 1,
        flex:1,
        marginBottom:10,
        borderRadius:20,
    },

    bodyItem:{
        flex:1,
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
        
    },
    footer:{
        flex: 0.2, backgroundColor:'',
    },

    footerContent:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:50,
        alignItems:'center',
        alignContent:'center',
    },

    footerButton:{
        backgroundColor:'blue',
        borderRadius:5,
        paddingVertical:10,
        paddingHorizontal:20,
    },

    normalText:{
        fontSize: 22,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },


    buttonText:{
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
    },

    itemBox:{
        borderWidth:1,
        borderRadius:20,
        flex:1,
        alignItems:'center',
        margin:5,
        paddingVertical:5,
        backgroundColor:'lightgray',
    }
});

export default styles;