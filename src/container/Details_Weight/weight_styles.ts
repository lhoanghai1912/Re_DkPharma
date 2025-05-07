import { Button, StyleSheet } from "react-native";
const styles = StyleSheet.create({

container:{
    flex:1,
    marginVertical:20,
    borderWidth:1,
    // backgroundColor:'grey',
},

header:{
    flexDirection:'row',
    flex:0.2,
    paddingHorizontal:20,

    // backgroundColor:'green',
    alignItems:'center',
    justifyContent:'space-between',
    borderBottomWidth:1,
    alignContent:'center',
},
headerText:{
    fontSize:26,
    color:'black',
    fontWeight:500,
},
icon:{
    resizeMode:'contain',
    width:40,
    height:40,
},
body:{
    borderBottomWidth:1,
    flex:1.5,
    // justifyContent:'center',

},
bodyHeader:{
    flexDirection:'row',
    alignContent:'flex-start',
    borderBottomWidth:1,
    // backgroundColor:'red',
    justifyContent:'space-between',
},
bodyHeaderCol:{
    borderLeftWidth:1,
    textAlign:'center',
    backgroundColor:'white',
    borderRadius:0,
    textAlignVertical:'center',
    fontSize:18
},
bodyMain:{
    flex:1,
    flexDirection:'row',
    alignContent:'center',
    justifyContent:'center',
    backgroundColor:'white',
},
footer:{
    // flexDirection:'row'
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'yellow',
    flex:0.3,
},

footerButton:{
    width:'auto',
    height:'auto',
    backgroundColor:'blue',
    borderRadius:5,
    paddingVertical:10,
    paddingHorizontal:20,
},

});
export default styles;