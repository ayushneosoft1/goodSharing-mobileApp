/**
 * Real Authentication Service calling GraphQL API
 */
import { BASE_URL } from "./config";

/**
 * Sign in user
 */

export const signinAPI = async ({ email, password }) => {
  const query = `
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
  `;

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", //  ONLY THIS
      },
      body: JSON.stringify({ query, variables: { email, password } }),
    });

    const result = await response.json();
    console.log("SIGNIN FULL RESPONSE:", JSON.stringify(result, null, 2));

    // GraphQL errors
    if (result.errors && result.errors.length > 0) {
      return { error: result.errors[0].message };
    }

    // Safe access
    const signinResult = result?.data?.signin;

    if (!signinResult) {
      return {
        error:
          result?.errors?.[0]?.message || "Signin failed (no data returned)",
      };
    }

    // Business logic error

    if (signinResult.status !== "SUCCESS") {
      return {
        error: signinResult.statusMessage || "Signin failed",
      };
    }

    // Success

    return { data: signinResult.data };
  } catch (err) {
    console.log("SIGNIN API ERROR:", err.message);
    return { error: err.message || "Signin failed" };
  }
};

/**
 * Sign up user
 */
export const signupAPI = async ({ first_name, last_name, email, password }) => {
  const query = `
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
  `;

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: {
          email,
          password,
          first_name,
          last_name,
        },
      }),
    });

    const result = await response.json();
    console.log("SIGNUP FULL RESPONSE:", JSON.stringify(result, null, 2));

    // Handle GraphQL-level errors first
    if (result.errors && result.errors.length > 0) {
      return { error: result.errors[0].message };
    }

    // Safe Access (Fix Here)

    const signupResult = result?.data?.signup;

    if (!signupResult) {
      return {
        error:
          result?.errors?.[0]?.message || "Signup failed no data returned)",
      };
    }

    // Business logic error
    if (signupResult.status !== "SUCCESS") {
      return { error: signupResult.statusMessage || "Signup failed" };
    }

    // Success

    return { data: signupResult.data };
  } catch (err) {
    console.log("SIGNUP API ERROR:", err.message);
    return { error: err.message || "Signup failed" };
  }
};
