// // features/sos/pages/UpdateSOSPage.tsx
// //
// // Nhận: navigate(`/update-sos/${response.id}`, { state: { sosData: response } })
// // PUT  /sos-request/{id}  (Image 4)

// import { useLocation, useParams, useNavigate } from "react-router-dom"
// import { useState } from "react"

// import { toast } from "react-toastify"
// import {
//   AlertCircle,
//   Clock,
//   Loader,
//   RefreshCw,
//   Eye,
//   Users,
//   FileText,
//   PhoneCall,
//   Map,
//   TriangleAlert,
//   Navigation,
//   MapPin,
// } from "lucide-react"

// import GeoMap from "../../map/components/GeoMap"
// import { useGeoLocation } from "../../map/hooks/useGeolocation"
// import Counter from "../../../components/ui/Counter"
// import ConditionSelector from "../../../components/ui/ConditionSelector"
// import { Input } from "../../../components/ui/Input"
// import { Label } from "../../../components/ui/Label"
// import { usesosrequestanonymous } from "../hooks/usesosrequestanonymous"
// import type { SoSRequest } from "@/features/sosrequest/types/sosType"

// // Shape của response từ BE (Image 1, 2, 3)
// interface SoSResponseData {
//   id: string
//   alreadyExists: boolean
//   priority: string
//   status: "PENDING" | "PROCESSING" | string
//   baseSeverityScore: number
//   environmentRisk: string
//   victimCount: number
//   priorityReason: string
//   mota: string
//   createdAt: string
//   sodt?: string
//   injured?: boolean
//   trapped?: boolean
//   vulnerable?: boolean
//   lat?: number
//   lon?: number
// }

// const STATUS_MAP: Record<string, { label: string; color: string; dot: string }> = {
//   PENDING: {
//     label: "Đang chờ xử lý",
//     color: "text-yellow-700 bg-yellow-50 border-yellow-200",
//     dot: "bg-yellow-400",
//   },
//   PROCESSING: {
//     label: "Đang được xử lý",
//     color: "text-blue-700 bg-blue-50 border-blue-200",
//     dot: "bg-blue-500",
//   },
// }

// const conditionOptions = [
//   "Bị thương",
//   "Mắc kẹt",
//   "Có người già/trẻ em/mang thai",
//   "Bình thường",
// ]

// function conditionsFromData(data: SoSResponseData): string[] {
//   const result: string[] = []
//   if (data.injured) result.push("Bị thương")
//   if (data.trapped) result.push("Mắc kẹt")
//   if (data.vulnerable) result.push("Có người già/trẻ em/mang thai")
//   if (!data.injured && !data.trapped && !data.vulnerable) result.push("Bình thường")
//   return result
// }

// export const UpdateSOSPage = () => {
//   const { id } = useParams<{ id: string }>()
//   const { state } = useLocation()
//   const navigate = useNavigate()
//   const { loading,updateSoSAnonymous } = usesosrequestanonymous()

//   // Lấy data SOS cũ từ navigate state (BE đã trả về đủ trong response alreadyExists=true)
//   const sosData: SoSResponseData | undefined = state?.sosData

//   // Pre-fill từ sosData
//   const [count, setCount] = useState(sosData?.victimCount ?? 1)
//   const [selected, setSelected] = useState<string[]>(
//     sosData ? conditionsFromData(sosData) : []
//   )
//   const [phone, setPhone] = useState(sosData?.sodt ?? "")
//   const [desc, setDesc] = useState(sosData?.mota ?? "")
//   const [manualLat, setManualLat] = useState(sosData?.lat?.toString() ?? "")
//   const [manualLon, setManualLon] = useState(sosData?.lon?.toString() ?? "")

//   const {
//     lat: gpsLat,
//     lon: gpsLon,
//     loading: locLoading,
//     getLocation,
//   } = useGeoLocation()

//   const parsedManualLat = manualLat !== "" ? parseFloat(manualLat) : null
//   const parsedManualLon = manualLon !== "" ? parseFloat(manualLon) : null
//   const isManualMode =
//     parsedManualLat !== null &&
//     parsedManualLon !== null &&
//     !isNaN(parsedManualLat) &&
//     !isNaN(parsedManualLon)

//   const effectiveLat = isManualMode ? parsedManualLat : gpsLat
//   const effectiveLon = isManualMode ? parsedManualLon : gpsLon

//   const handleToggle = (value: string) => {
//     setSelected(prev =>
//       prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
//     )
//   }

