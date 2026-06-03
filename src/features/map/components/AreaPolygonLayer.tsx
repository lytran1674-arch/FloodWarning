import { useEffect, useRef } from "react";
import L from "leaflet";

interface Props {
  map: L.Map | null;
  geometry?: any;
  name?: string;
}

export const AreaPolygonLayer = ({ map, geometry, name }: Props) => {
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    if (!map) return;

    if (geoJsonRef.current) {
      map.removeLayer(geoJsonRef.current);
      geoJsonRef.current = null;
    }

    if (!geometry) return;

    const feature = {
      type: "Feature",
      properties: {
        name: name ?? "",
      },
      geometry,
    };

    const layer = L.geoJSON(feature as any, {
      style: {
        color: "#2563eb",
        weight: 3,
        fillColor: "#60a5fa",
        fillOpacity: 0.35,
      },
      onEachFeature: (_feature, leafletLayer) => {
        if (name) {
          leafletLayer.bindPopup(name);
        }
      },
    }).addTo(map);

    geoJsonRef.current = layer;

    const bounds = layer.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [30, 30],
        maxZoom: 14,
      });
    }
  }, [map, geometry, name]);

  return null;
};