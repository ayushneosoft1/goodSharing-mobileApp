import { BASE_URL } from "./config";

// SIGN IN
export const signinAPI = async ({ email, password }) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation Signin($email: String!, $password: String!) {
            signin(email: $email, password: $password) {
              status
              statusMessage
              data {
                token
                user {
                  id
                  email
                  first_name
                  last_name
                }
              }
            }
          }
        `,
        variables: { email, password },
      }),
    });

    const result = await response.json();

    if (result.errors?.length) {
      return { error: result.errors[0].message };
    }

    const data = result?.data?.signin;

    if (!data) {
      return { error: "Signin failed (no data returned)" };
    }

    if (data.status !== "SUCCESS") {
      return { error: data.statusMessage || "Signin failed" };
    }

    return { data: data.data };
  } catch (error) {
    return { error: error.message || "Signin request failed" };
  }
};

// SIGN UP
export const signupAPI = async ({ first_name, last_name, email, password }) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation Signup($email: String!, $password: String!, $first_name: String!, $last_name: String!) {
            signup(email: $email, password: $password, first_name: $first_name, last_name: $last_name) {
              status
              statusMessage
              data {
                token
                user {
                  id
                  email
                  first_name
                  last_name
                }
              }
            }
          }
        `,
        variables: { first_name, last_name, email, password },
      }),
    });

    const result = await response.json();

    if (result.errors?.length) {
      return { error: result.errors[0].message };
    }

    const data = result?.data?.signup;

    if (!data) {
      return { error: "Signup failed (no data returned)" };
    }

    if (data.status !== "SUCCESS") {
      return { error: data.statusMessage || "Signup failed" };
    }

    return { data: data.data };
  } catch (error) {
    return { error: error.message || "Signup request failed" };
  }
};

// REGISTER DEVICE
export const registerDeviceAPI = async ({
  deviceId,
  fcmToken,
  platform,
  authToken,
}) => {
  try {
    if (!deviceId) return { error: "deviceId is required" };
    if (!fcmToken) return { error: "fcmToken is required" };
    if (!platform) return { error: "platform is required" };
    if (!authToken) return { error: "Authentication token is required" };

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        query: `
          mutation RegisterDevice($input: RegisterDeviceInput!) {
            registerDevice(input: $input) {
              id
              userId
              deviceId
              platform
              isActive
              createdAt
              updatedAt
              lastSeenAt
            }
          }
        `,
        variables: { input: { deviceId, fcmToken, platform } },
      }),
    });

    const result = await response.json();

    if (result.errors?.length) {
      return { error: result.errors[0].message };
    }

    const data = result?.data?.registerDevice;

    if (!data) {
      return { error: "Device registration failed (no data returned)" };
    }

    return { data };
  } catch (error) {
    return { error: error.message || "Device registration request failed" };
  }
};

// UNREGISTER DEVICE
export const unregisterDeviceAPI = async ({ deviceId, authToken }) => {
  try {
    if (!deviceId) return { error: "deviceId is required" };
    if (!authToken) return { error: "Authentication token is required" };

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        query: `
          mutation UnregisterDevice($input: UnregisterDeviceInput!) {
            unregisterDevice(input: $input) {
              id
              userId
              deviceId
              platform
              isActive
              createdAt
              updatedAt
              lastSeenAt
            }
          }
        `,
        variables: { input: { deviceId } },
      }),
    });

    const result = await response.json();

    if (result.errors?.length) {
      return { error: result.errors[0].message };
    }

    const data = result?.data?.unregisterDevice;

    if (!data) {
      return { error: "Device unregistration failed (no data returned)" };
    }

    return { data };
  } catch (error) {
    return { error: error.message || "Device unregistration request failed" };
  }
};
