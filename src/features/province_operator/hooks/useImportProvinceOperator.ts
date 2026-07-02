// src/features/province_operator/hooks/useImportProvinceOperator.ts
import { useState } from "react";
import type { ImportProvinceOperatorResponse } from "../types/provinceType";
import { provinceoperatorApi } from "../api/provinceoperatorApi";

export function useImportProvinceOperator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportProvinceOperatorResponse | null>(
    null
  );

  const importFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await provinceoperatorApi.importProvinceOperators(file);
      setResult(res);
      return res;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Import thất bại, vui lòng thử lại";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { importFile, loading, error, result, reset };
}