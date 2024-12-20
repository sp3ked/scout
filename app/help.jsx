import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  useColorScheme,
  ScrollView,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const HelpPage = () => {
  const [selected, setSelected] = useState(null);
  const colorScheme = useColorScheme();

  const toggleExpand = (index) => {
    setSelected((prevSelected) => (prevSelected === index ? null : index));
  };

  async function toggleTheme() {
    setDark(!dark);
    Appearance.setColorScheme(!dark ? "dark" : "light");
  }

  const faqs = [
    {
      question: "How do I use Scout to scan items?",
      answer:
        "Simply open the Scout app, point your camera at any item, and our technology will recognize it, and pull up the cheapest price out of over 100 retailers.",
    },
    {
      question: "Where can I find my scanned items?",
      answer:
        "All your scanned items are saved in the 'Scans' section of the app, where you can view the items and compare prices.",
    },
    {
      question: "How does the selling feature work?",
      answer:
        "Take a photo of the item you want to sell, and Scout will automatically generate a title, description, and post it to multiple selling sites for you.",
    },
    {
      question: "Can I edit the auto-generated listing before posting?",
      answer:
        "Yes, you can review and edit all the details of the listing before it goes live on the selling platforms.",
    },
    {
      question: "What should I do if the app doesn’t recognize an item?",
      answer:
        "Try to capture the item in good lighting and ensure it's fully visible in the frame. If issues persist, contact our support team for help.",
    },
  ];

  const styles = colorScheme == "dark" ? stylesDark : stylesLight;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {faqs.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => toggleExpand(index)}
            style={styles.faqContainer}
          >
            <View style={styles.questionContainer}>
              <Text style={styles.question}>{item.question}</Text>
              <FontAwesome
                name={selected === index ? "chevron-up" : "chevron-down"}
                size={15}
                style={styles.chevIcon}
              />
            </View>
            {selected === index && (
              <Text style={styles.answer}>{item.answer}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Have more questions? Contact us:</Text>
        <Text
          style={styles.emailLink}
          onPress={() => Linking.openURL("mailto:scoutsupport@gmail.com")}
        >
          scoutsupport@gmail.com
        </Text>
      </View>
    </View>
  );
};

const stylesLight = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    backgroundColor: "#f9f9f9",
  },
  content: {
    flex: 1,
    width: "90%",
  },
  faqContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  answer: {
    paddingVertical: 10,
    color: "#666",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  chevIcon: {
    color: "black",
  },
  footerText: {
    marginTop: 0,
    color: "#666", // Dark color for light theme
    fontSize: 16,
    marginBottom: 10,
  },
  emailLink: {
    color: "#007bff", // Link color
    textDecorationLine: "underline",
  },
  footer: {
    padding: 50,
    alignItems: "center",
    width: "100%",
  },
});

const stylesDark = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    backgroundColor: "#121212",
  },
  content: {
    flex: 1,
    width: "90%",
  },
  faqContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#222222",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 5,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ddd",
  },
  answer: {
    paddingVertical: 10,
    color: "#bbb",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#0056b3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  chevIcon: {
    color: "white",
  },
  footerText: {
    marginTop: 200,
    color: "#5c5b5b", // Light color for dark theme
    fontSize: 16,
    marginBottom: 10,
  },
  footer: {
    padding: 50,
    alignItems: "center",
    width: "100%",
  },
  emailLink: {
    color: "#2d76a3", // Bright link color for dark theme
    textDecorationLine: "underline",
  },
});

export default HelpPage;
