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
    console.log("Notification API request failed");
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
    console.log("Mark notification request failed");
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
    console.log("Mark all notifications request failed");

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
    console.log("Unread notification count request failed");

    return 0;
  }
};
