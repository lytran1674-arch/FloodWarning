// import { MapContainer, TileLayer } from 'react-leaflet';
// import AreaPolygon from './AreaPolygon';
// import 'leaflet/dist/leaflet.css';

// interface MapViewProps {
//   areaId: string;
//   areaName: string;
// }

// const MapView = ({ areaId, areaName }: MapViewProps) => {
//   // Tọa độ trung tâm mặc định (có thể lấy từ API nếu muốn)
//   const defaultCenter: [number, number] = [16.0, 108.0];
//   const defaultZoom = 6;

//   return (
//     <MapContainer
//       center={defaultCenter}
//       zoom={defaultZoom}
//       style={{ height: '100vh', width: '100%' }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
//       />
//       <AreaPolygon
//         areaId={areaId}
//         areaName={areaName}
//         color="#ff7800"
//         fillColor="#ff7800"
//         fillOpacity={0.3}
//         weight={3}
//       />
//     </MapContainer>
//   );
// };

// export default MapView;