// // src/hooks/useGeolocation.ts
// import { useState, useEffect } from "react";
// import type { GeolocationState } from "../types/mapType";


// const useGeolocation = () => {
//   const [state, setState] = useState<GeolocationState>({
//     lat: null,
//     lng: null,
//     accuracy: null,
//     error: null,
//     loading: true,
//   });

//   useEffect(() => {
//     const watchId = navigator.geolocation.watchPosition(
//       (pos) => {
//         setState({
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//           accuracy: pos.coords.accuracy,
//           error: null,
//           loading: false,
//         });
//       },
//       (err) => {
//         setState((prev) => ({
//           ...prev,
//           error: err.code === 1 ? "Please allow geolocation access" : "Cannot get location",
//           loading: false,
//         }));
//       }
//     );

//     return () => navigator.geolocation.clearWatch(watchId);
//   }, []);

//   return state;
// };

// export default useGeolocation;

// hooks/useGeoLocation.ts
import { useState, useCallback } from "react"

interface GeoState {
  lat: number | null
  lon: number | null
  loading: boolean
  error: string | null
}

export const useGeoLocation = () => {
  const [state, setState] = useState<GeoState>({
    lat: null, lon: null,
    loading: false, error: null,
  })

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: "Trình duyệt không hỗ trợ GPS" }))
      return
    }

    setState(s => ({ ...s, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          lat:     pos.coords.latitude,
          lon:     pos.coords.longitude,
          loading: false,
          error:   null,
        })
      },
      (err) => {
        const msg =
          err.code === 1 ? "Bạn chưa cho phép truy cập vị trí" :
          err.code === 2 ? "Không xác định được vị trí"         :
                           "Hết thời gian chờ GPS"
        setState(s => ({ ...s, loading: false, error: msg }))
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [])

  return { ...state, getLocation }
}