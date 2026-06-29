import { useEffect, useState } from 'react'
import { axiosClient } from '@/api/axiosClient'
import type { SoSResponse } from '../types/sosType'

type Props = {
  id: string | null
}

export default function SosDetailModal({ id }: Props) {
  const [data, setData] = useState<SoSResponse | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id) return  // ← không fetch nếu chưa có id

    const fetch = async () => {
      setLoading(true)
      try {
        const res = await axiosClient.get(`/sos-request/${id}`)
        setData(res.data?.result ?? res.data)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])  // ← id thay đổi thì fetch lại

  if (loading) return <p className="text-sm text-gray-400 text-center py-6">Đang tải...</p>
  if (!data)   return null

  return (
    <div className="flex flex-col gap-2 text-sm text-gray-700">
      {/*<Row label="Địa chỉ"      value={data.diachi} />*/}
      <Row label="Mô tả"        value={data.mota} />
      <Row label="Số nạn nhân"  value={data.victimCount} />
      <Row label="Ưu tiên"      value={data.priority} />
      <Row label="Trạng thái"   value={data.status} />
    </div>
  )
}

// Component nhỏ để tái sử dụng từng dòng
function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-400 w-28 shrink-0">{label}</span>
      <span className="font-medium">{value ?? '—'}</span>
    </div>
  )
}