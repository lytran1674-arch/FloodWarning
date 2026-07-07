import { useState } from 'react'
import { emergencyService } from '../services/emergencyService';
import type { Emergency } from '../types/emergencyType';

export const useEmergency = () => {
  const [data, setData] = useState<Emergency>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const CallHotline = async () => {
    setError("")

    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị GPS")
      return
    }

    setLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res = await emergencyService.getHotlineTeam(latitude, longitude)
          setData(res)

          // Gọi điện ngay sau khi lấy được số hotline
          if (res?.emergencyPhone) {
            window.location.href = `tel:${res.emergencyPhone}`
          }
        } catch (err) {
          console.error(err)
          setError("Không thể lấy được hotline của đội cứu hộ")
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        console.error(err)
        setError("Không thể lấy vị trí GPS, vui lòng bật định vị và cấp quyền truy cập vị trí")
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return { data, CallHotline, loading, error }
}