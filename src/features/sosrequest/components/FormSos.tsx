// features/sos/components/FormSOS.tsx

import { Label } from "../../../components/ui/Label"
import {
  Map,
  TriangleAlert,
  Users,
  Navigation,
  Loader,
  PhoneCall,
  FileText,
  Phone,
  MapPin,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../../hooks/redux.hooks"
import Counter from "../../../components/ui/Counter"
import React, { useState, useEffect, useRef } from "react"
import ConditionSelector from "../../../components/ui/ConditionSelector"
import { Input } from "../../../components/ui/Input"
import GeoMap from "../../map/components/GeoMap"
import { useGeoLocation } from "../../map/hooks/useGeolocation"
import { toast } from "react-toastify"
import type { SoSRequest } from "../types/sosType"
import { useSoS } from "../hooks/useSoS"

interface SOSRequestProps {
  onSuccess?: () => void; // thêm
}

export const SOSRequest = ({  }: SOSRequestProps) => {
  const [count, setCount] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [phone, setPhone] = useState("")
  const [desc, setDesc] = useState("")
  const [manualLat, setManualLat] = useState("")
  const [manualLon, setManualLon] = useState("")

  const { loading, createSoS,updateSoS } = useSoS()

  // redux user
  const user = useAppSelector(state => state.auth.user)

  const {
    lat,
    lon,
    loading: locLoading,
    error: locError,
    getLocation,
  } = useGeoLocation()

  // chống gọi GPS 2 lần
  const fetchedRef = useRef<boolean>(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    getLocation()
  }, [getLocation])

  // auto fill phone khi login
  useEffect(() => {
    if (user?.sodt) {
      setPhone(user.sodt)
    }
  }, [user])

  // Logic ưu tiên: thủ công > GPS
  const parsedManualLat = manualLat !== "" ? parseFloat(manualLat) : null
  const parsedManualLon = manualLon !== "" ? parseFloat(manualLon) : null

  const isManualMode =
    parsedManualLat !== null &&
    parsedManualLon !== null &&
    !isNaN(parsedManualLat) &&
    !isNaN(parsedManualLon)

  const effectiveLat = isManualMode ? parsedManualLat : lat
  const effectiveLon = isManualMode ? parsedManualLon : lon

  const handleToggle = (value: string) => {
    setSelected(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

const navigate = useNavigate()

const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {

  e.preventDefault()

  if (!effectiveLat || !effectiveLon) {

    toast.warning(
      isManualMode
        ? "Tọa độ thủ công không hợp lệ"
        : "Vui lòng bật GPS hoặc nhập tọa độ thủ công"
    )

    return
  }

  // ✅ deviceId cố định
  let deviceId =
    localStorage.getItem("deviceId")

  if (!deviceId) {

    deviceId = crypto.randomUUID()

    localStorage.setItem(
      "deviceId",
      deviceId
    )
  }

  const payload: SoSRequest = {

    sodt: phone,

    clientDeviceId: deviceId,

    victimCount: count,

    lat: effectiveLat,
    lon: effectiveLon,

    accuracy: isManualMode ? 0 : 10,

    injured: selected.includes(
      "Bị thương"
    ),

    trapped: selected.includes(
      "Mắc kẹt"
    ),

    vulnerable: selected.includes(
      "Có người già/trẻ em/mang thai"
    ),

    mota: desc,
  }
try {

  const response =
    await createSoS(payload)

  console.log(
    "SOS RESPONSE:",
    response
  )

  // ✅ nếu đã tồn tại SOS
  if (response?.alreadyExists) {

    // lấy id SOS cũ
    const sosId = response.id

    // gọi API update
    await updateSoS(
      sosId,
      payload
    )

    toast.success(
      "Đã cập nhật yêu cầu SOS"
    )

    navigate("/sent-request", {
      state: {
        updated: true,
      },
    })

    return
  }

  // ✅ SOS mới
  toast.success(
    "Gửi SOS thành công"
  )

  navigate("/success")

} catch (err) {

  console.error(err)

  toast.error(
    "Gửi SOS thất bại"
  )
}
}
  const options = [
    "Bị thương",
    "Mắc kẹt",
    "Có người già/trẻ em/mang thai",
    "Bình thường",
  ]

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border p-2 sm:p-6 lg:p-8 mt-5">
      <form className="space-y-2" onSubmit={handleSubmit}>
        <h2 className="text-center text-red-600 text-xl sm:text-2xl lg:text-3xl font-bold">
          CỨU HỘ KHẨN CẤP
        </h2>

        {/* Vị trí */}
        <section className="space-y-3">
          <Label
            icon={Map}
            className="text-red-600 font-semibold text-lg lg:text-xl sm:text-sm"
          >
            Vị trí
          </Label>

          {/* Nhập tọa độ thủ công */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="text-slate-400 w-4 h-4" />
              <span className="text-sm text-slate-500 font-medium">
                Nhập tọa độ thủ công (tuỳ chọn)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">
                  Latitude (vĩ độ)
                </label>
                <input
                  type="number"
                  step="0.00001"
                  value={manualLat}
                  onChange={e => setManualLat(e.target.value)}
                  placeholder="VD: 10.84940"
                  className={`
                    w-full border rounded-xl px-3 py-2 text-sm outline-none transition-all
                    ${
                      isManualMode
                        ? "border-blue-400 bg-blue-50 focus:ring-2 focus:ring-blue-100"
                        : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    }
                  `}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">
                  Longitude (kinh độ)
                </label>
                <input
                  type="number"
                  step="0.00001"
                  value={manualLon}
                  onChange={e => setManualLon(e.target.value)}
                  placeholder="VD: 106.77160"
                  className={`
                    w-full border rounded-xl px-3 py-2 text-sm outline-none transition-all
                    ${
                      isManualMode
                        ? "border-blue-400 bg-blue-50 focus:ring-2 focus:ring-blue-100"
                        : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                    }
                  `}
                />
              </div>
            </div>

            {/* Badge trạng thái tọa độ */}
            {isManualMode ? (
              <p className="text-xs text-blue-600 flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                <MapPin className="w-3 h-3" />
                Đang dùng tọa độ thủ công:{" "}
                {parsedManualLat!.toFixed(5)},{" "}
                {parsedManualLon!.toFixed(5)}
              </p>
            ) : (
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                Để trống để dùng GPS tự động
              </p>
            )}
          </div>

          {/* Bản đồ */}
          <div className="relative h-56 rounded-xl overflow-hidden border border-slate-200">
            {locLoading && !isManualMode && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/80 gap-2">
                <Loader className="w-6 h-6 animate-spin text-red-500" />
                <span className="text-sm text-slate-500">
                  Đang xác định vị trí...
                </span>
              </div>
            )}

            <GeoMap
              currentLat={effectiveLat}
              currentLon={effectiveLon}
              showCurrentPin={true}
              centerOnUser={true}
              className="w-full h-full"
            />
          </div>

          {/* Nút GPS */}
          <button
            type="button"
            onClick={getLocation}
            disabled={locLoading}
            className={`
              w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
              border-2 text-sm font-medium transition-all duration-200
              ${
                locLoading
                  ? "border-blue-200 text-blue-400 bg-blue-50 cursor-not-allowed"
                  : isManualMode
                  ? "border-slate-300 text-slate-400 bg-slate-50 hover:bg-slate-100"
                  : lat
                  ? "border-green-400 text-green-600 bg-green-50 hover:bg-green-100"
                  : "border-red-300 text-red-500 bg-red-50 hover:bg-red-100"
              }
            `}
          >
            {locLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Đang lấy vị trí...
              </>
            ) : lat ? (
              <>
                <Navigation className="w-4 h-4" />
                GPS: {lat.toFixed(5)}, {lon?.toFixed(5)} · Nhấn để cập nhật
                {isManualMode && (
                  <span className="text-xs opacity-60">(đang bị ghi đè)</span>
                )}
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                Nhấn để lấy vị trí GPS của bạn
              </>
            )}
          </button>

          {locError && !isManualMode && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <TriangleAlert className="w-3 h-3" />
              {locError}
            </p>
          )}
        </section>

        {/* Số người */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="text-red-600 size-6" />
            <p className="text-red-600 font-semibold text-lg lg:text-xl sm:text-sm">
              Số người cần cứu
            </p>
          </div>

          <Counter
            value={count}
            onDecrease={() => setCount(prev => Math.max(1, prev - 1))}
            onIncrease={() => setCount(prev => prev + 1)}
          />
        </section>

        {/* Tình trạng */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <TriangleAlert className="text-red-600 lg:size-6" />
            <p className="text-red-600 font-semibold text-lg lg:text-xl sm:text-sm">
              Tình trạng
            </p>
          </div>

          <ConditionSelector
            options={options}
            values={selected}
            onToggle={handleToggle}
          />
        </section>

        {/* SĐT */}
        <section className="space-y-3">
          <Label
            icon={PhoneCall}
            className="text-red-600 font-semibold text-lg sm:text-sm lg:text-xl"
          >
            Số điện thoại
          </Label>

          <Input
            value={phone}
            onChange={setPhone}
            placeholder="Nhập số điện thoại liên hệ"
            className="w-full"
          />
        </section>

        {/* Mô tả */}
        <section className="space-y-3">
          <Label
            icon={FileText}
            className="text-red-600 font-semibold text-lg sm:text-sm lg:text-xl"
          >
            Mô tả tình trạng
          </Label>

          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            className="w-full border rounded-xl p-3 min-h-32 resize-none outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
            placeholder="Mô tả tình trạng hiện tại..."
          />
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Phone />
          )}
          GỬI SOS
        </button>
      </form>
    </div>
  )
}