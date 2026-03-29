import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { categories } from "../data/mockPosts";

export default function CreatePostPage({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    if (!title || !description || !category || !location) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Your post has been created!", [
        { text: "OK", onPress: () => navigation.navigate("PostsList") },
      ]);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.intro}>
          <Text style={styles.title}>Share an Item</Text>
          <Text style={styles.subtitle}>Community sharing made easy</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Item Details</Text>

          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Children's Books Collection"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryBadge,
                  category === cat && styles.activeCategory,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.activeCategoryText,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the item..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Downtown, Main Street"
            value={location}
            onChangeText={setLocation}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Create Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { padding: 20 },
  intro: { marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#0c4a6e" },
  subtitle: { fontSize: 14, color: "#64748b" },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#bae6fd",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0c4a6e",
    marginBottom: 15,
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
  textArea: { height: 100, textAlignVertical: "top" },
  categoryContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#0ea5e9",
  },
  activeCategory: { backgroundColor: "#0ea5e9" },
  categoryText: { color: "#0ea5e9", fontSize: 12, fontWeight: "600" },
  activeCategoryText: { color: "#fff" },
  actions: { flexDirection: "row", gap: 10, marginTop: 25 },
  cancelBtn: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  cancelBtnText: { color: "#64748b", fontWeight: "bold" },
  submitBtn: {
    flex: 2,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#0ea5e9",
  },
  submitBtnText: { color: "#fff", fontWeight: "bold" },
});
