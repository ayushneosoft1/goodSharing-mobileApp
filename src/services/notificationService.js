import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) return null;

  const { status } = await Notifications.getPermissionsAsync();

  let finalStatus = status;

  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();

    finalStatus = newStatus;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: "31a28ec5-bb4c-444b-b87a-ae472b051c23",
    })
  ).data;

  console.log("Expo Push Token:", token);

  // TEMPORARY TEST
  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        to: token,
        title: "Push Test",
        body: "Hello from Expo 🎉",
        data: {
          postId: "102",
        },
      },
    ]),
  });

  const result = await response.json();
  console.log("PUSH TEST RESULT:", result);

  return token;
}

const testPush = async () => {
  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      {
        to: "ExponentPushToken[r1i12-EQ_DK87unzSm_kYK]",
        title: "Push Test",
        body: "Hello from Expo 🎉",
      },
    ]),
  });

  const result = await response.json();

  console.log("PUSH TEST RESULT:", result);
};
