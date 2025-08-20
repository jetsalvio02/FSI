import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BottomNavigation from "../../navigation/BottomNavigation";
import * as SecureStore from "expo-secure-store";
import Axios from "axios";
import Constants from "expo-constants";
import { useBaseUrl } from "../../utility/useBaseURL";
import jwtDecode from "jwt-decode";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "../../contexts/UsertContext";
import { useBaseUrl_image } from "../../utility/useImageURL";
import { useQuery } from "@tanstack/react-query";
import Clickable_Modal from "../../components/Clickable_Modal";

const HomeScreen = () => {
  // const { logout } = useAuth();
  const baseUrl = useBaseUrl();
  const forimage = useBaseUrl_image();
  // const params = useLocalSearchParams();
  // const user_id = params.id;
  // console.log(user_id);
  const { user_id } = useAuth();

  // React.useEffect(() => {
  //   if (user_id) {
  //     console.log(user_id.id);
  //   }
  // }, [user_id]);

  // console.log(user_id.id);

  // console.log(user_id);

  const [profile, setProfile] = React.useState(null);
  // const [user_data, set_user_data] = React.useState([]);
  // const [report_address, set_address_data] = React.useState([]);

  const fetch_user = async () => {
    try {
      const token = await SecureStore.getItemAsync("user_token");
      const response = await Axios.get(`${baseUrl}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data.user);
      await Location.requestForegroundPermissionsAsync();

      if (!user_id?.id) return;

      // Data of user
      const userData = await Axios.get(
        `${baseUrl}/report_by_user_id/${user_id.id}`
      );
      const fetched_user = userData.data.report;
      // console.log(userData.data);
      // set_user_data(fetched_user);
      return fetched_user;
      // console.log(fetched_user);
    } catch (error) {
      // console.log("Error during fetching user", error);
      throw error;
    }
  };

  const fetch_address = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      alert("Location permission not granted");
      return;
    }
    const addressList = await Promise.all(
      user_data.map(async (report) => {
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
  // console.log(report_address);

  const {
    data: user_data,
    refetch: user,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetch_user,
  });

  const {
    data: report_address,
    refetch: refetch_report_address,
    isLoading: isAddressLoading,
  } = useQuery({
    queryKey: ["report_address"],
    queryFn: fetch_address,
    // enabled: user_data,
  });

  React.useEffect(() => {
    // fetch_user();
    // fetch_address();
    user();
    refetch_report_address();
  });

  // React.useEffect(() => {
  //   fetch_user();
  //   fetch_address();
  // });

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffHours > 0)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  // Function to render the appropriate badge based on status
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Resolved":
        return (
          <View style={styles.resolvedBadge}>
            <MaterialIcons name="check-circle" size={14} color="#00a86b" />
            <Text style={styles.resolvedText}>Resolved</Text>
          </View>
        );
      case "Pending":
        return (
          <View style={styles.inProgressBadge}>
            <MaterialIcons name="schedule" size={14} color="#ff9800" />
            <Text style={styles.inProgressText}>Pending</Text>
          </View>
        );
      case "In Progress":
        return (
          <View style={styles.pendingBadge}>
            <MaterialIcons name="autorenew" size={14} color="#2196f3" />
            <Text style={styles.pendingText}>In Progress</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const [selectedReport, setSelectedReport] = React.useState(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  const openModal = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setModalVisible(false);
  };

  return (
    // {}
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header} />

      {/* Welcome Banner */}
      <View style={styles.welcomeBanner}>
        <Text style={styles.welcomeTitle}>
          Welcome {profile?.email} {/*to CleanTrack*/}
        </Text>
        <Text style={styles.welcomeSubtitle}>
          Help keep our community clean by reporting waste issues you find.
        </Text>
      </View>

      {/* Recent Reports Section */}
      <Text style={styles.sectionTitle}>Recent Reports</Text>
      <View style={styles.divider} />

      {isUserLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <ActivityIndicator size="large" color="#00a86b" />
          <Text style={{ marginTop: 10 }}>Loading reports...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          <View style={styles.reportsSection}>
            {/* Report Items */}
            {/* {reports.map((report) => (
            <View key={report.id} style={styles.reportItem}>
              <View style={styles.reportImageContainer}>
                <View style={styles.reportImage} />
              </View>

              <View style={styles.reportContent}>
                <View style={styles.locationContainer}>
                  <MaterialIcons name="location-on" size={16} color="#00a86b" />
                  <Text style={styles.locationText}>{report.location}</Text>
                  <Text style={styles.timeAgo}>{report.timeAgo}</Text>
                </View>

                <Text style={styles.reportDescription}>
                  {report.description}
                </Text>

                {renderStatusBadge(report.status)}
              </View>
            </View>
          ))} */}
            {[...(user_data ?? [])].reverse().map((report) => {
              const address = report_address?.find(
                (addr) => addr.id === report.id
              );
              return (
                <TouchableOpacity
                  key={report.id}
                  // style={styles.reportItem}
                  onPress={() =>
                    openModal({
                      ...report,
                      address: address ? address.full_address : "Loading...",
                    })
                  }
                >
                  <View style={styles.reportItem}>
                    <View style={styles.reportImageContainer}>
                      {/* <View style={styles.reportImage} /> */}
                      <Image
                        source={{
                          uri: `${forimage}/reports_images/${report.photo_url}`,
                        }}
                        style={styles.reportImage}
                        onError={(e) => {
                          console.log("Image load error:", e.nativeEvent.error);
                        }}
                      />
                    </View>

                    <View style={styles.reportContent}>
                      <View style={styles.locationContainer}>
                        <MaterialIcons
                          name="location-on"
                          size={16}
                          color="#00a86b"
                        />
                        <Text style={styles.locationText}>
                          {address
                            ? address.full_address
                            : "Loading Location..."}
                        </Text>
                      </View>
                      <Text style={styles.reportDescription}>
                        {report.description}
                      </Text>
                      <Text style={styles.timeAgo}>
                        {getTimeAgo(report.created_at)}
                      </Text>
                      {renderStatusBadge(report.status)}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* <View style={{ position: "absolute" }}> */}
      <BottomNavigation />
      {/* </View> */}

      <Clickable_Modal
        visible={modalVisible}
        onClose={closeModal}
        report={selectedReport}
        renderStatusBadge={renderStatusBadge}
        getTimeAgo={getTimeAgo}
        forimage={forimage}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 40,
    backgroundColor: "#fff",
  },
  header: {
    height: 20,
    // backgroundColor: "#00a86b",
  },
  scrollView: {
    // flex: 1,
  },
  welcomeBanner: {
    backgroundColor: "#e8f5e9",
    padding: 16,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c8e6c9",
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#388e3c",
  },
  reportsSection: {
    padding: 8,
  },
  sectionTitle: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  reportItem: {
    flexDirection: "row",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    paddingBottom: 16,
  },
  reportImageContainer: {
    marginRight: 12,
  },
  reportImage: {
    width: 60,
    height: 60,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  reportContent: {
    flex: 1,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#00a86b",
    marginLeft: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: "#9e9e9e",
    marginLeft: "auto",
  },
  reportDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  // Existing resolved badge
  resolvedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  resolvedText: {
    fontSize: 12,
    color: "#00a86b",
    marginLeft: 4,
  },
  // New in progress badge
  inProgressBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  inProgressText: {
    fontSize: 12,
    color: "#ff9800",
    marginLeft: 4,
  },
  // New pending badge
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  pendingText: {
    fontSize: 12,
    color: "#2196f3",
    marginLeft: 4,
  },
  reportImage: {
    width: 60,
    height: 60,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
});
