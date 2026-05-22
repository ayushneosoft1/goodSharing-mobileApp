import React, { useEffect, useState } from "react";

import { View, Text, Button, Alert, ActivityIndicator } from "react-native";

import CheckBox from "@react-native-community/checkbox";

import {
  getSubscriptions,
  updateSubscriptions,
} from "../services/subscriptionService";

import { CATEGORIES } from "../constants/categories";

const SubscribeCategoryPage = () => {
  const [selected, setSelected] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const data = await getSubscriptions();

      setSelected(data);
    } catch (error) {
      console.log(error);

      Alert.alert("Error", "Failed to load subscriptions");
    }
  };

  const toggleCategory = (category) => {
    if (selected.includes(category)) {
      setSelected(selected.filter((item) => item !== category));
    } else {
      setSelected([...selected, category]);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await updateSubscriptions(selected);

      Alert.alert("Success", "Categories saved");
    } catch (error) {
      Alert.alert("Error", "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          marginBottom: 20,
        }}
      >
        Subscribe Categories
      </Text>

      {CATEGORIES.map((item) => (
        <View
          key={item}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <CheckBox
            value={selected.includes(item)}
            onValueChange={() => toggleCategory(item)}
          />

          <Text>{item}</Text>
        </View>
      ))}

      {loading && <ActivityIndicator />}

      <Button title={loading ? "Saving..." : "Save"} onPress={handleSave} />
    </View>
  );
};

export default SubscribeCategoryPage;
