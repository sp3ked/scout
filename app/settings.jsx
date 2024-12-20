import React, { useEffect, useState } from "react";
import { changeIcon } from "react-native-change-icon";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Appearance,
} from "react-native";
import { useNavigation } from "expo-router";

function Settings() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(colorScheme == "dark");
  }, []);

  useEffect(() => {
    navigation.setOptions({ title: "Settings" });
  }, [navigation]);

  async function toggleTheme() {
    setDark(!dark);
    Appearance.setColorScheme(!dark ? "dark" : "light");
    changeIcon(!dark ? "Dark" : "Default");
  }

  const styles = colorScheme == "dark" ? stylesDark : stylesLight;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.island}>
        <Text style={styles.islandTitle}>Theme</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>{dark ? "Dark" : "Light"}</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={dark ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleTheme}
            value={dark}
          />
        </View>
      </View>

      {/* <Link href="/example1" asChild>
        <TouchableOpacity style={styles.linkButton}>
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Go to Example 1</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={styles.linkIcon.color}
            />
          </View>
        </TouchableOpacity>
      </Link>

      <Link href="/example2" asChild>
        <TouchableOpacity style={styles.linkButton2}>
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Go to Example 2</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={styles.linkIcon.color}
            />
          </View>
        </TouchableOpacity>
      </Link> */}
    </ScrollView>
  );
}

const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "bold",
  },
  island: {
    backgroundColor: "#333",
    padding: 15,
    width: "100%",
    marginBottom: 20,
    borderRadius: 5,
    flexDirection: "row", // Align items horizontally
    justifyContent: "space-between", // Space between the elements
    alignItems: "center", // Align items vertically
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchText: {
    color: "#fff",
    marginRight: 10, // Space between the text and the switch
  },
  islandTitle: {
    color: "#fff",
    marginRight: "auto", // Pushes everything to the right of it to the other end
  },
  linkButton: {
    paddingVertical: 2,
    // borderWidth: 1,
    // borderColor: '#7c7c7c',
    // borderRadius: 5,
  },
  linkButton2: {
    paddingVertical: 2,
    // borderWidth: 1,
    // borderColor: '#7c7c7c',
    // borderRadius: 5,
  },

  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
  },

  linkText: {
    color: "#fff",
  },
  linkIcon: {
    color: "#858585",
  },
});

const stylesLight = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#000",
    marginBottom: 20,
    fontWeight: "bold",
  },
  island: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    width: "100%",
    marginBottom: 20,
    borderRadius: 5,
    flexDirection: "row", // Align items horizontally
    justifyContent: "space-between", // Space between the elements
    alignItems: "center", // Align items vertically
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchText: {
    color: "#000",
    marginRight: 10,
  },
  islandTitle: {
    color: "#000",
    marginRight: "auto",
  },
  linkButton: {
    paddingVertical: 2,
    // borderWidth: 1,
    // borderColor: '#7c7c7c',
    // borderRadius: 5,
  },
  linkButton2: {
    paddingVertical: 2,
    // borderWidth: 1,
    // borderColor: '#7c7c7c',
    // borderRadius: 5,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
  },
  linkText: {
    color: "#000",
  },
  linkIcon: {
    color: "#7a7a7a",
  },
});

export default Settings;
