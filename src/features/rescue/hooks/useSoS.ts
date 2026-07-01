// features/sos/hooks/useSoS.ts

import { useState } from "react"
import type { AssignSos, ListSOS, SoSRequest, SoSResponse } from "../../sosrequest/types/sosType"
import { sosService } from "../../sosrequest/services/sosService"
import { toast } from "react-toastify"

export const useSoS = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [request, setRequest] = useState<ListSOS[]>([])
  const [submit, setSubmitting] = useState(false)

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

  const listSosRequest = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await sosService.getListSosRequest()
      setRequest(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const updateSoS = async (
    id: string,
    payload: SoSRequest
  ) => {
    return await sosService.updateSOS(
      id,
      payload
    )
  }

const assignment = async (payload: AssignSos): Promise<boolean> => {
  try {
    setSubmitting(true)
    await sosService.postassign(payload)
    console.log("POST dữ liệu thành công")
    toast.success("Phân công cứu hộ thành công")
    return true
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Phân công cứu hộ thất bại")
    return false
  } finally {
    setSubmitting(false)
  }
}

  return {
    listSosRequest,
    createSoS,
    updateSoS,
    assignment,
    submit,
    loading,
    error,
    request,
  }
}