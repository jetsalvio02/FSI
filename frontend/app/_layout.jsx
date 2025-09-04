import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { UserProvider, useAuth } from "../contexts/UsertContext";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { Platform } from "react-native";

// Screens
// import HomeScreen from "../screens/HomeScreen";
// import Report from "../screens/ReportsScreen";
// import CameraScreen from "../screens/CameraScreen";
// import Submit_Form_Screen from "../screens/Submit_Form_Screen";

// import Admin fro./adminmin";

import * as SecureStore from "expo-secure-store";

// ✅ Only load Leaflet on Web
if (Platform.OS === "web") {
  const L = require("leaflet");
  require("leaflet/dist/leaflet.css");

  const markerIcon2x = require("leaflet/dist/images/marker-icon-2x.png");
  const markerIcon = require("leaflet/dist/images/marker-icon.png");
  const markerShadow = require("leaflet/dist/images/marker-shadow.png");

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Custom header with logout button
function CustomHeader() {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("user_token");
    logout();
    navigation.navigate("/"); // Navigate to login screen
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
        TrashTag
      </Text>
      <TouchableOpacity onPress={handleLogout}>
        <Feather name="log-out" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const query_client = new QueryClient();

export default function RootLayout() {
  const initialRoute =
    Platform.OS === "web" ? "screens/HomeScreen" : "(auth)/login";

  return (
    <QueryClientProvider client={query_client}>
      <UserProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer>
            {/* Auth screens */}
            <Drawer.Screen
              name="(auth)/index"
              options={{
                headerShown: false,
                drawerLabel: () => null,
                drawerIcon: () => null,
                title: "",
                drawerItemStyle: { display: "none" },
                swipeEnabled: false,
              }}
            />
            <Drawer.Screen
              name="(auth)/register"
              options={{
                headerShown: false,
                drawerLabel: () => null,
                drawerIcon: () => null,
                title: "",
                drawerItemStyle: { display: "none" },
                swipeEnabled: false,
              }}
            />
            {/* App screens */}
            <Drawer.Screen
              name="screens/CameraScreen"
              options={{
                headerShown: false,
                drawerLabel: () => null,
                drawerIcon: () => null,
                title: "",
                drawerItemStyle: { display: "none" },
                swipeEnabled: false,
              }}
            />
            <Drawer.Screen
              name="screens/HomeScreen"
              options={{
                drawerLabel: "Home",
                headerTitle: () => <CustomHeader />,
                drawerIcon: ({ focused, color, size }) => (
                  <Feather name="home" size={size} color={color} />
                ),
                headerStyle: {
                  backgroundColor: "#4CAF50",
                },
                headerTintColor: "white",
              }}
            />
            <Drawer.Screen
              name="screens/ReportsScreen"
              options={{
                drawerLabel: "Reports",
                headerTitle: () => <CustomHeader />,
                drawerIcon: ({ focused, color, size }) => (
                  <Feather name="file-text" size={size} color={color} />
                ),
                headerStyle: {
                  backgroundColor: "#4CAF50",
                },
                headerTintColor: "white",
              }}
            />
            <Drawer.Screen
              name="screens/Submit_Form_Screen"
              options={{
                headerTitle: () => <CustomHeader />,
                drawerItemStyle: { display: "none" },
                headerStyle: {
                  backgroundColor: "#4CAF50",
                },
                headerTintColor: "white",
              }}
            />
            <Drawer.Screen
              name="admin/admin"
              // component={Admin}
              options={{
                headerShown: false,
                drawerLabel: () => null,
                drawerIcon: () => null,
                title: "",
                drawerItemStyle: { display: "none" },
                swipeEnabled: false,
              }}
            />
          </Drawer>
        </GestureHandlerRootView>
      </UserProvider>
    </QueryClientProvider>
  );
}
