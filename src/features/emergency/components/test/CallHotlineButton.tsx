// features/hotline/components/CallHotlineButton.tsx
import { useEffect, useRef, useState } from "react";
import { Phone, Loader, TriangleAlert } from "lucide-react";
import { useGeoLocation } from "@/features/map/hooks/useGeolocation";
import { useEmergencyContact } from "../../hooks/test/UseEmergencyContactResult ";


const ANONYMOUS_SODT_KEY = "sos_anonymous_sodt";
const PHONE_REGEX = /^(0[3|5|7|8|9])+([0-9]{8})$/;

/**
 * Nút "Gọi Hotline": lấy vị trí GPS hiện tại + số điện thoại người dùng,
 * gọi API xác định đội cứu hộ phụ trách khu vực, rồi tự mở cuộc gọi điện thoại
 * thật tới số hotline của đội đó.
 */
export function CallHotlineButton() {
  const [phone, setPhone] = useState(
    () => localStorage.getItem(ANONYMOUS_SODT_KEY) ?? ""
  );
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const {
    lat,
    lon,
    loading: locLoading,
    error: locError,
    getLocation,
  } = useGeoLocation();
  const { isRequesting, error: contactError, requestAndCall } =
    useEmergencyContact();

  const fetchedRef = useRef(false);
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    getLocation();
  }, [getLocation]);

  const handleCall = async () => {
    if (!PHONE_REGEX.test(phone.trim())) {
      setPhoneError("Nhập đúng số điện thoại (bắt đầu bằng 0, đủ 10 số)");
      return;
    }
    setPhoneError(null);

    if (lat == null || lon == null) {
      getLocation();
      return;
    }

    localStorage.setItem(ANONYMOUS_SODT_KEY, phone.trim());
    await requestAndCall({ lat, lon, callerPhoneNumber: phone.trim() });
  };

  const isReady = lat != null && lon != null;
  const isBusy = locLoading || isRequesting;

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border p-6 space-y-4">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-red-600">GỌI HOTLINE CỨU HỘ</h2>
        <p className="text-sm text-slate-500">
          Hệ thống sẽ tự động kết nối bạn với đội cứu hộ gần nhất theo vị trí
          hiện tại.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400">Số điện thoại của bạn</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setPhoneError(null);
          }}
          placeholder="Nhập số điện thoại"
          className="w-full border rounded-xl px-3 py-2 text-sm outline-none border-slate-200 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        />
        {phoneError && <p className="text-xs text-red-500">{phoneError}</p>}
      </div>

      {!isReady && !locLoading && (
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <TriangleAlert className="w-3 h-3" />
          Cần bật định vị GPS để xác định đội cứu hộ gần bạn nhất.
        </p>
      )}
      {locError && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <TriangleAlert className="w-3 h-3" />
          {locError}
        </p>
      )}
      {contactError && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <TriangleAlert className="w-3 h-3" />
          {contactError}
        </p>
      )}

      <button
        type="button"
        onClick={handleCall}
        disabled={isBusy}
        className={`w-full text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
          isBusy
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:opacity-90"
        }`}
      >
        {isBusy ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <Phone className="w-5 h-5" />
        )}
        {locLoading
          ? "Đang xác định vị trí..."
          : isRequesting
          ? "Đang kết nối..."
          : "Gọi Hotline ngay"}
      </button>
    </div>
  );
}