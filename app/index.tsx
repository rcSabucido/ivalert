import FluidLevel from "@/components/FluidLevel";
import TrackingStatus from "@/components/TrackingStatus";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Alert from "../components/Alert";

export default function Index() {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <View 
      style={{
        flex: 1,
      }}>
      <View style={styles.headerBlock}>
        <Text style={styles.headerText}>WELCOME TO</Text>
        <Text style={styles.headerSubText}>IVALERT</Text>
      </View>
      <View style={[styles.block]}>
        <TrackingStatus />
      </View>
      <View style={styles.block}>
        <Text style={styles.text}>Fluid Level Monitor</Text>
        <FluidLevel level={75} />
      </View>
      <Alert isVisible={showAlert} onClose={() => setShowAlert(false)}/>
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 32,
    color: "#263268",
  },
  headerSubText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 64,
    color: "#009DFF",
    lineHeight: 53,
  },
  headerBlock: {
    padding: 24,
    paddingTop: 64,
    flex: 1,
  },
  block: {
    backgroundColor: "#BBDEFB",
    padding: 12,
    marginLeft: 24,
    marginRight: 24,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 24,
    alignItems: "center",
    overflow: "hidden",
  },
  text: {
    fontFamily: "Poppins_700Bold",
    fontSize: 20,
    lineHeight: 24,
    color: "#263268",
  }
})