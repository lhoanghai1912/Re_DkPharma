import LottieView from 'lottie-react-native';
import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';

const LoadingScreen = () => {
  const [isloading, setIsloading] = useState(true);

  // Giả lập một quá trình tải dữ liệu
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsloading(false); // Set loading thành false sau 3 giây
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container]}>
      {isloading ? (
        <LottieView
          source={require('./lottieAnimation.json')} // Đường dẫn tới file animation
          autoPlay
          loop
          style={{width: 150, height: 150}}
        />
      ) : (
        <Text style={styles.loadedText}>Data Loaded!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // full màn
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // nền mờ đen đẹp hơn
    zIndex: 9999,
  },
  loadedText: {
    color: 'white',
    fontSize: 18,
  },
});

export default LoadingScreen;
