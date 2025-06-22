import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { WebSocketService } from '../services/WebSocketService';

const { width } = Dimensions.get('window');
const wsService = new WebSocketService();

type TrackingStatusProps = {
  showAlert: boolean
};

export default function TrackingStatus({ showAlert }: TrackingStatusProps) {
  const componentRef = useRef(null);
  const translateX = useRef<Animated.Value>(new Animated.Value(0)).current;
  const [isTracking, setIsTracking] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);  

  const startTracking = () => {
    wsService.connect('ws://nephil.net:4295/live_update', (level) => {
      let roundLevel = Math.floor(level);
      setCurrentLevel(roundLevel);
      onLevelUpdate(roundLevel);
      console.log("Received level update:", roundLevel);
    });
    setIsTracking(true);
  };

  const stopTracking = () => {
    wsService.disconnect();
    setIsTracking(false);
  };

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
    return () => {
      wsService.disconnect();
    };
  }, []);
  
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
        isTracking ? stopTracking() : startTracking();
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        setTrackingButtonVisible(true);
      }}>
        <Text style={[styles.text, { color: "white" }]}>{isTracking ? 'Stop Tracking' : 'Start Tracking'}</Text>
      </Pressable>
      
      { trackingButtonVisible && <Animated.View style={[styles.internalBlock,
        { transform: [{ translateX: translateX }]}]} {...panResponder.panHandlers}>
        <Text style={styles.text}>Tracking Status</Text>
        <View style={styles.trackingBlock}>
          <Text style={styles.trackingText}>{currentLevel}%</Text>
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