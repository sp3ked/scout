import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import ErrorMsg from "../components/errorMsg";
import * as WebBrowser from "expo-web-browser";

export default function CreateListing() {
  const [title, setTitle] = useState("");
  const [upc, setUpc] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [condition, setCondition] = useState("new"); // Default condition
  const [category, setCategory] = useState(""); // Category state
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState("");
  const [photos, setPhotos] = useState([]);
  const colorScheme = useColorScheme();
  const styles = colorScheme == "light" ? stylesLight : stylesDark;
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [aspectInput, setAspectInput] = useState("");
  const [aspects, setAspects] = useState([]);
  const [error, setError] = useState(null);
  const [policies, setPolicies] = useState(null);
  const [updatePolicies, setUpdatePolicies] = useState(0);

  useEffect(() => {
    (async () => {
      const scan = await AsyncStorage.getItem("listingScan");
      if (scan == undefined || scan == null) router.replace("/List");
      const scanj = JSON.parse(scan);
      if (scanj.upc) setUpc(scanj.upc);
      setPhotos([{ uri: scanj.imageURI, id: new Date() }]);

      const res = await fetch("https://scout.shopping/ebay/ai", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: await AsyncStorage.getItem("deviceId"),
          Accept: "application/json, text/xml, */*",
        },
        body: JSON.stringify(scanj.details),
      });
      if (!res.ok) {
        console.log(res.status);
        setError("AI Generation Unavailable");
        return;
      }
      let chunk = await res.text();
      setTitle(chunk.split("<title>")[1].split("</title>")[0]);
      setDescription(chunk.split("<description>")[1].split("</description")[0]);
      setPrice(chunk.split("<price>")[1].split("</price>")[0]);
    })();
  }, []);

  useEffect(() => {
    (async() => {
      const res = await fetch('https://scout.shopping/ebay/policies', {
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          Authorization: await AsyncStorage.getItem("deviceId"),
        },
        method: "GET",
      });
      const j = await res.json();
      if (!res.ok) {
        setError(j.message);
        return;
      }
      console.log(JSON.stringify(j));
      setPolicies(j);
    })();
  }, [updatePolicies]);

  useEffect(() => {
    if (title == null || title == undefined || title == "") return;
    const runIt = async () => {
      const res = await fetch(
        "https://scout.shopping/ebay/category-suggestions?" +
          new URLSearchParams({
            title: title,
          }),
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: await AsyncStorage.getItem("deviceId"),
          },
          method: "GET",
        },
      );
      const j = await res.json();
      if (!res.ok) {
        if (j.message == "Sign into Ebay") {
          const r = await fetch(
            "https://scout.shopping/ebay/associate-account",
            {
              method: "GET",
              credentials: "include",
              headers: {
                Authorization: await AsyncStorage.getItem("deviceId"),
              },
            },
          );
          const { url } = await r.json();
          const { type } = await WebBrowser.openAuthSessionAsync(url);
          if (type == "dismiss" || type == "cancel") {
            setError("You need to authenticate with eBay");
            return;
          }
          return await runIt();
        }
        setError(j.message);
        return;
      }
      const { categorySuggestions } = j;
      setCategories(
        categorySuggestions.map((cat) => {
          return {
            label: cat.category.categoryName,
            value: cat.category.categoryId,
          };
        }),
      );
      setCategory({
        label: categorySuggestions[0].category.categoryName,
        value: categorySuggestions[0].category.categoryId,
      });
    };
    runIt();
  }, [title]);
  useEffect(() => {
    if (error !== null) {
      setTimeout(() => {
        setError(null);
      }, 4000);
    }
  }, [error]);
  const [paymentPolicy, setPaymentPolicy] = useState();
  const [returnPolicy, setReturnPolicy] = useState();
  const [fulfillmentPolicy, setFulfillmentPolicy] = useState();
  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");

  const handleCreate = () => {
    console.log("Listing Created:", {
      title,
      description,
      price,
      condition,
      category,
      brand,
      photos,
    });
  };

  const addAspect = () => {
    if (keyInput && valueInput) {
      setAspects([...aspects, { key: keyInput, value: valueInput }]);
      setKeyInput("");
      setValueInput("");
    }
  };

  const handleAddPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.canceled) return;
    setPhotos([...photos, { uri: result.assets[0].uri, id: new Date() }]);
  };

  const removePhoto = (photoId) => {
    setPhotos(photos.filter((photo) => photo.id !== photoId));
  };

  const handleSaveDraft = () => {
    console.log("Draft Saved:", {
      title,
      description,
      price,
      condition,
      category,
      brand,
      photos,
    });
  };

  const handlePolicyChange = async (value, type) => {
    if (value.value === "createNew") {
      if (type == "return") {
        router.push("/returnPolicy");
      } else if (type == "fulfillment") {
        router.push("/fulfillmentPolicy");
      } else if (type == "payment") {
        // automatic
        const res = await fetch('https://scout.shopping/ebay/policies/payment', {
          method: "PUT",
          body: JSON.stringify({name: 'Default'}),
          headers: {
            "Content-Type": "application/json",
            Authorization: await AsyncStorage.getItem("deviceId"),
          },
          credentials: 'include',
        });
        const j = await res.json();
        if (!res.ok) {
          setError(j.message);
          return;
        }
        if (j.errors) {
          setError(JSON.stringify(j.errors));
          return;
        }
        setUpdatePolicies(updatePolicies + 1);
      }
    } else {
      if (type === "payment") {
        setPaymentPolicy(value);
      } else if (type === "return") {
        setReturnPolicy(value);
      } else if (type === "fulfillment") {
        setFulfillmentPolicy(value);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {error !== null ? <ErrorMsg message={error} /> : null}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.header}>Create Your Listing</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title (e.g., Coca-Cola Vintage Bottle)"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
            multiline
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Describe the item and its condition"
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <Text style={styles.label}>Price</Text>
        <View style={styles.inputContainer}>
          <View style={styles.priceRow}>
            <TextInput
              style={[styles.priceInput, { flex: 6 }]}
              placeholderTextColor="#888"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="Price of Item/s"
            />
            <Dropdown
              style={[styles.currencyDropdown, { flex: 3 }]}
              data={[
                { label: "USD", value: "USD" },
                { label: "EUR", value: "EUR" },
                { label: "JPY", value: "JPY" },
                { label: "GBP", value: "GBP" },
                { label: "AUD", value: "AUD" },
                { label: "CAD", value: "CAD" },
                { label: "CHF", value: "CHF" },
                { label: "CNY", value: "CNY" },
                { label: "SEK", value: "SEK" },
                { label: "NZD", value: "NZD" },
              ]}
              labelField="label"
              valueField="value"
              value={{ label: currency, value: currency }}
              onChange={(c) => setCurrency(c.value)}
              placeholder="Currency"
              onChangeText={setCurrency}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Condition</Text>
          <Dropdown
            style={styles.dropdown}
            data={[
              { label: "Reatard", value: "retard" },
              { label: "Used Monkey", value: "rip monkey" },
              { label: "Refurbished", value: "refurbished" },
              { label: "Custom", value: "custom" },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select condition"
            placeholderStyle={styles.placeholderStyle}
            itemTextStyle={styles.selectedTextStyle}
            visibleSelectedItem={styles.selectedTextStyle}
            selectedItemStyle={styles.selectedItemStyle}
            selectedStyle={styles.selectedItemStyle}
            itemContainerStyle={styles.itemContainer}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={styles.selectedItemStyle}
            activeColor={styles.activeColor}
            value={condition}
            onChange={(item) => {
              setCondition(item.value);
              setShowCustomInput(item.value === "custom");
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <Dropdown
            style={styles.dropdownCat}
            placeholderStyle={styles.placeholderStyle}
            itemTextStyle={styles.selectedTextStyle}
            visibleSelectedItem={styles.selectedTextStyle}
            selectedItemStyle={styles.selectedItemStyle}
            selectedStyle={styles.selectedItemStyle}
            itemContainerStyle={styles.itemContainer}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={styles.selectedItemStyle}
            activeColor={styles.activeColor}
            data={categories}
            maxHeight={200}
            labelField="label"
            valueField="value"
            value={category}
            onChange={(item) => setCategory(item.value)}
          />
        </View>

        {!upc ? (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Brand</Text>
            <TextInput
              style={styles.input}
              placeholder="Brand name"
              placeholderTextColor="#888"
              value={brand}
              onChangeText={setBrand}
            />
          </View>
        ) : null}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Photos</Text>
          <View style={styles.photosContainer}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri: photo.uri }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.deletePhotoButton}
                  onPress={() => removePhoto(photo.id)}
                >
                  <Text style={styles.deletePhotoText}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.photoAddButton}
              onPress={handleAddPhoto}
            >
              <Text style={styles.photoAddButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fulfillment Days</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter number of days"
            placeholderTextColor="#888"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter quantity"
            placeholderTextColor="#888"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Aspects</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 10 }]}
              placeholder="Key (e.g., Cable Type)"
              placeholderTextColor="#888"
              value={keyInput}
              onChangeText={setKeyInput}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Value (e.g., USB)"
              placeholderTextColor="#888"
              value={valueInput}
              onChangeText={setValueInput}
              onSubmitEditing={addAspect}
              returnKeyType="done"
            />
          </View>
          {aspects.map((aspect, index) => (
            <View key={index} style={styles.aspectContainer}>
              <Text
                style={styles.aspectText}
              >{`${aspect.key}: ${aspect.value}`}</Text>
              <TouchableOpacity
                onPress={() => {
                  setAspects(aspects.filter((_, i) => i !== index));
                }}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Payment Policy</Text>
          { policies !== null ?
          <Dropdown
            style={styles.dropdown}
            data={[
              ...policies.paymentPolicies.paymentPolicies.map(x => { return { label: x.name, value: x.paymentPolicyId }}),
              { label: "Create new", value: "createNew" },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select Payment Policy"
            placeholderStyle={styles.placeholderStyle}
            itemTextStyle={styles.selectedTextStyle}
            visibleSelectedItem={styles.selectedTextStyle}
            selectedItemStyle={styles.selectedItemStyle}
            selectedStyle={styles.selectedItemStyle}
            itemContainerStyle={styles.itemContainer}
            selectedTextStyle={styles.selectedTextStyle}
            containerStyle={styles.selectedItemStyle}
            activeColor={styles.activeColor}
            onChange={(item) => handlePolicyChange(item, "payment")}
            value={paymentPolicy}
          />
          : null }
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Return Policy</Text>
          { policies !== null ?
            <Dropdown
              style={styles.dropdown}
              data={[
                ...policies.returnPolicies.returnPolicies.map(x => { return { label: x.name, value: x.returnPolicyId }}),
                { label: "Create new", value: "createNew" },
              ]}
              labelField="label"
              valueField="value"
              placeholder="Select Return Policy"
              placeholderStyle={styles.placeholderStyle}
              itemTextStyle={styles.selectedTextStyle}
              visibleSelectedItem={styles.selectedTextStyle}
              selectedItemStyle={styles.selectedItemStyle}
              selectedStyle={styles.selectedItemStyle}
              itemContainerStyle={styles.itemContainer}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.selectedItemStyle}
              activeColor={styles.activeColor}
              onChange={(item) => handlePolicyChange(item, "return")}
              value={returnPolicy}
            />
          : null }
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fulfillment Policy</Text>
          { policies !== null ?
            <Dropdown
              style={styles.dropdown}
              data={[
                  ...policies.fulfillmentPolicies.fulfillmentPolicies.map(x => { return { label: x.name, value: x.fulfillmentPolicyId }}),
                { label: "Create new", value: "createNew" },
              ]}
              labelField="label"
              valueField="value"
              placeholder="Select Fulfillment Policy"
              placeholderStyle={styles.placeholderStyle}
              itemTextStyle={styles.selectedTextStyle}
              visibleSelectedItem={styles.selectedTextStyle}
              selectedItemStyle={styles.selectedItemStyle}
              selectedStyle={styles.selectedItemStyle}
              itemContainerStyle={styles.itemContainer}
              selectedTextStyle={styles.selectedTextStyle}
              containerStyle={styles.selectedItemStyle}
              activeColor={styles.activeColor}
              onChange={(item) => handlePolicyChange(item, "fulfillment")}
              value={fulfillmentPolicy}
            />
          : null }
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCreate}>
            <Text style={styles.buttonText}>Create Listing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonD} onPress={handleSaveDraft}>
            <Text style={styles.buttonText}>Save as Draft</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
  },
  inputContainer: {
    marginBottom: 15,
    padding: 10,
  },
  aspectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#030303",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  aspectText: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
  },
  dropdown: {
    backgroundColor: "#222",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
    height: 50,
  },
  placeholderStyle: {
    color: "#888",
    fontSize: 16,
  },
  itemContainer: {
    backgroundColor: "#2c2c2c",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  input: {
    backgroundColor: "#d8d8d8",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  aspectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2e2e2e",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#555",
  },
  aspectText: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: "#ffffff",
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  removeButtonText: {
    color: "#000000",
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  dropdownCat: {
    backgroundColor: "#222",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
    color: "#fff",
    height: 50,
  },
  itemContainer: {
    backgroundColor: "#2c2c2c",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    justifyContent: "center",
    color: "white",
  },
  selectedItemStyle: {
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#464141",
  },
  selectedTextStyle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#555",
  },
  placeholderStyle: {
    color: "#888",
    fontSize: 16,
  },
  activeColor: {
    backgroundColor: "#5a5a5a",
    color: "#5a5a5a",
  },
  scrollContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#166e00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonD: {
    backgroundColor: "#166e00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },

  photo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  photoWrapper: {
    position: "relative",
    marginBottom: 10,
    marginRight: 10,
  },
  photo: {
    width: 100,
    height: 100,
  },
  deletePhotoButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#fff",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  deletePhotoText: {
    color: "black",
    fontSize: 16,
  },
  photoAddButton: {
    width: 100,
    height: 100,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  photoAddButtonText: {
    fontSize: 24,
    color: "#333",
  },
  dropdown: {
    backgroundColor: "#222",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
    height: 50,
  },
  placeholderStyle: {
    color: "#888",
    fontSize: 16,
  },
  selectedTextStyle: {
    color: "#fff",
    fontSize: 16,
  },
  iconStyle: {
    color: "#fff",
    marginRight: 5,
  },
  conditionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  conditionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginHorizontal: 2,
    borderRadius: 4,
    backgroundColor: "#333", // Default button background
    alignItems: "center",
  },
  conditionButtonActive: {
    backgroundColor: "#6d6d6d", // Active button background
  },
  conditionButtonText: {
    color: "#fff",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceInput: {
    backgroundColor: "#222",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 5,
    flex: 6,
  },
  currencyDropdown: {
    backgroundColor: "#222",
    paddingHorizontal: 10,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
    textAlign: "center",
    flex: 3,
  },
});

