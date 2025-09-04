import React from "react";
import { View } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";

export default function Maps_Dynamic({
  reports,
  location,
  set_selected_report,
}) {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location?.latitude || 10.67,
          longitude: location?.longitude || 122.95,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation
        followsUserLocation
        mapType="hybrid"
      >
        <UrlTile urlTemplate="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        <UrlTile
          urlTemplate="https://cartodb-basemaps-a.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png"
          zIndex={1}
        />

        {reports
          .filter((r) => r.status === "Pending" || r.status === "In Progress")
          .map((report) => (
            <Marker
              key={report.id}
              coordinate={{
                latitude: parseFloat(report.latitude),
                longitude: parseFloat(report.longitude),
              }}
              onPress={() => set_selected_report(report)}
            />
          ))}
      </MapView>
    </View>
  );
}
