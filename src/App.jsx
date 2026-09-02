import "react-native-gesture-handler";

import React, { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { registerRootComponent } from "expo";

import { AuthProvider, useAuth } from "./contexts/AuthContext";

import LoginPage from "./pages/LoginPage";
import PostDetailPage from "./pages/PostDetailPage";
import CreatePostPage from "./pages/CreatePostPage";
import DrawerNavigation from "./navigation/DrawerNavigation";
import NotificationPage from "./pages/NotificationPage";

const Stack = createNativeStackNavigator();

export const navigationRef = React.createRef();

function Navigation() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          {/* Drawer App */}
          <Stack.Screen
            name="Home"
            component={DrawerNavigation}
            options={{ headerShown: false }}
          />

          <Stack.Screen name="NotificationPage" component={NotificationPage} />

          {/* Stack Screens */}
          <Stack.Screen name="PostDetail" component={PostDetailPage} />
          <Stack.Screen name="CreatePost" component={CreatePostPage} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    console.log("APP USEEFFECT STARTED");

    // Foreground notification listener
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    // Notification click listener
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        console.log("Notification clicked. Data:", data);

        const postId = data?.postId;

        if (postId) {
          navigationRef.current?.navigate("PostDetail", { postId });
        }
      });

    // App opened from killed state
    Notifications.getLastNotificationResponseAsync().then((response) => {
      const data = response?.notification?.request?.content?.data;

      console.log("Killed-state notification data:", data);

      const postId = data?.postId;

      if (postId) {
        setTimeout(() => {
          navigationRef.current?.navigate("PostDetail", { postId });
        }, 1000);
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <Navigation />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
