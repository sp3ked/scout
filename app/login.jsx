import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
// import * as GoogleSignIn from 'expo-google-sign-in'; // Uncomment this if you use GoogleSignIn

export default function LoginScreen() {
  // const scheme = useColorScheme(); // This will be either 'dark' or 'light'
  const [styles, setStyles] = useState(darkStyle);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignIn.initAsync(); // Ensure native Google login setup is correct
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === "success") {
        console.log("Google sign-in success:", user);
        // Handle successful Google login here
      } else {
        console.log("Google sign-in was cancelled");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.text1}>
        *Login in order to favorite items and see scan history
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Ionicons name="logo-google" size={20} color="white" />
        <Text style={styles.buttonText}>Sign In with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Ionicons name="logo-apple" size={20} color="white" />
        <Text style={styles.buttonText}>Sign In with Apple</Text>
      </TouchableOpacity>
    </View>
  );
}

const lightStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.light.backgroundColor,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 2,
  },
  text1: {
    padding: 10,
    backgroundColor: Colors.light.backgroundColor,
    color: Colors.light.color1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2081C3",
    padding: 15,
    width: "100%",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
  },
});

const darkStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.dark.backgroundColor,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.dark.text,
    marginBottom: 2,
  },
  text1: {
    padding: 10,
    backgroundColor: Colors.dark.backgroundColor,
    color: Colors.dark.color1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2081C3",
    padding: 15,
    width: "100%",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
  },
});
