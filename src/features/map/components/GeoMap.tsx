// import { useEffect } from "react";
// import { CurrentLocationLayer } from "./CurrentLocationLayer";
// import { AreaPolygonLayer } from "./AreaPolygonLayer";
// import { useLeafletMap } from "../hooks/useLeafletMap";

// interface GeoMapProps {
//   defaultCenter?: [number, number];
//   defaultZoom?: number;
//   className?: string;
//   selectedGeometry?: any;
//   selectedName?: string;
//   showCurrentLocation?: boolean;
// }

// const GeoMap = ({
//   defaultCenter = [16.0471, 108.2068],
//   defaultZoom = 13,
//   className ,
//   selectedGeometry,
//   selectedName,
//   showCurrentLocation = true,
// }: GeoMapProps) => {
//   const { containerRef, mapRef } = useLeafletMap(defaultCenter, defaultZoom);

//   // Di chuyển map mỗi khi defaultCenter/defaultZoom thay đổi (sau khi map đã được tạo)
//   useEffect(() => {
//     if (!mapRef.current) return;
//     mapRef.current.flyTo(defaultCenter, defaultZoom);
//   }, [defaultCenter[0], defaultCenter[1], defaultZoom, mapRef]);

//   return (
//     <div className="w-full">
//       <div ref={containerRef}  className={`w-full rounded-lg ${className}`}/>

//       {showCurrentLocation && (
//         <CurrentLocationLayer
//           map={mapRef.current}
//           disabledAutoZoom={Boolean(selectedGeometry)}
//         />
//       )}

//       <AreaPolygonLayer
//         map={mapRef.current}
//         geometry={selectedGeometry}
//         name={selectedName}
//       />
//     </div>
//   );
// };

// export default GeoMap;

// GeoMap.tsx
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface WarningFeature {
  id: string;
  geometry: any;
  name: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  probability?: number;
}

interface GeoMapProps {
  className?: string;
  features?: WarningFeature[];
  defaultCenter?: [number, number];   // tùy chọn, dùng khi không có features
  defaultZoom?: number;               // tùy chọn
}

const VIETNAM_BOUNDS: L.LatLngBoundsExpression = [[8.0, 102.0], [23.5, 110.0]];

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'HIGH': return { color: '#ff0000', fillColor: '#ff0000', fillOpacity: 0.5 };
    case 'MEDIUM': return { color: '#ffa500', fillColor: '#ffa500', fillOpacity: 0.4 };
    default: return { color: '#3388ff', fillColor: '#3388ff', fillOpacity: 0.2 };
  }
};

// Component điều khiển map khi có features (tự động fit bounds)
const MapControllerWithFeatures = ({ bounds }: { bounds: L.LatLngBoundsExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds);
    map.setMaxBounds(VIETNAM_BOUNDS);
    map.setMinZoom(6);
  }, [map, bounds]);
  return null;
};

// Component điều khiển map khi không có features (dùng center/zoom)
const MapControllerWithCenter = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
    map.setMaxBounds(VIETNAM_BOUNDS);
    map.setMinZoom(6);
  }, [map, center, zoom]);
  return null;
};

const PolygonLayer = ({ features }: { features: WarningFeature[] }) => {
  const map = useMap();
  const layerGroupRef = useRef<L.FeatureGroup | null>(null);

  useEffect(() => {
    if (!map || !features?.length) return;
    if (layerGroupRef.current) map.removeLayer(layerGroupRef.current);
    const group = L.featureGroup().addTo(map);
    features.forEach(({ geometry, name, riskLevel }) => {
      if (!geometry) return;
      const { color, fillColor, fillOpacity } = getRiskColor(riskLevel);
      const layer = L.geoJSON(geometry, {
        style: { color, weight: 2, fillColor, fillOpacity },
        onEachFeature: (feature, layer) => {
          layer.bindTooltip(`${name} - ${riskLevel}`, { sticky: true });
        },
      });
      layer.addTo(group);
    });
    layerGroupRef.current = group;
    const bounds = group.getBounds();
    if (bounds.isValid()) map.fitBounds(bounds);
    return () => { if (layerGroupRef.current) map.removeLayer(layerGroupRef.current); };
  }, [map, features]);

  return null;
};

const GeoMap = ({ className, features, defaultCenter, defaultZoom }: GeoMapProps) => {
  const hasFeatures = features && features.length > 0;
  // Nếu không có features, dùng defaultCenter và defaultZoom (hoặc giá trị mặc định)
  const center = defaultCenter || [16.0, 108.0];
  const zoom = defaultZoom || 6;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className={className}
      maxBounds={VIETNAM_BOUNDS}
      maxBoundsViscosity={1.0}
      style={{ background: '#e5e5e5' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />
      {hasFeatures && <PolygonLayer features={features} />}
      {hasFeatures && <MapControllerWithFeatures bounds={VIETNAM_BOUNDS} />}
      {!hasFeatures && <MapControllerWithCenter center={center} zoom={zoom} />}
    </MapContainer>
  );
};

export default GeoMap;