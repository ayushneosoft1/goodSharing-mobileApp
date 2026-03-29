import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { mockPosts } from "../data/mockPosts";

export default function PostDetailPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const post = mockPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Post Not Found</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.btnPrimary}
        >
          <Text style={styles.btnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: post.imageUrl }} style={styles.detailImage} />

        <View style={styles.detailBody}>
          <View style={styles.titleSection}>
            <Text style={styles.detailTitle}>{post.title}</Text>
            <View style={styles.detailBadge}>
              <Text style={styles.badgeText}>{post.category}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Shared by</Text>
            <View style={styles.ownerInfo}>
              <View style={styles.ownerAvatar}>
                <Text style={styles.avatarText}>
                  {post.owner.name.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={styles.ownerName}>{post.owner.name}</Text>
                <Text style={styles.infoMeta}>📍 {post.location}</Text>
                <Text style={styles.infoMeta}>
                  🕒 {formatDate(post.createdAt)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.detailDescription}>{post.description}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.btnPrimary}>
              <Text style={styles.btnText}>💬 Message Owner</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary}>
              <Text style={styles.btnSecondaryText}>❤️ Show Interest</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              💡 Tip: When you message the owner, be polite and explain why
              you're interested in this item. Arrange a safe meeting place for
              pickup.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
