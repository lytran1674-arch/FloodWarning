import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Props = {
  selectedArea: any;
};

function MoveMap({ selectedArea }: Props) {
  const map = useMap();

  if (selectedArea?.lat && selectedArea?.lon) {
    map.flyTo([Number(selectedArea.lat), Number(selectedArea.lon)], 14);
  }

  return null;
}

export const BasicMap = ({ selectedArea }: Props) => {
  const center: [number, number] = [10.49437, 106.60412];

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden">
      <MapContainer center={center} zoom={9} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MoveMap selectedArea={selectedArea} />

        {selectedArea?.lat && selectedArea?.lon && (
          <Marker position={[Number(selectedArea.lat), Number(selectedArea.lon)]}>
            <Popup>{selectedArea.ten_khuvuc}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};