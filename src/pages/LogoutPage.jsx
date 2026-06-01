import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../contexts/AuthContext";

const LogoutPage = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, []);

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
};

export default LogoutPage;
