import React from "react";
import { Svg, Rect, Circle } from "react-native-svg";

const TrashCanLogo = () => (
  <Svg width="50" height="40" viewBox="0 0 150 200">
    {/* Trash can body */}
    <Rect
      x="30"
      y="50"
      width="90"
      height="110"
      rx="10"
      ry="10"
      fill="#4CAF50"
      stroke="#2E7D32"
      strokeWidth="4"
    />

    {/* Trash can lid */}
    <Rect
      x="25"
      y="35"
      width="100"
      height="20"
      rx="5"
      ry="5"
      fill="#388E3C"
      stroke="#2E7D32"
      strokeWidth="3"
    />

    {/* Handle */}
    <Rect x="60" y="20" width="30" height="10" rx="3" ry="3" fill="#2E7D32" />

    {/* Wheels */}
    <Circle cx="40" cy="165" r="10" fill="#212121" />
    <Circle cx="110" cy="165" r="10" fill="#212121" />

    {/* Wheel centers */}
    <Circle cx="40" cy="165" r="4" fill="#9E9E9E" />
    <Circle cx="110" cy="165" r="4" fill="#9E9E9E" />
  </Svg>
);

export default TrashCanLogo;
