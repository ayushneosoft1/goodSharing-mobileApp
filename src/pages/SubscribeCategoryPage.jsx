import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import {
  subscribeCategoryAPI,
  unsubscribeCategoryAPI,
  getMySubscriptionsAPI,
} from "../api/subscriptionService";

import { CATEGORIES } from "../constants/categories";

export default function SubscribeCategoryPage() {
  const navigation = useNavigation();

  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ======================
  // Load Existing Subscriptions
  // ======================
  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);

      const subscriptions = await getMySubscriptionsAPI();

      console.log("EXISTING SUBSCRIPTIONS:", subscriptions);

      const subscribedCategories = CATEGORIES.filter((category) =>
        subscriptions.some(
          (categoryId) => String(categoryId) === category.id,
        ),
      );

      setSelected(subscribedCategories.map((category) => category.code));
    } catch (error) {
      console.log("Loading Subscriptions Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // Toggle Category
  // ======================
  const toggleCategory = (item) => {
    setSelected((prev) => {
      if (prev.includes(item)) {
        return prev.filter((category) => category !== item);
      }

      return [...prev, item];
    });
  };

  // ======================
  // Save Subscription Changes
  // ======================
  const submit = async () => {
    try {
      setSaving(true);

      const existingSubscriptions = await getMySubscriptionsAPI();

      const existingCategories = CATEGORIES.filter((category) =>
        existingSubscriptions.some(
          (categoryId) => String(categoryId) === category.id,
        ),
      );

      // Categories newly selected
      const categoriesToSubscribe = selected.filter(
        (category) =>
          !existingCategories.some(
            (existingCategory) => existingCategory.code === category,
          ),
      );

      // Categories previously selected but now removed
      const categoriesToUnsubscribe = existingCategories
        .map((category) => category.code)
        .filter((category) => !selected.includes(category));

      console.log("TO SUBSCRIBE:", categoriesToSubscribe);
      console.log("TO UNSUBSCRIBE:", categoriesToUnsubscribe);

      // ======================
      // Subscribe New Categories
      // ======================
      if (categoriesToSubscribe.length > 0) {
        const subscribeResponse = await subscribeCategoryAPI(
          categoriesToSubscribe,
        );

        if (!subscribeResponse?.success) {
          throw new Error("Subscription failed");
        }
      }

      // ======================
      // Unsubscribe Removed Categories
      // ======================
      for (const category of categoriesToUnsubscribe) {
        const success = await unsubscribeCategoryAPI(category);

        if (!success) {
          throw new Error(`Failed to unsubscribe ${category}`);
        }
      }

      Alert.alert("Success", "Category subscriptions updated successfully");

      navigation.goBack();
    } catch (error) {
      console.log("Subscription Update Error:", error);

      Alert.alert("Error", "Failed to update category subscriptions");
    } finally {
      setSaving(false);
    }
  };

  // ======================
  // Loading Existing State
  // ======================
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ======================
  // Main UI
  // ======================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Categories</Text>

      {CATEGORIES.map((item) => (
        <TouchableOpacity
          key={item.code}
          style={[styles.row, selected.includes(item.code) && styles.selectedRow]}
          onPress={() => toggleCategory(item.code)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.categoryText,
              selected.includes(item.code) && styles.selectedText,
            ]}
          >
            {item.label}
          </Text>

          <Text style={styles.checkbox}>
            {selected.includes(item.code) ? "☑" : "☐"}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[
          styles.button,
          saving && {
            opacity: 0.7,
          },
        ]}
        onPress={submit}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
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

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
