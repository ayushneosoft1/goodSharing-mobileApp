import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signinAPI, signupAPI } from "../api/authService";

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

        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            console.log("User parse error", e);
            setUser(null);
          }
        }

        if (savedToken) {
          setToken(savedToken);
        }
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

      if (!res || res.error) {
        return res || { error: "No response from server" };
      }

      if (res.data?.token) {
        setToken(res.data.token);
        await AsyncStorage.setItem("goodSharing_token", res.data.token);
      }

      if (res.data?.user) {
        await AsyncStorage.setItem(
          "goodSharing_user",
          JSON.stringify(res.data.user),
        );
        setUser(res.data.user);
      }

      return res;
    } catch (error) {
      console.error("Login failed:", error);
      return { error: error.message || "Login failed" };
    }
  };

  // SIGNUP
  const signup = async (first_name, last_name, email, password) => {
    try {
      const res = await signupAPI({
        first_name,
        last_name,
        email,
        password,
      });

      if (!res || res.error) {
        return res || { error: "No response from server" };
      }

      if (res.data?.token) {
        setToken(res.data.token);
        await AsyncStorage.setItem("goodSharing_token", res.data.token);
      }

      if (res.data?.user) {
        await AsyncStorage.setItem(
          "goodSharing_user",
          JSON.stringify(res.data.user),
        );
        setUser(res.data.user);
      }

      return res;
    } catch (error) {
      console.error("Signup failed:", error);
      return { error: error.message || "Signup failed" };
    }
  };

  // LOGOUT
  const logout = async () => {
    await AsyncStorage.removeItem("goodSharing_user");
    await AsyncStorage.removeItem("goodSharing_token");
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
        isAuthenticated: !!token, // ✅ FIXED
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
