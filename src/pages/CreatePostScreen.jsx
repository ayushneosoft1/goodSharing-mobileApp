import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import { createPostAPI } from "../services/postService"; // ✅ your postService.js

const CreatePostScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description || !category || !location) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);

    const token = await AsyncStorage.getItem("token"); // 🔐 get user token

    const res = await createPostAPI({
      title,
      description,
      location,
      imageUrl: "", // can improve later with image picker
      token, // pass token for authentication
    });

    setLoading(false);

    if (res.error) {
      Alert.alert("Error", res.error);
    } else {
      Alert.alert("Success", "Post created successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("PostsList"),
        },
      ]);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Create Post" onPress={handleSubmit} />
      )}
    </View>
  );
};

export default CreatePostScreen;
