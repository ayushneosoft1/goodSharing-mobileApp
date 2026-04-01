import { BASE_URL } from "../api/config";

/**
 * Create a new post
 */
export const createPostAPI = async ({
  title,
  description,
  category,
  location,
  imageUrl,
  token,
}) => {
  try {
    const query = `
      mutation CreatePost(
        $title: String!,
        $description: String!,
        $category: String!,
        $location: String!,
        $imageUrl: String
      ) {
        createPost(
          input: {
            title: $title,
            description: $description,
            category: $category,
            location: $location,
            imageUrl: $imageUrl
          }
        ) {
          status
          statusMessage
          data {
            id
            title
            description
            category
            location
            imageUrl
            createdAt
          }
        }
      }
    `;

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables: { title, description, category, location, imageUrl },
      }),
    });

    const result = await response.json();

    if (result.errors?.length) {
      return { error: result.errors[0].message };
    }

    const createPostResult = result.data.createPost;

    if (createPostResult.status !== "SUCCESS") {
      return {
        error: createPostResult.statusMessage || "Failed to create post",
      };
    }

    return { data: createPostResult.data };
  } catch (err) {
    return { error: err.message || "Network error" };
  }
};

/**
 * Get all posts
 */

export const getPostsAPI = async (token) => {
  const query = `
    query {
      posts {
        id
        title
        description
        category
        imageUrl
        location
        createdAt
        owner {
          id
          first_name
          last_name
        }
      }
    }
  `;

  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    const result = await res.json();

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    return { data: result.data.posts };
  } catch (err) {
    return { error: err.message };
  }
};
