import {Modal, StyleSheet} from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white',
  },
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
  body: {
    flex:1,
    height: '100%',
    borderTopWidth:1,
  },
  mainBody:{
    flex:1,
    justifyContent:'space-around',
  },
  mainContent:{
    flex:1,
    padding:10,
  },
  updateInfo:{
    flex:1,
    flexDirection:'row',
  },


  //Button Group
  buttonGroup:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignContent:'flex-start',
    alignItems:'flex-start',
  },
  radioGroup:{
    flexDirection: 'row',
    height:'auto',
    alignItems:'center',
    justifyContent: 'space-around',
    padding: 16,
    marginTop: 10,
    shadowColor: '#000',
  },

//password
passwordField:{
  justifyContent:'center',
  alignContent:'center',
},

inputWrapper: {
  position: 'relative',
  width: '100%',

},

changePassword:{
  flex:1,
  flexDirection:'row',
},

eyeIcon: {
  position: 'absolute',
  right: 10,
  top: '25%',
  transform: [{ translateY: -12 }], // Căn giữa biểu tượng mắt
  zIndex: 1,
},  

eyeIconImage: {
  width: 24,
  height: 24,
},
    lableStyle:{
      fontSize: 24,
      marginBottom:5,
      color: 'black', 
      fontWeight:400,   
    },
footer:{flex:1},

textInput:{
  borderWidth:1,
  alignItems:'center',  
  width:'auto',
  backgroundColor:'white',
  paddingBottom:10,
  fontSize:20,
  marginBottom:50,
},

readonly:{
  borderWidth:1,
  alignItems:'center',  
  width:'auto',
  paddingBottom:10,
  fontSize:20,
  marginBottom:50,
  backgroundColor:'lightgrey',
},
  });
  
export default styles;

