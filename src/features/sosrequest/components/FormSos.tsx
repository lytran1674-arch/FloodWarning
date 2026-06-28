// features/sos/components/FormSOS.tsx
import { Label } from "../../../components/ui/Label";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../hooks/redux.hooks";
import Counter from "../../../components/ui/Counter";
import React, { useState, useEffect, useRef } from "react";
import ConditionSelector from "../../../components/ui/ConditionSelector";
import { Input } from "../../../components/ui/Input";
import GeoMap from "../../map/components/GeoMap";
import { useGeoLocation } from "../../map/hooks/useGeolocation";
import { toast } from "react-toastify";
import type { SoSRequest } from "../types/sosType";
import { useSoS } from "../hooks/useSoS";

// Cấu hình toast như snackbar (dùng chung)
const showSnackbar = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
  toast[type](message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    style: { borderRadius: '8px', background: '#333', color: '#fff' },
  });
};

export const SOSRequest = () => {
  const [count, setCount] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [desc, setDesc] = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLon, setManualLon] = useState("");
  const [validationErrors, setValidationErrors] = useState<{ phone?: string; desc?: string; coords?: string }>({});

  const { loading, createSoS } = useSoS();
  const user = useAppSelector((state) => state.auth.user);
  const {
    lat,
    lon,
    loading: locLoading,
    error: locError,
    getLocation,
  } = useGeoLocation();

  const fetchedRef = useRef<boolean>(false);
  const navigate = useNavigate();

  // Lấy số điện thoại từ user
  useEffect(() => {
    if (user?.sodt) setPhone(user.sodt);
  }, [user]);

  // Lấy vị trí một lần
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    getLocation();
  }, [getLocation]);

  // Parse tọa độ thủ công
  const parsedManualLat = manualLat !== "" ? parseFloat(manualLat) : null;
  const parsedManualLon = manualLon !== "" ? parseFloat(manualLon) : null;
  const isManualMode =
    parsedManualLat !== null &&
    parsedManualLon !== null &&
    !isNaN(parsedManualLat) &&
    !isNaN(parsedManualLon);

  const effectiveLat = isManualMode ? parsedManualLat : lat;
  const effectiveLon = isManualMode ? parsedManualLon : lon;

  // Validation
  const validateForm = (): boolean => {
    const errors: { phone?: string; desc?: string; coords?: string } = {};

    // Số điện thoại
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/; // ví dụ cho VN
    if (!phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!phoneRegex.test(phone.trim())) {
      errors.phone = "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10-11 số)";
    }

    // Mô tả (không bắt buộc nhưng nếu có thì tối thiểu 5 ký tự)
    if (desc.trim() && desc.trim().length < 5) {
      errors.desc = "Mô tả phải có ít nhất 5 ký tự (nếu có)";
    }

    // Tọa độ
    if (!isManualMode && (!effectiveLat || !effectiveLon)) {
      errors.coords = "Vui lòng bật GPS hoặc nhập tọa độ thủ công";
    }
    if (isManualMode) {
      if (parsedManualLat! < -90 || parsedManualLat! > 90) {
        errors.coords = "Vĩ độ phải nằm trong khoảng -90..90";
      }
      if (parsedManualLon! < -180 || parsedManualLon! > 180) {
        errors.coords = "Kinh độ phải nằm trong khoảng -180..180";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleToggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      // Hiển thị lỗi đầu tiên bằng snackbar
      const firstError = Object.values(validationErrors)[0];
      if (firstError) showSnackbar(firstError, "warning");
      return;
    }

    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("deviceId", deviceId);
    }

    const payload: SoSRequest = {
      sodt: phone,
      clientDeviceId: deviceId,
      victimCount: count,
      lat: effectiveLat!,
      lon: effectiveLon!,
      accuracy: isManualMode ? 0 : 10,
      injured: selected.includes("Bị thương"),
      trapped: selected.includes("Mắc kẹt"),
      vulnerable: selected.includes("Có người già/trẻ em/mang thai"),
      mota: desc,
    };

    try {
      const response = await createSoS(payload);

      // Nếu đã tồn tại SOS đang xử lý
      if (response?.alreadyExists) {
        showSnackbar(
          "Bạn đang có yêu cầu SOS đang được xử lý. Vui lòng theo dõi hoặc cập nhật.",
          "warning"
        );
        navigate(`/update-sos/${response.id}`, {
          state: { sosData: response },
        });
        return;
      }

      // Gửi thành công
      showSnackbar("Gửi SOS thành công!", "success");
      navigate("/success");
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || "Gửi SOS thất bại";
      showSnackbar(msg, "error");
    }
  };

  const options = [
    "Bị thương",
    "Mắc kẹt",
    "Có người già/trẻ em/mang thai",
    "Bình thường",
  ];

  const isSubmitting = loading || locLoading;
  const isLocationReady = !!effectiveLat && !!effectiveLon;

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

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="text-slate-400 w-4 h-4" />
              <span className="text-sm text-slate-500 font-medium">
                Nhập tọa độ thủ công (tuỳ chọn)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Latitude (vĩ độ)</label>
                <input
                  type="number"
                  step="0.00001"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="VD: 10.84940"
                  className={`w-full border rounded-xl px-3 py-2 text-sm outline-none transition-all ${
                    isManualMode
                      ? "border-blue-400 bg-blue-50 focus:ring-2 focus:ring-blue-100"
                      : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  }`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-400">Longitude (kinh độ)</label>
                <input
                  type="number"
                  step="0.00001"
                  value={manualLon}
                  onChange={(e) => setManualLon(e.target.value)}
                  placeholder="VD: 106.77160"
                  className={`w-full border rounded-xl px-3 py-2 text-sm outline-none transition-all ${
                    isManualMode
                      ? "border-blue-400 bg-blue-50 focus:ring-2 focus:ring-blue-100"
                      : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                  }`}
                />
              </div>
            </div>

            {isManualMode ? (
              <p className="text-xs text-blue-600 flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
                <MapPin className="w-3 h-3" />
                Đang dùng tọa độ thủ công: {parsedManualLat!.toFixed(5)},{" "}
                {parsedManualLon!.toFixed(5)}
              </p>
            ) : (
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                Để trống để dùng GPS tự động
              </p>
            )}
            {validationErrors.coords && (
              <p className="text-xs text-red-500">{validationErrors.coords}</p>
            )}
          </div>

          <div className="relative h-56 rounded-xl overflow-hidden border border-slate-200">
            {locLoading && !isManualMode && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50/80 gap-2">
                <Loader className="w-6 h-6 animate-spin text-red-500" />
                <span className="text-sm text-slate-500">Đang xác định vị trí...</span>
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
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
              locLoading
                ? "border-blue-200 text-blue-400 bg-blue-50 cursor-not-allowed"
                : isManualMode
                ? "border-slate-300 text-slate-400 bg-slate-50 hover:bg-slate-100"
                : lat
                ? "border-green-400 text-green-600 bg-green-50 hover:bg-green-100"
                : "border-red-300 text-red-500 bg-red-50 hover:bg-red-100"
            }`}
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
            onDecrease={() => setCount((prev) => Math.max(1, prev - 1))}
            onIncrease={() => setCount((prev) => prev + 1)}
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
          {validationErrors.phone && (
            <p className="text-xs text-red-500">{validationErrors.phone}</p>
          )}
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
            onChange={(e) => setDesc(e.target.value)}
            className="w-full border rounded-xl p-3 min-h-32 resize-none outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
            placeholder="Mô tả tình trạng hiện tại (không bắt buộc)..."
          />
          {validationErrors.desc && (
            <p className="text-xs text-red-500">{validationErrors.desc}</p>
          )}
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !isLocationReady}
          className={`w-full text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            isSubmitting || !isLocationReady
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:opacity-90"
          }`}
        >
          {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <Phone />}
          GỬI SOS
        </button>
      </form>
    </div>
  );
};