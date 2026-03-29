import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { mockPosts } from "../data/mockPosts";

export default function PostsListPage() {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);

  const formatDate = (dateString) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuOpen(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>goodSharing</Text>
        <View style={{ width: 30 }} />
      </View>

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
          <View style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerLogo}>📦 goodSharing</Text>
              <Text style={styles.drawerSubtitle}>Community sharing</Text>
            </View>

            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.first_name?.charAt(0) || "U"}
                </Text>
              </View>
              <View>
                <Text style={styles.userName}>
                  {user?.first_name} {user?.last_name}
                </Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
              </View>
            </View>

            <View style={styles.drawerMenu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setMenuOpen(false)}
              >
                <Text style={styles.menuItemText}>📋 Browse Posts</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuOpen(false);
                  navigation.navigate("CreatePost");
                }}
              >
                <Text style={styles.menuItemText}>➕ Create Post</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
              <Text style={styles.logoutBtnText}>🚪 Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView style={styles.mainContent}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Available Items</Text>
          <Text style={styles.pageSubtitle}>
            Find items shared by your community
          </Text>
        </View>

        <View style={styles.postsList}>
          {mockPosts.map((post) => (
            <TouchableOpacity
              key={post.id}
              style={styles.postCard}
              onPress={() => navigation.navigate("PostDetail", { id: post.id })}
            >
              <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
              <View style={styles.postContent}>
                <View style={styles.postHeaderRow}>
                  <Text style={styles.postTitle} numberOfLines={1}>
                    {post.title}
                  </Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{post.category}</Text>
                  </View>
                </View>
                <Text style={styles.postDescription} numberOfLines={2}>
                  {post.description}
                </Text>
                <View style={styles.postMeta}>
                  <Text style={styles.metaItem}>📍 {post.location}</Text>
                  <Text style={styles.metaItem}>
                    🕒 {formatDate(post.createdAt)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
  container: { flex: 1, backgroundColor: "#e0f2fe" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  menuIcon: { fontSize: 24, color: "#0ea5e9" },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#0c4a6e" },
  drawerOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  drawer: { width: 280, height: "100%", backgroundColor: "#fff", padding: 20 },
  drawerHeader: { marginBottom: 30, marginTop: 40 },
  drawerLogo: { fontSize: 22, fontWeight: "bold", color: "#0c4a6e" },
  drawerSubtitle: { fontSize: 14, color: "#64748b" },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0ea5e9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  userName: { fontSize: 16, fontWeight: "bold", color: "#0c4a6e" },
  userEmail: { fontSize: 12, color: "#64748b" },
  drawerMenu: { flex: 1 },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  menuItemText: { fontSize: 16, color: "#0c4a6e" },
  logoutBtn: {
    padding: 15,
    backgroundColor: "#fff1f2",
    borderRadius: 8,
    alignItems: "center",
  },
  logoutBtnText: { color: "#e11d48", fontWeight: "bold" },
  mainContent: { flex: 1 },
  pageHeader: { padding: 20 },
  pageTitle: { fontSize: 24, fontWeight: "bold", color: "#0c4a6e" },
  pageSubtitle: { fontSize: 14, color: "#64748b" },
  postsList: { padding: 10 },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  postImage: { width: "100%", height: 180 },
  postContent: { padding: 12 },
  postHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0c4a6e",
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 10, color: "#0ea5e9", fontWeight: "bold" },
  postDescription: { fontSize: 14, color: "#64748b", marginBottom: 12 },
  postMeta: { flexDirection: "row", justifyContent: "space-between" },
  metaItem: { fontSize: 12, color: "#94a3b8" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#0ea5e9",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
  },
  fabText: { color: "#fff", fontSize: 32, marginTop: -4 },
});
