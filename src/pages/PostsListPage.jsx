// ./pages/PostsListPage.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { getPostsAPI } from "../api/postService";

export default function PostsListPage() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;

    return date.toLocaleDateString();
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await getPostsAPI();
      if (!res.error) {
        setPosts(res.data || []);
      }
    } catch (err) {
      console.log("Error fetching posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
        <View style={styles.postHeaderRow}>
          <Text style={styles.postTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {item.user?.first_name || "User"}
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
        <TouchableOpacity onPress={() => setMenuOpen(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>goodSharing</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* ✅ Drawer */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuOpen}
        onRequestClose={() => setMenuOpen(false)}
      >
        <TouchableOpacity
          style={styles.drawerOverlay}
          activeOpacity={1}
          onPress={() => setMenuOpen(false)}
        >
          {/* Prevent closing when clicking inside drawer */}
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.drawer}>
              <Text style={styles.drawerLogo}>📦 goodSharing</Text>

              <Text style={styles.userName}>
                {user?.first_name} {user?.last_name}
              </Text>

              {/* ✅ My Posts Button */}
              <TouchableOpacity
                style={{ marginTop: 20 }}
                onPress={() => {
                  setMenuOpen(false);
                  navigation.navigate("MyPosts");
                }}
              >
                <Text style={{ fontSize: 16, color: "#0ea5e9" }}>My Posts</Text>
              </TouchableOpacity>

              {/* Logout */}
              <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                <Text style={styles.logoutBtnText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Posts List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Available Items</Text>
            <Text style={styles.pageSubtitle}>
              Find items shared by your community
            </Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreatePost")}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
