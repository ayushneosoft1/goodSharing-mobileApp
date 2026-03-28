import React, { createContext, useContext, useState, useEffect } from "react";
import { signinAPI, signupAPI } from "../api/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("goodSharing_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // LOGIN using real API

  const login = async (email, password) => {
    try {
      const res = await signinAPI({ email, password });

      if (res.data?.user) {
        // Save user in localStorage and state
        localStorage.setItem("goodSharing_user", JSON.stringify(res.data.user));
        setUser(res.data.user);
      }

      return res; // return API response for handling success/error in page
    } catch (error) {
      console.error("Login failed:", error);
      return { error: error.message || "Login failed" };
    }
  };

  // SIGNUP using real API

  const signup = async (first_name, last_name, email, password) => {
    try {
      const res = await signupAPI({ first_name, last_name, email, password });

      if (res.data?.user) {
        localStorage.setItem("goodSharing_user", JSON.stringify(res.data.user));
        setUser(res.data.user);
      }
      return res; // return API response for handling success / error in page
    } catch (error) {
      console.error("Signup failed", error);
      return { error: error.message || "Signup failed" };
    }
  };

  // LOGOUT

  const logout = () => {
    localStorage.removeItem("goodSharing_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
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
