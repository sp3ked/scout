import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  TextInput,
  useColorScheme,
} from "react-native";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const formatDateTime = (milliseconds) => {
  const date = new Date(milliseconds);
  return (
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) +
    " " +
    date.toLocaleTimeString("en-US")
  );
};

const listing = () => {
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const colorScheme = useColorScheme();
  const styles = colorScheme == "dark" ? stylesDark : stylesLight;

  useEffect(() => {
    const fetchItems = async () => {
      const storedItems = JSON.parse(await AsyncStorage.getItem("items")) || [];
      const storedFavorites =
        JSON.parse(await AsyncStorage.getItem("favorites")) || [];
      setItems(storedItems);
      setFavorites(storedFavorites);
    };

    fetchItems();
  }, []);

  const renderItem = (item) => {
    const isFavorite = favorites.includes(item.title);
    return (
      <TouchableOpacity
        onPress={async () => {
          await AsyncStorage.setItem("listingScan", JSON.stringify(item));
          router.push("listing");
        }}
        key={Math.random()}
        style={[styles.item, isFavorite && styles.favoritedItem]}
      >
        <Image source={{ uri: item.imageURI }} style={styles.thumbnail} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle} numberOfLines={2} ellipsizeMode="tail">
            {item.title}
          </Text>
          <Text style={styles.itemDate}>{formatDateTime(item.date)}</Text>
        </View>
        <FontAwesome name="chevron-right" size={20} style={styles.chevron} />
      </TouchableOpacity>
    );
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose a Scan to Sell</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search scans..."
          placeholderTextColor="#ccc"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.bottomCont}>
        {filteredItems.length > 0
          ? filteredItems.map(renderItem)
          : searchQuery.length > 0 && (
              <View style={styles.emptySearchContainer}>
                <Text style={styles.emptySearchText}>
                  No results for that search found.
                </Text>
              </View>
            )}
      </ScrollView>
    </SafeAreaView>
  );
};

const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  bottomCont: {
    paddingTop: "2%",
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "#111",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#333",
    paddingBottom: "5%",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  searchInput: {
    width: "100%",
    backgroundColor: "#222",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
  },
  item: {
    backgroundColor: "#222",
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 0.2,
    borderColor: "#494949",
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  itemDate: {
    fontSize: 14,
    color: "#bbb",
  },
  favoritedItem: {
    borderColor: "#fdd048",
    borderWidth: 2,
  },
  chevron: {
    marginLeft: 10,
    color: "#7e7e7e",
  },
  emptySearchContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptySearchText: {
    fontSize: 18,
    color: "#fff",
  },
});

const stylesLight = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bottomCont: {
    paddingTop: "2%",
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: "5%",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  searchInput: {
    width: "100%",
    backgroundColor: "#ececec",
    color: "#000",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
  },
  item: {
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 0.2,
    borderColor: "#d1d1d1",
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  itemDate: {
    fontSize: 14,
    color: "#666",
  },
  favoritedItem: {
    borderColor: "#fdd048",
    borderWidth: 2,
  },
  chevron: {
    marginLeft: 10,
    color: "#606060",
  },
  emptySearchContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptySearchText: {
    fontSize: 18,
    color: "#000",
  },
});

export default listing;
