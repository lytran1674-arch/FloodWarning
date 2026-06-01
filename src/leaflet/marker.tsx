import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import iconViTri from "../assets/iconViTri.png"
import L from "leaflet"
type Props = {
  selectedArea: any;
};



export const MarkerMap = ({ selectedArea }: Props) => {
  const center: [number, number] = [10.49437, 106.60412];

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <MapContainer center={center} zoom={9} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

       
        {selectedArea?.lat && selectedArea?.lon && (
          <Marker position={[Number(selectedArea.lat), Number(selectedArea.lon)]}>
            <Popup>{selectedArea.ten_khuvuc}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};