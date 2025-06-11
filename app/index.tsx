import { Pressable, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Pressable onPress={() => console.log("Pressed!")}>
        <Text
          style={{
            color: "blue",
            marginTop: 20,
          }}
        >
          Press me!
        </Text>
      </Pressable>
    </View>
  );
}
