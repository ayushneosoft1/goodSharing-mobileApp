import api from "../services/api";

export const subscribeCategoryAPI = async (categories) => {
  try {
    console.log("Sending Categories:", categories);

    const response = await api.post("", {
      query: `
        mutation SubscribeCategories($categories:[PostCategory!]!){
          subscribeCategories(categories:$categories)
        }
      `,
      variables: {
        categories,
      },
    });

    console.log("SUBSCRIBE RESPONSE:", response.data);

    return response?.data?.data;
  } catch (error) {
    console.log("Subscription API Error:", error?.response?.data || error);

    return null;
  }
};

export const getMySubscriptionsAPI = async () => {
  try {
    const response = await api.post("", {
      query: `
        query {
          mySubscriptions
        }
      `,
    });

    console.log("MY SUBSCRIPTIONS:", response.data);

    return response?.data?.data?.mySubscriptions || [];
  } catch (error) {
    console.log("Subscription API Error:", error?.response?.data || error);

    return [];
  }
};
