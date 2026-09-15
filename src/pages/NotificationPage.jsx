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
  markAllNotificationsReadAPI,
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
      const success = await markNotificationReadAPI(item.id);

      if (success) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === item.id
              ? { ...notification, isRead: true }
              : notification,
          ),
        );
      }

      // Navigate only when notification has a postId
      if (item.postId) {
        navigation.navigate("PostDetail", {
          postId: item.postId,
        });
      }
    } catch (error) {
      console.log("Open Notification Error:", error);
    }
  };

  // ======================
  // Mark All Notifications Read
  // ======================
  const handleMarkAllRead = async () => {
    try {
      const success = await markAllNotificationsReadAPI();

      if (!success) {
        console.log("Failed to mark all notifications as read");
        return;
      }

      // Update UI instantly
      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        })),
      );
    } catch (error) {
      console.log("Mark All Read Error:", error);
    }
  };

  // ======================
  // Render Notification
  // ======================
  const renderNotification = ({ item }) => (
    <TouchableOpacity onPress={() => openNotification(item)}>
      <View style={[styles.card, !item.isRead && styles.unreadCard]}>
        <Text style={styles.title}>{item.title}</Text>

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
      <View style={styles.header}>
        <Text style={styles.heading}>Notifications</Text>

        {notifications.some((notification) => !notification.isRead) && (
          <TouchableOpacity
            onPress={handleMarkAllRead}
            style={styles.markAllButton}
          >
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
  },

  markAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },

  markAllText: {
    fontSize: 13,
    color: "#0ea5e9",
    fontWeight: "600",
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

  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
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
