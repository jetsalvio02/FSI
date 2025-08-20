import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import Axios from "axios";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import Logo from "../../assets/logo-removebg-preview.png";

const Register = () => {
  const navigation = useNavigation();
  const router = useRouter();
  // const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [deviceIp, setDeviceIp] = useState(null);

  const [baseUrl, setBaseUrl] = useState(null);

  React.useEffect(() => {
    let hostUri =
      Constants.expoConfig?.hostUri ||
      Constants.expoConfig?.extra?.expoClient?.hostUri ||
      Constants.manifest2?.extra?.expoClient?.hostUri;

    if (!hostUri) {
      console.warn(
        "Could not find Metro host. Make sure you're running in Expo Go or a dev client with proper config."
      );
      return;
    }

    const ip = hostUri.split(":")[0]; // Extract IP
    console.log(ip);
    setBaseUrl(`http://${ip}:4000/api`);
  }, []);

  // const validateName = (name) => {
  //   if (!name) {
  //     setNameError("Name is required");
  //     return false;
  //   }
  //   setNameError("");
  //   return true;
  // };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleRegister = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      try {
        const response = await Axios.post(`${baseUrl}/create_user`, {
          email,
          password,
        });

        if (response.data.success) {
          // Registration successful
          console.log("Registration successful:", response.data);
          Alert.alert(
            "Success",
            "Your account has been created successfully. Thank you for participating."
          );
          navigation.navigate("(auth)/login");
        } else {
          // Handle server-side validation errors
          alert(response.data.message || "Registration failed");
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert(error.response?.data?.message || "Registration failed");
      }
    }
  };

  const handleLogin = () => {
    // Navigate to login screen
    // Axios.post(`http://localhost:4000/api/users`, { email, password });
    // navigation.navigate("admin");
    router.replace("login");
    // navigation.navigate("login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.logoContainer}>
            <Image
              style={{ width: 80, height: 60, marginRight: 0 }}
              resizeMode="contain"
              source={Logo}
            />
            <Text style={styles.logoText}>TrashTag</Text>
            {/* <Text style={styles.tagline}>
              Track your cleaning, effortlessly
            </Text> */}
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>

            {/* <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#88A788"
                value={name}
                onChangeText={setName}
                onBlur={() => validateName(name)}
              />
              {nameError ? (
                <Text style={styles.errorText}>{nameError}</Text>
              ) : null}
            </View> */}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#88A788"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onBlur={() => validateEmail(email)}
              />
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="#88A788"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                onBlur={() => validatePassword(password)}
              />
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#88A788"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onBlur={() => validateConfirmPassword(confirmPassword)}
              />
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.registerButtonText}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FFF5",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    // marginBottom: 40,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "#4CAF50",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F5FFF5",
    borderWidth: 1,
    borderColor: "#CCDFCC",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: 4,
  },
  registerButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    color: "#666",
    fontSize: 14,
  },
  loginLink: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "600",
  },
});
