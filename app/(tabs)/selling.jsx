import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
  Image,
  useColorScheme,
} from "react-native";
import { Link, router, useFocusEffect } from "expo-router";

export default function ScansScreen() {
  const [tabIndex, setTabIndex] = useState(0);
  const tabUnderlinePosition = useRef(new Animated.Value(0)).current;
  const colorScheme = useColorScheme();
  const styles = colorScheme == "light" ? stylesLight : stylesDark;

  const [listings, setListings] = useState([]);
  const [drafts, setDrafts] = useState([]);

  const animateUnderline = (index) => {
    Animated.spring(tabUnderlinePosition, {
      toValue: index * 100,
      useNativeDriver: true,
    }).start();
    setTabIndex(index);
  };

  function createListingClick() {
    //Superwall.shared.register("CreateListing").then(() => {
      router.push("/List");
    //});
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Listings</Text>
        <TouchableOpacity style={styles.button} onPress={createListingClick}>
          <Text style={styles.buttonText}>Create Listing</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.ltab}
          onPress={() => animateUnderline(0)}
        >
          <Text
            style={[styles.tabText, tabIndex === 0 && styles.tabTextActive]}
          >
            Current Listings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rtab}
          onPress={() => animateUnderline(2)}
        >
          <Text
            style={[styles.tabText, tabIndex === 2 && styles.tabTextActive]}
          >
            Drafts
          </Text>
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.tabUnderline,
            { transform: [{ translateX: tabUnderlinePosition }] },
          ]}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        {tabIndex === 0 && listings.length === 0 && (
          <Text style={styles.messageText}>
            You have no Current Listings. Please hit 'Create Listing' at the top
            in order to make one.
          </Text>
        )}
        {tabIndex === 2 && drafts.length === 0 && (
          <Text style={styles.messageText}>
            You have no Drafts. Please hit 'Create Listing' at the top in order
            to make one.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    borderBottomWidth: 1,
    borderColor: "#333333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "5%",
    paddingHorizontal: "5%",
    paddingBottom: "5%",
    borderColor: "#333333",
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  button: {
    backgroundColor: "#166e00",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    // shadowColor: "#00361b", // A darker green shadow color
    // shadowOffset: { width: 3, height: 4 }, // Shadow positioned slightly below the button
    // shadowOpacity: 1,
    // shadowRadius: 1, // Slightly blurred shadow
    // elevation: 4, // For Android: similar effect to shadow
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },

  scrollView: {
    marginHorizontal: 20,
    paddingTop: 15,
  },
  listItem: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#1e1e1e",
    borderRadius: 5,
    marginBottom: 10,
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  itemDetails: {
    justifyContent: "center",
  },
  itemTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDate: {
    color: "#aaa",
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#111111",
    paddingTop: 10,
    paddingBottom: 10,
  },
  ltab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  rtab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    color: "#807e7e",
  },
  tabTextActive: {
    fontWeight: "bold",
    color: "#ffffff",
  },
  tabUnderline: {
    height: 2,
    width: "42%",
    backgroundColor: "#a8a8a8",
    position: "absolute",
    bottom: 15,
    left: 13,
  },
  scrollView: {
    marginHorizontal: 20,
  },
  messageText: {
    textAlign: "center",
    fontSize: 16,
    color: "#b3b3b3",
    marginTop: 10,
  },
});

const stylesLight = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderColor: "#999999",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "5%",
    paddingHorizontal: "5%",
    paddingBottom: "5%",
    borderColor: "#DDD",
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    // shadowColor: "#253825",
    // shadowOffset: { width: 2, height: 3 },
    // shadowOpacity: 0.6,
    // shadowRadius: 2,
    // elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  scrollView: {
    marginHorizontal: 20,
    paddingTop: 15,
  },
  listItem: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    marginBottom: 10,
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  itemDetails: {
    justifyContent: "center",
  },
  itemTitle: {
    color: "black", // Dark text color for items
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDate: {
    color: "#333", // Slightly darker gray for item date
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#ffffff", // Lighter background for the tab area
    paddingTop: 10,
    paddingBottom: 10,
  },
  ltab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  rtab: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    color: "#555", // Darker gray for better visibility
  },
  tabTextActive: {
    fontWeight: "bold",
    color: "#000", // Black for active tabs
  },
  tabUnderline: {
    height: 2,
    width: "42%",
    backgroundColor: "#000000", // Lighter gray for the underline
    position: "absolute",
    bottom: 15,
    left: 13,
  },
  messageText: {
    textAlign: "center",
    fontSize: 16,
    color: "#8d8d8d",
  },
});
