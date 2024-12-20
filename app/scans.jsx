import React from "react";
import { View, Text, StyleSheet } from "react-native";

function Scans() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scans</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // example background
  },
  title: {
    fontSize: 20,
    color: "#fff",
  },
});

export default Scans;
