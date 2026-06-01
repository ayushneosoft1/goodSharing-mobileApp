import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import { registerRootComponent } from "expo";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "./contexts/AuthContext";

import LoginPage from "./pages/LoginPage";
import PostDetailPage from "./pages/PostDetailPage";
import CreatePostPage from "./pages/CreatePostPage";
import NotificationPage from "./pages/NotificationPage";

import DrawerNavigation from "./navigation/DrawerNavigation.jsx";

const Stack = createNativeStackNavigator();

function Navigation() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
          <Stack.Screen
            name="Home"
            component={DrawerNavigation}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="PostDetail"
            component={PostDetailPage}
            options={{
              title: "Item Details",
            }}
          />

          <Stack.Screen
            name="CreatePost"
            component={CreatePostPage}
            options={{
              title: "Share Item",
            }}
          />

          <Stack.Screen
            name="NotificationPage"
            component={NotificationPage}
            options={{
              title: "Notifications",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
