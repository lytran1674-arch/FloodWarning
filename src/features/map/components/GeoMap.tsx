// // import { useEffect } from "react";
// // import { CurrentLocationLayer } from "./CurrentLocationLayer";
// // import { AreaPolygonLayer } from "./AreaPolygonLayer";
// // import { useLeafletMap } from "../hooks/useLeafletMap";

// // interface GeoMapProps {
// //   defaultCenter?: [number, number];
// //   defaultZoom?: number;
// //   className?: string;
// //   selectedGeometry?: any;
// //   selectedName?: string;
// //   showCurrentLocation?: boolean;
// // }

// // const GeoMap = ({
// //   defaultCenter = [16.0471, 108.2068],
// //   defaultZoom = 13,
// //   className ,
// //   selectedGeometry,
// //   selectedName,
// //   showCurrentLocation = true,
// // }: GeoMapProps) => {
// //   const { containerRef, mapRef } = useLeafletMap(defaultCenter, defaultZoom);

// //   // Di chuyển map mỗi khi defaultCenter/defaultZoom thay đổi (sau khi map đã được tạo)
// //   useEffect(() => {
// //     if (!mapRef.current) return;
// //     mapRef.current.flyTo(defaultCenter, defaultZoom);
// //   }, [defaultCenter[0], defaultCenter[1], defaultZoom, mapRef]);

// //   return (
// //     <div className="w-full">
// //       <div ref={containerRef}  className={`w-full rounded-lg ${className}`}/>

// //       {showCurrentLocation && (
// //         <CurrentLocationLayer
// //           map={mapRef.current}
// //           disabledAutoZoom={Boolean(selectedGeometry)}
// //         />
// //       )}

// //       <AreaPolygonLayer
// //         map={mapRef.current}
// //         geometry={selectedGeometry}
// //         name={selectedName}
// //       />
// //     </div>
// //   );
// // };

// // export default GeoMap;

// // GeoMap.tsx
// import { useEffect, useRef } from 'react';
// import { MapContainer, TileLayer, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// interface WarningFeature {
//   id: string;
//   geometry: any;
//   name: string;
//   riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
//   probability?: number;
// }

// interface GeoMapProps {
//   className?: string;
//   features?: WarningFeature[];
//   defaultCenter?: [number, number];   // tùy chọn, dùng khi không có features
//   defaultZoom?: number;               // tùy chọn
// }

// const VIETNAM_BOUNDS: L.LatLngBoundsExpression = [[8.0, 102.0], [23.5, 110.0]];

// const getRiskColor = (riskLevel: string) => {
//   switch (riskLevel) {
//     case 'HIGH': return { color: '#ff0000', fillColor: '#ff0000', fillOpacity: 0.5 };
//     case 'MEDIUM': return { color: '#ffa500', fillColor: '#ffa500', fillOpacity: 0.4 };
//     default: return { color: '#3388ff', fillColor: '#3388ff', fillOpacity: 0.2 };
//   }
// };

// // Component điều khiển map khi có features (tự động fit bounds)
// const MapControllerWithFeatures = ({ bounds }: { bounds: L.LatLngBoundsExpression }) => {
//   const map = useMap();
//   useEffect(() => {
//     map.fitBounds(bounds);
//     map.setMaxBounds(VIETNAM_BOUNDS);
//     map.setMinZoom(6);
//   }, [map, bounds]);
//   return null;
// };

// // Component điều khiển map khi không có features (dùng center/zoom)
// const MapControllerWithCenter = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
//   const map = useMap();
//   useEffect(() => {
//     map.setView(center, zoom);
//     map.setMaxBounds(VIETNAM_BOUNDS);
//     map.setMinZoom(6);
//   }, [map, center, zoom]);
//   return null;
// };

// const PolygonLayer = ({ features }: { features: WarningFeature[] }) => {
//   const map = useMap();
//   const layerGroupRef = useRef<L.FeatureGroup | null>(null);

//   useEffect(() => {
//     if (!map || !features?.length) return;
//     if (layerGroupRef.current) map.removeLayer(layerGroupRef.current);
//     const group = L.featureGroup().addTo(map);
//     features.forEach(({ geometry, name, riskLevel }) => {
//       if (!geometry) return;
//       const { color, fillColor, fillOpacity } = getRiskColor(riskLevel);
//       const layer = L.geoJSON(geometry, {
//         style: { color, weight: 2, fillColor, fillOpacity },
//         onEachFeature: (feature, layer) => {
//           layer.bindTooltip(`${name} - ${riskLevel}`, { sticky: true });
//         },
//       });
//       layer.addTo(group);
//     });
//     layerGroupRef.current = group;
//     const bounds = group.getBounds();
//     if (bounds.isValid()) map.fitBounds(bounds);
//     return () => { if (layerGroupRef.current) map.removeLayer(layerGroupRef.current); };
//   }, [map, features]);

//   return null;
// };

// const GeoMap = ({ className, features, defaultCenter, defaultZoom }: GeoMapProps) => {
//   const hasFeatures = features && features.length > 0;
//   // Nếu không có features, dùng defaultCenter và defaultZoom (hoặc giá trị mặc định)
//   const center = defaultCenter || [16.0, 108.0];
//   const zoom = defaultZoom || 6;

