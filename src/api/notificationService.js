import api from "../services/api";

// ======================
// Get All Notifications
// ======================
export const getNotificationsAPI = async () => {
  try {
    const response = await api.post("", {
      query: `         query GetNotifications {
          notifications {
            id
            title
            message
            isRead
            postId
            createdAt
            post {
              id
              title
            }
          }
        }
      `,
    });

    console.log("NOTIFICATIONS RESPONSE:", response.data);

    return response?.data?.data?.notifications || [];
  } catch (error) {
    console.log("Notification API Error:", error.response?.data || error);
    return [];
  }
};

// ======================
// Mark Notification Read
// ======================
export const markNotificationReadAPI = async (notificationId) => {
  try {
    const response = await api.post("", {
      query: `         mutation MarkNotificationRead($notificationId: ID!) {
          markNotificationRead(notificationId: $notificationId)
        }
      `,
      variables: {
        notificationId,
      },
    });

    return response?.data?.data?.markNotificationRead || false;
  } catch (error) {
    console.log("Mark Notification Error:", error.response?.data || error);
    return false;
  }
};

// ======================
// Get Unread Count
// ======================
export const getUnreadNotificationCountAPI = async () => {
  try {
    const response = await api.post("", {
      query: `         query GetUnreadCount {
          unreadNotificationCount
        }
      `,
    });

    return response?.data?.data?.unreadNotificationCount || 0;
  } catch (error) {
    console.log(
      "Unread Notification Count Error:",
      error.response?.data || error,
    );
    return 0;
  }
};

// ======================
// Save Expo Push Token
// ======================
export const savePushTokenAPI = async (token) => {
  try {
    const response = await api.post("", {
      query: `         mutation SavePushToken($token: String!) {
          savePushToken(token: $token)
        }
      `,
      variables: {
        token,
      },
    });

    console.log("SAVE PUSH TOKEN RESPONSE:", response.data);

    return response?.data?.data?.savePushToken || false;
  } catch (error) {
    console.log("Save Push Token Error:", error.response?.data || error);
    return false;
  }
};
