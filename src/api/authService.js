import { BASE_URL } from "./config";

// SIGNIN
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

    if (result.errors) return { error: result.errors[0].message };

    const data = result?.data?.signin;

    if (!data) return { error: "Signin failed (no data returned)" };

    if (data.status !== "SUCCESS") {
      return { error: data.statusMessage };
    }

    return { data: data.data };
  } catch (err) {
    return { error: err.message };
  }
};

// SIGNUP
export const signupAPI = async (payload) => {
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
        variables: payload,
      }),
    });

    const result = await response.json();

    if (result.errors) return { error: result.errors[0].message };

    const data = result?.data?.signup;

    if (!data) return { error: "Signup failed (no data returned)" };

    if (data.status !== "SUCCESS") {
      return { error: data.statusMessage };
    }

    return { data: data.data };
  } catch (err) {
    return { error: err.message };
  }
};

// PUSH TOKEN
export const savePushTokenAPI = async (token, authToken) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        query: `
          mutation SavePushToken($token: String!) {
            savePushToken(token: $token)
          }
        `,
        variables: { token },
      }),
    });

    const result = await response.json();

    if (result.errors) return { error: result.errors[0].message };

    return { data: result?.data?.savePushToken };
  } catch (err) {
    return { error: err.message };
  }
};
