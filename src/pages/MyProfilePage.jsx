import React from "react";
import { View, Text } from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function MyProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>ID: {user.id}</Text>
      <Text>First Name: {user.first_name}</Text>
      <Text>Last Name: {user.last_name}</Text>
      <Text>Email: {user.email}</Text>
    </View>
  );
}
