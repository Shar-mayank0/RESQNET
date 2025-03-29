"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Fix Leaflet default marker icon paths
const DefaultIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Disaster {
  id: number;
  lat: number;
  lng: number;
  risk: "High" | "Medium" | "Low";
}

interface DisasterMapProps {
  disasters: Disaster[];
}

export default function DisasterMap({ disasters }: DisasterMapProps) {
  // Ensure the map re-renders correctly in Next.js
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Force map to invalidate size after initial render
      const map = document.querySelector(".leaflet-container") as HTMLElement;
      if (map) {
        setTimeout(() => {
          const leafletMap = L.map(map);
          leafletMap.invalidateSize();
        }, 100);
      }
    }
  }, []);

  return (
    <div className="h-[400px] rounded-lg overflow-hidden">
      <MapContainer
        center={[20.5937, 78.9629]} // Center of India
        zoom={4}
        style={{ height: "100%", width: "100%" }}
        className="leaflet-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {disasters.map((disaster) => (
          <Marker
            key={disaster.id}
            position={[disaster.lat, disaster.lng]}
            icon={L.divIcon({
              className: "custom-marker",
              html: `<div style="background-color: ${
                disaster.risk === "High"
                  ? "red"
                  : disaster.risk === "Medium"
                  ? "yellow"
                  : "green"
              }; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup>
              {disaster.risk} Risk at ({disaster.lat}, {disaster.lng})
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
