// src/components/GeoMap.tsx
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useGeolocation from "../hooks/useGeolocation";

interface GeoMapProps {
  defaultCenter?: [number, number];
  defaultZoom?: number;
  height?: string;
}

const GeoMap = ({
  defaultCenter = [16.0471, 108.2068],
  defaultZoom = 13,
  height = "350px",
}: GeoMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const zoomedRef = useRef(false);

  const { lat, lng, accuracy, error, loading } = useGeolocation();

  // Init map
  useEffect(() => {
    const map = L.map("map").setView(defaultCenter, defaultZoom);
    mapRef.current = map;

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update marker khi vị trí thay đổi
  useEffect(() => {
    const map = mapRef.current;
    if (!map || lat === null || lng === null || accuracy === null) return;

    if (markerRef.current) map.removeLayer(markerRef.current);
    if (circleRef.current) map.removeLayer(circleRef.current);

    markerRef.current = L.marker([lat, lng]).addTo(map);
    circleRef.current = L.circle([lat, lng], { radius: accuracy }).addTo(map);

    if (!zoomedRef.current) {
      map.fitBounds(circleRef.current.getBounds());
      zoomedRef.current = true;
    }

    map.setView([lat, lng]);
  }, [lat, lng, accuracy]);

  return (
    <div className="w-full">
      {loading && (
        <div className="mb-2 text-sm text-gray-500">Getting location...</div>
      )}
      {error && (
        <div className="mb-2 rounded bg-red-100 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <div id="map" style={{ height }} className="w-full rounded-lg" />
    </div>
  );
};

export default GeoMap;