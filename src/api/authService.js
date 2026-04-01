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

    // Add this
    const signinResult = result.data?.signin;

    // Print only signin data
    console.log(" Signin Data:", signinResult?.data);

    // Check success first

    if (signinResult?.status == "SUCCESS") {
      return { data: signinResult.data };
    }

    //  Only throw error if truly failed
    if (result.errors?.length) {
      throw new Error(result.errors[0].message);
    }

    throw new Error(signinResult?.statusMessage || "Signin failed");
  } catch (err) {
    // Add this
    console.log("API FETCH ERROR", err.message);

    throw err;
  }
};

/**
 * Sign up user
 */
export const signupAPI = async ({ first_name, last_name, email, password }) => {
  const query = `
    mutation Signup($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
      signup(email: $email, password: $password, first_name: $firstName, last_name: $lastName) {
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

  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query,
      variables: {
        email,
        password,
        firstName: first_name,
        lastName: last_name,
      },
    }),
  });

  const result = await response.json();

  // GraphQL-level errors
  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0].message);
  }

  const signupResult = result.data.signup;

  // Application-level errors
  if (signupResult.status !== "SUCCESS") {
    throw new Error(signupResult.statusMessage || "Signup failed");
  }

  // Return nested data (user and token)
  return { data: signupResult.data };
};
