import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  useColorScheme,
} from "react-native";

const ReturnPolicy = () => {
  const [policyName, setPolicyName] = useState("");
  const [duration, setDuration] = useState("");
  const [returnsAccepted, setReturnsAccepted] = useState(false);
  const [returnShippingPayer, setReturnShippingPayer] = useState("");
  const [error, setError] = useState(''); // TODO: do something with this
  const styles = colorScheme == "light" ? stylesLight : stylesDark;
  const colorScheme = useColorScheme();

  async function handleSaveAndContinue() {
    const res = await fetch('https://scout.shopping/ebay/policies/return', {
      method: "PUT",
      body: JSON.stringify({
        name: policyName,
        returnsAccepted,
        duration: parseInt(duration),
        buyerPays: returnShippingPayer == 'buyer',
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
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Return Policy</Text>

        <Text style={styles.label}>Policy Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPolicyName}
          value={policyName}
          placeholder="Enter the policy name"
          placeholderTextColor="#afafaf"
        />

        <Text style={styles.label}>Returns Accepted?</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setReturnsAccepted(true)}
            style={[
              styles.button,
              returnsAccepted ? styles.buttonActive : styles.buttonInactive,
            ]}
          >
            <Text style={styles.buttonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setReturnsAccepted(false)}
            style={[
              styles.button,
              !returnsAccepted ? styles.buttonActive : styles.buttonInactive,
            ]}
          >
            <Text style={styles.buttonText}>No</Text>
          </TouchableOpacity>
        </View>

        {returnsAccepted && (
          <>
            <Text style={styles.label}>Duration (days)</Text>
            <TextInput
              style={styles.input}
              onChangeText={setDuration}
              value={duration}
              keyboardType="numeric"
              placeholder="Enter duration in days"
              placeholderTextColor="#afafaf"
            />

            <Text style={styles.label}>Who Pays for Return Shipping?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => setReturnShippingPayer("seller")}
                style={[
                  styles.button,
                  returnShippingPayer === "seller"
                    ? styles.buttonActive
                    : styles.buttonInactive,
                ]}
              >
                <Text style={styles.buttonText}>Seller (You)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setReturnShippingPayer("buyer")}
                style={[
                  styles.button,
                  returnShippingPayer === "buyer"
                    ? styles.buttonActive
                    : styles.buttonInactive,
                ]}
              >
                <Text style={styles.buttonText}>Buyer</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSaveAndContinue}
      >
        <Text style={styles.saveButtonText}>Save and Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const stylesLight = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    backgroundColor: "#eee",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#e6e6e6",
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginHorizontal: 2,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#333",
    fontSize: 16,
  },
  buttonActive: {
    backgroundColor: "#aaaaaa",
  },
  buttonInactive: {
    backgroundColor: "#ddd",
  },
  saveButton: {
    paddingVertical: 12,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 50,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
    marginTop: 15,
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
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#333",
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginHorizontal: 2,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonActive: {
    backgroundColor: "#6d6d6d",
  },
  buttonInactive: {
    backgroundColor: "#444",
  },
  saveButton: {
    paddingVertical: 12,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 50,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReturnPolicy;
