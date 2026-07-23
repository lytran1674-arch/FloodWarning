// features/sos/hooks/useSoS.ts

import { useCallback, useEffect, useState } from "react"
import type { AssignSos, AssignSosResult, DetailSos, ListSOS, SentedSupportRequest, SoSRequest, SoSResponse } from "../../sosrequest/types/sosType"
import { sosService } from "../../sosrequest/services/sosService"
import { toast } from "react-toastify"

import { SoSAPI } from "@/features/sosrequest/api/sosApi"

export const useSoS = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [request] = useState<ListSOS[]>([])
  const [submit, setSubmitting] = useState(false)
   const [requests, setRequests] = useState<SentedSupportRequest[]>([]);

  const [detail, setDetail] = useState<DetailSos | null>(null); // phải là DetailSos, không phải DetailSoSCitizen

const getDetailSoS = async (id: string) => {
  try {
    setLoading(true);
    setError("");
    const data = await sosService.getDetailSoS(id); // gọi đúng bản rescuer (DetailSos)
    setDetail(data);
    return data;
  } catch (err: any) {
    setError(err?.response?.data?.message || "Không thể tải chi tiết SOS");
    return null;
  } finally {
    setLoading(false);
  }
};
  // Tạo mới hoặc cập nhật — BE tự phân biệt qua sodt + clientDeviceId
  // Trả về SoSResponse với alreadyExists để FormSOS xử lý navigate
  const createSoS = async (payload: SoSRequest): Promise<SoSResponse> => {
    try {
      setLoading(true)
      setError("")
      return await sosService.createsos(payload)
    } catch (error: any) {
      setError(error?.response?.data?.message || "Không thể gửi SOS")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await SoSAPI.SentedSupportRequest();
      setRequests(data);
    } catch (err: any) {
      // ✅ thêm catch để không văng lỗi ra console dạng uncaught
      console.error("FETCH SUPPORT REQUEST ERROR:", err);
      setError(err?.response?.data?.message || "Không thể tải yêu cầu hỗ trợ");
    } finally {
      setLoading(false);
    }
  }, []);

useEffect(() => {
  fetchData(); // ⚠️ tự động chạy MỖI KHI bất kỳ trang nào gọi useSoS(), không cần biết trang đó có cần data này không
}, []);
  

  // const listSosRequest = async () => {
  //   try {
  //     setLoading(true)
  //     setError("")
  //     const data = await sosService.getListSosRequest()
  //     setRequest(data)
  //   } catch (error) {
  //     console.log(error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  
  useEffect(() => {
    fetchData();
  }, []);

  const updateSoS = async (
    id: string,
    payload: SoSRequest
  ) => {
    return await sosService.updateSOS(
      id,
      payload
    )
  }

const assignment = async (
    payload: AssignSos
  ): Promise<AssignSosResult | null> => {
    try {
      setSubmitting(true)
      const res = await sosService.postassign(payload)
      console.log("Phân công thành công:", res)
      return res
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Phân công cứu hộ thất bại"
      )
      return null
    } finally {
      setSubmitting(false)
    }
  }
  return {
    // listSosRequest,
    createSoS,
    updateSoS,
    assignment,
    submit,
    loading,
    error,
    request,
    requests,
    refresh:fetchData,
    getDetailSoS,
    detail
  }
}