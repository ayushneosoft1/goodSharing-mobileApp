// App.jsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import { registerRootComponent } from "expo";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import LoginPage from "./pages/LoginPage";
import PostsListPage from "./pages/PostsListPage";
import PostDetailPage from "./pages/PostDetailPage";
import CreatePostPage from "./pages/CreatePostPage";
import MyPostsPage from "./pages/MyPostsPage";

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
          backgroundColor: "#e0f2fe",
        }}
      >
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        // 🔐 Auth Flow
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
        />
      ) : (
        // ✅ App Flow
        <>
          <Stack.Screen
            name="PostsList"
            component={PostsListPage}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="PostDetail"
            component={PostDetailPage}
            options={{ headerShown: true, title: "Item Details" }}
          />

          <Stack.Screen
            name="CreatePost"
            component={CreatePostPage}
            options={{ headerShown: true, title: "Share Item" }}
          />

          <Stack.Screen
            name="MyPosts"
            component={MyPostsPage}
            options={{ headerShown: true, title: "My Posts" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
}

// ✅ Register the App after its declaration
registerRootComponent(App);
