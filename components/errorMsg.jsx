import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ErrorMessage = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 99,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 10,
  },
});

export default ErrorMessage;