const stylesLight = StyleSheet.create({
  conditionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  conditionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginHorizontal: 2,
    borderRadius: 4,
    backgroundColor: "#e6e6e6",
    alignItems: "center",
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
  },
  conditionButtonActive: {
    backgroundColor: "#aaaaaa",
  },
  conditionButtonText: {
    color: "#000000",
  },
  activeColor: {
    backgroundColor: "#5a5a5a",
    color: "#5a5a5a",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  dropdownCat: {
    backgroundColor: "#eeeeee",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#cfcdcd",
    color: "#fff",
    height: 50,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    color: "#333",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#eee",
    color: "#333",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonD: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  photo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  photosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  photoWrapper: {
    position: "relative",
    marginBottom: 10,
    marginRight: 10,
  },
  photo: {
    width: 100,
    height: 100,
  },
  deletePhotoButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "black",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  deletePhotoText: {
    color: "white",
    fontSize: 16,
  },
  photoAddButton: {
    width: 100,
    height: 100,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  photoAddButtonText: {
    fontSize: 24,
    color: "#333",
  },
  dropdown: {
    backgroundColor: "#eee",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    color: "#333",
    paddingHorizontal: 10,
    height: 50,
  },
  placeholderStyle: {
    color: "#888",
  },
  selectedTextStyle: {
    color: "#333",
  },
  iconStyle: {
    color: "#333",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    color: "#333",
    fontSize: 16,
    marginBottom: 5,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceInput: {
    backgroundColor: "#eee",
    color: "#333",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 5,
    flex: 6,
  },
  currencyDropdown: {
    backgroundColor: "#eee",
    paddingHorizontal: 10,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    flex: 2,
  },
  placeholderStyle: {
    color: "#888",
  },
  selectedTextStyle: {
    color: "#333",
  },
  aspectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fafafa",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  aspectText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: "#000000",
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  removeButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});
