import React from "react";
import { Image, StyleSheet, View } from "react-native";

type Props = {
  level: number
}

const MAX_FLUID_LEVEL_HEIGHT = 270;
const MARKER_SMALL = "20%";
const MARKER_LENGTH = "25%";

export default function FluidLevel({ level } : Props) {
  return (
    <>
      <View style={styles.fluidBlock}>
        <View style={styles.fluidLevelBlock} />
        <View style={styles.fluidLevelIconContainer}>
          <Image source={require('@/assets/images/fluid-level-icon.png')} style={{
            width: MAX_FLUID_LEVEL_HEIGHT * 0.4, height: MAX_FLUID_LEVEL_HEIGHT * 0.4}} />
        </View>
        <View style={styles.fluidLevelMarkers}>
          <View style={styles.fluidLevelMarkerNone} />
          <View style={styles.fluidLevelMarker} />
          <View style={styles.fluidLevelMarkerSmall} />
          <View style={styles.fluidLevelMarkerSmall} />
          <View style={styles.fluidLevelMarkerSmall} />
          <View style={styles.fluidLevelMarkerNone} />
          <View style={styles.fluidLevelMarker} />
          <View style={styles.fluidLevelMarkerSmall} />
          <View style={styles.fluidLevelMarkerSmall} />
          <View style={styles.fluidLevelMarkerSmall} />
          <View style={styles.fluidLevelMarkerNone} />
          <View style={styles.fluidLevelMarkerSmall} />
          <View style={styles.fluidLevelMarker} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({

  fluidBlock: {
    margin: 16,
    borderColor: "black",
    backgroundColor: "white",
    borderWidth: 4,
    borderRadius: 32,
    height: MAX_FLUID_LEVEL_HEIGHT,
    width: 280,
    alignItems: "center",
    overflow: "hidden", // very important so the fluid level cannot go past the border...
  },
  fluidLevelBlock: {
    borderRadius: 16,
    height: Math.round(MAX_FLUID_LEVEL_HEIGHT * 0.75),
    width: "100%",
    backgroundColor: "#009DFF",
    position: "absolute",
    bottom: 0,
  },
  fluidLevelMarkers: {
    width: "100%",
    height: "100%",
    flexDirection: "column-reverse",
  },
  fluidLevelMarker: {
    width: MARKER_LENGTH,
    height: 4,
    borderRadius: 2,
    marginTop: 16,
    backgroundColor: "black",
  },
  fluidLevelMarkerSmall: {
    width: MARKER_SMALL,
    height: 4,
    borderRadius: 2,
    marginTop: 16,
    backgroundColor: "black",
  },
  fluidLevelMarkerNone: {
    width: MARKER_SMALL,
    height: 4,
    borderRadius: 2,
    marginTop: 16,
  },
  fluidLevelIconContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
})