// features/sos/hooks/useSoS.ts

import { useState } from "react"
import type { ListSOS, SoSRequest, SoSResponse } from "../types/sosType"
import { sosService } from "../services/sosService"

export const useSoS = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [request, setRequest] = useState<ListSOS[]>([])

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

  return {
    listSosRequest,
    createSoS,
    updateSoS,
    loading,
    error,
    request,
  }
}