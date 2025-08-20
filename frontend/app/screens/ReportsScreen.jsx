import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Search, ArrowLeft } from "react-native-feather";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/UsertContext";
import { useBaseUrl } from "../../utility/useBaseURL";
import { useBaseUrl_image } from "../../utility/useImageURL";
import * as SecureStore from "expo-secure-store";
import Axios from "axios";
import * as Location from "expo-location";
import BottomNavigation from "../../navigation/BottomNavigation";
import Clickable_Modal from "../../components/Clickable_Modal";

// 🔹 Status options
const STATUS_OPTIONS = ["All", "Pending", "In Progress", "Resolved"];

// 🔹 Small badge component
const StatusBadge = ({ status }) => {
  const colors = {
    Resolved: { bg: "#e6f7ee", color: "#34c759" },
    Pending: { bg: "#fff3e0", color: "#ff9800" },
    "In Progress": { bg: "#e6f0fa", color: "#007aff" },
  };
  const { bg, color } = colors[status] || { bg: "#eee", color: "#555" };
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color }]}>{status}</Text>
    </View>
  );
};

// 🔹 Report card
const ReportItem = ({ item, imageUrl, onPress, address }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
    {item.photo_url ? (
      <Image
        source={{ uri: `${imageUrl}/reports_images/${item.photo_url}` }}
        style={styles.thumbnail}
      />
    ) : (
      <View style={[styles.thumbnail, { backgroundColor: "#ddd" }]} />
    )}
    <View style={{ flex: 1 }}>
      <View style={styles.row}>
        <MapPin width={14} height={14} color="#4cd964" />
        <Text style={styles.location}>
          {address.full_address || "Loading..."}
        </Text>
        <Text style={styles.time}>{item.timestamp}</Text>
      </View>
      <Text numberOfLines={2} style={styles.desc}>
        {item.description}
      </Text>
      <StatusBadge status={item.status} />
    </View>
  </TouchableOpacity>
);

const ReportScreen = () => {
  const { user_id } = useAuth();
  const baseUrl = useBaseUrl();
  const imageUrl = useBaseUrl_image();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);

  // ✅ Fetch reports
  const fetchReports = async () => {
    const token = await SecureStore.getItemAsync("user_token");
    const response = await Axios.get(
      `${baseUrl}/report_by_user_id/${user_id.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.report;
  };

  const fetch_address = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      alert("Location permission not granted");
      return;
    }
    const addressList = await Promise.all(
      reports.map(async (report) => {
        const [address] = await Location.reverseGeocodeAsync({
          latitude: parseFloat(report.latitude),
          longitude: parseFloat(report.longitude),
        });
        return {
          id: report.id,
          full_address: `${address.street ? address.street + ", " : ""}${
            address.city ? address.city : ""
          }`,
        };
      })
    );
    // set_address_data(addressList);
    return addressList;
  };

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: fetchReports,
  });

  const { data: report_address = [], refetch: refetch_report_address } =
    useQuery({
      queryKey: ["report_address"],
      queryFn: fetch_address,
    });

  // ✅ Format timestamp
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = (now - then) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // ✅ Filter & search
  const filteredReports = reports
    .filter((r) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        r.description?.toLowerCase().includes(query) ||
        r.location?.toLowerCase().includes(query) ||
        r.status?.toLowerCase().includes(query);
      const matchesStatus =
        selectedStatus === "All" || r.status === selectedStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // ✅ If report selected → show detail, else show list
  // if (selectedReport) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <View>
  //         <TouchableOpacity onPress={() => setSelectedReport(null)}>
  //           <ArrowLeft width={22} height={22} color="#333" />
  //         </TouchableOpacity>
  //         <Text style={[styles.title, { marginLeft: 10 }]}>Report Detail</Text>
  //       </View>

  //       <ScrollView contentContainerStyle={{ padding: 16 }}>
  //         {selectedReport.photo_url && (
  //           <Image
  //             source={{
  //               uri: `${imageUrl}/reports_images/${selectedReport.photo_url}`,
  //             }}
  //             style={{
  //               width: "100%",
  //               height: 200,
  //               borderRadius: 12,
  //               marginBottom: 16,
  //             }}
  //           />
  //         )}

  //         {selectedReport.proof_photo_url && (
  //           <Image
  //             source={{
  //               uri: `${imageUrl}/resolve_images/${selectedReport.proof_photo_url}`,
  //             }}
  //             style={{
  //               width: "100%",
  //               height: 200,
  //               borderRadius: 12,
  //               marginBottom: 16,
  //             }}
  //           />
  //         )}
  //         <Text style={styles.detailLabel}>Description</Text>
  //         <Text style={styles.detailValue}>{selectedReport.description}</Text>

  //         <Text style={styles.detailLabel}>Status</Text>
  //         <StatusBadge status={selectedReport.status} />

  //         <Text style={styles.detailLabel}>Location</Text>
  //         <Text style={styles.detailValue}>{selectedReport.location}</Text>

  //         <Text style={styles.detailLabel}>Reported</Text>
  //         <Text style={styles.detailValue}>
  //           {getTimeAgo(selectedReport.created_at)}
  //         </Text>
  //       </ScrollView>
  //     </SafeAreaView>
  //   );
  // }

  // const [selectedReport, setSelectedReport] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  // ✅ Default list view
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Reports</Text>
        <View style={styles.searchBar}>
          <Search width={18} height={18} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Status Filter */}
      <View style={styles.filterRow}>
        {STATUS_OPTIONS.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterChip,
              selectedStatus === status && styles.filterChipActive,
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text
              style={[
                styles.filterText,
                selectedStatus === status && styles.filterTextActive,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#4CAF50"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={filteredReports.map((item) => ({
            ...item,
            timestamp: getTimeAgo(item.created_at),
          }))}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 12 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => {
            // kung may bracket dapat may return kung () wala na return means direct nana sya gali ga return
            const address = report_address?.find((addr) => addr.id === item.id);
            return (
              <ReportItem
                item={item}
                address={report_address?.find((addr) => addr.id === item.id)}
                imageUrl={imageUrl}
                onPress={setSelectedReport}
              />
            );
          }}
        />
      )}

      {/* ✅ Reusable modal */}
      <Clickable_Modal
        visible={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
        renderStatusBadge={(status) => <StatusBadge status={status} />}
        getTimeAgo={getTimeAgo}
        forimage={imageUrl}
      />

      <BottomNavigation />
    </SafeAreaView>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  header: {
    flexDirection: "column",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchInput: { flex: 1, padding: 8, fontSize: 14 },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 10,
    // flexWrap: "wrap",
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
    // marginBottom: 6,
  },
  filterChipActive: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  filterText: { fontSize: 13, color: "#555" },
  filterTextActive: { color: "#fff" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  thumbnail: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  location: { flex: 1, fontSize: 13, color: "#444", marginLeft: 4 },
  time: { fontSize: 11, color: "#888" },
  desc: { fontSize: 14, color: "#333", marginBottom: 6 },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 12, fontWeight: "500" },
  detailLabel: { fontSize: 14, fontWeight: "600", marginTop: 12 },
  detailValue: { fontSize: 14, color: "#333", marginBottom: 8 },
});
