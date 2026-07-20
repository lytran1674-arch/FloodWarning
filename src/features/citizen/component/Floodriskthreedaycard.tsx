// import { FloodriskdataService } from '@/features/floodriskdata/services/floodriskService';
// import type { FloodRiskData } from '@/features/floodriskdata/types/floodriskType';
// import { useAppSelector } from '@/hooks/redux.hooks';
// import { useEffect, useMemo, useState } from 'react'

// type LeadKey = 1 | 2 | 3

// const RISK_CONFIG: Record<string, { label: string; badge: string; bar: string }> = {
//   LOW: {
//     label: 'Thấp',
//     badge: 'bg-green-100 text-green-700 border-green-300',
//     bar: 'bg-green-500',
//   },
//   MEDIUM: {
//     label: 'Trung bình',
//     badge: 'bg-amber-100 text-amber-700 border-amber-300',
//     bar: 'bg-amber-500',
//   },
//   HIGH: {
//     label: 'Cao',
//     badge: 'bg-red-100 text-red-700 border-red-300',
//     bar: 'bg-red-500',
//   },
// }

// function formatShortDate(date: Date) {
//   return date.toLocaleDateString('vi-VN', {
//     weekday: 'short',
//     day: '2-digit',
//     month: '2-digit',
//   })
// }

// function formatFullDate(value?: string) {
//   if (!value) return '—'
//   return new Date(value).toLocaleDateString('vi-VN')
// }

// export const FloodRiskThreeDayCard = () => {
//   const [data, setData] = useState<FloodRiskData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [activeLead, setActiveLead] = useState<LeadKey>(1)

//   const user = useAppSelector((state) => state.auth.user)
//   const areaId = user?.areaId

//   useEffect(() => {
//     // Chặn gọi API khi chưa có areaId hợp lệ -> tránh lỗi 400 do gửi areaId=null/undefined
//     if (!areaId) {
//       setLoading(false)
//       setError('Không xác định được khu vực (areaId trống). Vui lòng chọn lại khu vực.')
//       return
//     }

//     let mounted = true
//     setLoading(true)
//     setError(null)

//     FloodriskdataService.getListPredictById(areaId)
//       .then((res) => {
//         if (!mounted) return
//         // API /predict/list-by-area trả về mảng, lấy bản ghi mới nhất (index 0)
//         const latest = Array.isArray(res) ? res[0] : res
//         setData((latest as unknown as FloodRiskData) ?? null)
//       })
//       .catch(() => {
//         if (mounted) setError('Không thể tải dữ liệu dự đoán lũ')
//       })
//       .finally(() => {
//         if (mounted) setLoading(false)
//       })

//     return () => {
//       mounted = false
//     }
//   }, [areaId])

//   // Tính nhãn ngày thực tế (dựa trên predictedAt) cho ngày mai / ngày kia / ngày mốt
//   const dayLabels = useMemo(() => {
//     const base = data?.predictedAt ? new Date(data.predictedAt) : new Date()
//     return [1, 2, 3].map((offset) => {
//       const d = new Date(base)
//       d.setDate(d.getDate() + offset)
//       return formatShortDate(d)
//     })
//   }, [data])

//   if (loading) {
//     return (
//       <div className="animate-pulse rounded-xl border border-gray-200 p-4 text-sm text-gray-400">
//         Đang tải dữ liệu dự đoán...
//       </div>
//     )
//   }

//   if (error || !data) {
//     return (
//       <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
//         {error ?? 'Không có dữ liệu dự đoán cho khu vực này'}
//       </div>
//     )
//   }

//   const leads: Record<LeadKey, { risk: string; probability: number; label: string }> = {
//     1: { risk: data.lead1, probability: data.lead1Probability, label: 'Ngày mai' },
//     2: { risk: data.lead2, probability: data.lead2Probability, label: 'Ngày kia' },
//     3: { risk: data.lead3, probability: data.lead3Probability, label: 'Ngày mốt' },
//   }

//   const current = leads[activeLead]
//   const config = RISK_CONFIG[current.risk] ?? RISK_CONFIG.LOW
//   const percent = Math.round(current.probability * 100)

//   return (
//     <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
//       <div className="mb-3 flex items-center justify-between">
//         <h3 className="text-base font-semibold text-gray-800">{data.tenKhuVuc}</h3>
//         <span className="text-xs text-gray-400">
//           Cập nhật: {new Date(data.predictedAt).toLocaleString('vi-VN')}
//         </span>
//       </div>

