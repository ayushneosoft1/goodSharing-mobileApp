import api from "../services/api";
import { CATEGORY_IDS } from "../constants/categories";

export const subscribeCategoryAPI = async (categories) => {
  try {
    console.log("Sending Categories:", categories);

    for (const category of categories) {
      const categoryId = CATEGORY_IDS[category];

      if (!categoryId) {
        throw new Error(`Invalid category: ${category}`);
      }

      const response = await api.post("", {
        query: `
          mutation SubscribeCategory($categoryId: ID!) {
            subscribeCategory(categoryId: $categoryId)
          }
        `,
        variables: {
          categoryId,
        },
      });

      console.log("SUBSCRIBE RESPONSE:", response.data);
    }

    return { success: true };
  } catch (error) {
    console.log("Subscription API Error:", error?.response?.data || error);

    return null;
  }
};

export const unsubscribeCategoryAPI = async (category) => {
  try {
    const categoryId = CATEGORY_IDS[category];

    if (!categoryId) {
      throw new Error(`Invalid category: ${category}`);
    }

    const response = await api.post("", {
      query: `
        mutation UnsubscribeCategory($categoryId: ID!) {
          unsubscribeCategory(categoryId: $categoryId)
        }
      `,
      variables: {
        categoryId,
      },
    });

    console.log("UNSUBSCRIBE RESPONSE:", response.data);

    return response?.data?.data?.unsubscribeCategory || false;
  } catch (error) {
    console.log(
      "Unsubscribe Category API Error:",
      error?.response?.data || error,
    );

    return false;
  }
};

export const getMySubscriptionsAPI = async () => {
  try {
    const response = await api.post("", {
      query: `
        query {
          userCategorySubscriptions
        }
      `,
    });

    console.log("MY SUBSCRIPTIONS:", response.data);

    return response?.data?.data?.userCategorySubscriptions || [];
  } catch (error) {
    console.log("Subscription API Error:", error?.response?.data || error);

    return [];
  }
};
