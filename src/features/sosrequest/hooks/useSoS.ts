// features/sos/hooks/useSoS.ts

import { useCallback, useState } from "react"
import { toast } from "react-toastify"

import { sosService } from "../services/sosService"

import type {
  AssignSos,
  DetailSos,
  ListSOS,
  SoSRequest,
  SoSResponse,
} from "../types/sosType"

export const useSoS = () => {
  // =========================
  // STATE
  // =========================
  const [loading, setLoading] =
    useState(false)

  const [submit, setSubmitting] =
    useState(false)

  const [error, setError] = useState<
    string | null
  >(null)

  // =========================
  // DATA
  // =========================
  const [request, setRequest] =
    useState<ListSOS[]>([])

  const [detailSOS, setDetailSOS] =
    useState<DetailSos | null>(null)

  // =========================
  // CREATE SOS
  // =========================
  const createSoS = async (
    payload: SoSRequest
  ): Promise<SoSResponse> => {
    try {
      setLoading(true)
      setError(null)

      const response =
        await sosService.createsos(payload)

      toast.success(
        response.alreadyExists
          ? "Cập nhật SOS thành công"
          : "Gửi SOS thành công"
      )

      return response
    } catch (err: any) {
      console.error(
        "CREATE SOS ERROR:",
        err
      )

      const message =
        err?.response?.data?.message ||
        "Không thể gửi SOS"

      setError(message)

      toast.error(message)

      throw err
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // LIST SOS
  // =========================
  const listSosRequest =
    useCallback(async () => {
      try {
        setLoading(true)
        setError(null)

        const data =
          await sosService.getListSosRequest()

        setRequest(data)

        return data
      } catch (err: any) {
        console.error(
          "LIST SOS ERROR:",
          err
        )

        const message =
          err?.response?.data?.message ||
          "Không thể tải danh sách SOS"

        setError(message)

        toast.error(message)

        return []
      } finally {
        setLoading(false)
      }
    }, [])

  // =========================
  // DETAIL SOS
  // =========================
  const getDetailSoS =
    useCallback(
      async (
        id: string
      ): Promise<DetailSos | null> => {
        try {
          if (!id) return null

          setLoading(true)
          setError(null)

          const data =
            await sosService.getDetailSoS(
              id
            )

          setDetailSOS(data)

          return data
        } catch (err: any) {
          console.error(
            "GET DETAIL SOS ERROR:",
            err
          )

          const message =
            err?.response?.data?.message ||
            "Không thể tải chi tiết SOS"

          setError(message)

          toast.error(message)

          return null
        } finally {
          setLoading(false)
        }
      },
      []
    )

  // =========================
  // UPDATE SOS
  // =========================
  const updateSoS = async (
    id: string,
    payload: SoSRequest
  ): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)

      await sosService.updateSOS(
        id,
        payload
      )

      toast.success(
        "Cập nhật SOS thành công"
      )

      return true
    } catch (err: any) {
      console.error(
        "UPDATE SOS ERROR:",
        err
      )

      const message =
        err?.response?.data?.message ||
        "Không thể cập nhật SOS"

      setError(message)

      toast.error(message)

      return false
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // ASSIGNMENT
  // =========================
  const assignment = async (
    payload: AssignSos
  ): Promise<boolean> => {
    try {
      setSubmitting(true)
      setError(null)

      const assignmentId =
        await sosService.postassign(
          payload
        )

      console.log(
        "Assignment ID:",
        assignmentId
      )

      toast.success(
        "Phân công cứu hộ thành công"
      )

      return true
    } catch (err: any) {
      console.error(
        "ASSIGNMENT ERROR:",
        err
      )

      const message =
        err?.response?.data?.message ||
        "Phân công cứu hộ thất bại"

      setError(message)

      toast.error(message)

      return false
    } finally {
      setSubmitting(false)
    }
  }

    // =========================
  // LIST SOS ANONYMOUS
  // =========================
  const listAnonymousSosRequest =
    useCallback(async () => {
      try {
        setLoading(true)
        setError(null)

        const data =
          await sosService.getListAnonymousSosRequest()

        setRequest(data)

        return data
      } catch (err: any) {
        console.error(
          "LIST SOS ERROR:",
          err
        )

        const message =
          err?.response?.data?.message ||
          "Không thể tải danh sách SOS"

        setError(message)

        toast.error(message)

        return []
      } finally {
        setLoading(false)
      }
    }, [])
  // =========================
  // RESET DETAIL
  // =========================
  const clearDetailSOS = () => {
    setDetailSOS(null)
  }

  // =========================
  // RETURN
  // =========================
  return {
    // state
    loading,
    submit,
    error,

    // data
    request,
    detailSOS,

    // actions
    createSoS,
    listSosRequest,
    getDetailSoS,
    updateSoS,
    assignment,
    clearDetailSOS,
    listAnonymousSosRequest,
    // custom setters
    setRequest,
    setDetailSOS,
  }
}