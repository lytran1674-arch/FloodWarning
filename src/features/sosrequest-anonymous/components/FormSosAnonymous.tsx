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

// Key dùng chung để lưu định danh thiết bị/số điện thoại anonymous
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
  // Tên khu vực "sạch" dùng để geocode (VD: "Phường Bến Nghé, Quận 1") — tách riêng khỏi label hiển thị "Quận 1 > Phường Bến Nghé"
  const [selectedAreaGeoName, setSelectedAreaGeoName] = useState("");
  const [searchArea, setSearchArea] = useState("");
  const [openArea, setOpenArea] = useState(false);

  const [geocodedLat, setGeocodedLat] = useState<number | null>(null);
  const [geocodedLon, setGeocodedLon] = useState<number | null>(null);
  const [geocoding, setGeocoding] = useState(false);

  // Nguồn vị trí đang được người dùng chọn để dùng: GPS thật hoặc địa chỉ nhập tay.
  // null = chưa xác định (chưa có GPS lẫn địa chỉ)
  const [locationMode, setLocationMode] = useState<"gps" | "address" | null>(null);

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
  const navigate = useNavigate();

  // Khôi phục số điện thoại đã nhập lần trước (nếu có), tiện cho người dùng không phải gõ lại
  useEffect(() => {
    const savedPhone = localStorage.getItem(ANONYMOUS_SODT_KEY);
    if (savedPhone) setPhone(savedPhone);
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    getLocation();
  }, [getLocation]);

  // Khi GPS tự động lấy được lúc mount, chỉ nhận làm nguồn vị trí nếu người dùng
  // chưa chủ động chọn nhập địa chỉ trước đó.
  useEffect(() => {
    if (lat && locationMode === null) {
      setLocationMode("gps");
    }
  }, [lat, locationMode]);

  // areaOptions: label hiển thị dùng "Cha > Con", nhưng lưu thêm geoName "Con, Cha" để geocode chính xác hơn
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

  // Geocode với fallback: thử địa chỉ đầy đủ trước, nếu không ra kết quả thì thử lại chỉ với tên khu vực
  // để tối thiểu vẫn rơi đúng vào khu vực đã chọn thay vì null hoặc lệch lung tung.
  const geocodeAddress = async (fullAddress: string, fallbackAreaName?: string) => {
    try {
      setGeocoding(true);

      const tryGeocode = async (q: string) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          q
        )}&countrycodes=vn&limit=1`;
        const response = await fetch(url);
        return response.json();
      };

      let data = await tryGeocode(fullAddress);

      if ((!data || data.length === 0) && fallbackAreaName) {
        data = await tryGeocode(fallbackAreaName);
      }

      if (data && data.length > 0) {
        setGeocodedLat(Number(data[0].lat));
        setGeocodedLon(Number(data[0].lon));
        setValidationErrors((prev) => ({ ...prev, coords: undefined }));
      } else {
        setGeocodedLat(null);
        setGeocodedLon(null);
      }
    } catch (error) {
      console.error("Geocode error", error);
    } finally {
      setGeocoding(false);
    }
  };

  useEffect(() => {
    if (locationMode !== "address") return;
    if (!addressDetail || !selectedAreaGeoName) return;

    const fullAddress = `${addressDetail}, ${selectedAreaGeoName}`;
    const timer = setTimeout(() => {
      geocodeAddress(fullAddress, selectedAreaGeoName);
    }, 700);

    return () => clearTimeout(timer);
  }, [addressDetail, selectedAreaGeoName, locationMode]);

  // Toạ độ dùng thật sự phụ thuộc HOÀN TOÀN vào locationMode:
  // - "gps": luôn dùng toạ độ GPS thật, bỏ qua địa chỉ/geocode dù có
  // - "address": luôn dùng toạ độ geocode từ địa chỉ, bỏ qua GPS dù có
  const isUsingGeocode = locationMode === "address" && geocodedLat !== null;
  const effectiveLat = locationMode === "address" ? geocodedLat : lat;
  const effectiveLon = locationMode === "address" ? geocodedLon : lon;
  const fullAddress = `${addressDetail}${addressDetail && selectedAreaLabel ? ", " : ""}${selectedAreaLabel}`;

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

    if (!selectedArea) {
      errors.area = "Vui lòng chọn khu vực";
    }

    if (!effectiveLat || !effectiveLon) {
      errors.coords = "Vui lòng bật GPS hoặc nhập địa chỉ để xác định vị trí";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleToggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Người dùng bấm nút lấy GPS -> ưu tiên GPS, xoá phần địa chỉ/geocode đang nhập dở
  const handleUseGps = () => {
    setLocationMode("gps");
    setAddressDetail("");
    setGeocodedLat(null);
    setGeocodedLon(null);
    getLocation();
  };

  // Người dùng gõ địa chỉ -> chuyển sang dùng địa chỉ, không dùng GPS nữa
  const handleAddressChange = (value: string) => {
    setAddressDetail(value);
    if (value.trim()) {
      setLocationMode("address");
    } else if (lat) {
      // Xoá hết địa chỉ đã nhập thì quay lại dùng GPS nếu đang có sẵn
      setLocationMode("gps");
      setGeocodedLat(null);
      setGeocodedLon(null);
    } else {
      setLocationMode(null);
      setGeocodedLat(null);
      setGeocodedLon(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = Object.values(validationErrors)[0];
      if (firstError) showSnackbar(firstError, "warning");
      return;
    }

    // Lấy hoặc tạo mới clientDeviceId — định danh thiết bị cho người chưa đăng nhập
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
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
      diachi: fullAddress,
      // Quan trọng: gửi kèm khu vực người dùng CHỌN THỦ CÔNG lên backend, để backend match đội
      // cứu hộ theo khu vực này thay vì (hoặc kèm với) suy luận point-in-polygon từ lat/lon geocode,
      // vốn có thể lệch ra ngoài ranh giới khu vực thật.
      areaId    : selectedArea!,
      // Geocode kém chính xác hơn GPS thật -> accuracy (sai số, đơn vị mét) phải LỚN hơn, không phải 0.
      accuracy: isUsingGeocode ? 150 : 10,
      injured: selected.includes("Bị thương"),
      trapped: selected.includes("Mắc kẹt"),
      vulnerable: selected.includes("Có người già/trẻ em/mang thai"),
      mota: desc,
    };

    console.log(payload);

    try {
      const response = await createSosAnonymous(payload);

      // Lưu lại sodt để dùng cho việc xem/hủy yêu cầu sau này
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
  const isLocationReady = !!effectiveLat && !!effectiveLon;

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

          <button
            type="button"
            onClick={handleUseGps}
            disabled={locLoading}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
              locLoading
                ? "border-blue-200 text-blue-400 bg-blue-50 cursor-not-allowed"
                : locationMode === "gps" && lat
                ? "border-green-400 text-green-600 bg-green-50 hover:bg-green-100"
                : "border-red-300 text-red-500 bg-red-50 hover:bg-red-100"
            }`}
          >
            {locLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Đang lấy vị trí GPS...
              </>
            ) : locationMode === "gps" && lat ? (
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

          {locError && (
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
            {locationMode === "address" && (
              <p className="text-[11px] text-slate-400">
                Đang dùng vị trí theo địa chỉ nhập tay (bỏ qua GPS).
              </p>
            )}
          </div>

          <div className="space-y-1">
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
                        onClick={() => {
                          setSelectedArea(area.id);
                          setSelectedAreaLabel(area.label);
                          setSelectedAreaGeoName(area.geoName);
                          setSearchArea(area.label);
                          setOpenArea(false);
                          // Chọn khu vực để geocode nghĩa là người dùng đang dùng luồng địa chỉ
                          if (addressDetail.trim()) {
                            setLocationMode("address");
                          }
                        }}
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

          {geocoding && (
            <p className="text-xs text-blue-600 flex items-center gap-1">
              <Loader className="w-3 h-3 animate-spin" />
              Đang xác định vị trí từ địa chỉ...
            </p>
          )}
          {isUsingGeocode && !geocoding && (
            <p className="text-xs text-blue-600 flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-1.5">
              <MapPin className="w-3 h-3" />
              Đã xác định vị trí từ địa chỉ: {geocodedLat?.toFixed(5)}, {geocodedLon?.toFixed(5)}
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