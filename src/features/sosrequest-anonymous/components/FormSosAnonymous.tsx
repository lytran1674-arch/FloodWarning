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
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Counter from "../../../components/ui/Counter";
import React, { useState, useEffect, useRef, useMemo } from "react";
import ConditionSelector from "../../../components/ui/ConditionSelector";
import { Input } from "../../../components/ui/Input";
import GeoMap from "../../map/components/GeoMap";
import { useGeoLocation } from "../../map/hooks/useGeolocation";
import { useArea } from "../../areas/hooks/useArea";
import { toast } from "react-toastify";

import { usesosrequestanonymous } from "../../sosrequest-anonymous/hooks/usesosrequestanonymous";
import type { SoSRequest } from "@/features/sosrequest/types/sosType";

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

export const SOSRequestAnonymous = () => {
  const [count, setCount] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [desc, setDesc] = useState("");

  const [addressDetail, setAddressDetail] = useState("");
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedAreaLabel, setSelectedAreaLabel] = useState("");
  const [selectedAreaGeoName, setSelectedAreaGeoName] = useState("");
  const [searchArea, setSearchArea] = useState("");
  const [openArea, setOpenArea] = useState(false);

  const [geocodedLat, setGeocodedLat] = useState<number | null>(null);
  const [geocodedLon, setGeocodedLon] = useState<number | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const [geocodeNotFound, setGeocodeNotFound] = useState(false);

  const [validationErrors, setValidationErrors] = useState<{
    phone?: string;
    desc?: string;
    coords?: string;
    area?: string;
  }>({});

  const { loading, createSosAnonymous } = usesosrequestanonymous();
  const { areas } = useArea();
  const {
    lat,
    lon,
    loading: locLoading,
    error: locError,
    getLocation,
  } = useGeoLocation();

  const fetchedRef = useRef<boolean>(false);
  const areaBoxRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Khôi phục số điện thoại
  useEffect(() => {
    const savedPhone = localStorage.getItem(ANONYMOUS_SODT_KEY);
    if (savedPhone) setPhone(savedPhone);
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    getLocation();
  }, [getLocation]);

  // Đóng dropdown
  useEffect(() => {
    if (!openArea) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (areaBoxRef.current && !areaBoxRef.current.contains(e.target as Node)) {
        setOpenArea(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openArea]);

  const areaOptions = useMemo(() => {
    return areas.flatMap((parent) =>
      (parent.children ?? []).map((child) => ({
        id: child.id,
        label: `${parent.tenkhuvuc} > ${child.tenkhuvuc}`,
        geoName: `${child.tenkhuvuc}, ${parent.tenkhuvuc}`,
      }))
    );
  }, [areas]);

  const filteredAreas = areaOptions.filter((area) =>
    area.label.toLowerCase().includes(searchArea.toLowerCase())
  );

  const geocodeAddress = async (fullAddress: string, fallbackAreaName?: string) => {
    try {
      setGeocoding(true);
      setGeocodeNotFound(false);

      const tryGeocode = async (q: string) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          q
        )}&countrycodes=vn&limit=1`;
        const response = await fetch(url);
        return response.json();
      };

      let data = await tryGeocode(fullAddress);
      console.log("Geocode query:", fullAddress);
console.log("Geocode result:", data);

      if ((!data || data.length === 0) && fallbackAreaName) {
        data = await tryGeocode(fallbackAreaName);
      }

      if (data && data.length > 0) {
        setGeocodedLat(Number(data[0].lat));
        setGeocodedLon(Number(data[0].lon));
        setValidationErrors((prev) => ({ ...prev, coords: undefined }));
        setGeocodeNotFound(false);
      } else {
        setGeocodedLat(null);
        setGeocodedLon(null);
        setGeocodeNotFound(true);
      }
    } catch (error) {
      console.error("Geocode error", error);
      setGeocodeNotFound(true);
    } finally {
      setGeocoding(false);
    }
  };

  const hasAddress = !!addressDetail.trim();

  // Gọi geocode khi có địa chỉ và đã chọn khu vực
  useEffect(() => {
      console.log("useEffect geocode", {
    addressDetail,
    hasAddress,
    selectedAreaGeoName,
  });
    if (!hasAddress || !selectedAreaGeoName) {
      // Nếu không có địa chỉ hoặc chưa chọn khu vực, xóa geocode cũ
      if (!hasAddress) {
        setGeocodedLat(null);
        setGeocodedLon(null);
        setGeocodeNotFound(false);
      }
      return;
    }

    const timer = setTimeout(() => {
     const fullAddress =
`${addressDetail}, ${selectedAreaGeoName}, Việt Nam`;
      geocodeAddress(fullAddress, selectedAreaGeoName);
    }, 700);

    return () => clearTimeout(timer);
  }, [addressDetail, selectedAreaGeoName, hasAddress]);

// Nếu người dùng nhập địa chỉ thì chỉ dùng tọa độ từ địa chỉ.
// Nếu không nhập địa chỉ thì dùng GPS.
const usingGeocode = hasAddress;

const effectiveLat = hasAddress ? geocodedLat : lat;
const effectiveLon = hasAddress ? geocodedLon : lon;
  // Địa chỉ đầy đủ dùng để hiển thị và gửi lên: nếu có địa chỉ, dùng addressDetail + selectedAreaGeoName (có dấu phẩy)
  const fullAddress = hasAddress
    ? `${addressDetail}${addressDetail && selectedAreaGeoName ? ", " : ""}${selectedAreaGeoName || ""}`
    : "";

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
    if (hasAddress && !selectedArea) {
      errors.area = "Vui lòng chọn khu vực để xác định vị trí";
    }
    if (!hasAddress && !selectedArea) {
      errors.area = "Vui lòng chọn khu vực";
    }
   if (hasAddress) {
  if (!geocodedLat || !geocodedLon) {
    errors.coords =
      "Không xác định được vị trí từ địa chỉ. Vui lòng kiểm tra lại địa chỉ.";
  }
} else {
  if (!lat || !lon) {
    errors.coords =
      "Không lấy được vị trí GPS. Vui lòng bật GPS.";
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

  const handleUseGps = () => {
    setAddressDetail("");
    setSearchArea("");
    setSelectedArea(null);
    setSelectedAreaLabel("");
    setSelectedAreaGeoName("");
    setGeocodedLat(null);
    setGeocodedLon(null);
    setGeocodeNotFound(false);
    getLocation();
  };

  const handleAddressChange = (value: string) => {
    setAddressDetail(value);
    setGeocodeNotFound(false);
    if (!value.trim()) {
      setGeocodedLat(null);
      setGeocodedLon(null);
    }
  };

  const handleSelectArea = (area: { id: string; label: string; geoName: string }) => {
      console.log(area);
    setSelectedArea(area.id);
    setSelectedAreaLabel(area.label);
    setSelectedAreaGeoName(area.geoName);
    setSearchArea(area.label);
    setOpenArea(false);
    setValidationErrors((prev) => ({ ...prev, area: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = Object.values(validationErrors)[0];
      if (firstError) showSnackbar(firstError, "warning");
      return;
    }

    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    // Nếu đang geocode và chưa có kết quả, đợi (nhưng submit đã disabled, vẫn an toàn)
    // Chọn accuracy dựa trên nguồn
    const accuracy = usingGeocode ? 150 : 10;
    console.log({
  hasAddress,
  geocodedLat,
  geocodedLon,
  gpsLat: lat,
  gpsLon: lon,
  effectiveLat,
  effectiveLon,
});

    const payload: SoSRequest = {
      sodt: phone,
      clientDeviceId: deviceId,
      victimCount: count,
      lat: effectiveLat!,
      lon: effectiveLon!,
      diachi: fullAddress,
      areaId: selectedArea ?? undefined,
      accuracy: accuracy,
      injured: selected.includes("Bị thương"),
      trapped: selected.includes("Mắc kẹt"),
      vulnerable: selected.includes("Có người già/trẻ em/mang thai"),
      mota: desc,
    };

    console.log("[SOS submit] payload:", payload);

    try {
      const response = await createSosAnonymous(payload);
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

  const isSubmitting = loading || locLoading || geocoding;
  // Chỉ cho phép submit nếu có vị trí (GPS hoặc geocode) và không trong quá trình geocode
 const isLocationReady = hasAddress
  ? !!geocodedLat && !!geocodedLon && !geocoding
  : !!lat && !!lon;
  // Nếu đã có địa chỉ nhưng chưa chọn khu vực, không cho submit
  const isAreaMissing = hasAddress && !selectedArea;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border p-2 sm:p-6 lg:p-8 mt-5">
      <form className="space-y-2" onSubmit={handleSubmit}>
        <h2 className="text-center text-red-600 text-xl sm:text-2xl lg:text-3xl font-bold">
          CỨU HỘ KHẨN CẤP
        </h2>

        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
          <TriangleAlert className="text-amber-500 w-4 h-4 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            Bạn đang gửi yêu cầu với tư cách khách. Vui lòng nhập đúng số điện thoại
            để có thể xem lại hoặc hủy yêu cầu sau này trên cùng thiết bị.
          </p>
        </div>

        <section className="space-y-3">
          <Label
            icon={Map}
            className="text-red-600 font-semibold text-lg lg:text-xl sm:text-sm"
          >
            Vị trí
          </Label>

          {/* Nút GPS - bị disable khi có địa chỉ */}
          <button
            type="button"
            onClick={handleUseGps}
            disabled={locLoading || hasAddress}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
              locLoading || hasAddress
                ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
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
            ) : hasAddress ? (
              <>
                <Navigation className="w-4 h-4" />
                Đang dùng vị trí từ địa chỉ (không thể dùng GPS)
              </>
            ) : lat ? (
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

          {/* Nút xoá địa chỉ */}
          {hasAddress && (
            <button
              type="button"
              onClick={handleUseGps}
              className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 mt-1"
            >
              <X className="w-4 h-4" />
              Xoá địa chỉ để dùng GPS
            </button>
          )}

          {locError && !hasAddress && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <TriangleAlert className="w-3 h-3" />
              {locError} — bạn có thể nhập địa chỉ bên dưới thay thế
            </p>
          )}

          <div className="flex items-center gap-2 py-1">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">hoặc nhập địa chỉ</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Địa chỉ chi tiết</label>
            <input
              type="text"
              value={addressDetail}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="Ví dụ: 12 Nguyễn Huệ, Ấp 2..."
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <div className="space-y-1" ref={areaBoxRef}>
            <label className="text-xs text-slate-400">Khu vực</label>
            <div className="relative">
              <input
                value={searchArea}
                onFocus={() => setOpenArea(true)}
                onChange={(e) => {
                  setSearchArea(e.target.value);
                  setOpenArea(true);
                  if (selectedArea) {
                    setSelectedArea(null);
                    setSelectedAreaLabel("");
                    setSelectedAreaGeoName("");
                  }
                }}
                placeholder="Tìm kiếm khu vực..."
                className="w-full border rounded-xl px-3 py-2 text-sm outline-none border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
              {openArea && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border bg-white shadow-lg">
                  {filteredAreas.length > 0 ? (
                    filteredAreas.map((area) => (
                      <button
                        key={area.id}
                        type="button"
                        className="block w-full px-4 py-2.5 text-left text-sm hover:bg-slate-100"
                        onClick={() => handleSelectArea(area)}
                      >
                        {area.label}
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-gray-500">
                      Không tìm thấy khu vực
                    </div>
                  )}
                </div>
              )}
            </div>
            {validationErrors.area && (
              <p className="text-xs text-red-500">{validationErrors.area}</p>
            )}
          </div>

          {hasAddress && !selectedAreaGeoName && !geocoding && (
            <p className="text-xs text-slate-400">
              Vui lòng chọn khu vực để xác định vị trí chính xác từ địa chỉ.
            </p>
          )}

          {geocoding && (
            <p className="text-xs text-blue-600 flex items-center gap-1">
              <Loader className="w-3 h-3 animate-spin" />
              Đang xác định vị trí từ địa chỉ...
            </p>
          )}
          {usingGeocode && !geocoding && (
            <p className="text-xs text-blue-600 flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
              <MapPin className="w-3 h-3" />
              Đã xác định vị trí từ địa chỉ: {geocodedLat?.toFixed(5)}, {geocodedLon?.toFixed(5)}
            </p>
          )}
          {geocodeNotFound && !geocoding && hasAddress && (
            <p className="text-xs text-amber-600 flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
              <TriangleAlert className="w-3 h-3" />
              Không xác định được vị trí từ địa chỉ. Vui lòng kiểm tra lại địa chỉ.
            </p>
          )}
          {validationErrors.coords && (
            <p className="text-xs text-red-500">{validationErrors.coords}</p>
          )}

          <div className="relative h-56 rounded-xl overflow-hidden border border-slate-200">
            {locLoading && !hasAddress && (
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

        <button
          type="submit"
          disabled={isSubmitting || !isLocationReady || isAreaMissing}
          className={`w-full text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            isSubmitting || !isLocationReady || isAreaMissing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:opacity-90"
          }`}
        >
          {isSubmitting ? <Loader className="w-5 h-5 animate-spin" /> : <Phone />}
          GỬI SOS
        </button>
        {isAreaMissing && (
          <p className="text-xs text-red-500 text-center">Vui lòng chọn khu vực để xác định vị trí</p>
        )}
      </form>
    </div>
  );
};