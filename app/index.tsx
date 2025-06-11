import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Alert from "../components/Alert";

export default function Index() {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
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
    </View>
  );
}