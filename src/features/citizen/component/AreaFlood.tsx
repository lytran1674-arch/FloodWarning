import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { Button } from '../../../components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { axiosClient } from '@/api/axiosClient'
import { useAppSelector } from '../../../hooks/redux.hooks'

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export interface AreaForecast {
  area_id: string
  tenKhuVuc: string
  lead1: RiskLevel
  lead1Probability: number
  lead2: RiskLevel
  lead2Probability: number
  lead3: RiskLevel
  lead3Probability: number
  predictedAt: string
  weatherFrom: string
  weatherTo: string
}

const RISK_CONFIG: Record<RiskLevel, { label: string; badgeBg: string; badgeText: string }> = {
  HIGH: { label: 'Nguy hiểm cao', badgeBg: 'bg-[#EE0F0F]', badgeText: 'text-white' },
  MEDIUM: { label: 'Cảnh báo', badgeBg: 'bg-[#F59E0B]', badgeText: 'text-white' },
  LOW: { label: 'An toàn', badgeBg: 'bg-[#22C55E]', badgeText: 'text-white' },
}

const LEAD_LABELS = ['Ngày mai', 'Ngày kia', 'Ngày mốt']

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

export const AreaFlood = () => {
  const [data, setData] = useState<AreaForecast | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ✅ Lấy areaId từ Redux thay vì localStorage
  const user = useAppSelector(state => state.auth.user)
  const areaId = user?.areaId ?? null

  useEffect(() => {
    if (!areaId) {
      setError('Không tìm thấy khu vực của bạn. Vui lòng đăng nhập lại.')
      setLoading(false)
      return
    }

    const fetchForecast = async () => {
      try {
        setLoading(true)
        setError(null)

        // ✅ dùng axiosClient thay vì fetch
        const res = await axiosClient.get('/predict/list-by-area', {
          params: { areaId },
        })

        const json: AreaForecast[] = res.data.result ?? res.data ?? []
        setData(json[0] ?? null)
      } catch (err) {
        setError('Không thể tải dữ liệu dự báo. Vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    }

    fetchForecast()
  }, [areaId]) // ✅ reactive theo areaId

  return (
    <div>
      <div className="hidden lg:flex flex-col gap-2 w-[400px] xl:w-[300px] shrink-0">
        <div className="border rounded-md">
          <p className="text-[8px] lg:text-[13px] sm:text-[10px] p-1 font-bold">
            MỨC ĐỘ NGUY CƠ TẠI KHU VỰC CỦA BẠN
          </p>

          {loading && (
            <div className="m-1 p-2 text-[10px] lg:text-xs text-gray-400">
              Đang tải dữ liệu...
            </div>
          )}

          {!loading && error && (
            <div className="m-1 p-2 text-[10px] lg:text-xs text-red-500">
              {error}
            </div>
          )}

          {!loading && !error && data && (
            <>
              <div className={`${RISK_CONFIG[data.lead1].badgeBg} rounded-md m-1 flex items-center gap-2 p-1`}>
                <Icon icon="fa7-solid:house-flood-water" className="lg:text-4xl sm:text-xl text-sm text-white" />
                <p className="text-white lg:text-sm text-xs text-[8px] lg:text-[14px] sm:text-[10px]">
                  {RISK_CONFIG[data.lead1].label.toUpperCase()}<br />
                  Nguy cơ ngập lụt {data.lead1 === 'HIGH' ? 'rất cao' : data.lead1 === 'MEDIUM' ? 'cần lưu ý' : 'thấp'}
                </p>
              </div>
              <Button className="text-[#1C5FE5] text-xs flex items-center gap-1 px-2 pb-2">
                Xem chi tiết <ArrowRight size={13} />
              </Button>

              <div className="border-t mx-1 pt-2 pb-2 px-1">
                <p className="text-[8px] lg:text-[11px] sm:text-[9px] font-bold mb-2 text-gray-700">
                  DỰ BÁO 3 NGÀY TỚI · {data.tenKhuVuc.toUpperCase()}
                </p>
                <div className="flex flex-col gap-1.5">
                  {[
                    { label: LEAD_LABELS[0], level: data.lead1, probability: data.lead1Probability },
                    { label: LEAD_LABELS[1], level: data.lead2, probability: data.lead2Probability },
                    { label: LEAD_LABELS[2], level: data.lead3, probability: data.lead3Probability },
                  ].map((lead, idx) => {
                    const config = RISK_CONFIG[lead.level]
                    return (
                      <div key={idx} className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
                        <span className="text-[8px] lg:text-[12px] sm:text-[10px] font-medium text-gray-700">
                          {lead.label}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8px] lg:text-[11px] sm:text-[9px] text-gray-500">
                            {formatPercent(lead.probability)}
                          </span>
                          <span className={`${config.badgeBg} ${config.badgeText} text-[7px] lg:text-[10px] sm:text-[8px] font-semibold rounded-full px-2 py-0.5 whitespace-nowrap`}>
                            {config.label}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="border rounded-md p-2">
          <div className="flex justify-between items-center">
            <p className="text-xs sm:text-sm font-bold">CẢNH BÁO GẦN ĐÂY</p>
            <Button className="text-[#1C5FE5] text-xs flex items-center gap-1">
              Xem tất cả <ArrowRight size={12} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}