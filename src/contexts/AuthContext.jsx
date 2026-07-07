import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signinAPI, signupAPI, savePushTokenAPI } from "../api/authService";
import { registerForPushNotifications } from "../services/notificationService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("goodSharing_user");
        const savedToken = await AsyncStorage.getItem("goodSharing_token");

        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedToken) setToken(savedToken);
      } catch (e) {
        console.log("Load user error", e);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await signinAPI({ email, password });

      if (!res || res.error) return res;

      const authToken = res.data?.token;
      const authUser = res.data?.user;

      if (!authToken) return { error: "No token received" };

      setToken(authToken);
      setUser(authUser);

      await AsyncStorage.setItem("goodSharing_token", authToken);
      await AsyncStorage.setItem("goodSharing_user", JSON.stringify(authUser));

      // PUSH TOKEN (deduped)
      try {
        const expoToken = await registerForPushNotifications();
        console.log("Expo Push Token:", expoToken);

        if (expoToken) {
          const savedToken = await AsyncStorage.getItem("expo_push_token");

          if (savedToken !== expoToken) {
            await savePushTokenAPI(expoToken, authToken);
            await AsyncStorage.setItem("expo_push_token", expoToken);
          }
        }
      } catch (e) {
        console.log("Push token error:", e);
      }

      return res;
    } catch (error) {
      return { error: error.message };
    }
  };

  // SIGNUP
  const signup = async (first_name, last_name, email, password) => {
    try {
      const res = await signupAPI({ first_name, last_name, email, password });

      if (!res || res.error) return res;

      const authToken = res.data?.token;
      const authUser = res.data?.user;

      if (authToken) {
        setToken(authToken);
        await AsyncStorage.setItem("goodSharing_token", authToken);
      }

      if (authUser) {
        setUser(authUser);
        await AsyncStorage.setItem(
          "goodSharing_user",
          JSON.stringify(authUser),
        );
      }

      return res;
    } catch (error) {
      return { error: error.message };
    }
  };

  // LOGOUT
  const logout = async () => {
    await AsyncStorage.multiRemove([
      "goodSharing_user",
      "goodSharing_token",
      "expo_push_token",
    ]);

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
