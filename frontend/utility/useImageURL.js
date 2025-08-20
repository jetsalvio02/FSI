// utils/hooks/useBaseUrl.js
import { useState, useEffect } from "react";
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
  const { port = 4000, apiPath = "api" } = options;

  useEffect(() => {
    const hostUri = getHostUri();

    if (!hostUri) {
      console.warn(
        "Could not find Metro host. Make sure you're running in Expo Go or a dev client with proper config."
      );
      return;
    }

    const ip = hostUri.split(":")[0];
    setBaseUrl(`http://${ip}:${port}/`);
  }, [port]);

  return baseUrl;
};