//   const currentStatus = sosData?.status
//     ? STATUS_MAP[sosData.status] ?? {
//         label: sosData.status,
//         color: "text-slate-600 bg-slate-50 border-slate-200",
//         dot: "bg-slate-400",
//       }
//     : null

//   const handleUpdate = async () => {
//     if (!id) return

//     if (!effectiveLat || !effectiveLon) {
//       toast.warning("Vui lòng bật GPS hoặc nhập tọa độ để cập nhật vị trí")
//       return
//     }

//     let deviceId = localStorage.getItem("deviceId")
//     if (!deviceId) {
//       deviceId = crypto.randomUUID()
//       localStorage.setItem("deviceId", deviceId)
//     }

//     const payload: SoSRequest = {
//       sodt: phone,
//       clientDeviceId: deviceId,
//       victimCount: count,
//       lat: effectiveLat,
//       lon: effectiveLon,
//       accuracy: isManualMode ? 0 : 10,
//       injured: selected.includes("Bị thương"),
//       trapped: selected.includes("Mắc kẹt"),
//       vulnerable: selected.includes("Có người già/trẻ em/mang thai"),
//       mota: desc,
//     }

//     try {
//       // PUT /sos-request/{id}  (Image 4)
//       await updateSoSAnonymous(id, payload)
//       toast.success("Đã cập nhật yêu cầu SOS thành công")
//       navigate("/sent-request")
//     } catch {
//       toast.error("Cập nhật thất bại, vui lòng thử lại")
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto mt-5 px-2 sm:px-6 lg:px-8 pb-10">

//       {/* ── Banner cảnh báo ── */}
//       <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
//         <AlertCircle className="text-amber-500 w-5 h-5 mt-0.5 shrink-0" />
//         <div>
//           <p className="font-semibold text-amber-800 text-sm">
//             Bạn đang có yêu cầu SOS đang được xử lý
//           </p>
//           <p className="text-amber-700 text-xs mt-1">
//             Không thể gửi yêu cầu mới. Hãy cập nhật thông tin bên dưới nếu tình
//             trạng thay đổi, hoặc nhấn{" "}
//             <span className="font-semibold">Xem tiến trình</span> để theo dõi.
//           </p>
//         </div>
//       </div>

//       {/* ── Trạng thái + nút xem tiến trình ── */}
//       <div className="flex items-center justify-between mb-5 gap-3">
//         {currentStatus && (
//           <div
//             className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 text-sm font-medium flex-1 ${currentStatus.color}`}
//           >
//             <span
//               className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${currentStatus.dot}`}
//             />
//             <Clock className="w-4 h-4" />
//             Trạng thái: {currentStatus.label}
//           </div>
//         )}

//         <button
//           onClick={() => navigate("/sent-request")}
//           className="flex items-center gap-2 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors whitespace-nowrap"
//         >
//           <Eye className="w-4 h-4" />
//           Xem tiến trình
//         </button>
//       </div>

//       {/* ── Form cập nhật ── */}
//       <div className="bg-white rounded-2xl shadow-lg border p-4 sm:p-6 space-y-5">
//         <h2 className="text-center text-red-600 text-xl sm:text-2xl font-bold">
//           CẬP NHẬT YÊU CẦU CỨU HỘ
//         </h2>

//         {/* Vị trí */}
//         <section className="space-y-3">
//           <Label icon={Map} className="text-red-600 font-semibold text-lg">
//             Vị trí
//           </Label>

//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-1">
//               <label className="text-xs text-slate-400">Latitude (vĩ độ)</label>
//               <input
//                 type="number"
//                 step="0.00001"
//                 value={manualLat}
//                 onChange={e => setManualLat(e.target.value)}
//                 placeholder="VD: 10.84940"
//                 className={`w-full border rounded-xl px-3 py-2 text-sm outline-none transition-all ${
//                   isManualMode
//                     ? "border-blue-400 bg-blue-50 focus:ring-2 focus:ring-blue-100"
//                     : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
//                 }`}
//               />
//             </div>
//             <div className="space-y-1">
//               <label className="text-xs text-slate-400">Longitude (kinh độ)</label>
//               <input
//                 type="number"
//                 step="0.00001"
//                 value={manualLon}
//                 onChange={e => setManualLon(e.target.value)}
//                 placeholder="VD: 106.77160"
//                 className={`w-full border rounded-xl px-3 py-2 text-sm outline-none transition-all ${
//                   isManualMode
//                     ? "border-blue-400 bg-blue-50 focus:ring-2 focus:ring-blue-100"
//                     : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
//                 }`}
//               />
//             </div>
//           </div>