//       {/* 3 nút chuyển đổi ngày mai / ngày kia / ngày mốt */}
//       <div className="mb-4 grid grid-cols-3 gap-2">
//         {([1, 2, 3] as LeadKey[]).map((key) => {
//           const lead = leads[key]
//           const c = RISK_CONFIG[lead.risk] ?? RISK_CONFIG.LOW
//           const isActive = activeLead === key
//           return (
//             <button
//               key={key}
//               type="button"
//               onClick={() => setActiveLead(key)}
//               className={`flex flex-col items-center rounded-lg border px-2 py-2 transition ${
//                 isActive
//                   ? 'border-[#1565C0] ring-2 ring-[#1565C0]/30'
//                   : 'border-gray-200 hover:border-gray-300'
//               }`}
//             >
//               <span className="text-xs font-medium text-gray-600">{lead.label}</span>
//               <span className="mt-0.5 text-[10px] text-gray-400">{dayLabels[key - 1]}</span>
//               <span className={`mt-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${c.badge}`}>
//                 {c.label}
//               </span>
//             </button>
//           )
//         })}
//       </div>

//       {/* Chi tiết của ngày đang chọn */}
//       <div>
//         <div className="mb-1 flex items-center justify-between text-sm">
//           <span className="text-gray-600">Xác suất lũ ({current.label.toLowerCase()})</span>
//           <span className="font-semibold text-gray-800">{percent}%</span>
//         </div>
//         <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
//           <div className={`h-full rounded-full transition-all ${config.bar}`} style={{ width: `${percent}%` }} />
//         </div>
//       </div>

//       {/* Chi tiết đầy đủ - toàn bộ thuộc tính trả về từ API */}
//       <div className="mt-4 border-t border-gray-100 pt-3">
//         <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
//           Chi tiết đầy đủ
//         </h4>
//         <dl className="grid grid-cols-2 gap-y-2 text-xs">
//           <dt className="text-gray-400">Mã khu vực</dt>
//           <dd className="text-right font-mono text-gray-700">{data.area_id}</dd>

//           <dt className="text-gray-400">Tên khu vực</dt>
//           <dd className="text-right text-gray-700">{data.tenKhuVuc}</dd>

//           <dt className="text-gray-400">Ngày mai — mức độ</dt>
//           <dd className="text-right">
//             <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${(RISK_CONFIG[data.lead1] ?? RISK_CONFIG.LOW).badge}`}>
//               {(RISK_CONFIG[data.lead1] ?? RISK_CONFIG.LOW).label}
//             </span>
//           </dd>

//           <dt className="text-gray-400">Ngày mai — xác suất</dt>
//           <dd className="text-right text-gray-700">{Math.round(data.lead1Probability * 100)}%</dd>

//           <dt className="text-gray-400">Ngày kia — mức độ</dt>
//           <dd className="text-right">
//             <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${(RISK_CONFIG[data.lead2] ?? RISK_CONFIG.LOW).badge}`}>
//               {(RISK_CONFIG[data.lead2] ?? RISK_CONFIG.LOW).label}
//             </span>
//           </dd>

//           <dt className="text-gray-400">Ngày kia — xác suất</dt>
//           <dd className="text-right text-gray-700">{Math.round(data.lead2Probability * 100)}%</dd>

//           <dt className="text-gray-400">Ngày mốt — mức độ</dt>
//           <dd className="text-right">
//             <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${(RISK_CONFIG[data.lead3] ?? RISK_CONFIG.LOW).badge}`}>
//               {(RISK_CONFIG[data.lead3] ?? RISK_CONFIG.LOW).label}
//             </span>
//           </dd>

//           <dt className="text-gray-400">Ngày mốt — xác suất</dt>
//           <dd className="text-right text-gray-700">{Math.round(data.lead3Probability * 100)}%</dd>

//           <dt className="text-gray-400">Thời điểm dự đoán</dt>
//           <dd className="text-right text-gray-700">{new Date(data.predictedAt).toLocaleString('vi-VN')}</dd>

//           <dt className="text-gray-400">Dữ liệu thời tiết từ</dt>
//           <dd className="text-right text-gray-700">{formatFullDate(data.weatherFrom)}</dd>

//           <dt className="text-gray-400">Dữ liệu thời tiết đến</dt>
//           <dd className="text-right text-gray-700">{formatFullDate(data.weatherTo)}</dd>
//         </dl>
//       </div>
//     </div>
//   )
// }