//   return (
//     <MapContainer
//       center={center}
//       zoom={zoom}
//       className={className}
//       maxBounds={VIETNAM_BOUNDS}
//       maxBoundsViscosity={1.0}
//       style={{ background: '#e5e5e5' }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
//       />
//       {hasFeatures && <PolygonLayer features={features} />}
//       {hasFeatures && <MapControllerWithFeatures bounds={VIETNAM_BOUNDS} />}
//       {!hasFeatures && <MapControllerWithCenter center={center} zoom={zoom} />}
//     </MapContainer>
//   );
// };

// export default GeoMap;

// features/map/components/GeoMap.tsx
// ============================================================
// Map hiển thị polygon tô màu theo risk level
// Highlight vùng của user với viền đậm
// ============================================================
import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { AreaWithRisk } from "../types/mapType"
import { RISK_COLORS } from "../types/mapType"

interface GeoMapProps {
  areas: AreaWithRisk[]               // danh sách vùng có polygon + risk
  userAreaId?: string                 // id xã của user để highlight
  provinceName?: string               // tên tỉnh hiển thị
  loading?: boolean
  className?: string
  onAreaClick?: (area: AreaWithRisk) => void
}

const GeoMap = ({
  areas,
  userAreaId,
  provinceName,
  loading = false,
  className = "",
  onAreaClick,
}: GeoMapProps) => {
  const mapRef    = useRef<L.Map | null>(null)
  const layerRef  = useRef<L.LayerGroup | null>(null)
  const divRef    = useRef<HTMLDivElement>(null)

  // Init map 1 lần
  useEffect(() => {
    if (!divRef.current || mapRef.current) return

    mapRef.current = L.map(divRef.current, {
      center:    [16.047, 108.206],  // Việt Nam
      zoom:      6,
      zoomControl: true,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(mapRef.current)

    layerRef.current = L.layerGroup().addTo(mapRef.current)

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  // Vẽ polygon mỗi khi areas thay đổi
  useEffect(() => {
    if (!mapRef.current || !layerRef.current) return

    layerRef.current.clearLayers()
    if (areas.length === 0) return

    const bounds: L.LatLngBounds[] = []

    areas.forEach(area => {
      if (!area.geometry) return

      const isUserArea = area.id === userAreaId
      const colors     = RISK_COLORS[area.riskLevel]

      const layer = L.geoJSON(area.geometry as any, {
        style: {
          fillColor:   colors.fill,
          fillOpacity: 0.6,
          color:       isUserArea ? "#1E40AF" : colors.stroke,
          weight:      isUserArea ? 3 : 1.5,
          dashArray:   isUserArea ? undefined : undefined,
        },
      })

      // Popup khi hover
      layer.bindTooltip(
        `<div style="font-size:13px;font-weight:500">${area.tenkhuvuc}</div>
         <div style="font-size:12px;color:${colors.stroke}">${colors.label}</div>
         ${isUserArea ? '<div style="font-size:11px;color:#1E40AF">📍 Khu vực của bạn</div>' : ""}`,
        { sticky: true, opacity: 0.95 }
      )

      // Click → callback
      layer.on("click", () => onAreaClick?.(area))

      // Hover effect
      layer.on("mouseover", () => {
        layer.setStyle({ fillOpacity: 0.85, weight: 2.5 })
      })
      layer.on("mouseout", () => {
        layer.setStyle({
          fillOpacity: 0.6,
          weight: isUserArea ? 3 : 1.5,
        })
      })

      layer.addTo(layerRef.current!)

      // Collect bounds để auto-fit
      try {
        bounds.push(layer.getBounds())
      } catch {}
    })

    // Auto zoom vừa khung tỉnh
    if (bounds.length > 0) {
      const combined = bounds.reduce((acc, b) => acc.extend(b))
      mapRef.current.fitBounds(combined, { padding: [20, 20], animate: true })
    }
  }, [areas, userAreaId, onAreaClick])

  return (
    <div className={`relative ${className}`}>
      {/* Map */}
      <div ref={divRef} className="w-full h-full rounded-xl z-0" />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl z-10">
          <div className="flex items-center gap-2 text-blue-600">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            <span className="text-sm font-medium">Đang tải bản đồ...</span>
          </div>
        </div>
      )}

      {/* Province label */}
      {provinceName && (
        <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow text-sm font-medium text-slate-700">
          📍 {provinceName}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 right-2 z-10 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow">
        <p className="text-xs font-medium text-slate-500 mb-1.5">Mức độ nguy cơ</p>
        {(Object.entries(RISK_COLORS) as [keyof typeof RISK_COLORS, typeof RISK_COLORS[keyof typeof RISK_COLORS]][]).map(
          ([key, val]) => (
            <div key={key} className="flex items-center gap-2 mb-1">
              <div
                className="w-4 h-3 rounded-sm border"
                style={{ background: val.fill, borderColor: val.stroke }}
              />
              <span className="text-xs text-slate-600">{val.label}</span>
            </div>
          )
        )}
      </div>
    </div>
  )
}

export default GeoMap