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
} from "lucide-react"

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

export const SOSRequest = () => {
  const [count, setCount] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [phone, setPhone] = useState("")
  const [desc, setDesc] = useState("")
  const {loading,createSoS}=useSoS();
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

  const handleToggle = (value: string) => {
    setSelected(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()

    if(!lat || !lon){
        toast.warning("Vui lòng bật GPS");
        return;
    }
    const payload: SoSRequest = {
  sodt: phone,

  clientDeviceId: crypto.randomUUID(),

  victimCount: count,

  lat,
  lon,

  accuracy: 10,

  injured: selected.includes("Bị thương"),

  trapped: selected.includes("Mắc kẹt"),

  vulnerable: selected.includes(
    "Có người già/trẻ em/mang thai"
  ),

  mota: desc,
}
   try {
    await createSoS(payload)

    toast.success("Gửi SOS thành công")

    setCount(1)
    setSelected([])
    setDesc("")

    if (!user) {
      setPhone("")
    }

  } catch (err) {
    console.error(err)
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

          <div className="relative h-56 rounded-xl overflow-hidden border border-slate-200">
            {locLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/80 gap-2">
                <Loader className="w-6 h-6 animate-spin text-red-500" />
                <span className="text-sm text-slate-500">
                  Đang xác định vị trí...
                </span>
              </div>
            )}

            <GeoMap
              currentLat={lat}
              currentLon={lon}
              showCurrentPin={true}
              centerOnUser={true}
              className="w-full h-full"
            />
          </div>

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
                {lat.toFixed(5)}, {lon?.toFixed(5)} · Nhấn để cập nhật
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                Nhấn để lấy vị trí GPS của bạn
              </>
            )}
          </button>

          {locError && (
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
          <Phone />
          GỬI SOS
        </button>
      </form>
    </div>
  )
}