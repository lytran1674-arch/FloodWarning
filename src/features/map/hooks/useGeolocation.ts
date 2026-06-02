// src/hooks/useGeolocation.ts
import { useState, useEffect } from "react";
import type { GeolocationState } from "../types/mapType";


const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    accuracy: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          error: null,
          loading: false,
        });
      },
      (err) => {
        setState((prev) => ({
          ...prev,
          error: err.code === 1 ? "Please allow geolocation access" : "Cannot get location",
          loading: false,
        }));
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return state;
};

export default useGeolocation;