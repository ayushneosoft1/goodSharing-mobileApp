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
  const { user, logout, token } = useAuth();
  const navigation = useNavigation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await getPostsAPI(token);
      if (!res.error) {
        setPosts(res.data || []);
      }
    } catch (err) {
      console.log("Error fetching posts", err);
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
              {item.owner?.first_name || "User"}
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

      {/* Drawer */}
      <Modal transparent visible={menuOpen} animationType="fade">
        <TouchableOpacity
          style={styles.drawerOverlay}
          onPress={() => setMenuOpen(false)}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.drawer}>
              <Text style={styles.drawerLogo}>📦 goodSharing</Text>

              <Text style={styles.userName}>
                {user?.first_name} {user?.last_name}
              </Text>

              <TouchableOpacity
                style={{ marginTop: 20 }}
                onPress={() => {
                  setMenuOpen(false);
                  navigation.navigate("MyPosts");
                }}
              >
                <Text style={{ color: "#0ea5e9" }}>My Posts</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                <Text style={styles.logoutBtnText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Posts */}
      <FlatList
        data={posts}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
        renderItem={renderPost}
        contentContainerStyle={{ padding: 16 }}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  menuIcon: { fontSize: 22 },

  headerTitle: { fontSize: 18, fontWeight: "bold" },

  postCard: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    overflow: "hidden",
  },

  postImage: { width: "100%", height: 180 },

  postContent: { padding: 12 },

  postHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  postTitle: { fontSize: 16, fontWeight: "bold" },

  badge: {
    backgroundColor: "#0ea5e9",
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  badgeText: { color: "#fff", fontSize: 12 },

  postDescription: { color: "#555", marginTop: 4 },

  postMeta: { marginTop: 6 },

  metaItem: { fontSize: 12, color: "#777" },

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

  fabText: { color: "#fff", fontSize: 20 },

  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  drawer: {
    width: 250,
    backgroundColor: "#fff",
    padding: 20,
    height: "100%",
  },

  drawerLogo: { fontSize: 18, fontWeight: "bold" },

  userName: { marginTop: 10 },

  logoutBtn: { marginTop: 20 },

  logoutBtnText: { color: "red" },
});
