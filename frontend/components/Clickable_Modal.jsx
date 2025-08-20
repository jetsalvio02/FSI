import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from "react-native";

export default function Clickable_Modal({
  visible,
  onClose,
  report,
  renderStatusBadge,
  getTimeAgo,
  forimage,
}) {
  if (!report) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={{ alignItems: "center" }}>
            <Text style={styles.modalTitle}>Report Details</Text>

            {/* Original Report Photo */}
            <Text style={styles.photoLabel}>Reported Photo</Text>
            <Image
              source={{
                uri: `${forimage}/reports_images/${report.photo_url}`,
              }}
              style={styles.modalImage}
            />

            {/* Proof Photo (if available) */}
            {report.proof_photo_url ? (
              <>
                <Text style={styles.photoLabel}>Proof Photo</Text>
                <Image
                  source={{
                    uri: `${forimage}/reports_proofs/${report.proof_photo_url}`,
                  }}
                  style={styles.modalImage}
                />
              </>
            ) : (
              <Text style={styles.noProofText}>
                No proof photo uploaded yet.
              </Text>
            )}

            {/* Details */}
            <Text style={styles.modalText}>
              <Text style={styles.label}>Location: </Text>
              {report.address}
            </Text>

            <Text style={styles.modalText}>
              <Text style={styles.label}>Description: </Text>
              {report.description}
            </Text>

            <Text style={styles.modalText}>
              <Text style={styles.label}>Reported: </Text>
              {getTimeAgo(report.created_at)}
            </Text>

            {renderStatusBadge(report.status)}

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  noProofText: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#757575",
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  modalText: {
    fontSize: 14,
    marginVertical: 4,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  label: {
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#00a86b",
    borderRadius: 6,
    alignSelf: "center",
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
