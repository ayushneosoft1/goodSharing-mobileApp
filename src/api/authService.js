/**
 * Mock Authentication Service
 * In production, replace these with real fetch/axios calls to your GraphQL or REST API
 */

export const signinAPI = async ({ email, password }) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock successful login
  return {
    data: {
      user: {
        id: "u1",
        email,
        first_name: "John",
        last_name: "Doe",
      },
    },
  };
};

export const signupAPI = async ({ first_name, last_name, email, password }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    data: {
      user: { id: "u" + Math.random(), first_name, last_name, email },
    },
  };
};
