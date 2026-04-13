// ./pages/CreatePostPage.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { createPostAPI } from "../api/postService";
import { categories } from "../data/mockPosts";

export default function CreatePostPage() {
  const navigation = useNavigation();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ SINGLE CLEAN FUNCTION
  const handleCreatePost = async () => {
    if (!token) {
      Alert.alert("Error", "User not authenticated yet. Please wait.");
      return;
    }

    if (!title || !description || !category || !location) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title,
        description,
        category,
        location,
        imageUrl, // ✅ correct (no hardcoded "")
      };

      const res = await createPostAPI(payload, token);

      if (res?.data?.createPost && !res?.errors) {
        Alert.alert("Success", "Post created successfully!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(
          "Error",
          res?.errors?.[0]?.message || "Post creation failed",
        );
      }
    } catch (err) {
      console.log("Create Post Error:", err);
      Alert.alert("Error", "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Share an Item</Text>
      <Text style={styles.subHeader}>Community sharing made easy</Text>

      <View style={styles.form}>
        {/* Title */}
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Books, Clothes, etc."
          value={title}
          onChangeText={setTitle}
        />

        {/* Category */}
        <Text style={styles.label}>Category *</Text>
        <View style={styles.categories}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.categoryBadge,
                category === cat.value && styles.activeCategory,
              ]}
              onPress={() => setCategory(cat.value)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === cat.value && styles.activeCategoryText,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your item..."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Image URL */}
        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="Paste image link"
          value={imageUrl}
          onChangeText={setImageUrl}
        />

        {/* Location */}
        <Text style={styles.label}>Location *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Anjar, Gujarat"
          value={location}
          onChangeText={setLocation}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleCreatePost}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Create Post</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8fafc",
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0c4a6e",
    marginBottom: 4,
  },

  subHeader: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
  },

  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#bae6fd",
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0c4a6e",
    marginBottom: 8,
    marginTop: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#bae6fd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fdfdfd",
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },

  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#0ea5e9",
  },

  activeCategory: {
    backgroundColor: "#0ea5e9",
  },

  categoryText: {
    color: "#0ea5e9",
    fontSize: 12,
    fontWeight: "600",
  },

  activeCategoryText: {
    color: "#fff",
  },

  submitBtn: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#0ea5e9",
  },

  submitBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
