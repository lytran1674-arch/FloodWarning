import { useEffect, useState } from "react";
import { type RequestSupportMyTeam } from "../types/provinceType";
import { provinceService } from "../services/provinceService";
import { provinceApi } from "../api/provinceApi";

export const useRequestSupport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestsupport, setrequestsupport] = useState<RequestSupportMyTeam[]>([]);

  const getListRequestSupportMyTeam = async () => {
    try {
      setLoading(true);
      const res: RequestSupportMyTeam[] = await provinceService.getListRequestSupportMyTeam();
      setrequestsupport(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const assignGroupToRequest = async (id: string, groupId: string, note = "") => {
    try {
      setLoading(true);
      await provinceApi.assignmentRequestSupport(id, { groupId, note });
      return true;
    } catch (err) {
      setError("Phân công thất bại, vui lòng thử lại");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListRequestSupportMyTeam();
  }, []);

  return {
    requestsupport,
    setrequestsupport,
    loading,
    error,
    getListRequestSupportMyTeam,
    assignGroupToRequest,
  };
};