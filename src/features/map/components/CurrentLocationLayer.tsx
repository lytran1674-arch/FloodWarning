// import { useEffect, useRef } from "react";
// import L from "leaflet";
// import  useGeolocation from "../hooks/useGeolocation";

// interface Props {
//   map: L.Map | null;
//   disabledAutoZoom?: boolean;
// }

// export const CurrentLocationLayer = ({
//   map,
//   disabledAutoZoom = false,
// }: Props) => {
//   const markerRef = useRef<L.Marker | null>(null);
//   const circleRef = useRef<L.Circle | null>(null);
//   const zoomedRef = useRef(false);

//   const { lat, lng, accuracy } = useGeolocation();

//   useEffect(() => {
//     if (!map || lat === null || lng === null || accuracy === null) return;

//     if (markerRef.current) {
//       markerRef.current.setLatLng([lat, lng]);
//     } else {
//       markerRef.current = L.marker([lat, lng])
//         .addTo(map)
//         .bindPopup("Vị trí hiện tại");
//     }

//     if (circleRef.current) {
//       circleRef.current.setLatLng([lat, lng]);
//       circleRef.current.setRadius(accuracy);
//     } else {
//       circleRef.current = L.circle([lat, lng], {
//         radius: accuracy,
//       }).addTo(map);
//     }

//     if (disabledAutoZoom) return;

//     if (!zoomedRef.current) {
//       map.fitBounds(circleRef.current.getBounds(), {
//         padding: [30, 30],
//         maxZoom: 16,
//       });

//       zoomedRef.current = true;
//     }
//   }, [map, lat, lng, accuracy, disabledAutoZoom]);

//   return null;
// };