// @ts-nocheck
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { Link, router } from "expo-router";
import { rank } from "../affiliate";
import {
  Button,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";
import { searchByFile } from "@/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as cheerio from "cheerio/lib/slim";
import axios from "axios";
import * as Crypto from "expo-crypto";
import * as FileSystem from "expo-file-system";
import ErrorMsg from "../../components/errorMsg";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [spinner, setSpinner] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [pic, setPic] = useState(null);
  const [error, setError] = useState(null);
  const colorScheme = useColorScheme();
  const styles = colorScheme == "light" ? stylesLight : stylesDark;
  const iconSize = 25;

  useEffect(() => {
    if (error !== null) {
      setTimeout(() => {
        setError(null);
      }, 4000);
    }
  }, [error]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.allowText}>
          Please hit continue in order to allow access of camera to use LENS
        </Text>
        <Button onPress={requestPermission} title="Continue" />
        {/* {permission.canAskAgain && (
          <Button
            title="Open Settings"
            onPress={() => Linking.openSettings()}
            color="red"
          />
        )} */}
      </View>
    );
  }

  function findPreferable(r: any) {
    for (const site in rank) {
      for (const link of r) {
        if (link.pageURL == null) continue;
        //@ts-ignore
        if (link.pageURL.includes(rank[site])) return link;
      }
    }

    return r[0];
  }

  function findTopShopping(r: any) {
    let items = {};
    for (const link of r) {
      const purl = link.pageURL !== undefined ? link.pageURL : link.url;
      if (purl == null || link.price == null) continue;
      for (const site in rank) {
        //@ts-ignore
        if (purl.includes(rank[site])) items[site] = link;
      }
    }

    let ret = [];
    for (const key in items) {
      ret.push({
        store: key,
        price: items[key].price,
        url:
          items[key].pageURL !== undefined
            ? items[key].pageURL
            : items[key].url,
        thumbnail: items[key].thumbnail,
        title: items[key].title,
        upc: items[key].upc,
        asin: items[key].asin,
        ean: items[key].ean,
      });
    }
    return ret;
  }

  async function gshop(xxr: any) {
    const search = xxr[0].title;
    const r = await axios.get(
      `https://www.google.com/search?sca_esv=697ef796fdf142b1&hl=en-US&tbm=shop&psb=1&q=${search}&oq=${search}&gs_lp=Egtwcm9kdWN0cy1jYyIIZG9nIHRveXMyChAAGIAEGEMYigUyChAAGIAEGEMYigUyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABEjqMlCMDFizEnABeACQAQCYAYABoAGmBqoBAzcuMrgBA8gBAPgBAYgGAQ&sclient=products-cc`,
    );
    const $ = cheerio.load(r.data);

    let ret = [];
    let s = new Set();
    $(".xcR77").each((_, ele) => {
      const e = $(ele);
      const a = e.find("a");
      const gurl = a.attr("href");
      if (!gurl.startsWith("/url?q")) return;
      const url = decodeURIComponent(gurl.substring(7));
      const title = a.text();
      const price = parseFloat(e.find(".HRLxBb").text().substring(1));
      const img = e.find("img").attr("src");
      let store = "";
      for (const site in rank) {
        //@ts-ignore
        if (url.includes(rank[site])) {
          store = site;
        }
      }

      if (s.has(store)) return;
      s.add(store);

      if (store == "") return;
      ret.push({
        url,
        title,
        price,
        thumbnail: img,
        store,
      });
    });

    ret.sort((a, b) => a.price - b.price);

    const x = ret.map((item) => ({
      ...item,
      price: `$${item.price.toFixed(2)}`,
    }));
    return x;
  }

  async function takePicture() {
    if (cameraRef.current) {
      setSpinner(true);
      try {
        let photo = await cameraRef.current.takePictureAsync({
          imageType: "jpg",
          base64: false,
          skipProcessing: false,
        });
        setPic(photo);

        const offset = {
          x: photo.width * 0.2,
          y: photo.height * 0.3,
        };
        const size = {
          width: photo.width * 0.6,
          height: photo.height * 0.4,
        };

        const cropped = await manipulateAsync(
          photo.uri,
          [
            {
              crop: {
                height: size.height,
                width: size.width,
                originX: offset.x,
                originY: offset.y,
              },
            },
          ],
          { compress: 1, base64: true, format: SaveFormat.JPEG },
        );

        const r = await searchByFile({
          uri: cropped.uri,
          type: "image/jpeg",
          name: "img.jpg",
        });
        //const pref = findPreferable(r.similar);
        let list = JSON.parse((await AsyncStorage.getItem("items")) || "[]");
        const to = `${FileSystem.documentDirectory}${Crypto.randomUUID()}.jpg`;
        await FileSystem.copyAsync({ from: cropped.uri, to });

        const listings = findTopShopping(r.similar);
        if (listings.length == 0) {
          setSpinner(false);
          setError("We didn't find this item for sale");
          setPic(null);
          return;
        }

        list.push({
          favorite: false,
          date: +new Date(),
          title: findPreferable(r.similar).title,
          imageURI: to,
          details: listings,
        });
        await AsyncStorage.setItem("items", JSON.stringify(list));

        setSpinner(false);
        setPic(null);
        router.replace("/items");
      } catch (e) {
        console.log(e);
        setSpinner(false);
        setError("Failed to scan item.");
        setPic(null);
      }
    }
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    console.log(
      `Bar code with type ${type} and data ${data} has been scanned!`,
    );
    setSpinner(true);
    try {
      let list = JSON.parse((await AsyncStorage.getItem("items")) || "[]");
      const r = await fetch(
        "https://api.upcitemdb.com/prod/trial/lookup?upc=" + data,
      );
      const info = await r.json();
      if (info.code !== "OK") {
        console.log(info.message);
        setSpinner(false);
        return;
      }
      if (info.items.length < 1) {
        console.log("No items found from barcode");
        setSpinner(false);
        return;
      }

      const imageURI =
        info.items[0].images.length < 1
          ? await cameraRef.current.takePictureAsync({
              imageType: "jpg",
              base64: false,
              skipProcessing: false,
            })
          : info.items[0].images[0];

      const g = await gshop([{ title: info.items[0].title }]);
      const listings = findTopShopping(g);
      if (listings.length == 0) {
        setSpinner(false);
        setError("We didn't find this item for sale");
        return;
      }

      list.push({
        favorite: false,
        upc: info.items[0].upc,
        asin: info.items[0].asin,
        ean: info.items[0].ean,
        date: +new Date(),
        title: info.items[0].title,
        imageURI,
        details: listings,
      });
      await AsyncStorage.setItem("items", JSON.stringify(list));

      setSpinner(false);
      setPic(null);
      router.replace("/items");
    } catch (e) {
      console.log(e);
      setSpinner(false);
      setError("Failed to scan barcode");
    }
  };

  return (
    <View style={styles.container}>
      <Spinner
        visible={spinner}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      {error !== null ? <ErrorMsg message={error} /> : null}
      {pic == null ? (
        <CameraView
          onBarcodeScanned={spinner ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["ean13", "ean8", "upc_a"],
          }}
          flash={flashEnabled ? "on" : "off"}
          style={styles.camera}
          ref={cameraRef}
        >
          <Link href="/help" asChild>
            <TouchableOpacity style={styles.help}>
              <Text style={styles.text}>?</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/settings" asChild>
            <TouchableOpacity style={styles.settings}>
              <Ionicons
                name={"settings-outline"}
                color={"white"}
                size={iconSize}
              />
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            style={styles.flash}
            onPress={() => setFlashEnabled(!flashEnabled)} // Toggle flash state on press
          >
            <Ionicons
              name={flashEnabled ? "flash" : "flash-outline"}
              color={"white"}
              size={iconSize}
            />
          </TouchableOpacity>

          <View style={styles.topLeftCorner} />
          <View style={styles.topRightCorner} />
          <View style={styles.bottomLeftCorner} />
          <View style={styles.bottomRightCorner} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              disabled={spinner}
              style={styles.button}
              onPress={takePicture}
            >
              <Text style={styles.text}>Scan</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <>
          <Image source={pic} style={styles.image} />
          <TouchableOpacity
            style={styles.flash}
            onPress={() => setPic(null)} // Toggle flash state on press
          >
            <Ionicons name={"close-outline"} color={"white"} size={iconSize} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const stylesDark = StyleSheet.create({
  allowText: { textAlign: "center", color: "white", fontSize: 20 },
  spinnerTextStyle: {
    color: "#FFF",
    marginLeft: 10,
    marginBottom: 50,
    // paddingBottom: 30,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textAlign: {
    textAlign: "center",
    color: "white",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    borderBottomWidth: 1.5,
    borderColor: "#333333",
  },
  camera: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topLeftCorner: {
    position: "absolute",
    width: 60,
    height: 60,
    borderLeftWidth: 3,
    borderLeftColor: "white",
    borderRadius: 3,
    borderTopWidth: 3,
    borderTopColor: "white",
    left: "20%",
    top: "30%",
  },
  // (20%, 30%), (-20%, 30%), (20%, -30%), (-20%, -30%)
  topRightCorner: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 3,
    borderRightWidth: 3,
    borderRightColor: "white",
    borderTopWidth: 3,
    borderTopColor: "white",
    right: "20%",
    top: "30%",
  },
  bottomLeftCorner: {
    borderRadius: 3,
    position: "absolute",
    width: 60,
    height: 60,
    borderLeftWidth: 3,
    borderLeftColor: "white",
    borderBottomWidth: 3,
    borderBottomColor: "white",
    left: "20%",
    bottom: "30%",
  },
  bottomRightCorner: {
    borderRadius: 3,
    position: "absolute",
    width: 60,
    height: 60,
    borderRightWidth: 3,
    borderRightColor: "white",
    borderBottomWidth: 3,
    borderBottomColor: "white",
    right: "20%",
    bottom: "30%",
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 150,
    borderRadius: 10,
    padding: 10,
  },
  help: {
    position: "absolute",
    top: 60, // Adjust this value as needed to move the button closer to the top of the screen
    right: "17%", // Adjust this value as needed to move the button closer to the right side of the screen
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  settings: {
    position: "absolute",
    top: 60, // Adjust this value as needed to move the button closer to the top of the screen
    right: "5%", // Adjust this value as needed to move the button closer to the right side of the screen
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  flash: {
    position: "absolute",
    top: 60, // Adjust this value as needed to move the button closer to the top of the screen
    right: "85%", // Adjust this value as needed to move the button closer to the right side of the screen
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

const stylesLight = StyleSheet.create({
  allowText: { textAlign: "center", color: "black", fontSize: 20 },
  spinnerTextStyle: {
    color: "#FFF",
    marginLeft: 10,
    marginBottom: 50,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textAlign: {
    textAlign: "center",
    color: "white",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    borderBottomWidth: 0.5,
    borderColor: "#999999",
  },
  camera: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  topLeftCorner: {
    position: "absolute",
    width: 60,
    height: 60,
    borderLeftWidth: 3,
    borderLeftColor: "white",
    borderRadius: 3,
    borderTopWidth: 3,
    borderTopColor: "white",
    left: "20%",
    top: "30%",
  },
  // (20%, 30%), (-20%, 30%), (20%, -30%), (-20%, -30%)
  topRightCorner: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 3,
    borderRightWidth: 3,
    borderRightColor: "white",
    borderTopWidth: 3,
    borderTopColor: "white",
    right: "20%",
    top: "30%",
  },
  bottomLeftCorner: {
    borderRadius: 3,
    position: "absolute",
    width: 60,
    height: 60,
    borderLeftWidth: 3,
    borderLeftColor: "white",
    borderBottomWidth: 3,
    borderBottomColor: "white",
    left: "20%",
    bottom: "30%",
  },
  bottomRightCorner: {
    borderRadius: 3,
    position: "absolute",
    width: 60,
    height: 60,
    borderRightWidth: 3,
    borderRightColor: "white",
    borderBottomWidth: 3,
    borderBottomColor: "white",
    right: "20%",
    bottom: "30%",
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 150,
    borderRadius: 10,
    padding: 10,
  },
  help: {
    position: "absolute",
    top: 60, // Adjust this value as needed to move the button closer to the top of the screen
    right: "17%", // Adjust this value as needed to move the button closer to the right side of the screen
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  settings: {
    position: "absolute",
    top: 60, // Adjust this value as needed to move the button closer to the top of the screen
    right: "5%", // Adjust this value as needed to move the button closer to the right side of the screen
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  flash: {
    position: "absolute",
    top: 60, // Adjust this value as needed to move the button closer to the top of the screen
    right: "85%", // Adjust this value as needed to move the button closer to the right side of the screen
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
