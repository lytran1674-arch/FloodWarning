// features/sosrequest-anonymous/hooks/usesosrequestanonymous.ts
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { sosanonymousService } from '../services/sosanonymousService'
import type { CancelResponse } from '../types/sosanonymousType'
import type { SoSRequest, SoSResponse } from '@/features/sosrequest/types/sosType'

export const usesosrequestanonymous = () => {
  const [cancel, setCancel] = useState<CancelResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // =========================
  // CREATE SOS ANONYMOUS
  // =========================
  const createSosAnonymous = useCallback(
    async (payload: SoSRequest): Promise<SoSResponse> => {
      try {
        setLoading(true)
        setError(null)

        const response = await sosanonymousService.createSosAnonymous(payload)
        return response
      } catch (err: any) {
        console.error("CREATE SOS ANONYMOUS ERROR:", err)
        const message = err?.response?.data?.message || "Không thể gửi SOS"
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // =========================
  // CANCEL SOS ANONYMOUS
  // =========================
  const cancelSosRequestAnonymous = useCallback(
    async (sosId: string, sodt: string, clientDeviceId: string) => {
      setLoading(true)
      setError(null)
      try {
        const res = await sosanonymousService.cancelSosRequestAnonymous(sosId, sodt, clientDeviceId)
        setCancel(res)
        return res
      } catch (err: any) {
        console.error("CANCEL SOS ANONYMOUS ERROR:", err)
        const message = err?.response?.data?.message || "Lỗi không thể hủy yêu cầu!"
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    []
  )

  // =========================
  // UPDATE SOS ANONYMOUS
  // =========================
  const updateSoSAnonymous = async (
    id: string,
    payload: SoSRequest
  ): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      await sosanonymousService.updateSosAnonymous(id, payload)
      toast.success("Cập nhật SOS thành công")
      return true
    } catch (err: any) {
      console.error("UPDATE SOS ANONYMOUS ERROR:", err)
      const message = err?.response?.data?.message || "Không thể cập nhật SOS"
      setError(message)
      toast.error(message)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    cancel,
    error,
    loading,
    createSosAnonymous,
    cancelSosRequestAnonymous,
    updateSoSAnonymous,
  }
}