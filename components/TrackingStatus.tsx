import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get('window');

type Props = {
  showAlert: boolean
}

export default function TrackingStatus({ showAlert }: Props) {
  const [trackingButtonVisible, setTrackingButtonVisible] = useState(true);
  const translateX = useRef<Animated.Value>(new Animated.Value(-width)).current;

  useEffect(() => {
    if (trackingButtonVisible || showAlert) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      setTrackingButtonVisible(true);
    } else {
      Animated.spring(translateX, {
        toValue: -width,
        useNativeDriver: true,
      }).start();
    }
    console.log("useEffect!")
  }, [trackingButtonVisible, showAlert]);

  const panResponder = React.useRef<any>(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx <= 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          Animated.timing(translateX, {
            toValue: -width, 
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setTrackingButtonVisible(false);
            console.log("closed")
          });
          return;
        }

        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;
  
  console.log(translateX);

  console.log(`tracking button visible: ${trackingButtonVisible}`)

  return (
    <>
    <View style={{flexDirection: "row"}}>
      <View style={[styles.trackingNav, { backgroundColor: trackingButtonVisible ? "white" : "#263268" }]}/>
      <View style={[styles.trackingNav, { backgroundColor: !trackingButtonVisible ? "white" : "#263268" }]}/>
    </View>
    { trackingButtonVisible && <View></View> }
    <View style={{ height: "28%" }}>
      <Text style={[styles.text, {paddingTop: 40}]}>Tracking: Inactive</Text>

      <Pressable style={styles.trackButton} onPress={() => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        setTrackingButtonVisible(true);
      }}>
        <Text style={[styles.text, { color: "white" }]}>Start Tracking</Text>
      </Pressable>
      
      { trackingButtonVisible && <Animated.View style={[styles.internalBlock,
        { transform: [{ translateX: translateX }]}]} {...panResponder.panHandlers}>
        <Text style={styles.text}>Tracking Status</Text>
        <View style={styles.trackingBlock}>
          <Text style={styles.trackingText}>75{"%"}</Text>
        </View>
        <Text style={styles.text}>Bag Volume: 1 Liter</Text>
      </Animated.View> }
    </View>
    </>
  );
}


const styles = StyleSheet.create({
  trackingBlock: {
    margin: 16,
    borderColor: "black",
    backgroundColor: "white",
    borderWidth: 3,
    borderRadius: 12,
    height: 150,
    width: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  trackingNav: {
    width: 32,
    height: 32,
    borderColor: "#BBDEFB",
    borderWidth: 10,
    borderRadius: 16,
    marginTop: 4,
    backgroundColor: "#263268",
  },
  trackingText: {
    color: "#263268",
    fontFamily: "Poppins_700Bold",
    fontSize: 40,
  },
  text: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    lineHeight: 24,
    color: "#263268",
  },
  internalBlock: {
    backgroundColor: "#BBDEFB",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  trackButton: {
    backgroundColor: "#009DFF",
    padding: 12,
    width: "90%",
    height: 96,
    margin: "auto",
    borderRadius: 15,
    marginTop: 32,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
})