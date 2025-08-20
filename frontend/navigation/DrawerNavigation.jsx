// import React from "react";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import TabNavigator from "./TabNavigation";
// import { View, Text, TouchableOpacity } from "react-native";

// import BottomNavigation from "./BottomNavigation";
// import { NavigationContainer, useNavigation } from "@react-navigation/native";
// import { Feather } from "@expo/vector-icons";

// // Screens
// import HomeScreen from "../screens/HomeScreen";
// import Report from "../screens/ReportsScreen";
// import CameraScreen from "../screens/CameraScreen";
// import Submit_Form_Screen from "../screens/Submit_Form_Screen";

// import login from "../app/(auth)/login";
// import Register from "../app/(auth)/register";

// import Admin from "../app/admin/admin";

// import { useAuth, UserProvider } from "../contexts/UsertContext";

// const Drawer = createDrawerNavigator();

// // Add this custom header component
// const CustomHeader = () => {
//   const { logout } = useAuth();
//   const navigation = useNavigation();

//   const handleLogout = () => {
//     navigation.navigate("login"); // Navigate to login screen
//     logout();
//   };

//   return (
//     <View style={{ flexDirection: "row", alignItems: "center" }}>
//       <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
//         CleanTrack
//       </Text>
//       <TouchableOpacity onPress={handleLogout} style={{ marginLeft: "55%" }}>
//         <Feather name="log-out" size={24} color="white" />
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default function DrawerNavigator() {
//   const { user } = useAuth();
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         headerShown: true,
//       }}
//       initialRouteName={user ? "Home" : "login"}
//     >
//       <Drawer.Screen
//         name="admin"
//         component={Admin}
//         options={{
//           headerShown: false,
//           drawerLabel: () => null,
//           drawerIcon: () => null,
//           title: "",
//           drawerItemStyle: { display: "none" },
//           swipeEnabled: false,
//         }}
//       />
//       {user ? (
//         <>
//           <Drawer.Screen
//             name="Home"
//             component={HomeScreen}
//             options={{
//               drawerLabel: "Home",
//               headerTitle: () => <CustomHeader />,
//               drawerIcon: ({ focused, color, size }) => (
//                 <Feather name="home" size={size} color={color} />
//               ),
//               headerStyle: {
//                 backgroundColor: "#4CAF50",
//               },
//               headerTintColor: "white",
//             }}
//           />
//         </>
//       ) : (
//         <>
//           <Drawer.Screen
//             name="login"
//             component={login}
//             options={{
//               headerShown: false,
//               drawerLabel: () => null,
//               drawerIcon: () => null,
//               title: "",
//               drawerItemStyle: { display: "none" },
//               swipeEnabled: false,
//             }}
//           />
//         </>
//       )}
//       <Drawer.Screen
//         name="register"
//         component={Register}
//         options={{
//           headerShown: false,
//           drawerLabel: () => null,
//           drawerIcon: () => null,
//           title: "",
//           drawerItemStyle: { display: "none" },
//           swipeEnabled: false,
//         }}
//       />

//       <Drawer.Screen
//         name="Reports"
//         component={Report}
//         options={{
//           drawerLabel: "Report",
//           headerTitle: () => <CustomHeader />,
//           drawerIcon: ({ focused, color, size }) => (
//             <Feather name="file-text" size={size} color={color} />
//           ),
//           headerStyle: {
//             backgroundColor: "#4CAF50",
//           },
//           headerTintColor: "white",
//         }}
//       />
//       <Drawer.Screen
//         name="Submit_Form"
//         component={Submit_Form_Screen}
//         options={{
//           headerTitle: () => <CustomHeader />,
//           drawerItemStyle: { display: "none" }, // Add this to hide the drawer item
//           headerStyle: {
//             backgroundColor: "#4CAF50",
//           },
//           headerTintColor: "white",
//         }}
//       />
//       {/* <Drawer.Screen
//         name="Camera"
//         component={CameraScreen}
//         options={{
//           drawerLabel: "Camera",
//           title: "CleanTrack",
//           headerStyle: {
//             backgroundColor: "#4CAF50",
//           },
//           headerTintColor: "white",
//         }}
//       /> */}
//     </Drawer.Navigator>
//   );
// }
