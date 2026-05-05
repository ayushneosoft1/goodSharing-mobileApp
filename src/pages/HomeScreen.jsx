import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ textAlign: "center", marginTop: 50 }}>Home Screen</Text>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreatePost")}
      >
        <Text style={{ fontSize: 30, color: "white" }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    zIndex: 999,
  },
});

export default HomeScreen;
