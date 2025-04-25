import { Button, StyleSheet } from "react-native";
import React from "react";
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column',
        marginHorizontal:50,
    },
    //dùng chung
    content:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },

    icon:{
        position: 'absolute',
        resizeMode: 'contain', // Đảm bảo logo không bị méo
        zIndex: 1,
        width: 30, // Kích thước logo
        height: 30, // Kích thước logo
        right: 20,
        bottom: 35,
    },

    //header
    header:{
        flex: 1,
        height:'100%',
        width:'100%',
        backgroundColor: 'white',
        alignContent:'center',
        alignItems: 'center',
    },
    image:{
        width: 500,
        height: 500,
        resizeMode: 'contain',
    },

    //body
    body:{
        flex: 2,
        justifyContent: 'center',
        height:'100%',
        alignItems: 'center',
        width:'100%',
        alignContent:'center',
    },
    textInput:{
        flex: 1,
        borderWidth:1,
        borderRadius:5,
        width: '100%',
        fontSize:24,
        paddingLeft:20,
    },
    button:{
        flex: 0.5,   
        backgroundColor:'lightblue',
        alignContent: 'center', 
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        borderRadius: 5,
        borderWidth:1,
    },              
    //footer
    footer:{
        flex: 1,
        justifyContent: 'center',
        height:'100%',
        alignItems: 'center',
        backgroundColor: 'white',
        alignContent:'center',

    },
    buttonText :{
        fontSize: 26,
        color: 'white',
        fontWeight: 'bold',
    },
    text:{
        fontSize: 20,
    },
    inputGroup:{
        flex: 2,
        width: '100%',
        paddingVertical: 10,
    },
    inputItem:{
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent:'center',
        // backgroundColor: 'red',
        height: 'auto',
        marginBottom: 50,
    },
    iconGroup:{
        flexDirection: 'row',
        position: 'absolute',
        resizeMode: 'contain', // Đảm bảo logo không bị méo
        zIndex: 1,  
        justifyContent:'space-between',
        width:80,
        right: 30,
        bottom: 35,
        // backgroundColor: 'blue',
    },
    iconItem:{
        width: 30,
        height: 30,
    }
});

export default styles;