import React, { use, useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Pressable,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Location from "expo-location";
import { useFocusEffect, useRouter } from "expo-router";
import Axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useBaseUrl } from "../../utility/useBaseURL";

export default function Submit_Form_Screen() {
  const baseUrl = useBaseUrl();
  const navigation = useNavigation();
  const route = useRoute();
  const router = useRouter();
  const { imageUri } = route.params ?? {};
  const [description, setDescription] = useState("");

  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const [modal_visbile, set_modal_visible] = useState(false);

  const get_location = async () => {
    try {
      // 1. Request permission first
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationError("Permission to access location was denied");
        return;
      }

      // 2. Get current position with error handling
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000, // 15 seconds
      });

      setLocation(location);
    } catch (error) {
      // console.error("Location error:", error);
      setLocationError("Unable to get location");
      throw error;
    }
  };

  const [profile, setProfile] = React.useState(null);

  const fetch_user = async () => {
    try {
      const token = await SecureStore.getItemAsync("user_token");
      const response = await Axios.get(`${baseUrl}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data.user);
    } catch (error) {
      // console.log("Error during fetching user", error);
      throw error;
    }
  };

  useEffect(() => {
    fetch_user();
    get_location();
  });

  const generateRandomName = () => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `photo_${timestamp}`;
  };

  const handle_submit = async () => {
    // Extract file name & type
    const uriParts = imageUri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    const form_data = new FormData();
    form_data.append("user_id", profile?.id);
    form_data.append("photo_url", {
      uri: imageUri,
      name: `${generateRandomName()}.${fileType}`,
      type: `image/${fileType}`,
    });
    form_data.append("latitude", location?.coords.latitude);
    form_data.append("longitude", location?.coords.longitude);
    form_data.append("description", description);

    console.log(form_data);

    await Axios.post(`${baseUrl}/create_report`, form_data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    });

    Alert.alert(
      "Report Submitted",
      "Thank you. The admin will review your report."
    );

    setDescription("");

    navigation.navigate("screens/HomeScreen");
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        setDescription("");
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Submit Report</Text>
        <Text
          onPress={() => router.replace("screens/HomeScreen")}
          style={styles.cancelText}
        >
          Cancel
        </Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Modal
          animationType="fade"
          onRequestClose={() => set_modal_visible(false)}
          transparent={true}
          visible={modal_visbile}
        >
          <Pressable
            style={styles.modalBackground}
            onPress={() => set_modal_visible(false)}
          >
            <Image
              style={styles.fullImage}
              resizeMode="contain"
              source={{ uri: imageUri }}
            />
          </Pressable>
        </Modal>
        {/* Image Upload Area */}
        <TouchableOpacity style={styles.imageUploadContainer}>
          {imageUri ? (
            <Pressable
              onPress={() => {
                set_modal_visible(true);
              }}
            >
              <View style={styles.imageUploadContainer}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.imageUploadContainer}
                  resizeMode="cover"
                />
              </View>
            </Pressable>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={50} color="#aaa" />
            </View>
          )}
        </TouchableOpacity>

        {/* Location Info */}
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={18} color="#4CAF50" />
          <Text style={styles.locationText}>
            Current Location • GPS coordinates captured
          </Text>
        </View>

        {/* Description Input */}
        <TextInput
          style={styles.descriptionInput}
          placeholder="Describe the waste issue..."
          multiline
          value={description}
          onChangeText={setDescription}
        />

        {/* Submit Button */}
        <TouchableOpacity onPress={handle_submit} style={styles.submitButton}>
          <Ionicons
            name="paper-plane-outline"
            size={18}
            color="white"
            style={styles.submitIcon}
          />
          <Text style={styles.submitText}>Submit Report</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageUploadContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  cancelText: {
    fontSize: 16,
    color: "#000",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imageUploadContainer: {
    width: "100%",
    height: 180,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
  },
  descriptionInput: {
    height: 100,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 24,
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
  },
  submitIcon: {
    marginRight: 8,
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  fullImage: {
    width: "90%",
    height: "70%",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
});
