import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";

export default function CameraScreen() {
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need camera permissions to take pictures."
        );
      }
    })();
  }, []);

  const handleOpenCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: false,
        saveToPhotos: true,
      });

      if (result.canceled) {
        Alert.alert("Cancelled", "Camera was closed without taking a photo.");
      } else {
        const uri = result.assets[0].uri;
        console.log("Photo URI:", uri);
        Alert.alert("Got it!", "Photo captured successfully.");
        // You now have `uri` (and `result.assets[0].base64]` if you asked for base64)
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "An error occurred while opening the camera.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <TouchableOpacity onPress={handleOpenCamera} style={styles.snapButton}>
          <Feather name="camera" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  snapButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});
