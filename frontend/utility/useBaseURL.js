// // utils/hooks/useBaseUrl.js
// import { useState, useEffect } from "react";
// import Constants from "expo-constants";

// const getHostUri = () => {
//   return (
//     Constants.expoConfig?.hostUri ||
//     Constants.expoConfig?.extra?.expoClient?.hostUri ||
//     Constants.manifest2?.extra?.expoClient?.hostUri
//   );
// };

// export const useBaseUrl = (options = {}) => {
//   const [baseUrl, setBaseUrl] = useState(null);
//   const { port = 4000, apiPath = "api" } = options;

//   useEffect(() => {
//     const hostUri = getHostUri();

//     if (!hostUri) {
//       console.warn(
//         "Could not find Metro host. Make sure you're running in Expo Go or a dev client with proper config."
//       );
//       return;
//     }

//     const ip = hostUri.split(":")[0];
//     setBaseUrl(`http://${ip}:${port}/${apiPath}`);
//   }, [port, apiPath]);

//   return baseUrl;
// };
// utils/hooks/useBaseUrl.js
import { useState, useEffect } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";

const getHostUri = () => {
  return (
    Constants.expoConfig?.hostUri ||
    Constants.expoConfig?.extra?.expoClient?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri
  );
};

export const useBaseUrl = (options = {}) => {
  const [baseUrl, setBaseUrl] = useState(null);
  const { port = 4000, apiPath = "api" } = options;

  useEffect(() => {
    let ip;

    if (Platform.OS === "web") {
      // ✅ For web: use the current window hostname
      ip = window.location.hostname;
    } else {
      // ✅ For native: use Metro hostUri
      const hostUri = getHostUri();
      if (!hostUri) {
        console.warn(
          "Could not find Metro host. Make sure you're running in Expo Go or a dev client with proper config."
        );
        return;
      }
      ip = hostUri.split(":")[0];
    }

    setBaseUrl(`http://${ip}:${port}/${apiPath}`);
  }, [port, apiPath]);

  return baseUrl;
};
