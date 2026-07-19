// features/hotline/hooks/useCreateHotlineSos.ts
import { useState } from "react";
import type { SosHotlineCreateResult, SosHotlineRequestPayload } from "../../types/emergencyType";
import { emergencyApi } from "../../api/emergencyApi";


interface UseCreateHotlineSosResult {
  createSos: (
    payload: SosHotlineRequestPayload
  ) => Promise<SosHotlineCreateResult | null>;
  isSubmitting: boolean;
  error: string | null;
}

export function useCreateHotlineSos(): UseCreateHotlineSosResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

const createSos = async (
  payload: SosHotlineRequestPayload
): Promise<SosHotlineCreateResult | null> => {
  setIsSubmitting(true)
  setError(null)

  try {
    const result = await emergencyApi.createHotlineSos(payload)

    // ✅ Thêm 2 dòng log này
    console.log("[DEBUG] API result:", JSON.stringify(result, null, 2))
    console.log("[DEBUG] initialCallTask:", result?.initialCallTask)

    return result
  } catch (err: any) {
    setError(err?.response?.data?.message ?? "Không thể tạo SOS. Vui lòng thử lại.")
    return null
  } finally {
    setIsSubmitting(false)
  }
}

  return { createSos, isSubmitting, error };
}