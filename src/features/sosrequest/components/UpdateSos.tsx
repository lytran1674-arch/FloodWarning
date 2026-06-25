// // features/sos/components/UpdateSOS.tsx

// import {
//   Map,
//   TriangleAlert,
//   Users,
//   Navigation,
//   Loader,
//   PhoneCall,
//   FileText,
//   RefreshCw,
//   MapPin,
//   ArrowLeft,
//   AlertCircle,
// } from "lucide-react"
// import { Label } from "../../../components/ui/Label"
// import Counter from "../../../components/ui/Counter"
// import ConditionSelector from "../../../components/ui/ConditionSelector"
// import { Input } from "../../../components/ui/Input"
// import GeoMap from "../../map/components/GeoMap"
// import { useGeoLocation } from "../../map/hooks/useGeolocation"
// import { useAppSelector } from "../../../hooks/redux.hooks"
// import { toast } from "react-toastify"
// import React, { useState, useEffect, useRef } from "react"
// import { useNavigate, useLocation } from "react-router-dom"
// import { useSoS } from "../hooks/useSoS"
// import { getDeviceId } from "../utils/getDeviceid"
// import type { SoSRequest, SoSResponse } from "../types/sosType"

// export const UpdateSOS = () => {
//   const location = useLocation()
//   const navigate = useNavigate()

//   // Lấy data từ navigate state truyền sang từ FormSOS
//   const sosData = location.state?.sosData as SoSResponse | undefined
//   const currentPayload = location.state?.currentPayload as SoSRequest | undefined

//   // Prefill form từ lần gửi trước
//   const [count, setCount] = useState(currentPayload?.victimCount ?? sosData?.victimCount ?? 1)
//   const [phone, setPhone] = useState(currentPayload?.sodt ?? sosData?.sodt ?? "")
//   const [desc, setDesc] = useState(currentPayload?.mota ?? sosData?.mota ?? "")
//   const [manualLat, setManualLat] = useState(
//     currentPayload?.lat ? String(currentPayload.lat) : sosData?.lat ? String(sosData.lat) : ""
//   )
//   const [manualLon, setManualLon] = useState(
//     currentPayload?.lon ? String(currentPayload.lon) : sosData?.lon ? String(sosData.lon) : ""
//   )

//   const buildInitialSelected = () => {
//     const src = currentPayload ?? sosData
//     if (!src) return []
//     const result: string[] = []
//     if (src.injured) result.push("Bị thương")
//     if (src.trapped) result.push("Mắc kẹt")
//     if (src.vulnerable) result.push("Có người già/trẻ em/mang thai")
//     return result
//   }
//   const [selected, setSelected] = useState<string[]>(buildInitialSelected)

//   const { loading, updateSoS } = useSoS()
//   const user = useAppSelector(state => state.auth.user)

//   // deviceId cố định — giữ nguyên để BE nhận ra cùng thiết bị
//   const deviceId = useRef<string>(getDeviceId())

//   const {
//     lat,
//     lon,
//     loading: locLoading,
//     error: locError,
//     getLocation,
//   } = useGeoLocation()

//   const fetchedRef = useRef<boolean>(false)
//   useEffect(() => {
//     if (fetchedRef.current) return
//     fetchedRef.current = true
//     // Chỉ lấy GPS nếu không có tọa độ cũ từ lần gửi trước
//     if (!manualLat && !manualLon) {
//       getLocation()
//     }
//   }, [getLocation, manualLat, manualLon])

//   useEffect(() => {
//     if (!phone && user?.sodt) setPhone(user.sodt)
//   }, [user, phone])

//   const parsedManualLat = manualLat !== "" ? parseFloat(manualLat) : null
//   const parsedManualLon = manualLon !== "" ? parseFloat(manualLon) : null

//   const isManualMode =
//     parsedManualLat !== null &&
//     parsedManualLon !== null &&
//     !isNaN(parsedManualLat) &&
//     !isNaN(parsedManualLon)

//   const effectiveLat = isManualMode ? parsedManualLat : lat
//   const effectiveLon = isManualMode ? parsedManualLon : lon

