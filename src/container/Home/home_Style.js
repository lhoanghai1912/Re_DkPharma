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
        flex: 1.5,
    },
    welcomeText:{
        textAlign: 'left', 
        fontSize: 24, 
        fontWeight: 'bold', 
        margin: 20},
    bodyContent:
    {
        flex:1,
        paddingTop:'5%',
    },

    pickerBox:{
        flex:1,        
        justifyContent:'flex-start',
        alignItems:'center',
        
    }, 
    pickerHeader:{
        paddingHorizontal:5,
        width:'50%',
        flexDirection:'row',
        backgroundColor:'orange',
        justifyContent:'space-between',
        alignItems:'center',
        borderWidth: 1,
        borderRadius:5,
        height:'15%',
    },

    pickerBody:{
        borderWidth: 1,
        flex:1,
        width:'50%',
        marginBottom:10,
        borderRadius:5,
    },
    
    bodyItem:{
        flex:1,
        width:'100%',
        alignItems:'center',
        
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
    },


    bottonText:{
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
    },

    itemBox:{
        borderWidth:1,
        borderRadius:5,
        flex:1,
        alignItems:'center',
        margin:5,
        paddingVertical:5,
        backgroundColor:'lightgray',
    }
});

export default styles;