import React, { useState } from "react";
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
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../contexts/UsertContext";
import * as Securestore from "expo-secure-store";
import Axios from "axios";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TrashCanLogo from "../../assets/Logo";
import Logo from "../../assets/logo-removebg-preview.png";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [show_password, set_show_password] = useState(false);

  const [loginError, setLoginError] = useState("");

  const [baseUrl, setBaseUrl] = useState(null);
  const router = useRouter();
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

  const { login } = useAuth();

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

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      // Admin?
      if (
        (email === "admin@gmail.com" && password === "admin123") ||
        password === "Admin123"
      ) {
        // navigation.navigate("admin");
        setEmail("");
        setPassword("");
        router.replace("admin/admin");
        return;
      }

      try {
        const response = await Axios.post(`${baseUrl}/login_user`, {
          email,
          password,
        });
        if (response.status === 200) {
          await Securestore.setItemAsync("user_token", response.data.token);
          await login(response.data.token);
          // console.log(response.data.user_id);
          // navigation.navigate("home");
          setEmail("");
          setPassword("");
          router.replace(`/screens/HomeScreen`);
        }
      } catch (error) {
        // console.error("Error during login:", error);
        if (error.response && error.response.status === 401) {
          setLoginError("Wrong email or password");
          setTimeout(() => {
            setLoginError("");
          }, 3000);
        }
        throw error;
      }
    }
  };

  const handleSignUp = () => {
    // Navigate to sign up screen
    // navigation.navigate("/register");
    router.replace("register");
  };

  // const handleForgotPassword = () => {
  //   // Navigate to forgot password screen
  //   // navigation.navigate("ForgotPassword");
  // };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View
            style={[
              styles.logoContainer,
              {
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
              },
            ]}
          >
            {/* <TrashCanLogo /> */}
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
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

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
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter your password"
                  placeholderTextColor="#88A788"
                  secureTextEntry={!show_password}
                  value={password}
                  onChangeText={setPassword}
                  onBlur={() => validatePassword(password)}
                />

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => set_show_password((prev) => !prev)}
                  style={styles.eyeIconTouchable}
                >
                  <Ionicons name={show_password ? "eye-off" : "eye"} />
                </TouchableOpacity>
              </View>

              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>

            {/* <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity> */}

            <View style={{ marginBottom: 15 }}>
              {loginError ? (
                <Text style={styles.errorText}>{loginError}</Text>
              ) : null}
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

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
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2E7D32",
    // marginBottom: 8,
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
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
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
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#2E7D32",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#666",
    fontSize: 14,
  },
  signupLink: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "600",
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIconTouchable: {
    position: "absolute",
    right: 12,
    padding: 4,
  },
});
