import api from "../services/api";

// GET NOTIFICATIONS
export const getNotificationsAPI = async () => {
  try {
    const response = await api.post("", {
      query: `
        query GetNotifications {
          notifications {
            id
            title
            message
            isRead
            postId
            createdAt
            readAt
          }
        }
      `,
    });

    return response?.data?.data?.notifications || [];
  } catch (error) {
    console.log("Notification API Error:", error.response?.data || error);
    return [];
  }
};

// MARK NOTIFICATION READ
export const markNotificationReadAPI = async (notificationId) => {
  try {
    const response = await api.post("", {
      query: `
        mutation MarkNotificationRead($notificationId: ID!) {
          markNotificationRead(notificationId: $notificationId)
        }
      `,
      variables: { notificationId },
    });

    return response?.data?.data?.markNotificationRead || false;
  } catch (error) {
    console.log("Mark Notification Error:", error.response?.data || error);
    return false;
  }
};

// MARK ALL NOTIFICATIONS READ
export const markAllNotificationsReadAPI = async () => {
  try {
    const response = await api.post("", {
      query: `
        mutation MarkAllNotificationsRead {
          markAllNotificationsRead
        }
      `,
    });

    return response?.data?.data?.markAllNotificationsRead || false;
  } catch (error) {
    console.log("Mark All Notifications Error:", error.response?.data || error);

    return false;
  }
};

// GET UNREAD NOTIFICATION COUNT
export const getUnreadNotificationCountAPI = async () => {
  try {
    const response = await api.post("", {
      query: `
        query GetUnreadCount {
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
