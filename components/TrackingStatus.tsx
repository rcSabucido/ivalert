import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function TrackingStatus() {
  return (
    <>
      <Text style={styles.text}>Tracking Status</Text>
      <View style={styles.trackingBlock}>
        <Text style={styles.trackingText}>75{"%"}</Text>
      </View>
      <Text style={styles.text}>Bag Volume: 1 Liter</Text>
      <View style={styles.trackingGestureBar} />
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
  trackingGestureBar: {
    width: "30%",
    height: 4,
    borderRadius: 2,
    marginTop: 16,
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
  }
})