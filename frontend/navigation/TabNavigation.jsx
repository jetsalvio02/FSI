// // src/navigation/TabNavigator.js
// import React from "react";
// import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Ionicons } from "@expo/vector-icons";

// import HomeScreen from "../screens/HomeScreen";
// // import ReportsScreen from "../screens/ReportsScreen";
// // import ProfileScreen from "../screens/ProfileScreen";

// const Tab = createBottomTabNavigator();

// const CameraButton = ({ children, onPress }) => (
//   <TouchableOpacity style={styles.cameraButtonContainer} onPress={onPress}>
//     <View style={styles.cameraButton}>{children}</View>
//   </TouchableOpacity>
// );

// export default function TabNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarStyle: styles.tabBar,
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <Ionicons
//               name="home-outline"
//               size={24}
//               color={focused ? "#2ecc71" : "#555"}
//             />
//           ),
//         }}
//       />

//       {/* <Tab.Screen
//         name="Camera"
//         // component={ReportsScreen}
//         options={{
//           tabBarButton: (props) => (
//             <CameraButton {...props}>
//               <Ionicons name="camera" size={28} color="#fff" />
//             </CameraButton>
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="ProfileTab"
//         // component={ProfileScreen}
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <Ionicons
//               name="person-outline"
//               size={24}
//               color={focused ? "#2ecc71" : "#555"}
//             />
//           ),
//         }}
//       /> */}
//     </Tab.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   tabBar: {
//     position: "absolute",
//     height: Platform.OS === "ios" ? 80 : 60,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     backgroundColor: "#fff",
//     elevation: 5,
//     paddingBottom: Platform.OS === "ios" ? 20 : 10,
//   },
//   cameraButtonContainer: {
//     top: -30,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cameraButton: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#2ecc71",
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 5,
//   },
// });
