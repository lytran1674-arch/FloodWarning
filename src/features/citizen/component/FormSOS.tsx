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
import React, { useState, useEffect, useRef, useMemo } from "react"
import ConditionSelector from "../../../components/ui/ConditionSelector"
import { Input } from "../../../components/ui/Input"
import GeoMap from "../../map/components/GeoMap"
import { useGeoLocation } from "../../map/hooks/useGeolocation"
import { toast } from "react-toastify"
import type { SoSRequest } from "../../sosrequest/types/sosType"
import { useSoS } from "../../sosrequest/hooks/useSoS"
import { useNavigate } from "react-router-dom"

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import { useMap, useMapEvents } from "react-leaflet"
import { useArea } from "@/features/areas/hooks/useArea"

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const RecenterMap = ({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], 15);
  }, [lat, lng, map]);

  return null;
};

const MapClickHandler = ({
  setLat,
  setLng,
}: {
  setLat: (lat: number) => void;
  setLng: (lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    },
  });

  return null;
};
export const FormSOS = () => {

  const navigate = useNavigate()

  const [count, setCount] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [phone, setPhone] = useState("")
  const [desc, setDesc] = useState("")
  const [manualLat, setManualLat] = useState("")
  const [manualLon, setManualLon] = useState("")
    const { areas } = useArea();
  const { loading, createSoS, updateSoS } = useSoS()
  const [searchArea, setSearchArea] =
    useState("");

  const [openArea, setOpenArea] =
    useState(false);

  const [file, setFile] =
    useState<File | null>(null);
  const user = useAppSelector(state => state.auth.user)
 const [lat, setLat] = useState<
    number | null
  >(null);

  const [lon, setLng] = useState<
    number | null
  >(null);

   const areaOptions = useMemo(() => {
      return areas.flatMap((parent) =>
        (parent.children ?? []).map(
          (child) => ({
            id: child.id,
            label: `${parent.tenkhuvuc} > ${child.tenkhuvuc}`,
          })
        )
      );
    }, [areas]);
  
    const filteredAreas =
      areaOptions.filter((area) =>
        area.label
          .toLowerCase()
          .includes(searchArea.toLowerCase())
      );
  
    const geocodeAddress = async (
      fullAddress: string
    ) => {
      try {
        const url =
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            fullAddress
          )}`;
  
        const response = await fetch(url);
  
        const data = await response.json();
  
        if (data.length > 0) {
          setLat(Number(data[0].lat));
  
          setLng(Number(data[0].lon));
        }
      } catch (error) {
        console.error(
          "Geocode error",
          error
        );
      }
    };
  const {
  
    loading: locLoading,
    error: locError,
    getLocation,
  } = useGeoLocation()

  // chống gọi GPS nhiều lần
  const fetchedRef = useRef<boolean>(false)

  useEffect(() => {
    if (fetchedRef.current) return

    fetchedRef.current = true
    getLocation()

  }, [getLocation])

  // autofill phone
  useEffect(() => {
    if (user?.sodt) {
      setPhone(user.sodt)
    }
  }, [user])

  // ưu tiên tọa độ thủ công
  const parsedManualLat =
    manualLat !== "" ? parseFloat(manualLat) : null

  const parsedManualLon =
    manualLon !== "" ? parseFloat(manualLon) : null

  const isManualMode =
    parsedManualLat !== null &&
    parsedManualLon !== null &&
    !isNaN(parsedManualLat) &&
    !isNaN(parsedManualLon)

  const effectiveLat =
    isManualMode ? parsedManualLat : lat

  const effectiveLon =
    isManualMode ? parsedManualLon : lon

  const handleToggle = (value: string) => {
    setSelected(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

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
    const geocodeAddress = async (
    fullAddress: string
  ) => {
    try {
      const url =
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          fullAddress
        )}`;

      const response = await fetch(url);

      const data = await response.json();

      if (data.length > 0) {
        setLat(Number(data[0].lat));

        setLng(Number(data[0].lon));
      }
    } catch (error) {
      console.error(
        "Geocode error",
        error
      );
    }
  };

    // deviceId cố định
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

      // =========================
      // 1. TẠO SOS
      // =========================
      const response =
        await createSoS(payload)

      console.log(
        "SOS RESPONSE:",
        response
      )

      // =========================
      // 2. NẾU ĐÃ TỒN TẠI -> UPDATE
      // =========================
      if (response?.alreadyExists) {

        // backend đang trả lại id SOS cũ
        const sosId = response.id

        if (!sosId) {

          toast.error(
            "Không tìm thấy ID SOS để cập nhật"
          )

          return
        }

        // gọi update
        await updateSoS(
          sosId,
          payload
        )

        toast.success(
          "Cập nhật yêu cầu SOS thành công"
        )

        navigate(
          "/sent-request",
          {
            state: {
              updated: true,
            },
          }
        )

        return
      }

      // =========================
      // 3. SOS MỚI
      // =========================
      toast.success(
        "Gửi SOS thành công"
      )

      // reset form
      setCount(1)
      setSelected([])
      setDesc("")
      setManualLat("")
      setManualLon("")

      if (!user) {
        setPhone("")
      }

      navigate("/success")

    } catch (err: any) {

      console.error(
        "CREATE / UPDATE SOS ERROR:",
        err
      )

      // backend có thể trả 401 nếu chưa login
      if (err?.response?.status === 401) {

        toast.error(
          "Phiên đăng nhập đã hết hạn"
        )

        return
      }

      toast.error(
        err?.response?.data?.message ||
        "Gửi yêu cầu SOS thất bại"
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
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl shadow-md border mt-4 px-4 py-4 sm:px-5 sm:py-5">

      <form
        className="space-y-4"
        onSubmit={handleSubmit}
      >

        <h2 className="text-center text-red-600 text-base sm:text-lg font-bold tracking-wide">
          🚨 CỨU HỘ KHẨN CẤP
        </h2>

        {/* VỊ TRÍ */}
        <section className="space-y-2">

          <Label
            icon={Map}
            className="text-red-600 font-semibold text-sm"
          >
            Vị trí
          </Label>

          <div className="grid grid-cols-2 gap-2">

            <div className="space-y-0.5">
              <label className="text-[11px] text-slate-400">
                Latitude
              </label>

              <input
                type="number"
                step="0.00001"
                value={manualLat}
                onChange={e =>
                  setManualLat(e.target.value)
                }
                className="w-full border rounded-lg px-2.5 py-1.5 text-xs"
              />
            </div>

            <div className="space-y-0.5">
              <label className="text-[11px] text-slate-400">
                Longitude
              </label>

              <input
                type="number"
                step="0.00001"
                value={manualLon}
                onChange={e =>
                  setManualLon(e.target.value)
                }
                className="w-full border rounded-lg px-2.5 py-1.5 text-xs"
              />
            </div>

          </div>

          <div className="relative h-40 rounded-lg overflow-hidden border">

            {locLoading && !isManualMode && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
                <Loader className="w-5 h-5 animate-spin text-red-500" />
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

          <button
            type="button"
            onClick={getLocation}
            disabled={locLoading}
            className="w-full py-2 rounded-lg border text-xs"
          >

            {locLoading ? (
              <>
                <Loader className="w-3.5 h-3.5 animate-spin inline mr-1" />
                Đang lấy GPS...
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5 inline mr-1" />
                Lấy vị trí GPS
              </>
            )}

          </button>

          {locError && (
            <p className="text-[11px] text-red-500">
              {locError}
            </p>
          )}

        </section>

        {/* SỐ NGƯỜI */}
        <section className="space-y-2">

          <div className="flex items-center gap-1.5">
            <Users className="text-red-600 w-4 h-4" />
            <p className="text-red-600 font-semibold text-sm">
              Số người cần cứu
            </p>
          </div>

          <Counter
            value={count}
            onDecrease={() =>
              setCount(prev =>
                Math.max(1, prev - 1)
              )
            }
            onIncrease={() =>
              setCount(prev => prev + 1)
            }
          />

        </section>

        {/* TÌNH TRẠNG */}
        <section className="space-y-2">

          <div className="flex items-center gap-1.5">
            <TriangleAlert className="text-red-600 w-4 h-4" />
            <p className="text-red-600 font-semibold text-sm">
              Tình trạng
            </p>
          </div>

          <ConditionSelector
            options={options}
            values={selected}
            onToggle={handleToggle}
          />

        </section>

        {/* PHONE */}
        <section className="space-y-2">

          <Label
            icon={PhoneCall}
            className="text-red-600 font-semibold text-sm"
          >
            Số điện thoại
          </Label>

          <Input
            value={phone}
            onChange={setPhone}
            placeholder="Nhập số điện thoại"
            className="w-full text-sm"
          />

        </section>

        {/* MÔ TẢ */}
        <section className="space-y-2">

          <Label
            icon={FileText}
            className="text-red-600 font-semibold text-sm"
          >
            Mô tả tình trạng
          </Label>

          <textarea
            value={desc}
            onChange={e =>
              setDesc(e.target.value)
            }
            className="w-full border rounded-lg p-2.5 text-sm min-h-[80px]"
            placeholder="Mô tả..."
          />

        </section>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
        >

          {loading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Phone className="w-4 h-4" />
          )}

          GỬI SOS

        </button>

      </form>

    </div>
  )
}