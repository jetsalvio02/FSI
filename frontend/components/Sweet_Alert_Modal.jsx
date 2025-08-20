// SweetAlertModal.js
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import { FontAwesome5 } from "@expo/vector-icons";

export default function SweetAlertModal({
  visible,
  type = "success",
  title,
  message,
  confirmText = "OK",
  cancelText,
  onConfirm,
  onCancel,
}) {
  const iconMap = {
    success: ["check-circle", "#2ecc71"],
    warning: ["exclamation-circle", "#f39c12"],
    error: ["times-circle", "#e74c3c"],
    info: ["info-circle", "#3498db"],
  };
  const [iconName, iconColor] = iconMap[type] || iconMap.info;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animatable.View animation="zoomIn" style={styles.container}>
          <FontAwesome5 name={iconName} size={50} color={iconColor} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            {cancelText && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}
              >
                <Text style={styles.buttonText}>{cancelText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    width: "80%",
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
    color: "#555",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 15,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: "#2ecc71",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
