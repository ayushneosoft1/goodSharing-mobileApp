import { BASE_URL } from "./config";

export const signupAPI = async ({ first_name, last_name, email, password }) => {
  const response = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation Signup($first_name: String!, $last_name: String!, $email: String!, $password: String!) {
          signup(first_name: $first_name, last_name: $last_name, email: $email, password: $password) {
            data {
              token
              user {
                id
                first_name
                last_name
                email
              }
            }
          }
        }
      `,
      variables: { first_name, last_name, email, password },
    }),
  });

  const result = await response.json();

  if (result.errors) {
    return { error: result.errors[0].message };
  }

  return result.data.signup;
};

export const signinAPI = async ({ email, password }) => {
  const response = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `
        mutation Signin($email: String!, $password: String!) {
          signin(email: $email, password: $password) {
            data {
              token
              user {
                id
                first_name
                last_name
                email
              }
            }
          }
        }
      `,
      variables: { email, password },
    }),
  });

  const result = await response.json();

  if (result.errors) {
    return { error: result.errors[0].message };
  }

  return result.data.signin;
};
