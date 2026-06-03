import { CurrentLocationLayer } from "./CurrentLocationLayer";
import { AreaPolygonLayer } from "./AreaPolygonLayer";
import { useLeafletMap } from "../hooks/useLeafletMap";

interface GeoMapProps {
  defaultCenter?: [number, number];
  defaultZoom?: number;
  height?: string;
  selectedGeometry?: any;
  selectedName?: string;
  showCurrentLocation?: boolean;
}

const GeoMap = ({
  defaultCenter = [16.0471, 108.2068],
  defaultZoom = 13,
  height = "350px",
  selectedGeometry,
  selectedName,
  showCurrentLocation = true,
}: GeoMapProps) => {
  const { containerRef, mapRef } = useLeafletMap(defaultCenter, defaultZoom);

  return (
    <div className="w-full">
      <div ref={containerRef} style={{ height }} className="w-full rounded-lg" />

      {showCurrentLocation && (
        <CurrentLocationLayer
          map={mapRef.current}
          disabledAutoZoom={Boolean(selectedGeometry)}
        />
      )}

      <AreaPolygonLayer
        map={mapRef.current}
        geometry={selectedGeometry}
        name={selectedName}
      />
    </div>
  );
};

export default GeoMap;