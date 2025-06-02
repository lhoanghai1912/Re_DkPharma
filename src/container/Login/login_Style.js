import { Button, StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container:{
        paddingTop: 20,
        flex: 1,
        // colors: ['#0C8B43', '#A8D5BA'],
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        marginHorizontal:10,
    },

    logo:{
        flex:1,
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
        position: 'absolute',
    },
    info:{
        flex: 1,
        alignContent:'flex-end',
        justifyContent: 'flex-end',
        width: '100%',
        // backgroundColor:'red',
        paddingBottom:20,
    },
    textInfo:{
        fontSize:28,
        color: 'black',
        fontWeight: 'bold',
        marginHorizontal:10,    
        textAlign: 'center',
    },
    line: {
        height: 2,
        backgroundColor: 'black',
        marginHorizontal: 40,
        marginBottom:0,
  },
    iconBar:{
        flexDirection: 'row',
        resizeMode: 'contain', // Đảm bảo logo không bị méo
        zIndex: 1,  
        justifyContent:'space-evenly',
        alignContent:'center',
        alignItems: 'center',
        width:'100%',
        
    },
    mainContent:{
        paddingVertical:20,
        borderRadius:50,
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    //dùng chung
    wrapContent:{
        flexDirection:'row',
        width: '90%',
        height: '80%',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 50,

    },
    content:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },

    
    //header
    header:{
        flex: 0.7,
        height:'100%',
        width:'100%',
        // backgroundColor: 'white',
        alignContent:'center',
        alignItems: 'center',
    },
    image:{
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    
    //body
    body:{
        flex: 1,
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
        fontSize:24,
        borderLeftWidth:0,
        borderRightWidth:0,
        paddingLeft:20,
        textAlign: 'center',
    },
    button:{
        flex: 0.5,   
        backgroundColor:'lightblue',
        alignContent: 'center', 
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        borderRadius: 10,
        borderWidth:1,
    },              
    //footer
    footer:{
        flex: 0.5,
        justifyContent: 'center',
        width:'90%',
        height:'auto',
        alignItems: 'center',
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
        flex: 3,
        width: '100%',
        paddingVertical: 10,
        alignItems: 'center',
    },
    inputItem:{
        flex: 1,
        width: '80%',
        flexDirection: 'row',
        justifyContent:'center',
        // backgroundColor: 'red',
        height: '50%',
        marginBottom: 20,
    },
    iconGroup:{
        flexDirection: 'row',
        position: 'absolute',
        resizeMode: 'contain', // Đảm bảo logo không bị méo
        zIndex: 1,  
        justifyContent:'space-between',
        width:80,
        right: '0%',
        top: '25%',
        // backgroundColor: 'blue',
    },
    icon:{
        position: 'absolute',
        resizeMode: 'contain', // Đảm bảo logo không bị méo
        zIndex: 1,
        width: 30, // Kích thước logo
        height: 30, // Kích thước logo
        right: '10%',
        top:'30%',    },
    iconItem:{
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
    iconLoginItem:{
        width: 30,
        height: 30,
        top:'30%',
        right: '10%',
        resizeMode: 'contain',

    },
});

export default styles;