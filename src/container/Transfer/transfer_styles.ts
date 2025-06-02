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
        textAlign:'center'
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
        // backgroundColor:'red',
    },
    headerContent:{
        flex:0.7,
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
        borderTopWidth:1,
        marginTop:10,
        // backgroundColor:'blue'
    },

    mainContentHeader:{
        flexDirection:'row',
        alignContent:'center',
        justifyContent:'center',
    },    
    mainConTentHeaderText:{
        fontSize:20,
        borderLeftWidth:1,
        borderBottomWidth:1,    
        backgroundColor:'#87cefa',
        color:'white',
        fontWeight:'500',
        textAlign:'center',
        textAlignVertical:'center',
    },
        mainConTentBodyText:{
        fontSize:20,
        borderLeftWidth:1,
        borderBottomWidth:1,    
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
        fontSize:20,
      },
    wrapModal:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: 'rgba(52, 52, 52,0.5)'

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
        borderBottomWidth:1,
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
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
    },
    modalWeightRender:{
        flexDirection:'column',
    },
    button:{
        backgroundColor:'blue',
        width:'10%',
        height:'auto',
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:10,
        borderRadius: 5,
        borderWidth:1,
        marginBottom:10,
    },
    buttonOnNormal:{
        backgroundColor:'lightgray',
        width:'auto',
        height:'auto',
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:10,
        marginBottom:10,
        paddingVertical:5,
        borderRadius: 5,
        borderWidth:1,
    },
    buttonOnSelected:{
        backgroundColor: 'blue',
        width:'auto',
        height:'auto',
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:10,
        marginBottom:10,
        paddingVertical:5,
        borderRadius: 5,
        borderWidth:1,

    },
    bottonText:{
        fontSize: 22,
        color: 'white',
        fontWeight: 'bold',
    },

})

export default styles;