import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
  RefreshControl,
  Image,
  ActivityIndicator,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  Linking,
  Platform,
} from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";
// import MapView, { Marker, PROVIDER_GOOGLE, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import { useBaseUrl } from "../../utility/useBaseURL";
import { useBaseUrl_image } from "../../utility/useImageURL";
import Axios from "axios";
import { Feather } from "@expo/vector-icons";
import pLimit from "p-limit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as mime from "react-native-mime-types";
import { useQuery } from "@tanstack/react-query";
import Maps_Dynamic from "../../components/Maps_Dynamic";
// import { Platform } from "react-native";

const screenWidth = Dimensions.get("window").width;

const Admin = () => {
  const [modal_visbile, set_modal_visible] = useState(false);
  const [selected_image, set_selected_image] = useState(null);

  const navigation = useNavigation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [location, set_location] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Pending");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [displayedReports, setDisplayedReports] = useState([]);

  const baseUrl = useBaseUrl();
  const imageUrl = useBaseUrl_image(); // for image render
  // const [reports, set_reports] = useState([]);
  // const [report_address, set_address_data] = React.useState([]);
  const [reportsloading, setReportsLoading] = useState(true); // ✅ loading state

  // const [users_stats, set_users_stats] = useState([]);

  // const {data: displayedReports , refetch:refetch_displayedReports } = useQuery({queryKey:[""],queryFn:});

  // const fetch_all_reports = useCallback(async () => {
  //   try {
  //     const response = await Axios.get(`${baseUrl}/get_all_reports`);
  //     // console.log(response.data.reports);
  //     set_reports(response.data.reports);

  //     // const addressList = await Promise.all(
  //     //   response.data.reports.map(async (report) => {
  //     //     // const cacheKey = `geocode_${report.id}`;

  //     //     // const cacheAddress = await AsyncStorage.getItem(cacheKey);
  //     //     // if (cacheAddress) {
  //     //     //   return JSON.parse(cacheAddress);
  //     //     // }

  //     //     const [address] = await Location.reverseGeocodeAsync({
  //     //       latitude: parseFloat(report.latitude),
  //     //       longitude: parseFloat(report.longitude),
  //     //     });

  //     //     return {
  //     //       id: report.id,
  //     //       full_address: `${address.street ? address.street + ", " : ""}${
  //     //         address.city
  //     //       }`,
  //     //     };

  //     // Cache the result
  //     // await AsyncStorage.setItem(cacheKey, JSON.stringify(full_address));

  //     // return full_address;
  //     // })
  //     // );
  //     // console.log(addressList);
  //     set_address_data(addressList);

  //     const usersData = await Axios.get(`${baseUrl}/get_users_stats`);
  //     set_users_stats(usersData.data.users_stats);

  //     // console.log(usersData.data.users_stats);
  //   } catch (error) {
  //     // console.log("Error in fetch all reports ", error);
  //     throw error;
  //   } finally {
  //     setReportsLoading(false);
  //   }
  // });
  const generateRandomName = () => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `photo_${timestamp}`;
  };

  const handle_resolve_report = async (report_id, new_status) => {
    try {
      // Permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Camera access is required to take a proof photo.");
        return;
      }

      //  Open camera
      let result = await ImagePicker.launchCameraAsync({
        // allowsEditing: true,
      });
      if (result.canceled) return;

      const file_uri = result.assets[0].uri;
      const file_extension = file_uri.split(".").pop().toLowerCase();
      const file_type = mime.lookup(file_uri) || `image/${file_extension}`;

      const form_data = new FormData();
      form_data.append("new_status", new_status);
      form_data.append("proof_photo_url", {
        uri: result.assets[0].uri,
        type: file_type,
        name: `${generateRandomName()}.${file_extension}`,
      });

      Alert.alert(
        "Update Report Status",
        `Are you sure you want to mark this report as "${new_status}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Update",
            onPress: async () => {
              await Axios.put(
                `${baseUrl}/reports/resolved/${report_id}`,
                form_data,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Accept: "application/json",
                  },
                }
              );
            },
          },
        ],
        {
          cancelable: true,
        }
      );
      // Alert.alert("Success", "Report updated successfully!");
    } catch (error) {
      console.error("Error updating report with proof photo", error);
    }
  };

  const fetch_all_reports = async () => {
    try {
      const response = await Axios.get(`${baseUrl}/get_all_reports`);
      // const fetched_reports = response.data.reports;
      const fetched_reports = response.data?.reports ?? [];
      // console.log(fetched_reports);
      // set_reports(fetched_reports);
      return fetched_reports;
    } catch (error) {
      throw error;
    } finally {
      setReportsLoading(false);
    }
  };

  // const user_data_stats = async () => {
  //   const usersData = await Axios.get(`${baseUrl}/get_users_stats`);
  //   // set_users_stats(usersData.data.users_stats);
  //   return usersData.data.users_stats;
  // };

  const user_data_stats = async () => {
    const usersData = await Axios.get(`${baseUrl}/get_users_stats`);
    return usersData.data?.users_stats ?? []; // ✅ never undefined
  };

  // const fetch_report_address = async (reports) => {
  //   if (Platform.OS === "web") {
  //     // fallback: use Nominatim API
  //     const addressList = await Promise.all(
  //       reports.map(async (report) => {
  //         try {
  //           const res = await fetch(
  //             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${report.latitude}&lon=${report.longitude}`
  //           );
  //           const data = await res.json();
  //           console.log(data);
  //           return {
  //             id: report.id,
  //             full_address: data.display_name || "Unknown Location",
  //           };
  //         } catch (e) {
  //           return { id: report.id, full_address: "Unknown Location" };
  //         }
  //       })
  //     );
  //     return addressList;
  //   } else {
  //     // native mobile: use expo-location
  //     const addressList = await Promise.all(
  //       reports.map(async (report) => {
  //         const [address] = await Location.reverseGeocodeAsync({
  //           latitude: parseFloat(report.latitude),
  //           longitude: parseFloat(report.longitude),
  //         });
  //         return {
  //           id: report.id,
  //           full_address: `${address.street ? address.street + ", " : ""}${
  //             address.city || ""
  //           }`,
  //         };
  //       })
  //     );
  //     return addressList;
  //   }
  // };

  const fetch_report_address = async (reports) => {
    if (Platform.OS === "web") {
      // 🌐 Web: use Nominatim API
      const addressList = await Promise.all(
        reports.map(async (report) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${report.latitude}&lon=${report.longitude}&addressdetails=1`
            );
            const data = await res.json();
            const addr = data.address || {};

            const full_address = [
              addr.road, // street
              addr.quarter, // barangay equivalent
              addr.city, // city
            ]
              .filter(Boolean) // remove undefined
              .join(", ");

            return {
              id: report?.id,
              full_address: full_address,
            };
          } catch (e) {
            return {
              id: report.id,
              full_address: `Lat: ${report.latitude}, Lng: ${report.longitude}`,
            };
          }
        })
      );
      return addressList;
    } else {
      // 📱 Native: use expo-location
      const addressList = await Promise.all(
        reports.map(async (report) => {
          const [address] = await Location.reverseGeocodeAsync({
            latitude: parseFloat(report.latitude),
            longitude: parseFloat(report.longitude),
          });

          const full_address = [
            address.street,
            address.district, // often used as barangay in PH
            address.city,
          ]
            .filter(Boolean)
            .join(", ");

          return {
            id: report.id,
            full_address: full_address,
          };
        })
      );
      return addressList;
    }
  };

  // const [addresses, setAddresses] = useState({});

  // const getAddress = async (report) => {
  //   if (addresses[report.id]) return addresses[report.id];
  //   const [address] = await Location.reverseGeocodeAsync({
  //     latitude: parseFloat(report.latitude),
  //     longitude: parseFloat(report.longitude),
  //   });
  //   const full_address = `${address.street ? address.street + ", " : ""}${
  //     address.city || ""
  //   }`;
  //   setAddresses((prev) => ({ ...prev, [report.id]: full_address }));
  //   return full_address;
  // };

  const { data: reports = [], refetch: refetch_reports } = useQuery({
    queryKey: ["report"],
    queryFn: fetch_all_reports,
  });

  const { data: report_address = [], refetch: refetch_report_address } =
    useQuery({
      queryKey: ["report_address", reports],
      queryFn: () => fetch_report_address(reports),
      enabled: reports?.length > 0,
    });

  // console.log(report_address);

  const { data: users_stats, refetch: refetch_users_stats } = useQuery({
    queryKey: ["user_stat"],
    queryFn: user_data_stats,
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission denied",
          "Allow location access to use this feature"
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      set_location(loc.coords);
      // await fetch_all_reports();
      // await fetch_location();
      refetch_reports();
      refetch_report_address();
      refetch_users_stats();
    })();
    // fetch_all_reports();
    // fetch_location();
  });

  // useEffect(() => {
  //   if (!addresses[reports.id]) {
  //     getAddress(reports);
  //   }
  // }, [reports]);

  // Initialize displayed reports
  // useEffect(() => {
  //   // const allReports = [...reports];
  //   // set_reports(allReports);

  //   // Set initial displayed reports THIS IS FILLTERING
  //   const filteredReports = reports.filter(
  //     (report) => report.status === activeFilter
  //   );
  //   setDisplayedReports(filteredReports.slice(0, 10));
  //   setPage(2);
  // }, []);

  // // Load more reports function
  // // const loadMoreReports = useCallback(() => {
  // //   if (loading) return;

  // //   setLoading(true);

  // //   setTimeout(() => {
  // //     const filteredReports = reports.filter(
  // //       (report) => report.status === activeFilter
  // //     );
  // //     const startIndex = (page - 1) * 10;
  // //     const endIndex = page * 10;
  // //     const newReports = filteredReports.slice(startIndex, endIndex);

  // //     if (newReports.length > 0) {
  // //       setDisplayedReports((prev) => [...prev, ...newReports]);
  // //       setPage((prev) => prev + 1);
  // //     }

  // //     setLoading(false);
  // //   }, 500);
  // // }, [reports, activeFilter, page, loading]);

  // // Reset pagination when filter changes
  // useEffect(() => {
  //   const filteredReports = reports.filter(
  //     (report) => report.status === activeFilter
  //   );
  //   setDisplayedReports(filteredReports.slice(0, 10));
  //   setPage(2);
  // }, [activeFilter, reports]);

  // Handle scroll to load more
  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const paddingToBottom = 20;

    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      loadMoreReports();
    }
  };

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      const filteredReports = reports.filter(
        (report) => report.status === activeFilter
      );
      setDisplayedReports(filteredReports.slice(0, 10));
      setPage(2);
      setRefreshing(false);
    }, 1000);
  }, [reports, activeFilter]);

  // Function to update report status
  const updateReportStatus = async (reportId, newStatus) => {
    // setReports((prevReports) =>
    //   prevReports.map((report) =>
    //     report.id === reportId ? { ...report, status: newStatus } : report
    //   )
    // );
    // setDisplayedReports((prevDisplayed) =>
    //   prevDisplayed.map((report) =>
    //     report.id === reportId ? { ...report, status: newStatus } : report
    //   )
    // );
    Alert.alert(
      "Update Report Status",
      `Are you sure you want to mark this report as "${newStatus}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          onPress: async () => {
            await Axios.put(`${baseUrl}/update_status_report/${reportId}`, {
              newStatus,
            });
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  // Calculate the monthy users
  const getMonthlyUserChange = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter reports from current month
    const currentMonthReports = reports.filter((r) => {
      const date = new Date(r.created_at);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });

    // Get unique user IDs from current month
    const currentUserIds = new Set(currentMonthReports.map((r) => r.user_id));
    const currentUserCount = currentUserIds.size;

    // Optionally, calculate last month users
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const lastMonthReports = reports.filter((r) => {
      const date = new Date(r.created_at);
      return (
        date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
      );
    });

    const lastUserIds = new Set(lastMonthReports.map((r) => r.user_id));
    const lastUserCount = lastUserIds.size;

    // Calculate change
    const change = currentUserCount - lastUserCount;

    return (change >= 0 ? "+" : "") + change + " this month";
  };

  // Function to delete a report
  const deleteReport = (reportId) => {
    Alert.alert(
      "Delete Report",
      "Are you sure you want to delete this report?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            // setReports((prevReports) =>
            //   prevReports.filter((report) => report.id !== reportId)
            // );
            // setDisplayedReports((prevDisplayed) =>
            //   prevDisplayed.filter((report) => report.id !== reportId)
            // );
            Axios.delete(`${baseUrl}/delete_report/${reportId}`);
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

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

  // User Growth
  const generateMonthlyUserData = (reports) => {
    const monthlyUsers = Array(12)
      .fill(0)
      .map(() => new Set()); // Set to track unique users per month

    reports.forEach((report) => {
      const date = new Date(report.created_at);
      const month = date.getMonth(); // 0 = Jan, 11 = Dec
      monthlyUsers[month].add(report.user_id);
    });

    const data = monthlyUsers.map((set) => set.size); // get size of each Set
    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return {
      labels,
      data,
    };
  };

  const { labels, data } = generateMonthlyUserData(reports);

  // Mock data for charts
  const pieChartData = [
    {
      name: "Resolved",
      population: reports.filter((r) => r.status === "Resolved").length,
      color: "#4CAF50",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "In Progress",
      population: reports.filter((r) => r.status === "In Progress").length,
      color: "royalblue",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Pending",
      population: reports.filter((r) => r.status === "Pending").length,
      color: "#FF5252",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const bar_chart = {
    labels: ["Pending", "In Progress", "Resolved"],
    datasets: [
      {
        data: [
          reports.filter((r) => r.status === "Pending").length,
          reports.filter((r) => r.status === "In Progress").length,
          reports.filter((r) => r.status === "Resolved").length,
        ],

        colors: [
          (opacity = 1) => `rgba(255, 82, 82, ${opacity})`, // Red for Pending
          (opacity = 1) => `rgba(65, 105, 225, ${opacity})`, // Royal Blue for In Progress
          (opacity = 1) => `rgba(76, 175, 80, ${opacity})`, // Green for Resolved,
        ],
      },
    ],
  };

  // Completion Rate Calculate
  const totalReports = reports.length;
  const completedReports = reports.filter(
    (r) => r.status === "Resolved"
  ).length;
  const completionrRate =
    totalReports > 0 ? Math.round((completedReports / totalReports) * 100) : 0;

  const [selected_report, set_selected_report] = useState(null);

  // Helper to pick a badge color based on status text
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#f39c12"; // orange
      case "in progress":
        return "#2980b9"; // blue
      case "resolved":
      case "completed":
        return "#27ae60"; // green
    }
  };

  // Icons Feathers
  const getStatusIconName = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "clock"; // Feather’s clock icon
      case "in progress":
        return "refresh-cw"; // rotating arrow
      case "resolved":
      case "completed":
        return "check-circle"; // check inside a circle
      case "rejected":
      case "cancelled":
        return "x-circle"; // X inside a circle
      default:
        return "info"; // generic info icon
    }
  };

  //  Open Directions
  // const openDirections = () => {
  //   if (!selected_report) return;
  //   const lat = selected_report.latitude;
  //   const lng = selected_report.longitude;

  //   if (Platform.OS === "android") {
  //     // Launch native Google Maps in navigation mode
  //     const googleNavUri = `google.navigation:q=${lat},${lng}`;
  //     Linking.openURL(googleNavUri).catch((err) => {
  //       console.warn("Could not open Google Maps on Android:", err);
  //     });
  //   } else {
  //     // iOS: try Google Maps first
  //     const googleMapsURL = `comgooglemaps://?daddr=${lat},${lng}&x-success=myapp://return`;
  //     const appleMapsURL = `maps://?daddr=${lat},${lng}&x-success=myapp://return`;

  //     Linking.canOpenURL("comgooglemaps://")
  //       .then((isInstalled) => {
  //         if (isInstalled) {
  //           return Linking.openURL(googleMapsURL);
  //         } else {
  //           return Linking.openURL(appleMapsURL);
  //         }
  //       })
  //       .catch((err) => {
  //         console.warn("Error opening iOS maps URL:", err);
  //       });
  //   }
  // };

  //  Open Directions
  const openDirections = () => {
    if (!selected_report) return;
    const { latitude, longitude } = selected_report;
    // Format as “lat,lng”
    // const dest = `${latitude},${longitude}`;
    // Google Maps URI scheme; will fall back to web if maps app is unavailable
    // const url = `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
    if (Platform.OS === "android") {
      // Launch native Google Maps in navigation mode
      const googleNavUri = `google.navigation:q=${latitude},${longitude}`;
      Linking.openURL(googleNavUri).catch((err) => {
        console.warn("Could not open Google Maps on Android:", err);
      });
    } else {
      // iOS: try Google Maps first
      const googleMapsURL = `comgooglemaps://?daddr=${lat},${lng}&x-success=myapp://return`;
      const appleMapsURL = `maps://?daddr=${lat},${lng}&x-success=myapp://return`;

      Linking.canOpenURL("comgooglemaps://")
        .then((isInstalled) => {
          if (isInstalled) {
            return Linking.openURL(googleMapsURL);
          } else {
            return Linking.openURL(appleMapsURL);
          }
        })
        .catch((err) => {
          console.warn("Error opening iOS maps URL:", err);
        });
    }
    // Linking.openURL(url).catch((error) => {
    //   console.warn("Failed to open maps: ", error);
    // });
  };

  // useEffect(() => {
  //   const listener = ({ url }) => {
  //     if (url.startWith("myapp://return")) {
  //       set_selected_report(null);
  //     }
  //     Linking.addEventListener("url", listener);
  //   };
  //   return Linking.removeAllListeners("url", listener);
  // }, []);

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <View style={styles.tabContent}>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {reports.filter((r) => r.status === "Pending").length ||
                    reports.filter((r) => r.status === "In Progress").length}
                </Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {reports.filter((r) => r.status === "In Progress").length}
                </Text>
                <Text style={styles.statLabel}>In Progress</Text>
                {/* <Text style={styles.statNumber}>
                  {reports.length > 0 ? reports[0].total_users : 0}
                </Text>
                <Text style={styles.statLabel}>Users</Text> */}
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{completionrRate}%</Text>
                <Text style={styles.statLabel}>Completion Rate</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {reports.filter((r) => r.status === "Resolved").length}
                </Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
            </View>

            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Task Status</Text>
              <PieChart
                data={pieChartData}
                width={screenWidth - 50}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[2, 0]}
                absolute
                style={styles.chart}
              />
            </View>

            <View style={styles.chartContainer}>
              <BarChart
                chartConfig={{
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // label color
                }}
                width={screenWidth - 50}
                data={bar_chart}
                height={220}
                paddingLeft={"15"}
                center={[2, 0]}
                // withHorizontalLabels={false}
                absolute
                style={styles.chart}
                flatColor={true}
                withCustomBarColorFromData={true}
                fromZero={true}
              />
            </View>
          </View>
        );
      case "tasks":
        return (
          <View style={styles.tabContent}>
            <View style={styles.reportsContainer}>
              {/* Header with title and stats */}
              <View style={styles.reportsHeader}>
                <Text style={styles.reportsTitle}>Reports Management</Text>
                <View style={styles.quickStats}>
                  <View style={styles.quickStatItem}>
                    <Text style={styles.quickStatNumber}>
                      {reports.filter((r) => r.status === "Pending").length}
                    </Text>
                    <Text style={styles.quickStatLabel}>Pending</Text>
                  </View>
                  <View style={styles.quickStatItem}>
                    <Text style={styles.quickStatNumber}>
                      {reports.filter((r) => r.status === "In Progress").length}
                    </Text>
                    <Text style={styles.quickStatLabel}>In Progress</Text>
                  </View>
                  <View style={styles.quickStatItem}>
                    <Text style={styles.quickStatNumber}>
                      {reports.filter((r) => r.status === "Resolved").length}
                    </Text>
                    <Text style={styles.quickStatLabel}>Resolved</Text>
                  </View>
                </View>
              </View>

              {/* Enhanced Filter Buttons */}
              <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.filterButtons}>
                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        activeFilter === "Pending" && styles.activeFilterButton,
                      ]}
                      onPress={() => setActiveFilter("Pending")}
                    >
                      <View style={styles.filterButtonContent}>
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color={
                            activeFilter === "Pending" ? "white" : "#FF9800"
                          }
                        />
                        <Text
                          style={[
                            styles.filterButtonText,
                            activeFilter === "Pending" &&
                              styles.activeFilterButtonText,
                          ]}
                        >
                          Pending (
                          {reports.filter((r) => r.status === "Pending").length}
                          )
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        activeFilter === "In Progress" &&
                          styles.activeFilterButton,
                      ]}
                      onPress={() => setActiveFilter("In Progress")}
                    >
                      <View style={styles.filterButtonContent}>
                        <Ionicons
                          name="play-circle-outline"
                          size={16}
                          color={
                            activeFilter === "In Progress" ? "white" : "#2196F3"
                          }
                        />
                        <Text
                          style={[
                            styles.filterButtonText,
                            activeFilter === "In Progress" &&
                              styles.activeFilterButtonText,
                          ]}
                        >
                          In Progress (
                          {
                            reports.filter((r) => r.status === "In Progress")
                              .length
                          }
                          )
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        activeFilter === "Resolved" &&
                          styles.activeFilterButton,
                      ]}
                      onPress={() => setActiveFilter("Resolved")}
                    >
                      <View style={styles.filterButtonContent}>
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={16}
                          color={
                            activeFilter === "Resolved" ? "white" : "#4CAF50"
                          }
                        />
                        <Text
                          style={[
                            styles.filterButtonText,
                            activeFilter === "Resolved" &&
                              styles.activeFilterButtonText,
                          ]}
                        >
                          Resolved (
                          {
                            reports.filter((r) => r.status === "Resolved")
                              .length
                          }
                          )
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>

              {/* Infinite Scroll Reports List */}
              <ScrollView
                style={styles.reportsList}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={400}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                {reportsloading ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ActivityIndicator size="large" color="#2E7D32" />
                    <Text>Loading reports...</Text>
                  </View>
                ) : (
                  reports
                    .filter((report) => report.status === activeFilter)
                    .map((report) => {
                      // const address_lookup = Object.fromEntries(
                      //   report_address.map((addr) => [
                      //     addr.id,
                      //     addr.full_address,
                      //   ])
                      // );

                      // const address = address_lookup[report.id] || null;

                      const address = report_address?.find(
                        (addr) => addr.id === report.id
                      );

                      // if (reportsloading) {
                      //   return (

                      //   );
                      // }
                      return (
                        <View key={report.id} style={styles.reportCard}>
                          <View style={styles.reportCardContent}>
                            {/* Main Content Row */}
                            <View style={styles.reportMainRow}>
                              {/* Category Icon */}
                              <View style={styles.reportImageContainer}>
                                <View style={styles.reportImage}>
                                  {/* <Ionicons
                              name={getCategoryIcon(report.category)}
                              size={24}
                              color="#2E7D32"
                            /> */}

                                  <Pressable
                                    onPress={() => {
                                      set_selected_image(
                                        `${imageUrl}/reports_images/${report.photo_url}`
                                      );
                                      set_modal_visible(true);
                                    }}
                                  >
                                    <Image
                                      source={{
                                        uri: `${imageUrl}/reports_images/${report.photo_url}`,
                                      }}
                                      style={styles.reportImage}
                                    />
                                  </Pressable>
                                </View>
                              </View>

                              {/* Content Area */}
                              <View style={styles.reportContentArea}>
                                {/* Location as Main Title */}
                                <View style={styles.reportCardHeader}>
                                  <View style={styles.reportHeaderInfo}>
                                    <View style={styles.locationRow}>
                                      <Ionicons
                                        name="location-outline"
                                        size={16}
                                        color="#2E7D32"
                                      />
                                      <Text style={styles.reportLocation}>
                                        {address ? (
                                          address?.full_address
                                        ) : (
                                          <ActivityIndicator
                                            size="small"
                                            color="#2E7D32"
                                          />
                                        )}
                                      </Text>
                                    </View>
                                  </View>

                                  <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => deleteReport(report.id)}
                                  >
                                    <Ionicons
                                      name="trash-outline"
                                      size={18}
                                      color="#FF5252"
                                    />
                                  </TouchableOpacity>
                                </View>

                                {/* Description */}
                                <View style={styles.descriptionContainer}>
                                  <View style={styles.descriptionRow}>
                                    <Ionicons
                                      name="document-text-outline"
                                      size={14}
                                      color="#666"
                                    />
                                    <Text style={styles.descriptionText}>
                                      {report.description}
                                    </Text>
                                  </View>
                                </View>

                                {/* Meta Information */}
                                <View style={styles.metaRow}>
                                  <View style={styles.metaItem}>
                                    <Ionicons
                                      name="person-outline"
                                      size={12}
                                      color="#666"
                                    />
                                    <Text style={styles.metaText}>
                                      {report.email}
                                    </Text>
                                  </View>
                                  <View style={styles.metaItem}>
                                    <Ionicons
                                      name="calendar-outline"
                                      size={12}
                                      color="#666"
                                    />
                                    <Text style={styles.metaText}>
                                      {`${report.created_at.substring(
                                        0,
                                        10
                                      )} ${getTimeAgo(report.created_at)}`}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>

                            {/* Status Actions */}
                            <View style={styles.statusActions}>
                              <TouchableOpacity
                                style={[
                                  styles.statusActionButton,
                                  styles.pendingActionButton,
                                  report.status === "Pending" &&
                                    styles.activeStatusAction,
                                ]}
                                onPress={() =>
                                  updateReportStatus(report.id, "Pending")
                                }
                              >
                                <Ionicons
                                  name="time-outline"
                                  size={14}
                                  color={
                                    report.status === "Pending"
                                      ? "white"
                                      : "#FF9800"
                                  }
                                />
                                <Text
                                  style={[
                                    styles.statusActionText,
                                    {
                                      color:
                                        report.status === "Pending"
                                          ? "white"
                                          : "#FF9800",
                                    },
                                  ]}
                                >
                                  Pending
                                </Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={[
                                  styles.statusActionButton,
                                  styles.progressActionButton,
                                  report.status === "In Progress" &&
                                    styles.activeStatusAction,
                                ]}
                                onPress={() =>
                                  updateReportStatus(report.id, "In Progress")
                                }
                              >
                                <Ionicons
                                  name="play-circle-outline"
                                  size={14}
                                  color={
                                    report.status === "In Progress"
                                      ? "white"
                                      : "#2196F3"
                                  }
                                />
                                <Text
                                  style={[
                                    styles.statusActionText,
                                    {
                                      color:
                                        report.status === "In Progress"
                                          ? "white"
                                          : "#2196F3",
                                    },
                                  ]}
                                >
                                  In Progress
                                </Text>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={[
                                  styles.statusActionButton,
                                  styles.resolvedActionButton,
                                  report.status === "Resolved" &&
                                    styles.activeStatusAction,
                                ]}
                                onPress={() =>
                                  // updateReportStatus(report.id, "Resolved")
                                  handle_resolve_report(report.id, "Resolved")
                                }
                              >
                                <Ionicons
                                  name="checkmark-circle-outline"
                                  size={14}
                                  color={
                                    report.status === "Resolved"
                                      ? "white"
                                      : "#4CAF50"
                                  }
                                />
                                <Text
                                  style={[
                                    styles.statusActionText,
                                    {
                                      color:
                                        report.status === "Resolved"
                                          ? "white"
                                          : "#4CAF50",
                                    },
                                  ]}
                                >
                                  Resolve
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      );
                    })
                )}

                {}

                <Modal
                  visible={modal_visbile}
                  transparent={true}
                  onRequestClose={() => set_modal_visible(false)}
                  animationType="fade"
                >
                  <Pressable
                    style={styles.modalBackground}
                    onPress={() => set_modal_visible(false)}
                  >
                    <Image
                      style={styles.fullImage}
                      resizeMode="contain"
                      source={{ uri: selected_image }}
                    />
                  </Pressable>
                </Modal>

                {/* Loading indicator */}
                {loading && (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>
                      Loading more reports...
                    </Text>
                  </View>
                )}

                {/* End padding for better scrolling */}
                <View style={{ height: 50 }} />
              </ScrollView>
            </View>
          </View>
        );
      case "map":
        return (
          <View style={styles.tabContent}>
            <View>
              <Text style={styles.chartTitle}>Location Reports</Text>
              <View style={styles.mapContainer}>
                {/* {location ? (
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    followsUserLocation={true}
                    mapType="hybrid"
                    minZoomLevel={0}
                    maxZoomLevel={18.8}
                  >
                    <UrlTile urlTemplate="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

                    <UrlTile
                      urlTemplate="https://cartodb-basemaps-a.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png"
                      zIndex={1}
                    />

                    {reports
                      .filter(
                        (report) =>
                          report.status === "Pending" ||
                          report.status === "In Progress"
                      )
                      .map((report) => (
                        <Marker
                          key={report.id}
                          coordinate={{
                            latitude: parseFloat(report.latitude),
                            longitude: parseFloat(report.longitude),
                          }}
                          // title={report.description}
                          // description={`Status: ${report.status}\nReported by: ${report.email}`}
                          onPress={() => set_selected_report(report)}
                        ></Marker>
                      ))}
                  </MapView>
                ) : (
                  <View style={styles.loadingMap}>
                    <Text>Loading map...</Text>
                  </View>
                )} */}
                <Maps_Dynamic
                  reports={reports}
                  location={location}
                  set_selected_report={set_selected_report}
                />
                <Modal
                  visible={selected_report !== null}
                  transparent
                  animationType="fade"
                  onRequestClose={() => set_selected_report(null)}
                >
                  {/* A semi-transparent backdrop to close when tapping outside */}
                  <TouchableWithoutFeedback
                    onPress={() => set_selected_report(null)}
                  >
                    <View style={styles.backdrop} />
                  </TouchableWithoutFeedback>

                  {/* Centered content box */}
                  <View style={styles.modalContainer}>
                    {/* The report’s photo “on top” */}
                    {selected_report && (
                      <>
                        <Image
                          source={{
                            uri: `${imageUrl}/reports_images/${selected_report.photo_url}`,
                          }}
                          style={styles.modalImage}
                          resizeMode="cover"
                        />

                        {/* Below the image: description, status, email */}
                        <View style={styles.modalTextContainer}>
                          <Text style={styles.modalTitle}>
                            {selected_report.description}
                          </Text>
                          <View
                            style={[
                              styles.statusBadge,
                              {
                                backgroundColor: getStatusColor(
                                  selected_report.status
                                ),
                              },
                            ]}
                          >
                            {/* 1. Feather icon */}

                            {/* 2. Status text */}
                            <Text style={styles.statusBadgeText}>
                              <Feather
                                name={getStatusIconName(selected_report.status)}
                                size={14}
                                color="#fff"
                                style={{ marginRight: 6 }}
                              />{" "}
                              {selected_report.status}
                            </Text>
                          </View>

                          <Text style={styles.modalText}>
                            Reported by: {selected_report.email}
                          </Text>
                        </View>

                        {/* 3. “Get Directions” Button */}
                        <TouchableOpacity
                          onPress={openDirections}
                          style={styles.directionButton}
                        >
                          <Text style={styles.directionButtonText}>
                            <Feather
                              name="navigation"
                              size={16}
                              color="#fff"
                              style={{ marginRight: 6 }}
                            />{" "}
                            Get Directions
                          </Text>
                        </TouchableOpacity>

                        {/* A simple “Close” button */}
                        <TouchableOpacity
                          onPress={() => set_selected_report(null)}
                          style={styles.closeButton}
                        >
                          <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </Modal>
              </View>
            </View>
          </View>
        );
      case "users":
        return (
          <View style={styles.tabContent}>
            <View style={styles.userStatsContainer}>
              <View style={styles.userStatCard}>
                <Text style={styles.userStatTitle}>Total Users</Text>
                <Text style={styles.userStatNumber}>
                  {reports.length > 0 ? reports[0].total_users : 0}
                </Text>
                <Text style={styles.userStatChange}>
                  {getMonthlyUserChange()}
                </Text>
              </View>
              {/* <View style={styles.userStatCard}>
                <Text style={styles.userStatTitle}>Active Users</Text>
                <Text style={styles.userStatNumber}>18</Text>
                <Text style={styles.userStatChange}>75% of total</Text>
              </View> */}
            </View>

            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>User Growth</Text>

              <LineChart
                data={{
                  labels: labels.slice(0, 12),
                  datasets: [
                    {
                      data: data.slice(0, 12),
                      color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
                      strokeWidth: 2,
                    },
                  ],
                  legend: ["User Growth"],
                }}
                width={screenWidth}
                height={220}
                center={[1, 0]}
                absolute
                paddingLeft={"15"}
                chartConfig={chartConfig}
                fromZero={true}
                bezier
                style={styles.chart}
              />
            </View>

            <View style={styles.userListContainer}>
              <Text style={styles.sectionTitle}> Users</Text>
              {/* {[
                { name: "John Smith", tasks: 45, completion: "98%" },
                { name: "Sarah Johnson", tasks: 38, completion: "92%" },
                { name: "Michael Brown", tasks: 32, completion: "87%" },
                { name: "Emily Davis", tasks: 29, completion: "95%" },
              ].map((user, index) => (
                <View key={index} style={styles.userItem}>
                  <View style={styles.userInfo}>
                    <View style={styles.userAvatar}>
                      <Text style={styles.userInitial}>{user.name[0]}</Text>
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                  </View>
                  <View style={styles.userStats}>
                    <Text style={styles.userTaskCount}>{user.tasks} tasks</Text>
                    <Text style={styles.userCompletion}>{user.completion}</Text>
                  </View>
                </View>
              ))} */}
              {users_stats.map((user, index) => (
                <View key={index} style={styles.userItem}>
                  <View style={styles.userInfo}>
                    <View style={styles.userAvatar}>
                      <Text style={styles.userInitial}>{user.email[0]}</Text>
                    </View>
                    <Text style={styles.userName}>{user.email}</Text>
                  </View>
                  <View style={styles.userStats}>
                    <Text style={styles.userTaskCount}>
                      {user.reports} reports
                    </Text>
                    <Text style={styles.userCompletion}>
                      {user.completion}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        );
      default:
        return <View />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TrashTag Admin</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.replace("login")}
        >
          <Ionicons name="exit-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "overview" && styles.activeTab]}
          onPress={() => setActiveTab("overview")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "overview" && styles.activeTabText,
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "tasks" && styles.activeTab]}
          onPress={() => setActiveTab("tasks")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "tasks" && styles.activeTabText,
            ]}
          >
            Reports
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "map" && styles.activeTab]}
          onPress={() => setActiveTab("map")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "map" && styles.activeTabText,
            ]}
          >
            Map
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "users" && styles.activeTab]}
          onPress={() => setActiveTab("users")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "users" && styles.activeTabText,
            ]}
          >
            Users
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>{renderTab()}</ScrollView>
    </SafeAreaView>
  );
};

