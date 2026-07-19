// features/sosrequest/components/FormSOSAnonymous.tsx
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
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Counter from "../../../components/ui/Counter";
import React, { useState, useEffect, useRef } from "react";
import ConditionSelector from "../../../components/ui/ConditionSelector";
import { Input } from "../../../components/ui/Input";
import GeoMap from "../../map/components/GeoMap";
import { useGeoLocation } from "../../map/hooks/useGeolocation";
import { toast } from "react-toastify";

import type { SoSRequest } from "@/features/sosrequest/types/sosType";
import { useSoS } from "@/features/sosrequest/hooks/useSoS";

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

const DEVICE_ID_KEY = "deviceId";
const ANONYMOUS_SODT_KEY = "sos_anonymous_sodt";

const VN_LAT_RANGE: [number, number] = [8, 24];
const VN_LON_RANGE: [number, number] = [102, 110];

// ======================================================
// LOCATION STATE truyền qua khi navigate từ luồng "alreadyExists"
// sosData: dữ liệu SOS cũ để prefill lại toàn bộ form.
// Dùng Record<string, any> vì sosData có thể đến từ response
// createSoS (SoSResponse, dùng sodt/mota) HOẶC từ DetailSoSCitizen
// (qua getDetailSoSForOwner, dùng phoneNumber/description) —
// 2 nguồn lệch tên field, nên field-mapping xử lý fallback cả 2.
// ======================================================
interface UpdateLocationState {
  sosData?: Record<string, any>;
  sodt?: string;
  clientDeviceId?: string;
}

