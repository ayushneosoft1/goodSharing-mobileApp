import React, { createContext, useContext, useEffect, useState } from "react";

import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import {
  signinAPI,
  signupAPI,
  registerDeviceAPI,
  unregisterDeviceAPI,
} from "../api/authService";

import { registerForPushNotifications } from "../services/notificationService";

// ============================================================
// AUTH CONTEXT
// ============================================================

const AuthContext = createContext(null);

// ============================================================
// ASYNC STORAGE KEYS
// ============================================================

const USER_STORAGE_KEY = "goodSharing_user";
const TOKEN_STORAGE_KEY = "goodSharing_token";
const DEVICE_ID_STORAGE_KEY = "goodSharing_device_id";
const FCM_TOKEN_STORAGE_KEY = "goodSharing_fcm_token";

// ============================================================
// AUTH PROVIDER
// ============================================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // GET / CREATE STABLE DEVICE ID
  // ==========================================================
  //
  // This ID belongs to the app installation.
  //
  // It is NOT the authenticated user's ID.
  //
  // It remains the same across:
  // - login
  // - logout
  // - app restart
  //
  // It is removed only when app storage/app installation
  // is cleared.
  //
  // ==========================================================

  const getDeviceId = async () => {
    try {
      let deviceId = await AsyncStorage.getItem(DEVICE_ID_STORAGE_KEY);

      if (deviceId) {
        return deviceId;
      }

      deviceId = [
        "goodsharing",
        Platform.OS,
        Date.now(),
        Math.random().toString(36).substring(2, 10),
      ].join("-");

      await AsyncStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);


      return deviceId;
    } catch (error) {

      return null;
    }
  };

  // ==========================================================
  // REGISTER CURRENT DEVICE
  // ==========================================================
  //
  // Flow:
  //
  // JWT
  //  ↓
  // native FCM token
  //  ↓
  // stable deviceId
  //  ↓
  // registerDevice
  //
  // Backend identifies authenticated user through x-user.id.
  //
  // ==========================================================

  const registerCurrentDevice = async (authToken) => {
    try {
      if (!authToken) {

        return null;
      }


      // ------------------------------------------------------
      // 1. Get native FCM token
      // ------------------------------------------------------

      const fcmToken = await registerForPushNotifications();

      if (!fcmToken) {

        return null;
      }

      // ------------------------------------------------------
      // 2. Get stable device ID
      // ------------------------------------------------------

      const deviceId = await getDeviceId();

      if (!deviceId) {

        return null;
      }

      // ------------------------------------------------------
      // 3. Platform
      // ------------------------------------------------------

      const platform = Platform.OS === "ios" ? "ios" : "android";

      // ------------------------------------------------------
      // 4. Register device with backend
      // ------------------------------------------------------


      const result = await registerDeviceAPI({
        deviceId,
        fcmToken,
        platform,
        authToken,
      });

      if (result?.error) {

        return null;
      }

      // ------------------------------------------------------
      // 5. Save latest FCM token locally
      // ------------------------------------------------------

      await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, fcmToken);


      return result.data;
    } catch (error) {
      /*
       * IMPORTANT:
       *
       * Push/device registration must NEVER break
       * authentication.
       */

      return null;
    }
  };

  // ==========================================================
  // AUTHENTICATED APP STARTUP
  // ==========================================================
  //
  // Requirement:
  //
  // App restart
  //    ↓
  // saved JWT found
  //    ↓
  // restore user
  //    ↓
  // safely re-register device
  //
  // Backend registration is idempotent, so repeated calls
  // do not create duplicate rows for the same user/device.
  //
  // ==========================================================

  useEffect(() => {
    const loadSavedAuth = async () => {
      try {
        const [savedUser, savedToken] = await AsyncStorage.multiGet([
          USER_STORAGE_KEY,
          TOKEN_STORAGE_KEY,
        ]);

        const storedUser = savedUser?.[1];
        const storedToken = savedToken?.[1];

        // ----------------------------------------------------
        // Restore saved user
        // ----------------------------------------------------

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {

            await AsyncStorage.removeItem(USER_STORAGE_KEY);
          }
        }

        // ----------------------------------------------------
        // Restore saved authentication token
        // ----------------------------------------------------

        if (storedToken) {
          setToken(storedToken);

          // --------------------------------------------------
          // Re-register device on authenticated app startup
          // --------------------------------------------------

          try {
            await registerCurrentDevice(storedToken);
          } catch {}
        }
      } catch {} finally {
        setLoading(false);
      }
    };

    loadSavedAuth();
  }, []);

  // ==========================================================
  // FCM TOKEN ROTATION LISTENER
  // ==========================================================
  //
  // Requirement:
  //
  // When Firebase/native token changes:
  //
  // new FCM token
  //      ↓
  // same deviceId
  //      ↓
  // registerDevice
  //      ↓
  // backend updates fcm_token
  //
  // ==========================================================

  useEffect(() => {
    if (!token) {
      return;
    }

    let subscription;

    try {
      subscription = Notifications.addPushTokenListener(async (tokenData) => {
        try {
          const fcmToken = tokenData?.data;

          if (!fcmToken) {

            return;
          }

          // ------------------------------------------------
          // Get existing stable device ID
          // ------------------------------------------------

          const deviceId = await getDeviceId();

          if (!deviceId) {

            return;
          }

          // ------------------------------------------------
          // Backend-compatible platform
          // ------------------------------------------------

          const platform = Platform.OS === "ios" ? "ios" : "android";


          // ------------------------------------------------
          // Register the new token
          // ------------------------------------------------

          const result = await registerDeviceAPI({
            deviceId,
            fcmToken,
            platform,
            authToken: token,
          });

          if (result?.error) {

            return;
          }

          // ------------------------------------------------
          // Save latest token locally
          // ------------------------------------------------

          await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, fcmToken);

        } catch {}
      });
    } catch {}

    // --------------------------------------------------------
    // Cleanup listener
    // --------------------------------------------------------

    return () => {
      try {
        subscription?.remove();
      } catch {}
    };
  }, [token]);

  // ==========================================================
  // LOGIN
  // ==========================================================

  const login = async (email, password) => {
    try {
      const result = await signinAPI({
        email,
        password,
      });

      if (!result || result.error) {
        return result;
      }

      const authToken = result.data?.token;

      const authUser = result.data?.user;

      if (!authToken) {
        return {
          error: "No authentication token received",
        };
      }

      // ------------------------------------------------------
      // Update React state
      // ------------------------------------------------------

      setToken(authToken);
      setUser(authUser || null);

      // ------------------------------------------------------
      // Persist authentication
      // ------------------------------------------------------

      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, authToken);

      if (authUser) {
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
      }

      // ------------------------------------------------------
      // Register device after login
      // ------------------------------------------------------
      //
      // Push registration failure must NOT make
      // login fail.
      //
      try {
        await registerCurrentDevice(authToken);
      } catch {}

      return result;
    } catch (error) {

      return {
        error: error.message || "Login failed",
      };
    }
  };

  // ==========================================================
  // SIGN UP
  // ==========================================================

  const signup = async (first_name, last_name, email, password) => {
    try {
      const result = await signupAPI({
        first_name,
        last_name,
        email,
        password,
      });

      if (!result || result.error) {
        return result;
      }

      const authToken = result.data?.token;

      const authUser = result.data?.user;

      if (!authToken) {
        return {
          error: "No authentication token received",
        };
      }

      // ------------------------------------------------------
      // Update React state
      // ------------------------------------------------------

      setToken(authToken);
      setUser(authUser || null);

      // ------------------------------------------------------
      // Persist authentication
      // ------------------------------------------------------

      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, authToken);

      if (authUser) {
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authUser));
      }

      // ------------------------------------------------------
      // Register device after signup
      // ------------------------------------------------------

      try {
        await registerCurrentDevice(authToken);
      } catch {}

      return result;
    } catch (error) {

      return {
        error: error.message || "Signup failed",
      };
    }
  };

  // ==========================================================
  // LOGOUT
  // ==========================================================
  //
  // IMPORTANT:
  //
  // unregisterDevice must happen BEFORE JWT is removed.
  //
  // ==========================================================

  const logout = async () => {
    let authToken = null;
    let deviceId = null;

    try {
      // ------------------------------------------------------
      // Read credentials before clearing them
      // ------------------------------------------------------

      authToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);

      deviceId = await AsyncStorage.getItem(DEVICE_ID_STORAGE_KEY);

      // ------------------------------------------------------
      // Deactivate device registration
      // ------------------------------------------------------

      if (authToken && deviceId) {
        try {

          const result = await unregisterDeviceAPI({
            deviceId,
            authToken,
          });


        } catch (error) {
          /*
           * Logout must continue even if device
           * unregister fails.
           */
        }
      }
    } catch {} finally {
      // ------------------------------------------------------
      // Clear authentication storage
      // ------------------------------------------------------

      try {
        await AsyncStorage.multiRemove([
          USER_STORAGE_KEY,
          TOKEN_STORAGE_KEY,
          FCM_TOKEN_STORAGE_KEY,
        ]);
      } catch {}

      // IMPORTANT:
      // Do NOT remove DEVICE_ID_STORAGE_KEY.
      //
      // Device ID belongs to the app installation,
      // not to the authenticated user.

      // ------------------------------------------------------
      // Clear React authentication state
      // ------------------------------------------------------

      setUser(null);
      setToken(null);
    }
  };

  // ==========================================================
  // CONTEXT VALUE
  // ==========================================================

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: Boolean(token),
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// USE AUTH
// ============================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
