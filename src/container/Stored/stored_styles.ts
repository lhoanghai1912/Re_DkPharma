import { Button, StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column',
    },
    //dùng chung

    //header
    header:{
        flex: 0.2,
        flexDirection: 'row',
        justifyContent: 'space-between',

        borderWidth:1,
        borderRadius:20,
        borderColor:'white',
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
    iconArrow:{
        width:20,
        height:20,
        resizeMode:'contain'
    },

    body:{
        flex:1.5,
        marginVertical:10,
        // backgroundColor:'blue',
    },
    headerContent:{
        flex:0.7,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:10,
        },
    headerContentCol:{
        flex:1,
        height:'100%',
        marginStart:5,
        justifyContent:'center',
    },
    headerContentItem:{
        width:'100%',
        flex:1,
        marginTop:0,
    },
    mainContent:{
        flex:2,
        // borderTopWidth:1,
    },

    mainContentHeader:{
        flexDirection:'row',
        alignContent:'center',
        justifyContent:'center',
    },    
    mainContentHeaderText:{
        flex:1,
        fontSize:18,
        borderWidth:1,
        color:'white',
        borderRightWidth:0,   
        borderColor:'white',
        textAlign:'center',
        textAlignVertical:'center',
        backgroundColor:'#87cefa',
        height:'auto',
        fontWeight:'500',
    },
    mainContentBodyText:{
        flex:1,
        fontSize:18,
        borderWidth:1,
        color:'white',
        borderRightWidth:0,   
        borderColor:'white',
        textAlign:'center',
        textAlignVertical:'center',
        height:'auto',
        fontWeight:'500',
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
    wrapWeightModal:{
        flex:1,
        width:'100%',
    },

    calendar:{
        // flex:1,
        // backgroundColor:'red',
        height:'auto',
        width:500,
        justifyContent:'center',
        fontSize:18,
      },
    wrapModal:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'rgba(52, 52, 52, 0.5)'

    },
    modalHeader:{
        flex:0.4,
        backgroundColor:'red',

    },
    modalBody:{
        flex:1,
        backgroundColor:'blue',

    },
    modalFooter:{
        flex:0.4,
        backgroundColor:'yellow',

    },
    footer:{
        flex: 0.2,
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
        borderRadius:20,
        borderColor:'white',
        borderWidth:1,
        paddingVertical:10,
        paddingHorizontal:20,
        
    },
    weightModal:{
        // flex:1,
        height:'auto',
        backgroundColor:'white',
        alignItems:'center',
        justifyContent:'center',
    },
    modalWeightWrap:{
        flex:1,
        backgroundColor:'white',
        alignItems:'center',
    },
    modal_HeaderBodyContent:{
        width:'100%',
        flexDirection:'row',
        borderLeftWidth:1,
        textAlign:'center',
        backgroundColor:'white',
        borderRadius:0,
        textAlignVertical:'center',
        fontSize:18
    },
    bodyHeaderCol:{
        borderLeftWidth:1,
        // borderBottomWidth:1,
        textAlign:'center',
        borderRadius:0,
        textAlignVertical:'center',
        fontSize:18
    },
    modalWeightHeader:{
        width:'100%',
        flexDirection:'row',
        backgroundColor:'#87cefa',
        justifyContent:'space-between',
        alignItems:'center',

    },
    modalWeightBody:{
        // backgroundColor:'red',
    },
    modalWeightBodyConten:{
        flexDirection:'row',
    },
    modalWeightFooter:{
        flexDirection:'row',
        flex:0.3,
        alignContent:'center',
        alignItems:'center',
        width:'50%',
        justifyContent:'space-around',
    },
    modalColLable:{
        borderLeftWidth:1,
        textAlign:'center',
        textAlignVertical:'center',
    },
    normalText:{
        fontSize:18,
        color: 'white',
        fontWeight: 'bold',
    },
    modalWeightRender:{
        flexDirection:'column',
    },
    button:{
        width:'10%',
        height:'auto',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:20,
        borderWidth:1,
        borderColor:'white',
        marginBottom:'5%',
    },

    buttonText:{
        fontSize:18,
        color: 'white',
        fontWeight: 'bold',
    },

})

export default styles;