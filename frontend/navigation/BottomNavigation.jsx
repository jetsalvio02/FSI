import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Axios from "axios";
import { endEvent } from "react-native/Libraries/Performance/Systrace";
import { useBaseUrl } from "../utility/useBaseURL";
import { useSearchParams } from "expo-router/build/hooks";
import { useAuth } from "../contexts/UsertContext";

var router = useRouter();

// Custom Footer Component
const Footer = ({ activeTab, onTabPress, onCameraPress }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.footerWrapper}>
      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={onCameraPress}>
          <Feather name="camera" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Footer Tabs */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            onTabPress("home");
            navigation.navigate(`screens/HomeScreen`);
            // router.replace(`/screens/HomeScreen?id=${user_id}`);
          }}
        >
          <Feather
            name="home"
            size={20}
            color={activeTab === "home" ? "#000" : "#888"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "home" && styles.activeTabText,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab}>
          <Feather
            // name="file-text"
            size={20}
            color={activeTab === "reports" ? "#000" : "#888"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "reports" && styles.activeTabText,
            ]}
          >
            To Report
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => {
            onTabPress("profile");
            navigation.navigate(`screens/ReportsScreen`);
            // router.replace(`/screens/ReportsScreen?id=${user_id}`);
          }}
        >
          <Feather
            name="file-text"
            size={20}
            color={activeTab === "profile" ? "#000" : "#888"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "profile" && styles.activeTabText,
            ]}
          >
            Reports
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Main App Component
export default function BottomNavigation() {
  const { user_id } = useAuth();

  // console.log(user_id.id);

  const [activeTab, setActiveTab] = useState("home");
  const navigation = useNavigation();

  // ask for camera permission on mount
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

  // actually opens the camera
  const handleOpenCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      // mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      saveToPhotos: true,
    });

    if (result.canceled) {
      Alert.alert("Cancelled", "Camera was closed without taking a photo.");
    } else {
      const uri = result.assets[0].uri;
      console.log("Photo URI:", uri);
      Alert.alert("Got it!", "Photo captured successfully.");
      navigation.navigate("screens/Submit_Form_Screen", { imageUri: uri });
    }

    // navigation.navigate("screens/CameraScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Footer
        activeTab={activeTab}
        onTabPress={setActiveTab}
        onCameraPress={handleOpenCamera}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  footerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  footer: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: "#888",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "500",
  },
  fabContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: 30,
    zIndex: 1,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
