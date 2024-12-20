import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  SafeAreaView,
  Animated,
  useColorScheme,
} from "react-native";
import { Linking } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Swiper from "../../components/Swiper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFocusEffect, router } from "expo-router";

function formatDateTime(milliseconds) {
  const date = new Date(milliseconds);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "2-digit", // "23"
    month: "2-digit", // "01"
    day: "2-digit", // "22"
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit", // "14"
    minute: "2-digit", // "05"
    hour12: false, // use 24-hour time
  });
  return `${formattedDate} ${formattedTime}`;
}

const ScanItem = ({ ssd, styles, scan, toggleFavorite, isFavorite }) => {
  const [expanded, setExpanded] = useState(false);

  async function swipeHandler(direction) {
    setExpanded(false);

    if (direction == "right") {
      let list = JSON.parse((await AsyncStorage.getItem("items")) || "[]");
      let nl = [];
      for (const item of list) {
        if (item.title !== scan.title) nl.push(item);
      }
      await AsyncStorage.setItem("items", JSON.stringify(nl));
      ssd(nl);
    } else if (direction == "left") {
      toggleFavorite(scan.title);
    }
  }

  function favoriteHandler() {
    toggleFavorite(scan.title);
  }

  async function deleteHandler() {
    let list = JSON.parse((await AsyncStorage.getItem("items")) || "[]");
    let nl = [];
    for (const item of list) {
      if (item.title !== scan.title) nl.push(item);
    }
    await AsyncStorage.setItem("items", JSON.stringify(nl));
    ssd(nl);
  }

  async function listHandler() {
    //await AsyncStorage.setItem("listingScan", JSON.stringify(scan));
    //router.push("/listing");
    alert('Coming Soon!');
  }

  return (
    <View style={[styles.item, isFavorite ? styles.favoritedItem : null]}>
      <GestureHandlerRootView>
        <Swiper
          disabled={expanded}
          listAction={listHandler}
          favoriteAction={favoriteHandler}
          deleteAction={deleteHandler}
          itemId={scan.title}
        >
          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            style={styles.itemHeader}
          >
            <View>
              <Image source={{ uri: scan.imageURI }} style={styles.thumbnail} />
            </View>
            <View style={styles.itemInfo}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.itemTitle}
              >
                {scan.title}
              </Text>
              <View style={styles.dateTimeContainer}>
                <Text style={styles.itemDate}>{formatDateTime(scan.date)}</Text>
              </View>
            </View>
            <View
              style={{
                marginLeft: "auto",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                flex: 1,
              }}
            >
              <FontAwesome
                name={expanded ? "chevron-up" : "chevron-down"}
                size={15}
                style={styles.chevronIcon}
              />
            </View>
          </TouchableOpacity>
        </Swiper>
      </GestureHandlerRootView>
      {expanded && (
        <View style={styles.details}>
          {scan.details.map((detail, i) => (
            <TouchableOpacity
              key={i}
              style={styles.StoreButton}
              onPress={() => Linking.openURL(detail.url)}
            >
              <Image
                style={styles.storeThumbnail}
                source={{ uri: detail.thumbnail }}
              />
              <View style={styles.storeInfo}>
                <Text style={styles.storeName}>{detail.store}</Text>
                <Text style={styles.itemInTitle} numberOfLines={2}>
                  {detail.title}
                </Text>
              </View>
              <Text style={styles.itemPrice}>{detail.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default function ScansScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewFavorites, setViewFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [scanData, setScanData] = useState([]);
  const colorScheme = useColorScheme();
  const styles = colorScheme == "light" ? stylesLight : stylesDark;
  const [searchResults, setSearchResults] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const tabUnderlinePosition = useRef(new Animated.Value(0)).current;

  const animateUnderline = (index) => {
    Animated.spring(tabUnderlinePosition, {
      toValue: index * 100,
      useNativeDriver: true,
    }).start();
    setTabIndex(index);
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const items = await AsyncStorage.getItem("items");
        if (items !== undefined && items !== null) {
          setScanData(JSON.parse(items));
        }
      })();
    }, []),
  );

  const toggleFavorite = (title) => {
    setFavorites((prev) => {
      const isFav = prev.includes(title);
      return isFav ? prev.filter((item) => item !== title) : [...prev, title];
    });
  };

  const selectedScans = viewFavorites
    ? scanData.filter((scan) => favorites.includes(scan.title))
    : scanData;
  const sortedScans = selectedScans.sort((a, b) => b.date - a.date);
  const filteredScans = sortedScans.filter((scan) =>
    scan.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    if (searchQuery) {
      const filteredItems = scanData.filter((scan) =>
        scan.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResults(filteredItems);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, scanData]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleCat}>
          <Text style={styles.title}>Scan History</Text>
        </View>
        <View style={styles.topBarContainer}>
          <View style={styles.searchBarContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search scans..."
              placeholderTextColor="#858383"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              autoCorrect={false}
            />
            <FontAwesome
              name="search"
              size={15}
              color="white"
              style={styles.searchIcon}
            />
          </View>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={styles.ltab}
              onPress={() => animateUnderline(0)}
            >
              <Text
                style={[styles.tabText, tabIndex === 0 && styles.tabTextActive]}
              >
                Scans
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rtab}
              onPress={() => animateUnderline(2)}
            >
              <Text
                style={[styles.tabText, tabIndex === 2 && styles.tabTextActive]}
              >
                Favorites
              </Text>
            </TouchableOpacity>
            <Animated.View
              style={[
                styles.tabUnderline,
                { transform: [{ translateX: tabUnderlinePosition }] },
              ]}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        {tabIndex == 2 ? (
          favorites.length === 0 ? (
            <Text style={styles.noFavoritesText}>
              You have no current favorites. Swipe right on an item and hit the
              star icon to make it a "favorite".
            </Text>
          ) : (
            favorites.map((favTitle, index) => {
              const favItem = scanData.find((scan) => scan.title === favTitle);
              return favItem ? (
                <ScanItem
                  key={index}
                  scan={favItem}
                  ssd={setScanData}
                  toggleFavorite={toggleFavorite}
                  isFavorite={true}
                  styles={styles}
                />
              ) : null;
            })
          )
        ) : searchResults.length === 0 && searchQuery ? (
          <Text style={styles.noResultsText}>
            No results for that search found.
          </Text>
        ) : (
          searchResults.map((scan, index) => (
            <ScanItem
              key={index}
              scan={scan}
                ssd={setScanData}
              toggleFavorite={toggleFavorite}
              isFavorite={favorites.includes(scan.title)}
              styles={styles}
            />
          ))
        )}
        {!searchQuery &&
          tabIndex !== 2 &&
          scanData.map((scan, index) => (
            <ScanItem
              key={index}
              scan={scan}
              ssd={setScanData}
              toggleFavorite={toggleFavorite}
              isFavorite={favorites.includes(scan.title)}
              styles={styles}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const stylesDark = StyleSheet.create({
  buttonBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingHorizontal: 15,
    width: "100%",
    alignSelf: "center",
  },
  tabButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  allScansButton: {
    flex: 3,
    backgroundColor: "#222",
    marginRight: 2,
  },
  tabsButton: {
    flex: 1,
    backgroundColor: "#d8d8d8",
  },
  tabButton: {
    paddingVertical: 8,
    borderRadius: 5,
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 2,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },

  noFavoritesText: {
    color: "white",
    fontSize: 18,
    padding: 20,
    textAlign: "center",
  },
  // cartIcon: {
  //   color: "white",
  // },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  topBarContainer: {
    backgroundColor: "#111111",
    // paddingBottom: 0,
    // borderBottomWidth: 0,
    // borderColor: "#1d1d1d",
    // shadowColor: "#000000",
    // shadowOffset: { width: 0, height: 8 },
    // shadowOpacity: 0.5,
    // shadowRadius: 6,
    // elevation: 3,
  },
  // cartButton: {
  //   color: "white",
  //   size: 32,
  //   paddingBottom: 10,
  // },
  container: {
    flex: 1,
    backgroundColor: "#111111",
    borderBottomWidth: 1.5,
    borderColor: "#333333",
  },
  header: {
    paddingTop: 10,
    backgroundColor: "#111111",
    borderBottomWidth: 10,
    borderColor: "#000",
  },
  titleCat: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "4%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textAlign: "left",
    paddingBottom: 10,
  },
  chevronIcon: {
    color: "white",
  },

  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333333",
    borderRadius: 5,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "#777777",
  },
  searchIcon: {
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 5,
    paddingTop: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
    backgroundColor: "#000",
  },
  searchInput: {
    flex: 1,
    color: "#ffffff",
    paddingLeft: 10,
  },
  item: {
    backgroundColor: "#111111",
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  itemTitle: {
    fontSize: 16,
    color: "#ffffff",
    flexShrink: 1,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
  },
  itemInfo: {
    flex: 6,
    flexDirection: "column",
    justifyContent: "center",
  },

  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  itemDate: {
    color: "#5c5c5c",
    fontSize: 16,
    paddingRight: 10,
  },
  details: {
    backgroundColor: "#1b1b1b",
    padding: 15,
  },
  detailText: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },

  StoreButton: {
    backgroundColor: "#111111",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },

  storeThumbnail: {
    width: 50,
    height: 50,
    marginRight: 10,
  },

  storeInfo: {
    flex: 1,
    justifyContent: "center",
  },

  storeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  itemInTitle: {
    fontSize: 16,
    color: "#c0c0c0",
    flexShrink: 1,
  },

  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "left",
  },

  favoritedItem: {
    borderColor: "#fdd048",
    borderWidth: 2,
  },
  noResultsText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "white",
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
  buttonBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingHorizontal: 15,
    width: "100%",
    alignSelf: "center",
  },
  tabButtonText: {
    color: "#000",
    fontSize: 16,
    textAlign: "center",
  },
  tabButton: {
    paddingVertical: 8,
    borderRadius: 5,
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 2,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: "#ffffff",
  },
  noFavoritesText: {
    color: "#000",
    fontSize: 18,
    padding: 20,
    textAlign: "center",
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  topBarContainer: {
    backgroundColor: "#ffffff",
    // borderBottomWidth: 1,
    // borderColor: "#ccc",
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderBottomWidth: 0.5,
    borderColor: "#999999",
  },
  header: {
    paddingTop: "5%",
    backgroundColor: "#ffffff",
    borderBottomWidth: 10,
    borderColor: "#e2e2e2",
  },
  titleCat: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "4%",
  },
  // cartButton: {
  //   color: "black",
  //   paddingBottom: 10,
  // },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
    textAlign: "left",
    paddingBottom: 10,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ebebeb",
    borderRadius: 5,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "#969696",
  },
  searchInput: {
    flex: 1,
    color: "#000000",
    paddingLeft: 10,
  },
  searchIcon: {
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 5,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    backgroundColor: "#fff",
  },
  showFav: {
    color: "#000",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: "center",
    minWidth: 100,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  item: {
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 10,
    borderWidth: 0.5,
    borderColor: "#c4c4c4",
    borderRadiusBottom: 20,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
  },
  itemInfo: {
    flex: 6,
    flexDirection: "column",
    justifyContent: "center",
  },
  itemInTitle: {
    fontSize: 16,
    color: "#5e5d5d",
    flexShrink: 1,
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  itemDate: {
    color: "#5a5a5a",
    fontSize: 16,
    paddingRight: 10,
  },
  details: {
    backgroundColor: "#d8d7d7",
    padding: 15,
  },
  detailText: {
    color: "#000",
    fontSize: 16,
    marginBottom: 5,
  },
  StoreButton: {
    backgroundColor: "#f3f3f3",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    borderWidth: 0.2,
    borderColor: "#c4c4c4",
  },
  storeThumbnail: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  chevronIcon: {
    color: "black",
  },
  storeInfo: {
    flex: 1,
    justifyContent: "center",
  },
  storeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  itemTitle: {
    fontSize: 16,
    color: "#000000",
    flexShrink: 1,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "left",
  },
  favoritedItem: {
    borderColor: "#fdd048",
    borderWidth: 2,
  },
  noResultsText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: "black",
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
