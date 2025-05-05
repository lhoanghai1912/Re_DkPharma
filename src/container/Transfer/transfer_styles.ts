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
        height:'auto',
        width:'auto',
        backgroundColor: 'green',
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
    iconArrow:{width:20,height:20,resizeMode:'contain'},

    body:{
        flex:1.5,
        marginVertical:10,
    },
    headerContent:{
        flex:0.5,
        flexDirection:'row',
        alignContent:'center',
        paddingHorizontal:10,
    },
    headerContentCol:{
        flex:1,
        marginRight:5,
        // backgroundColor:'red',
        justifyContent:'space-around',
        alignContent:'center',
        alignItems:'center',
    },
    headerContentItem:{
        width:'100%',
    },
    mainContent:{
        flex:2,
        // backgroundColor:'blue'
    },

    mainContentHeader:{
        flexDirection:'row',
        alignContent:'center',
        justifyContent:'center',
    },    
    mainConTentText:{
        fontSize:20,
        borderWidth:1,
        textAlign:'center',
        textAlignVertical:'center',
    },
    mainContentBody:{
        flex:1,
    },

    pickerBody:{
        borderWidth: 1,
        flex:1,
        width:'50%',
        marginBottom:10,
        borderRadius:5,
    },

    modal:{
        // flex:1,
        height:300,
        width:500,
        justifyContent:'center',
        alignContent:'center',
      },
    wrapModal:{
    flex:1,
    width:'auto',
    justifyContent:'center',
    alignItems:'center',
    alignContent:'center',
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
        fontSize: 20,
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