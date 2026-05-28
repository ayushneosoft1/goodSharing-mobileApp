// pages/SubscribeCategoryPage.jsx

import React, { useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import { subscribeCategoryAPI } from "../api/subscriptionService";

const categories = ["BOOK", "CLOTH", "ELECTRONIC", "TOYS"];

export default function SubscribeCategoryPage() {
  const navigation = useNavigation();

  const [selected, setSelected] = useState([]);

  const [loading, setLoading] = useState(false);

  // ======================
  // Toggle Category
  // ======================
  const toggleCategory = (item) => {
    setSelected((prev) => {
      if (prev.includes(item)) {
        return prev.filter((c) => c !== item);
      }

      return [...prev, item];
    });
  };

  // ======================
  // Submit Subscription
  // ======================
  const submit = async () => {
    try {
      if (selected.length === 0) {
        Alert.alert("Select Category", "Please select at least one category");

        return;
      }

      setLoading(true);

      const formattedCategories = selected.map((item) => item.toUpperCase());

      console.log("Sending Categories:", formattedCategories);

      // save on backend only
      const response = await subscribeCategoryAPI(formattedCategories);

      console.log("SUBSCRIBE RESPONSE:", response);

      Alert.alert("Success", "Categories subscribed successfully");

      // reset selection
      setSelected([]);

      // optional navigation
      navigation.goBack();
    } catch (error) {
      console.log("Subscription Error:", error);

      Alert.alert("Error", "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // Main UI
  // ======================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Categories</Text>

      {categories.map((item) => (
        <TouchableOpacity
          key={item}
          style={[styles.row, selected.includes(item) && styles.selectedRow]}
          onPress={() => toggleCategory(item)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.categoryText,

              selected.includes(item) && styles.selectedText,
            ]}
          >
            {item}
          </Text>

          <Text style={styles.checkbox}>
            {selected.includes(item) ? "☑" : "☐"}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[
          styles.button,

          loading && {
            opacity: 0.7,
          },
        ]}
        onPress={submit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ======================
// Styles
// ======================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    padding: 16,

    borderWidth: 1,
    borderColor: "#e5e7eb",

    borderRadius: 10,

    marginBottom: 12,

    backgroundColor: "#fff",
  },

  selectedRow: {
    backgroundColor: "#e0f2fe",
    borderColor: "#0ea5e9",
  },

  categoryText: {
    fontSize: 16,
    color: "#111827",
  },

  selectedText: {
    fontWeight: "bold",
    color: "#0284c7",
  },

  checkbox: {
    fontSize: 22,
  },

  button: {
    marginTop: 30,

    backgroundColor: "#0ea5e9",

    padding: 16,

    borderRadius: 10,

    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
