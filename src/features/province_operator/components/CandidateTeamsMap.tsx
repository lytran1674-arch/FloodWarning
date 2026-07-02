// // src/features/province_operator/components/CandidateTeamsMap.tsx
// import { useEffect, useRef } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import type { CandidateTeam } from "../types/provinceType";

// interface CandidateTeamsMapProps {
//   sosLat: number;
//   sosLon: number;
//   teams: CandidateTeam[];
//   selectedTeamId: string | null;
//   onSelectTeam: (id: string) => void;
// }

// export function CandidateTeamsMap({
//   sosLat,
//   sosLon,
//   teams,
//   selectedTeamId,
//   onSelectTeam,
// }: CandidateTeamsMapProps) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const mapRef = useRef<L.Map | null>(null);
//   const markersRef = useRef<L.Marker[]>([]);

//   useEffect(() => {
//     if (!containerRef.current || mapRef.current) return;

//     const map = L.map(containerRef.current).setView([sosLat, sosLon], 13);
//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: "&copy; OpenStreetMap contributors",
//     }).addTo(map);

//     mapRef.current = map;
//     return () => {
//       map.remove();
//       mapRef.current = null;
//     };
//   }, []);

//   useEffect(() => {
//     const map = mapRef.current;
//     if (!map) return;

//     markersRef.current.forEach((m) => m.remove());
//     markersRef.current = [];

//     // Marker SOS - đỏ
//     const sosIcon = L.divIcon({
//       className: "",
//       html: `<div style="background:#dc2626;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)"></div>`,
//       iconSize: [28, 28],
//       iconAnchor: [14, 28],
//     });
//     const sosMarker = L.marker([sosLat, sosLon], { icon: sosIcon }).addTo(map);
//     sosMarker.bindTooltip("Vị trí yêu cầu SOS", { permanent: false });
//     markersRef.current.push(sosMarker);

//     // Marker từng team - xanh, đánh số
//     teams.forEach((team, index) => {
//       const isSelected = team.id === selectedTeamId;
//       const teamIcon = L.divIcon({
//         className: "",
//         html: `<div style="background:${isSelected ? "#2563eb" : "#60a5fa"};width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:600;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.4)">${index + 1}</div>`,
//         iconSize: [26, 26],
//         iconAnchor: [13, 13],
//       });
//       const marker = L.marker([team.lat, team.lon], { icon: teamIcon }).addTo(
//         map
//       );
//       marker.bindTooltip(team.teamName, { permanent: false });
//       marker.on("click", () => onSelectTeam(team.id));
//       markersRef.current.push(marker);
//     });
//   }, [teams, selectedTeamId, sosLat, sosLon]);

//   return (
//     <div
//       ref={containerRef}
//       className="w-full h-[320px] rounded-lg overflow-hidden border border-gray-200"
//     />
//   );
// }