// import { useEffect, useRef } from 'react';
// import { useMap } from 'react-leaflet';
// import L from 'leaflet';
// import { fetchAreaGeometry } from '../utils/areaApi';
// import type { AreaGeometry } from '../utils/areaApi'; // type-only import

// interface AreaPolygonProps {
//   areaId: string;
//   areaName: string;
//   color?: string;
//   fillColor?: string;
//   fillOpacity?: number;
//   weight?: number;
// }

// const AreaPolygon = ({
//   areaId,
//   areaName,
//   color = '#3388ff',
//   fillColor = '#3388ff',
//   fillOpacity = 0.4,
//   weight = 2,
// }: AreaPolygonProps) => {
//   const map = useMap();
//   const layerRef = useRef<L.GeoJSON | null>(null);

//   useEffect(() => {
//     let isMounted = true;

//     const loadAndDisplay = async () => {
//       const geometry = await fetchAreaGeometry(areaId);
//       if (!isMounted) return;
//       if (!geometry) {
//         console.warn(`No geometry for area: ${areaName} (${areaId})`);
//         return;
//       }

//       if (layerRef.current) {
//         map.removeLayer(layerRef.current);
//       }

//       const newLayer = L.geoJSON(geometry as any, {
//         style: {
//           color,
//           weight,
//           fillColor,
//           fillOpacity,
//         },
//         onEachFeature: (feature, layer) => {
//           layer.bindTooltip(areaName, { sticky: true, direction: 'center' });
//           layer.on('click', () => console.log(`Clicked on ${areaName}`));
//         },
//       }).addTo(map);

//       layerRef.current = newLayer;
//       map.fitBounds(newLayer.getBounds());
//     };

//     loadAndDisplay();

//     return () => {
//       isMounted = false;
//       if (layerRef.current) {
//         map.removeLayer(layerRef.current);
//       }
//     };
//   }, [map, areaId, areaName, color, fillColor, fillOpacity, weight]);

//   return null;
// };

// export default AreaPolygon;