//   const handleToggle = (value: string) => {
//     setSelected(prev =>
//       prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
//     )
//   }

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     if (!effectiveLat || !effectiveLon) {
//       toast.warning("Vui lòng xác nhận vị trí trước khi cập nhật")
//       return
//     }

//     // Payload giống hệt FormSOS — BE dùng clientDeviceId để map sang SOS cũ
//     const payload: SoSRequest = {
//       sodt: phone,
//       clientDeviceId: deviceId.current,
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
//       await updateSoS(payload)
//       toast.success("Cập nhật yêu cầu SOS thành công!")
//       navigate("/sos")
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   const options = [
//     "Bị thương",
//     "Mắc kẹt",
//     "Có người già/trẻ em/mang thai",
//     "Bình thường",
//   ]

//   const sosId = sosData?.id

//   return (
//     <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border p-2 sm:p-6 lg:p-8 mt-5">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-4">
//         <button
//           type="button"
//           onClick={() => navigate(-1)}
//           className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
//         >
//           <ArrowLeft className="w-5 h-5 text-slate-500" />
//         </button>
//         <h2 className="flex-1 text-center text-orange-600 text-xl sm:text-2xl lg:text-3xl font-bold">
//           CẬP NHẬT YÊU CẦU CỨU HỘ
//         </h2>
//       </div>

//       {/* Banner thông báo */}
//       <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-4">
//         <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
//         <div>
//           <p className="text-sm font-semibold text-orange-700">
//             Bạn đã có yêu cầu SOS đang chờ xử lý
//           </p>
//           <p className="text-xs text-orange-500 mt-0.5">
//             Cập nhật thông tin mới nhất để đội cứu hộ hỗ trợ chính xác hơn.
//             {sosId && (
//               <span className="ml-1 font-mono opacity-60">#{sosId.slice(0, 8)}...</span>
//             )}
//           </p>
//         </div>
//       </div>

//       <form className="space-y-2" onSubmit={handleSubmit}>
//         {/* Vị trí */}
//         <section className="space-y-3">
//           <Label icon={Map} className="text-orange-600 font-semibold text-lg lg:text-xl sm:text-sm">
//             Vị trí
//           </Label>

//           <div className="space-y-2">
//             <div className="flex items-center gap-2">
//               <MapPin className="text-slate-400 w-4 h-4" />
//               <span className="text-sm text-slate-500 font-medium">
//                 Nhập tọa độ thủ công (tuỳ chọn)
//               </span>
//             </div>

//             <div className="grid grid-cols-2 gap-3">
//               <div className="space-y-1">
//                 <label className="text-xs text-slate-400">Latitude (vĩ độ)</label>
//                 <input
//                   type="number"
//                   step="0.00001"
//                   value={manualLat}
//                   onChange={e => setManualLat(e.target.value)}
//                   placeholder="VD: 10.84940"
//                   className={`w-full border rounded-xl px-3 py-2 text-sm outline-none transition-all ${
//                     isManualMode
//                       ? "border-blue-400 bg-blue-50 focus:ring-2 focus:ring-blue-100"
//                       : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
//                   }`}
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className="text-xs text-slate-400">Longitude (kinh độ)</label>
//                 <input
//                   type="number"
//                   step="0.00001"
//                   value={manualLon}
//                   onChange={e => setManualLon(e.target.value)}
//                   placeholder="VD: 106.77160"
//                   className={`w-full border rounded-xl px-3 py-2 text-sm outline-none transition-all ${
//                     isManualMode
//                       ? "border-blue-400 bg-blue-50 focus:ring-2 focus:ring-blue-100"
//                       : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
//                   }`}
//                 />
//               </div>
//             </div>

//             {isManualMode ? (
//               <p className="text-xs text-blue-600 flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
//                 <MapPin className="w-3 h-3" />
//                 Đang dùng tọa độ thủ công: {parsedManualLat!.toFixed(5)}, {parsedManualLon!.toFixed(5)}
//               </p>
//             ) : (
//               <p className="text-xs text-slate-400 flex items-center gap-1">
//                 <Navigation className="w-3 h-3" />
//                 Để trống để dùng GPS tự động
//               </p>
//             )}
//           </div>

//           <div className="relative h-56 rounded-xl overflow-hidden border border-slate-200">
//             {locLoading && !isManualMode && (
//               <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/80 gap-2">
//                 <Loader className="w-6 h-6 animate-spin text-orange-500" />
//                 <span className="text-sm text-slate-500">Đang xác định vị trí...</span>
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
//             className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
//               locLoading
//                 ? "border-blue-200 text-blue-400 bg-blue-50 cursor-not-allowed"
//                 : isManualMode
//                 ? "border-slate-300 text-slate-400 bg-slate-50 hover:bg-slate-100"
//                 : lat
//                 ? "border-green-400 text-green-600 bg-green-50 hover:bg-green-100"
//                 : "border-orange-300 text-orange-500 bg-orange-50 hover:bg-orange-100"
//             }`}
//           >
//             {locLoading ? (
//               <><Loader className="w-4 h-4 animate-spin" />Đang lấy vị trí...</>
//             ) : lat ? (
//               <>
//                 <Navigation className="w-4 h-4" />
//                 GPS: {lat.toFixed(5)}, {lon?.toFixed(5)} · Nhấn để cập nhật
//                 {isManualMode && <span className="text-xs opacity-60">(đang bị ghi đè)</span>}
//               </>
//             ) : (
//               <><Navigation className="w-4 h-4" />Nhấn để lấy vị trí GPS của bạn</>
//             )}
//           </button>

//           {locError && !isManualMode && (
//             <p className="text-xs text-red-500 flex items-center gap-1">
//               <TriangleAlert className="w-3 h-3" />{locError}
//             </p>
//           )}
//         </section>

//         {/* Số người */}
//         <section className="space-y-3">
//           <div className="flex items-center gap-2">
//             <Users className="text-orange-600 size-6" />
//             <p className="text-orange-600 font-semibold text-lg lg:text-xl sm:text-sm">
//               Số người cần cứu
//             </p>
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
//             <TriangleAlert className="text-orange-600 lg:size-6" />
//             <p className="text-orange-600 font-semibold text-lg lg:text-xl sm:text-sm">
//               Tình trạng
//             </p>
//           </div>
//           <ConditionSelector options={options} values={selected} onToggle={handleToggle} />
//         </section>

//         {/* SĐT */}
//         <section className="space-y-3">
//           <Label icon={PhoneCall} className="text-orange-600 font-semibold text-lg sm:text-sm lg:text-xl">
//             Số điện thoại
//           </Label>
//           <Input value={phone} onChange={setPhone} placeholder="Nhập số điện thoại liên hệ" className="w-full" />
//         </section>

//         {/* Mô tả */}
//         <section className="space-y-3">
//           <Label icon={FileText} className="text-orange-600 font-semibold text-lg sm:text-sm lg:text-xl">
//             Mô tả tình trạng
//           </Label>
//           <textarea
//             value={desc}
//             onChange={e => setDesc(e.target.value)}
//             className="w-full border rounded-xl p-3 min-h-32 resize-none outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
//             placeholder="Mô tả tình trạng hiện tại..."
//           />
//         </section>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
//         >
//           {loading ? <Loader className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
//           CẬP NHẬT SOS
//         </button>
//       </form>
//     </div>
//   )
// }