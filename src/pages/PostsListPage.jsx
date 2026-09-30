// ./pages/PostsListPage.jsx

import React, { useState, useCallback } from "react";

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

import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { useAuth } from "../contexts/AuthContext";

import { getPostsAPI } from "../api/postService";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import noImage from "../../assets/images/no-image.png";

export default function PostsListPage() {
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  const { user, logout, token } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================
  // Format Date
  // ======================
  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString();
  };

  // ======================
  // Fetch Posts
  // ======================
  const fetchPosts = async () => {
    setLoading(true);

    try {
      const res = await getPostsAPI(token);

      if (!res.error) {
        setPosts(res.data || []);
      }
    } catch (err) {
      console.log("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // Refresh on Screen Focus
  // ======================
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [token]),
  );

  // ======================
  // Render Post
  // ======================
  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() =>
        navigation.navigate("PostDetail", {
          postId: item.id,
        })
      }
    >
      <Image
        source={item.imageUrl ? { uri: item.imageUrl } : noImage}
        style={styles.postImage}
      />

      <View style={styles.postContent}>
        <View style={styles.postHeaderRow}>
          <Text style={styles.postTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {item.owner?.first_name || item.userName || "User"}
            </Text>
          </View>
        </View>

        <Text style={styles.postDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.postMeta}>
          <Text style={styles.metaItem}>📍 {item.location || "Unknown"}</Text>

          <Text style={styles.metaItem}>🕒 {formatDate(item.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // ======================
  // Loading
  // ======================
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0ea5e9" />
      </View>
    );
  }

  // ======================
  // Main UI
  // ======================
  return (
    <SafeAreaView style={styles.container}>
      {/* Posts */}
      <FlatList
        data={posts}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
        renderItem={renderPost}
        contentContainerStyle={{
          padding: 16,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          !loading && (
            <View style={styles.center}>
              <Text>No Posts Found</Text>
            </View>
          )
        }
      />

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreatePost")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ======================
// Styles
// ======================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  postCard: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    overflow: "hidden",
  },

  postImage: {
    width: "100%",
    height: 180,
  },

  postContent: {
    padding: 12,
  },

  postHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },

  badge: {
    backgroundColor: "#0ea5e9",
    paddingHorizontal: 8,
    borderRadius: 8,
    justifyContent: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
  },

  postDescription: {
    color: "#555",
    marginTop: 4,
  },

  postMeta: {
    marginTop: 8,
  },

  metaItem: {
    fontSize: 12,
    color: "#777",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#0ea5e9",
    padding: 16,
    borderRadius: 50,
  },

  fabText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
});