//           {isManualMode ? (
//             <p className="text-xs text-blue-600 flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
//               <MapPin className="w-3 h-3" />
//               Đang dùng tọa độ thủ công: {parsedManualLat!.toFixed(5)},{" "}
//               {parsedManualLon!.toFixed(5)}
//             </p>
//           ) : (
//             <p className="text-xs text-slate-400 flex items-center gap-1">
//               <Navigation className="w-3 h-3" />
//               Để trống để dùng GPS tự động
//             </p>
//           )}

//           <div className="relative h-48 rounded-xl overflow-hidden border border-slate-200">
//             {locLoading && (
//               <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50/80">
//                 <Loader className="w-5 h-5 animate-spin text-red-500" />
//               </div>
//             )}
//             <GeoMap
//               currentLat={effectiveLat}
//               currentLon={effectiveLon}
//               showCurrentPin={true}
//               centerOnUser={true}
//               className="w-full h-full"
//             />
//           </div>

//           <button
//             type="button"
//             onClick={getLocation}
//             disabled={locLoading}
//             className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
//               locLoading
//                 ? "border-blue-200 text-blue-400 bg-blue-50 cursor-not-allowed"
//                 : gpsLat
//                 ? "border-green-400 text-green-600 bg-green-50 hover:bg-green-100"
//                 : "border-red-300 text-red-500 bg-red-50 hover:bg-red-100"
//             }`}
//           >
//             {locLoading ? (
//               <>
//                 <Loader className="w-4 h-4 animate-spin" />
//                 Đang lấy vị trí...
//               </>
//             ) : gpsLat ? (
//               <>
//                 <Navigation className="w-4 h-4" />
//                 GPS: {gpsLat.toFixed(5)}, {gpsLon?.toFixed(5)} · Nhấn để cập nhật
//               </>
//             ) : (
//               <>
//                 <Navigation className="w-4 h-4" />
//                 Nhấn để lấy vị trí GPS của bạn
//               </>
//             )}
//           </button>
//         </section>

//         {/* Số người */}
//         <section className="space-y-3">
//           <div className="flex items-center gap-2">
//             <Users className="text-red-600 size-6" />
//             <p className="text-red-600 font-semibold text-lg">Số người cần cứu</p>
//           </div>
//           <Counter
//             value={count}
//             onDecrease={() => setCount(prev => Math.max(1, prev - 1))}
//             onIncrease={() => setCount(prev => prev + 1)}
//           />
//         </section>

//         {/* Tình trạng */}
//         <section className="space-y-3">
//           <div className="flex items-center gap-2">
//             <TriangleAlert className="text-red-600 size-6" />
//             <p className="text-red-600 font-semibold text-lg">Tình trạng</p>
//           </div>
//           <ConditionSelector
//             options={conditionOptions}
//             values={selected}
//             onToggle={handleToggle}
//           />
//         </section>

//         {/* SĐT */}
//         <section className="space-y-3">
//           <Label icon={PhoneCall} className="text-red-600 font-semibold text-lg">
//             Số điện thoại
//           </Label>
//           <Input
//             value={phone}
//             onChange={setPhone}
//             placeholder="Nhập số điện thoại liên hệ"
//             className="w-full"
//           />
//         </section>

//         {/* Mô tả */}
//         <section className="space-y-3">
//           <Label icon={FileText} className="text-red-600 font-semibold text-lg">
//             Mô tả tình trạng
//           </Label>
//           <textarea
//             value={desc}
//             onChange={e => setDesc(e.target.value)}
//             rows={4}
//             className="w-full border rounded-xl p-3 resize-none outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
//             placeholder="Mô tả tình trạng hiện tại..."
//           />
//         </section>

//         {/* Buttons */}
//         <div className="flex flex-col gap-3 pt-2">
//           <button
//             onClick={handleUpdate}
//             disabled={loading}
//             className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <Loader className="w-5 h-5 animate-spin" />
//             ) : (
//               <RefreshCw className="w-5 h-5" />
//             )}
//             Cập nhật yêu cầu SOS
//           </button>

//           <button
//             onClick={() => navigate("/sent-request-anonymous")}
//             className="w-full border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
//           >
//             <Eye className="w-4 h-4" />
//             Xem tiến trình xử lý
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }