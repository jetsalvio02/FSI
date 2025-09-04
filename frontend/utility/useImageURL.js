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

// export const useBaseUrl_image = (options = {}) => {
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
//     setBaseUrl(`http://${ip}:${port}/`);
//   }, [port]);

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

export const useBaseUrl_image = (options = {}) => {
  const [baseUrl, setBaseUrl] = useState(null);
  const { port = 4000 } = options;

  useEffect(() => {
    let ip;

    if (Platform.OS === "web") {
      // ✅ Web uses the browser hostname
      ip = window.location.hostname;
    } else {
      // ✅ Mobile uses Expo’s Metro host
      const hostUri = getHostUri();
      if (!hostUri) {
        console.warn(
          "Could not find Metro host. Make sure you're running in Expo Go or a dev client with proper config."
        );
        return;
      }
      ip = hostUri.split(":")[0];
    }

    setBaseUrl(`http://${ip}:${port}/`);
  }, [port]);

  return baseUrl;
};
