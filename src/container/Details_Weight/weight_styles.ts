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
    backgroundColor:'green',
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
    position:'absolute',
    resizeMode:'contain',
    width:30,
    height:30,
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
},
footer:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'yellow',
    flex:0.3,
},

});
export default styles;