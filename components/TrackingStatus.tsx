import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import { WebSocketService } from '../services/WebSocketService';

const { height } = Dimensions.get('window');
const wsService = new WebSocketService();

type TrackingStatusProps = {
  onLevelUpdate: (level: number) => void;
};

export default function TrackingStatus({ onLevelUpdate }: TrackingStatusProps) {
  const componentRef = useRef(null);
  const translateY = useRef<Animated.Value>(new Animated.Value(0)).current;
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
    Animated.spring(translateY, {
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
        if (gestureState.dy <= 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50) {
          Animated.timing(translateY, {
            toValue: -height, 
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            console.log("closed")
          });
          return;
        }

        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;
  
  console.log(translateY);

  return (
    <View style={{ height: 260 }}>
      <Text style={[styles.text, {paddingTop: 40}]}>Tracking: Inactive</Text>

      <Pressable style={styles.trackButton} onPress={() => {
        isTracking ? stopTracking() : startTracking();
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }}>
        <Text style={[styles.text, { color: "white" }]}>{isTracking ? 'Stop Tracking' : 'Start Tracking'}</Text>
      </Pressable>
      
      <Animated.View style={[styles.internalBlock,
        { transform: [{ translateY: translateY }]}]} {...panResponder.panHandlers}>
        <Text style={styles.text}>Tracking Status</Text>
        <View style={styles.trackingBlock}>
          <Text style={styles.trackingText}>{currentLevel}%</Text>
        </View>
        <Text style={styles.text}>Bag Volume: 1 Liter</Text>
        <View style={styles.trackingGestureBar}/>
      </Animated.View>
    </View>
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
  trackingGestureBar: {
    width: "35%",
    height: 24,
    borderColor: "#BBDEFB",
    borderWidth: 10,
    borderRadius: 16,
    marginTop: 4,
    backgroundColor: "#009DFF",
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