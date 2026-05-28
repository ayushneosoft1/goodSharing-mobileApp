import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { getMySubscriptionsAPI } from "../api/subscriptionService";

const MySubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const data = await getMySubscriptionsAPI();

      setSubscriptions(data || []);
    } catch (error) {
      console.log("Loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Subscriptions</Text>

      {subscriptions.length === 0 ? (
        <Text>No subscriptions found</Text>
      ) : (
        <FlatList
          data={subscriptions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },

  text: {
    fontSize: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MySubscriptionsPage;
