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
  const { user, token } = useAuth();
  const navigation = useNavigation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await getPostsAPI(token);

      if (!res.error) {
        const filteredPosts = (res.data || []).filter(
          (post) => post.owner?.id == user?.id,
        );
        setPosts(filteredPosts);
      }
    } catch (err) {
      console.log("Error fetching posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchPosts();
  }, [user]);

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <Image
        source={{ uri: item.imageUrl || "https://via.placeholder.com/300" }}
        style={styles.postImage}
      />

      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text numberOfLines={2}>{item.description}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
        renderItem={renderPost}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  postCard: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    overflow: "hidden",
  },

  postImage: { width: "100%", height: 180 },

  postContent: { padding: 12 },

  postTitle: { fontSize: 16, fontWeight: "bold" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
