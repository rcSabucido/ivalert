import FluidLevel from "@/components/FluidLevel";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Alert from "../components/Alert";


export default function Index() {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <View 
      style={{
        flex: 1,
        justifyContent: "flex-start",
      }}>
    <ScrollView>
      <View style={styles.headerBlock}>
        <Text style={styles.headerText}>WELCOME TO</Text>
        <Text style={styles.headerSubText}>IVALERT</Text>
      </View>
      <View style={styles.block}>
        <Text style={styles.text}>Tracking Status</Text>
        <View style={styles.trackingBlock}>
          <Text style={styles.trackingText}>75{"%"}</Text>
        </View>
        <Text style={styles.text}>Bag Volume: 1 Liter</Text>
        <View style={styles.trackingGestureBar} />
      </View>
      <View style={styles.block}>
        <Text style={styles.text}>Fluid Level Monitor</Text>
        <FluidLevel level={75} />
      </View>

      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Pressable onPress={() => setShowAlert(true)}>
        <Text
          style={{
            color: "blue",
            marginTop: 20,
            fontFamily: "Poppins_500Medium",
          }}
        >
          Press me!
        </Text>
      </Pressable>

      <Alert isVisible={showAlert} onClose={() => setShowAlert(false)}/>
    </ScrollView>
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
  },
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