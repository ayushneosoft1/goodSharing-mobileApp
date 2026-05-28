import React, { useState, useCallback } from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { useNavigation, useFocusEffect } from "@react-navigation/native";

import {
  getNotificationsAPI,
  markNotificationReadAPI,
} from "../api/notificationService";

const NotificationPage = () => {
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // Load Notifications
  // ======================
  const loadNotifications = async () => {
    try {
      setLoading(true);

      const data = await getNotificationsAPI();

      console.log("NOTIFICATIONS:", data);

      setNotifications(data || []);
    } catch (error) {
      console.log("Notification Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // Refresh When Screen Focused
  // ======================
  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, []),
  );

  // ======================
  // Open Notification
  // ======================
  const openNotification = async (item) => {
    try {
      // mark notification as read
      await markNotificationReadAPI(item.id);

      // update UI instantly
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === item.id
            ? { ...notification, isRead: true }
            : notification,
        ),
      );

      // navigate to post detail page
      navigation.navigate("PostDetail", {
        postId: item.postId,
      });
    } catch (error) {
      console.log("Open Notification Error:", error);
    }
  };

  // ======================
  // Render Notification
  // ======================
  const renderNotification = ({ item }) => (
    <TouchableOpacity onPress={() => openNotification(item)}>
      <View style={[styles.card, !item.isRead && styles.unreadCard]}>
        <Text style={styles.message}>{item.message}</Text>

        <Text style={styles.time}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // ======================
  // Loading
  // ======================
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  // ======================
  // Main UI
  // ======================
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Notifications</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotification}
        ListEmptyComponent={<Text style={styles.empty}>No notifications</Text>}
      />
    </View>
  );
};

// ======================
// Styles
// ======================
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
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginBottom: 10,
  },

  unreadCard: {
    backgroundColor: "#dbeafe",
    borderWidth: 1,
    borderColor: "#93c5fd",
  },

  message: {
    fontSize: 15,
    fontWeight: "500",
  },

  time: {
    marginTop: 5,
    fontSize: 12,
    color: "#666",
  },

  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#777",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NotificationPage;
