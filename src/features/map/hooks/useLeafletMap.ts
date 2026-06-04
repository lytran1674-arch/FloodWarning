import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export const useLeafletMap = (
  defaultCenter: [number, number],
  defaultZoom: number
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const container = containerRef.current;

    const leafletMap = L.map(container).setView(defaultCenter, defaultZoom);
    mapRef.current = leafletMap;
    setMap(leafletMap);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(leafletMap);

    const timer = window.setTimeout(() => {
      if (!container.isConnected) return;
      if (mapRef.current !== leafletMap) return;

      leafletMap.invalidateSize({
        pan: false,
      });
    }, 300);

    return () => {
      window.clearTimeout(timer);

      leafletMap.remove();
      mapRef.current = null;
      setMap(null);
    };
  }, []);

  return {
    containerRef,
    map,
    mapRef,
  };
};