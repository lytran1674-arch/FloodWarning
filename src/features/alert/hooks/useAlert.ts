import { useState, useEffect, useCallback } from "react"
import { alertService } from "../services/alertService"
import type { Alert } from "../types/alertType"

export const useMyAlerts = (userId: string) => {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const loadAlerts = useCallback(async () => {
    if (!userId) return
    try {
      setLoading(true)
      setError("")
      const result = await alertService.getMyAlertById(userId)
      setAlerts(result)
    } catch (err) {
      console.error(err)
      setError("Không thể tải danh sách cảnh báo")
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadAlerts()
  }, [loadAlerts])

  return { alerts, loading, error, reload: loadAlerts }
}