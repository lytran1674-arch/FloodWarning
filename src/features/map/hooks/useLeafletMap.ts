import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export const useLeafletMap = (
  defaultCenter: [number, number],
  defaultZoom: number
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current).setView(defaultCenter, defaultZoom);
    mapRef.current = map;

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    map.whenReady(() => {
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return { containerRef, mapRef };
};