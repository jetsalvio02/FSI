import React from "react";
import L, { icon, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import { MapContainer } from "react-leaflet";
// import { TileLayer } from "react-leaflet";
// import { Marker } from "react-leaflet";
// import { useMap } from "react-leaflet/hooks";

import pin_location from "../assets/pin_location.png";

// // Import marker images directly
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// // Fix default icon paths
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

import { useBaseUrl_image } from "../utility/useImageURL";

export default function Maps_Dynamic({ reports }) {
  const custom_icon = L.icon({
    iconUrl: pin_location,
    iconSize: [38, 38],
  });

  const imageUrl = useBaseUrl_image();

  const [currentLocation, setCurrentLocation] = React.useState([
    9.9833, 122.8167,
  ]); // fallback location
  const [loaded, setLoaded] = React.useState(false);

  const [selected_image, set_selected_image] = React.useState(null);

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // const { latitude, longitude } = pos.coords;
          // setCurrentLocation([latitude, longitude]);
          setLoaded(true);
        },
        (err) => {
          console.error("Geolocation error:", err);
          // Fallback: set to a default location (ex: your city center)
          // setCurrentLocation([10.0123, 122.867]);
          setLoaded(true);
        },
        {
          enableHighAccuracy: true, // forces GPS if available
          timeout: 10000, // wait up to 10s
          maximumAge: 0, // don’t use cached location
        }
      );
    } else {
      console.warn("Geolocation not supported");
      setLoaded(true);
    }
  }, []);

  return (
    <div style={{ height: "400px", width: "100%" }}>
      {/* {loaded && (
        <>
          <MapContainer
            center={currentLocation}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            <TileLayer url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png" />

            {/* {reports
              .filter(
                (r) => r.status === "Pending" || r.status === "In Progress"
              )
              .map((report) => (
                <Marker
                  key={report.id}
                  position={[
                    parseFloat(report.latitude),
                    parseFloat(report.longitude),
                  ]}
                  icon={custom_icon}
                >
                  <Popup>
                    <div style={{ textAlign: "center" }}>
                      {report.photo_url && (
                        <img
                          src={`${imageUrl}/reports_images/${report.photo_url}`}
                          alt="Report"
                          style={{
                            width: "150px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginBottom: "8px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            set_selected_image(
                              `${imageUrl}/reports_images/${report.photo_url}`
                            )
                          }
                        />
                      )}
                      <br />
                      <b>{report.description}</b>
                      <br />
                      Status: {report.status}
                      <br />
                      Reported by: {report.email}
                    </div>
                  </Popup>
                </Marker>
              ))} */}
      {/* <Marker icon={custom_icon} position={[9.9833, 122.8167]}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer> */}

      {/* Full-size image modal */}
      {/* {selected_image && (
            <div
              onClick={() => set_selected_image(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
              }}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <img
                  src={selected_image}
                  alt="Full View"
                  style={{
                    maxWidth: "90%",
                    maxHeight: "90%",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                  }}
                />
              </div>
            </div>
          )} */}
      {/* <Modal
            visible={modal_visbile}
            transparent={true}
            onRequestClose={() => set_modal_visible(false)}
            animationType="fade"
          >
            <Pressable
              style={styles.modalBackground}
              onPress={() => set_modal_visible(false)}
            >
              <Image
                style={styles.fullImage}
                resizeMode="contain"
                source={{ uri: selected_image }}
              />
            </Pressable>
          </Modal> */}
      {/* </>
      )} */}
      <MapContainer
        center={currentLocation}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        <TileLayer url="https://cartodb-basemaps-a.global.ssl.fastly.net/light_only_labels/{z}/{x}/{y}.png" />
        {/* <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        /> */}

        {reports
          .filter((r) => r.status === "Pending" || r.status === "In Progress")
          .map((report) => (
            <Marker
              key={report.id}
              position={[
                parseFloat(report.latitude),
                parseFloat(report.longitude),
              ]}
              // icon={custom_icon}
            >
              <Popup>
                <div style={{ textAlign: "center" }}>
                  {report.photo_url && (
                    <img
                      src={`${imageUrl}/reports_images/${report.photo_url}`}
                      alt="Report"
                      style={{
                        width: "150px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        set_selected_image(
                          `${imageUrl}/reports_images/${report.photo_url}`
                        )
                      }
                    />
                  )}
                  <br />
                  <b>{report.description}</b>
                  <br />
                  Status: {report.status}
                  <br />
                  Reported by: {report.email}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
