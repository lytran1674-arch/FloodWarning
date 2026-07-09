// Hook lấy vị trí + gọi SOS
import { useState, useCallback } from "react";
import { emergencyService } from "../services/emergencyService";

export const useEmergency = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Nhận callerPhoneNumber từ nơi gọi (component có input số điện thoại),
  // vì getEmergencyContact bắt buộc field này trong payload.
  const callSos = useCallback((callerPhoneNumber: string) => {
    if (!("geolocation" in navigator)) {
      setError("Trình duyệt không hỗ trợ định vị");
      return;
    }

    if (!callerPhoneNumber?.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const team = await emergencyService.getEmergencyContact({
            lat: latitude,
            lon: longitude,
            callerPhoneNumber: callerPhoneNumber.trim(),
          });

          if (!team?.emergencyPhone) {
            setError("Không tìm thấy đội cứu hộ gần bạn");
            return;
          }

          // Chuyển sang bàn phím gọi điện
          window.location.href = `tel:${team.emergencyPhone}`;
        } catch (err) {
          setError("Không lấy được thông tin đội cứu hộ, vui lòng thử lại");
        } finally {
          setLoading(false);
        }
      },
      (_geoErr) => {
        setLoading(false);
        setError("Không lấy được vị trí. Vui lòng bật định vị (GPS)");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return { callSos, loading, error };
};