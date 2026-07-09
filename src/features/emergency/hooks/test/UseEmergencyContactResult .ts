// features/hotline/hooks/useEmergencyContact.ts
import { useState } from "react";
import type { EmergencyContactRequest, EmergencyContactResult } from "../../types/emergencyType";
import { emergencyApi } from "../../api/emergencyApi";


interface UseEmergencyContactResult {
  isRequesting: boolean;
  error: string | null;
  /** Gọi API lấy số hotline, rồi tự mở cuộc gọi điện thoại thật (tel:) tới số đó. */
  requestAndCall: (
    payload: EmergencyContactRequest
  ) => Promise<EmergencyContactResult| null>;
}

export function useEmergencyContact(): UseEmergencyContactResult {
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestAndCall = async (
    payload: EmergencyContactRequest
  ): Promise<EmergencyContactResult | null> => {
    setIsRequesting(true);
    setError(null);

    try {
      const result = await emergencyApi.getEmergencyContact(payload);
      window.location.href = `tel:${result.emergencyPhone}`;
      return result;
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Không thể lấy số hotline. Vui lòng thử lại."
      );
      return null;
    } finally {
      setIsRequesting(false);
    }
  };

  return { isRequesting, error, requestAndCall };
}