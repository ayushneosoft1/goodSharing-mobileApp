import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { BASE_URL } from "../api/config";
import { useAuth } from "../contexts/AuthContext";

export default function PostDetailPage() {
  const route = useRoute();
  const { id } = route.params;

  const { token } = useAuth(); // ✅ FIX 1: token added

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPostDetail = async () => {
    if (!token) {
      console.log("No token found");
      setLoading(false);
      return;
    }

    const query = `
      query GetPost($id: ID!) {
        post(id: $id) {
          id
          title
          description
          imageUrl
          location
          createdAt
          owner {   // ✅ FIX 2: user → owner
            id
            first_name
            last_name
          }
        }
      }
    `;

    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query,
          variables: { id },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        console.log("GraphQL Error:", result.errors);
      }

      setPost(result?.data?.post || null);
    } catch (err) {
      console.log("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPostDetail();
    }
  }, [token]);

  // ✅ Loader UI
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading post...</Text>
      </View>
    );
  }

  // ✅ Fallback UI
  if (!post) {
    return (
      <View style={styles.center}>
        <Text>Post not found 😕</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: post.imageUrl || "https://via.placeholder.com/300" }}
        style={styles.image}
      />

      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.desc}>{post.description}</Text>

      <Text style={styles.meta}>📍 {post.location || "Unknown"}</Text>

      {/* ✅ FIX 3: owner used safely */}
      <Text style={styles.meta}>
        👤 {post.owner?.first_name || "User"} {post.owner?.last_name || ""}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  image: {
    width: "100%",
    height: 250,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 12,
  },

  desc: {
    fontSize: 14,
    color: "#555",
    marginHorizontal: 12,
    marginBottom: 10,
  },

  meta: {
    fontSize: 13,
    color: "#777",
    marginHorizontal: 12,
    marginBottom: 6,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
