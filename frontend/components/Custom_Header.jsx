import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "../contexts/UsertContext";

const CustomHeader = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();

  const handleConfirmLogout = () => {
    Alert.alert(
      "Log Out?",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            logout();
            navigation.navigate("login");
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
    // logout();
    // navigation.navigate("login");
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
        TrashTag
      </Text>
      <TouchableOpacity
        onPress={handleConfirmLogout}
        style={{ marginLeft: "55%" }}
      >
        <Feather name="log-out" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default CustomHeader;