export default Admin;

const CARD_WIDTH = screenWidth * 0.8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FFFE",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#2E7D32",
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    // marginBottom: 15,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#4CAF50",
  },
  tabText: {
    color: "#666",
    fontWeight: "500",
    fontSize: 14,
  },
  activeTabText: {
    color: "#2E7D32",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center", // centers horizontally
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  chart: {
    borderRadius: 10,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  userStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  userStatCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userStatTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  userStatNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  userStatChange: {
    fontSize: 12,
    color: "#4CAF50",
  },
  userListContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userInitial: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  userStats: {
    alignItems: "flex-end",
  },
  userTaskCount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  userCompletion: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  mapContainer: {
    height: 400,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 8,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingMap: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },

  // Enhanced Reports Styles
  reportsContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  reportsHeader: {
    marginBottom: 20,
  },
  reportsTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 16,
  },
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  quickStatItem: {
    alignItems: "center",
  },
  quickStatNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterButtons: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  activeFilterButton: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  filterButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filterButtonText: {
    color: "#666",
    fontWeight: "500",
    fontSize: 13,
  },
  activeFilterButtonText: {
    color: "white",
    fontWeight: "600",
  },
  reportsList: {
    flex: 1,
  },
  reportCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  reportCardContent: {
    padding: 16,
  },
  reportMainRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  reportImageContainer: {
    width: 60,
    height: 60,
    marginRight: 16,
  },
  reportImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#C8E6C9",
  },
  reportContentArea: {
    flex: 1,
  },
  reportCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  reportHeaderInfo: {
    flex: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  reportLocation: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32",
    flex: 1,
    lineHeight: 20,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#FFEBEE",
    marginLeft: 8,
  },
  descriptionContainer: {
    marginBottom: 12,
  },
  descriptionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#666",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: "auto",
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "600",
  },
  statusActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  statusActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  pendingActionButton: {
    backgroundColor: "#FFF8E1",
    borderColor: "#FF9800",
  },
  progressActionButton: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  resolvedActionButton: {
    backgroundColor: "#E8F5E9",
    borderColor: "#4CAF50",
  },
  activeStatusAction: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },
  statusActionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    color: "#666",
    fontSize: 14,
  },
  reportImage: {
    width: 60,
    height: 60,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullImage: {
    width: "90%",
    height: "70%",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    position: "absolute",
    top: "25%",
    left: (screenWidth - CARD_WIDTH) / 2,
    width: CARD_WIDTH,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 5, // for Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalImage: {
    width: "100%",
    height: 180,
  },
  modalTextContainer: {
    padding: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 4,
  },
  closeButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "600",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusBadgeText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  modalReporter: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },
  directionButton: {
    backgroundColor: "#2980b9", // blue
    marginHorizontal: 12,
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  directionButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
});
