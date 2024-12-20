import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const FulfillmentPolicy = () => {
  const [policyName, setPolicyName] = useState("");
  const [handlingTime, setHandlingTime] = useState("");
  const [shippingOptions, setShippingOptions] = useState([]);
  const [error, setError] = useState('') // TODO: b

  const addShippingOption = () => {
    setShippingOptions([
      ...shippingOptions,
      {
        carrier: "",
        shippingType: "",
        flatOrCalc: "",
        cost: "",
        weight: "",
        buyerPays: "buyer",  // Default to buyer pays
      },
    ]);
  };

  const handleShippingOptionChange = (index, field, value) => {
    const updatedOptions = [...shippingOptions];
    updatedOptions[index][field] = value;
    setShippingOptions(updatedOptions);
  };

  const deleteShippingOption = (index) => {
    setShippingOptions(shippingOptions.filter((_, idx) => idx !== index));
  };

  const saveAndContinue = async () => {
    const res = await fetch('https://scout.shopping/ebay/policies/fulfillment', {
      method: "PUT",
      body: JSON.stringify({
        name: policyName,
        handlingTime,
        shippingOptions: shippingOptions.map(x => { return {
          international: x.shippingType == 'international',
          free: x.whoPays == 'seller',
          carrier: x.carrier,
          service: x.service,
        }}),
      }),
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
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Fulfillment Policy</Text>

        <Text style={styles.label}>Policy Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPolicyName}
          value={policyName}
          placeholder="Enter the policy name"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Handling Time (days)</Text>
        <TextInput
          style={styles.input}
          onChangeText={setHandlingTime}
          value={handlingTime}
          keyboardType="numeric"
          placeholder="Enter handling time in days"
          placeholderTextColor="#888"
        />

        {shippingOptions.map((option, index) => (
          <View key={index} style={styles.optionBox}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => deleteShippingOption(index)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Shipping Option {index + 1}</Text>
            <Dropdown
              style={styles.dropdown}
              data={[{ label: "International", value: "international" }, { label: "Domestic", value: "domestic" }]}
              labelField="label"
              valueField="value"
              placeholder="Select Shipping Type"
              placeholderTextColor="#888"
              onChange={(item) => handleShippingOptionChange(index, "shippingType", item.value)}
            />
            <Dropdown
              style={styles.dropdown}
              data={[]}
              labelField="label"
              valueField="value"
              placeholder="Select Carrier"
              placeholderTextColor="#888"
              onChange={(item) => handleShippingOptionChange(index, "carrier", item.value)}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => handleShippingOptionChange(index, "whoPays", "buyer")}
                style={[styles.button, option.whoPays === "buyer" ? styles.buttonActive : styles.buttonInactive]}
              >
                <Text style={styles.buttonText}>Buyer Pays</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleShippingOptionChange(index, "whoPays", "seller")}
                style={[styles.button, option.whoPays === "seller" ? styles.buttonActive : styles.buttonInactive]}
              >
                <Text style={styles.buttonText}>Seller Pays</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={addShippingOption}>
          <Text style={styles.addButtonText}>Add Shipping Option</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={saveAndContinue}>
        <Text style={styles.saveButtonText}>Save and Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#111",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 10,
    backgroundColor: "#222",
    color: "#fff",
    placeholderTextColor: "#888",
  },
  dropdown: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 10,
    color: '#fff',
    backgroundColor: "#333",
  },
  optionBox: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 5,
    marginBottom: 10,
    position: 'relative',
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#800000",
    borderRadius: 5,
    padding: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonActive: {
    backgroundColor: "#6d6d6d",
  },
  buttonInactive: {
    backgroundColor: "#444",
  },
  addButton: {
    backgroundColor: "#333",
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    paddingVertical: 12,
    backgroundColor: "#4CAF50",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default FulfillmentPolicy;
