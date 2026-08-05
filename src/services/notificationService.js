import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Notification behaviour when app is foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,

    // SDK 53+ compatibility
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Register device for push notifications
export async function registerForPushNotifications() {
  try {
    // Push notifications only work on a real device
    if (!Device.isDevice) {
      console.log("Push notifications require a physical device");
      return null;
    }

    // Check existing permission
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    // Ask permission if not granted
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Stop if permission denied
    if (finalStatus !== "granted") {
      console.log("Push notification permission denied");
      return null;
    }

    // Android notification channel
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    // Generate Expo Push Token
    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "31a28ec5-bb4c-444b-b87a-ae472b051c23",
      })
    ).data;

    console.log("Expo Push Token:", token);

    // TODO: Send this token to backend API and save in DB

    return token;
  } catch (error) {
    console.log("Error registering for push notifications:", error);
    return null;
  }
}
