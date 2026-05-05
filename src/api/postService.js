import { BASE_URL } from "../api/config";

/**
 * Create a new post
 */

export const createPostAPI = async (data, token) => {
  if (!token) {
    return { error: "Unauthorized - Token missing" };
  }

  try {
    const query = `
      mutation CreatePost(
        $title: String!,
        $category: PostCategory!,
        $description: String!,
        $imageUrl: String,
        $location: String
      ) {
        createPost(
          title: $title,
          category: $category,
          description: $description,
          imageUrl: $imageUrl,
          location: $location
        ) {
          id
          title
          description
          category
          location
          imageUrl
          createdAt
        }
      }
    `;

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ FIXED
      },
      body: JSON.stringify({
        query,
        variables: data,
      }),
    });

    const result = await response.json();

    console.log("GRAPHQL RESULT:", result); // 👈 debug

    return result;
  } catch (err) {
    return { error: err.message };
  }
};

/**
 * Get all posts
 */

export const getPostsAPI = async (token) => {
  if (!token) {
    return { error: "Unauthorized - Token missing" };
  }
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
