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
import { getPostsAPI } from "../api/postService";

export default function PostDetailPage() {
  const route = useRoute();
  const { id } = route.params;
  console.log("Received ID:", id); // Added console

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPostDetail = async () => {
    const query = `
    query GetPost($id: ID!) {
      post(id: $id) {
        id
        title
        description
        imageUrl
        location
        createdAt
        user {
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: { id },
        }),
      });

      const result = await response.json();
      setPost(result?.data?.post || null);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPostDetail();
  }, []);

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
      <Image source={{ uri: post.imageUrl }} style={styles.image} />

      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.desc}>{post.description}</Text>

      <Text style={styles.meta}>📍 {post.location}</Text>
      <Text style={styles.meta}>
        👤 {post.user.first_name} {post.user.last_name}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0c4a6e",
    marginBottom: 20,
  },
  detailImage: { width: "100%", height: 300 },
  detailBody: {
    padding: 20,
    marginTop: -20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0c4a6e",
    flex: 1,
    marginRight: 10,
  },
  detailBadge: {
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  badgeText: { color: "#0ea5e9", fontWeight: "bold", fontSize: 12 },
  infoCard: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0c4a6e",
    marginBottom: 12,
  },
  ownerInfo: { flexDirection: "row", alignItems: "center" },
  ownerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0ea5e9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: "#fff", fontWeight: "bold" },
  ownerName: { fontSize: 16, fontWeight: "bold", color: "#0c4a6e" },
  infoMeta: { fontSize: 13, color: "#64748b", marginTop: 2 },
  detailDescription: { fontSize: 15, color: "#334155", lineHeight: 22 },
  actionButtons: { gap: 12, marginBottom: 20 },
  btnPrimary: {
    backgroundColor: "#0ea5e9",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  btnSecondary: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0ea5e9",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  btnSecondaryText: { color: "#0ea5e9", fontWeight: "bold", fontSize: 16 },
  tipCard: {
    backgroundColor: "#fffbeb",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#f59e0b",
  },
  tipText: { fontSize: 13, color: "#92400e", lineHeight: 18 },
});