export const SOSRequestAnonymous = () => {
  // id có trên URL (/update-sos/:id) -> đang ở chế độ CẬP NHẬT
  const { id: sosIdParam } = useParams<{ id?: string }>();
  const location = useLocation();
  const locationState = (location.state as UpdateLocationState | null) ?? {};

  const isEditMode = !!sosIdParam;

  const [count, setCount] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [desc, setDesc] = useState("");

  const [manualLat, setManualLat] = useState("");
  const [manualLon, setManualLon] = useState("");

  const [validationErrors, setValidationErrors] = useState<{
    phone?: string;
    desc?: string;
    coords?: string;
  }>({});

  // getDetailSoSForOwner trả về DetailSoSCitizen — tự chọn đúng
  // API /my hoặc /anonymous theo trạng thái đăng nhập
  const { loading, createSoS, updateSoS, fetchDetail } = useSoS();

  const {
    lat,
    lon,
    loading: locLoading,
    error: locError,
    getLocation,
  } = useGeoLocation();

  const fetchedRef = useRef<boolean>(false);
  const prefillDoneRef = useRef<boolean>(false);
  const navigate = useNavigate();

  // ======================================================
  // PREFILL DỮ LIỆU CŨ KHI Ở CHẾ ĐỘ CẬP NHẬT
  // Ưu tiên dùng sosData có sẵn trong location.state (không cần
  // gọi lại API); nếu người dùng vào thẳng URL /update-sos/:id
  // mà không qua navigate (F5 lại trang, không có state) thì
  // tự gọi getDetailSoSForOwner(id) để lấy lại dữ liệu.
  //
  // Field xác nhận qua Postman cho DetailSoSCitizen:
  // phoneNumber, description, lat, lon, victimCount,
  // injured, trapped, vulnerable (KHÔNG phải sodt/mota).
  // Vẫn giữ fallback ?? sodt / ?? mota phòng trường hợp
  // sosData đến từ response createSoS (SoSResponse) dùng tên
  // field khác.
  // ======================================================
  useEffect(() => {
    if (!isEditMode || prefillDoneRef.current) return;

    const prefillFromData = (data: Record<string, any>) => {
      setPhone(data.phoneNumber ?? data.sodt ?? "");
      setDesc(data.description ?? data.mota ?? "");
      setCount(data.victimCount ?? 1);

      const restoredSelected: string[] = [];
      if (data.injured) restoredSelected.push("Bị thương");
      if (data.trapped) restoredSelected.push("Mắc kẹt");
      if (data.vulnerable) restoredSelected.push("Có người già/trẻ em/mang thai");
      setSelected(restoredSelected);

      if (data.lat != null && data.lon != null) {
        setManualLat(String(data.lat));
        setManualLon(String(data.lon));
      }

      prefillDoneRef.current = true;
    };

    if (locationState.sosData) {
      // có sẵn dữ liệu truyền qua navigate -> dùng luôn, khỏi gọi API
      prefillFromData(locationState.sosData);
    } else if (sosIdParam) {
      // không có state (F5 lại trang) -> gọi API lấy lại chi tiết,
      // tự chọn đúng /my hoặc /anonymous theo trạng thái đăng nhập
      (async () => {
        try {
          const detail = await fetchDetail(sosIdParam);
          if (detail) prefillFromData(detail as unknown as Record<string, any>);
        } catch (err) {
          console.error("Không lấy được dữ liệu SOS cũ:", err);
          showSnackbar("Không tải được dữ liệu cũ, vui lòng nhập lại", "warning");
        }
      })();
    }
  }, [isEditMode, sosIdParam, locationState.sosData, fetchDetail]);

  // Khôi phục sđt đã lưu — CHỈ áp dụng khi tạo mới, không ghi đè
  // lên sđt vừa prefill ở chế độ cập nhật
  useEffect(() => {
    if (isEditMode) return;
    const savedPhone = localStorage.getItem(ANONYMOUS_SODT_KEY);
    if (savedPhone) setPhone(savedPhone);
  }, [isEditMode]);

  // Tự động lấy GPS CHỈ khi tạo mới (không có tọa độ cũ để prefill).
  // Ở chế độ cập nhật, đã có tọa độ cũ điền sẵn, không cần tự bấm GPS.
  useEffect(() => {
    if (isEditMode) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    getLocation();
  }, [isEditMode, getLocation]);

  const parsedManualLat = manualLat.trim() !== "" ? Number(manualLat) : null;
  const parsedManualLon = manualLon.trim() !== "" ? Number(manualLon) : null;

  const hasManualInput = manualLat.trim() !== "" || manualLon.trim() !== "";

  const isManualLatValid =
    parsedManualLat !== null &&
    !Number.isNaN(parsedManualLat) &&
    parsedManualLat >= VN_LAT_RANGE[0] &&
    parsedManualLat <= VN_LAT_RANGE[1];

  const isManualLonValid =
    parsedManualLon !== null &&
    !Number.isNaN(parsedManualLon) &&
    parsedManualLon >= VN_LON_RANGE[0] &&
    parsedManualLon <= VN_LON_RANGE[1];

  const isUsingManualCoords = isManualLatValid && isManualLonValid;

  const effectiveLat = isUsingManualCoords ? parsedManualLat : lat;
  const effectiveLon = isUsingManualCoords ? parsedManualLon : lon;

  const isGpsDisabled = hasManualInput;

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!phoneRegex.test(phone.trim())) {
      errors.phone = "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10-11 số)";
    }

    if (desc.trim() && desc.trim().length < 5) {
      errors.desc = "Mô tả phải có ít nhất 5 ký tự (nếu có)";
    }

    if (hasManualInput) {
      if (!isManualLatValid || !isManualLonValid) {
        errors.coords = "Toạ độ nhập tay không hợp lệ. Vĩ độ 8-24, Kinh độ 102-110";
      }
    } else if (!effectiveLat || !effectiveLon) {
      errors.coords = "Vui lòng bật GPS hoặc nhập toạ độ để xác định vị trí";
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
      const firstError = Object.values(validationErrors)[0];
      if (firstError) showSnackbar(firstError, "warning");
      return;
    }

    let deviceId =
      locationState.clientDeviceId || localStorage.getItem(DEVICE_ID_KEY);

    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    const payload: SoSRequest = {
      sodt: phone,
      clientDeviceId: deviceId,
      victimCount: count,
      lat: effectiveLat!,
      lon: effectiveLon!,
      accuracy: isUsingManualCoords ? 0 : 10,
      injured: selected.includes("Bị thương"),
      trapped: selected.includes("Mắc kẹt"),
      vulnerable: selected.includes("Có người già/trẻ em/mang thai"),
      mota: desc,
    };

    try {
      if (isEditMode && sosIdParam) {
        // CHẾ ĐỘ CẬP NHẬT
        await updateSoS(sosIdParam, payload);
        localStorage.setItem(ANONYMOUS_SODT_KEY, phone);
        showSnackbar("Cập nhật yêu cầu SOS thành công!", "success");
        navigate("/sent-request-anonymous", { state: { updated: true } });
        return;
      }

      // CHẾ ĐỘ TẠO MỚI
      const response = await createSoS(payload);
      localStorage.setItem(ANONYMOUS_SODT_KEY, phone);

      if (response?.alreadyExists) {
        showSnackbar(
          "Bạn đang có yêu cầu SOS đang được xử lý. Vui lòng theo dõi hoặc cập nhật.",
          "warning"
        );
        navigate(`/update-sos-anonymous/${response.id}`, {
          state: { sosData: response, sodt: phone, clientDeviceId: deviceId },
        });
        return;
      }

      showSnackbar("Gửi SOS thành công!", "success");
      navigate("/success-anonymous");
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
          {isEditMode ? "CẬP NHẬT YÊU CẦU CỨU HỘ" : "CỨU HỘ KHẨN CẤP"}
        </h2>

        {/* Vị trí */}
        <section className="space-y-3">
          <Label icon={Map} className="text-red-600 font-semibold text-lg lg:text-xl sm:text-sm">
            Vị trí
          </Label>

          <button
            type="button"
            onClick={getLocation}
            disabled={locLoading || isGpsDisabled}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
              locLoading
                ? "border-blue-200 text-blue-400 bg-blue-50 cursor-not-allowed"
                : isGpsDisabled
                ? "border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed"
                : lat
                ? "border-green-400 text-green-600 bg-green-50 hover:bg-green-100"
                : "border-red-300 text-red-500 bg-red-50 hover:bg-red-100"
            }`}
          >
            {locLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Đang lấy vị trí GPS...
              </>
            ) : lat && !isGpsDisabled ? (
              <>
                <Navigation className="w-4 h-4" />
                GPS: {lat.toFixed(5)}, {lon?.toFixed(5)} · Nhấn để cập nhật
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                Nhấn để lấy vị trí GPS của bạn
              </>
            )}
          </button>

          {isGpsDisabled && (
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <TriangleAlert className="w-3 h-3" />
              GPS đang tắt vì bạn đã nhập toạ độ tay. Xoá 2 ô toạ độ bên dưới để dùng lại GPS.
            </p>
          )}

          {locError && !isGpsDisabled && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <TriangleAlert className="w-3 h-3" />
              {locError} — bạn có thể nhập toạ độ bên dưới thay thế
            </p>
          )}

          <div className="flex items-center gap-2 py-1">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">hoặc nhập toạ độ tay</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Vĩ độ (lat)</label>
              <input
                type="number"
                step="any"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                placeholder="VD: 10.77653"
                className="w-full border rounded-xl px-3 py-2 text-sm outline-none border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Kinh độ (lon)</label>
              <input
                type="number"
                step="any"
                value={manualLon}
                onChange={(e) => setManualLon(e.target.value)}
                placeholder="VD: 106.70098"
                className="w-full border rounded-xl px-3 py-2 text-sm outline-none border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
          </div>

          {hasManualInput && (
            <button
              type="button"
              onClick={() => {
                setManualLat("");
                setManualLon("");
              }}
              className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-700"
            >
              Xoá toạ độ nhập tay, dùng lại GPS
            </button>
          )}

          {isUsingManualCoords && (
            <p className="text-xs text-blue-600 flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
              <MapPin className="w-3 h-3" />
              Đang dùng toạ độ: {parsedManualLat?.toFixed(5)}, {parsedManualLon?.toFixed(5)}
            </p>
          )}
          {validationErrors.coords && (
            <p className="text-xs text-red-500">{validationErrors.coords}</p>
          )}

          <div className="relative h-56 rounded-xl overflow-hidden border border-slate-200">
            {locLoading && (
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
          <ConditionSelector options={options} values={selected} onToggle={handleToggle} />
        </section>

        {/* SĐT */}
        <section className="space-y-3">
          <Label icon={PhoneCall} className="text-red-600 font-semibold text-lg sm:text-sm lg:text-xl">
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
          <Label icon={FileText} className="text-red-600 font-semibold text-lg sm:text-sm lg:text-xl">
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
          {isEditMode ? "CẬP NHẬT SOS" : "GỬI SOS"}
        </button>
      </form>
    </div>
  );
};