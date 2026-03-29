/**
 * Real Authentication Service calling GraphQL API
 */
import { BASE_URL } from "./config";

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

  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { email, password } }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  // Return the nested data object containing user and token
  return {
    data: result.data.signin.data,
  };
};

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

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return {
    data: result.data.signup.data,
  };
};
