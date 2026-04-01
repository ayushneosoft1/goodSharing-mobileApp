// ./pages/MyPostsPage.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { getPostsAPI } from "../api/postService";

export default function MyPostsPage() {
  const { user } = useAuth();
  const navigation = useNavigation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // ✅ YOUR FILTER LOGIC APPLIED HERE
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await getPostsAPI();

      if (!res.error) {
        const filteredPosts = (res.data || []).filter(
          (post) => post.user && post.user.id == user?.id,
        );

        setPosts(filteredPosts);
      }
    } catch (err) {
      console.log("Error fetching posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchPosts();
    }
  }, [user]);
  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => navigation.navigate("PostDetail", { id: item.id })}
    >
      <Image
        source={{
          uri: item.imageUrl || "https://via.placeholder.com/300",
        }}
        style={styles.postImage}
      />

      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{item.title}</Text>

        <Text style={styles.postDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <Text style={styles.metaText}>📍 {item.location || "Unknown"}</Text>

        <Text style={styles.metaText}>🕒 {formatDate(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Posts</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* List */}
      {posts.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ fontSize: 16, color: "#777" }}>
            No Posts Created yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  backBtn: {
    fontSize: 20,
  },

  postCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },

  postImage: {
    width: "100%",
    height: 180,
  },

  postContent: {
    padding: 12,
  },

  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },

  postDescription: {
    color: "#555",
    marginBottom: 6,
  },

  metaText: {
    fontSize: 12,
    color: "#777",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
