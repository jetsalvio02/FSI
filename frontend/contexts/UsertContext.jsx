// import { createContext, useContext, useEffect, useState } from "react";
// import * as SecureStore from "expo-secure-store";
// import Axios from "axios";
// import { useBaseUrl } from "../utility/useBaseURL";

// export const UserContext = createContext();

// export function UserProvider({ children }) {
//   const [user, set_user] = useState(null); // Token
//   const [user_id, set_user_id] = useState(null); // User
//   const baseUrl = useBaseUrl();

//   // Fetch profile using stored token
//   const fetchProfile = async (token) => {
//     try {
//       const response = await Axios.get(`${baseUrl}/user`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       set_user_id(response.data.user);
//     } catch (err) {
//       // console.error("Failed to fetch user profile:", err);
//       set_user(null);
//       throw err;
//     }
//   };

//   // On mount: check token and fetch profile
//   useEffect(() => {
//     (async () => {
//       const token = await SecureStore.getItemAsync("user_token");
//       if (token) {
//         await fetchProfile(token);
//       }
//       setLoading(false);
//     })();
//   }, []);

//   const login = async (token, user) => {
//     await SecureStore.setItemAsync("user_token", token);
//     set_user(token);
//     await fetchProfile(token);
//   };

//   const logout = async () => {
//     await SecureStore.deleteItemAsync("user_token");
//     set_user(null);
//   };
//   return (
//     <UserContext.Provider value={{ user, user_id, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// }

// export const useAuth = () => useContext(UserContext);
import { createContext, useContext, useEffect, useState } from "react";
import Axios from "axios";
import { useBaseUrl } from "../utility/useBaseURL";
import Storage from "../utility/Storage.js"; // ✅ use wrapper

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, set_user] = useState(null); // token
  const [user_id, set_user_id] = useState(null); // profile
  const [loading, setLoading] = useState(true); // ✅ missing state
  const baseUrl = useBaseUrl();

  const fetchProfile = async (token) => {
    try {
      const response = await Axios.get(`${baseUrl}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set_user_id(response.data.user);
    } catch (err) {
      set_user(null);
      throw err;
    }
  };

  useEffect(() => {
    (async () => {
      const token = await Storage.getItem("user_token");
      if (token) {
        set_user(token);
        await fetchProfile(token);
      }
      setLoading(false);
    })();
  }, []);

  const login = async (token) => {
    await Storage.setItem("user_token", token);
    set_user(token);
    await fetchProfile(token);
  };

  const logout = async () => {
    await Storage.deleteItem("user_token");
    set_user(null);
    set_user_id(null);
  };

  return (
    <UserContext.Provider value={{ user, user_id, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export const useAuth = () => useContext(UserContext);
