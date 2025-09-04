// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Prevent `react-native-maps` from being bundled on web
config.resolver.blockList = [/node_modules\/react-native-maps\/.*/];

module.exports = config;
