import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import PostsListPage from "../pages/PostsListPage";
import MyPostsPage from "../pages/MyPostsPage";
import NotificationPage from "../pages/NotificationPage";
import MyProfilePage from "../pages/MyProfilePage";
import LogoutPage from "../pages/LogoutPage";
import SubscribeCategoryPage from "../pages/SubscribeCategoryPage";
import MySubscriptionsPage from "../pages/MySubscriptionsPage";
import { getUnreadNotificationCountAPI } from "../api/notificationService";

const Drawer = createDrawerNavigator();

function NotificationHeaderButton({ navigation }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadUnreadCount = async () => {
        const count = await getUnreadNotificationCountAPI();

        if (isActive) {
          setUnreadCount(count || 0);
        }
      };

      loadUnreadCount();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Open notifications"
      onPress={() => navigation.navigate("Notifications")}
      style={styles.notificationButton}
    >
      <Ionicons name="notifications-outline" size={26} color="#000000" />

      {unreadCount > 0 && (
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationBadgeText}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTintColor: "#000000",
        headerTitleStyle: {
          color: "#000000",
          fontWeight: "bold",
        },
        drawerType: "front",
      }}
    >
      <Drawer.Screen
        name="Posts"
        component={PostsListPage}
        options={({ navigation }) => ({
          headerTitle: "goodSharing",
          headerLeft: () => (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Open menu"
              onPress={() => navigation.openDrawer()}
              style={styles.menuButton}
            >
              <Ionicons name="menu" size={28} color="#000000" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <NotificationHeaderButton navigation={navigation} />
          ),
        })}
      />
      <Drawer.Screen name="MyPosts" component={MyPostsPage} />
      <Drawer.Screen name="Notifications" component={NotificationPage} />
      <Drawer.Screen name="MyProfile" component={MyProfilePage} />
      <Drawer.Screen name="SubscribeCategory" component={SubscribeCategoryPage} />
      <Drawer.Screen name="MySubscriptions" component={MySubscriptionsPage} />
      <Drawer.Screen name="LogOut" component={LogoutPage} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  notificationButton: {
    marginRight: 15,
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 2,
    right: 0,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
