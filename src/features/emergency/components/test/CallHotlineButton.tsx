// features/hotline/components/CallHotlineButton.tsx
import { useEffect, useRef, useState } from "react";
import { Phone, Loader, TriangleAlert } from "lucide-react";
import { useGeoLocation } from "@/features/map/hooks/useGeolocation";
import { useAppSelector } from "@/hooks/redux.hooks";
import { useEmergencyContact } from "../../hooks/test/UseEmergencyContactResult ";

const ANONYMOUS_SODT_KEY = "sos_anonymous_sodt";
const PHONE_REGEX = /^(0[3|5|7|8|9])+([0-9]{8})$/;

export function CallHotlineButton() {
  const user = useAppSelector((state) => state.auth.user);
  const userPhone = user?.sodt ?? "";
  const isLoggedIn = !!user;

  const [phone, setPhone] = useState(() => {
    if (userPhone) return userPhone;
    return localStorage.getItem(ANONYMOUS_SODT_KEY) ?? "";
  });
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const {
    lat,
    lon,
    loading: locLoading,
    error: locError,
    getLocation,
  } = useGeoLocation();
  const {
    isRequesting,
    error: contactError,
    requestAndCall,
  } = useEmergencyContact();

  const fetchedRef = useRef(false);
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    if (userPhone) setPhone(userPhone);
  }, [userPhone]);

  const handleCall = async () => {
    const callerPhone = userPhone || phone.trim();
    if (!PHONE_REGEX.test(callerPhone)) {
      setPhoneError("Số điện thoại chưa đúng (10 số, bắt đầu 0)");
      return;
    }
    setPhoneError(null);
    if (lat == null || lon == null) {
      getLocation();
      return;
    }
    if (!isLoggedIn) {
      localStorage.setItem(ANONYMOUS_SODT_KEY, callerPhone);
    }
    await requestAndCall({ lat, lon, callerPhoneNumber: callerPhone });
  };

  const isBusy = locLoading || isRequesting;

  return (
    <div className="w-full max-w-sm mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-slate-200/80 p-3 space-y-2.5 transition">
      {!isLoggedIn && (
        <div className="relative">
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setPhoneError(null);
            }}
            placeholder="Số điện thoại của bạn"
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none border-slate-200 focus:border-red-400 focus:ring-2 focus:ring-red-100/70 transition bg-white/70"
          />
          {phoneError && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <TriangleAlert className="w-3 h-3" />
              {phoneError}
            </p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleCall}
        disabled={isBusy}
        className={`
          w-full rounded-lg py-2.5 text-sm font-semibold text-white
          flex items-center justify-center gap-2
          transition-all duration-200
          ${isBusy
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600 active:scale-[0.97] shadow-sm hover:shadow"
          }
        `}
      >
        {isBusy ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Phone className="w-4 h-4" />
        )}
        {locLoading
          ? "Đang xác định vị trí..."
          : isRequesting
          ? "Đang kết nối..."
          : "Gọi Hotline"}
      </button>

      {/* Các thông báo phụ trợ - gọn gàng */}
      {(locError || contactError || (lat == null && lon == null && !locLoading)) && (
        <div className="space-y-0.5 text-xs">
          {locError && (
            <p className="flex items-center gap-1 text-amber-600">
              <TriangleAlert className="w-3 h-3" /> {locError}
            </p>
          )}
          {contactError && (
            <p className="flex items-center gap-1 text-red-500">
              <TriangleAlert className="w-3 h-3" /> {contactError}
            </p>
          )}
          {lat == null && lon == null && !locLoading && !locError && (
            <p className="flex items-center gap-1 text-amber-600">
              <TriangleAlert className="w-3 h-3" /> Vui lòng bật GPS để tìm đội cứu hộ gần nhất.
            </p>
          )}
        </div>
      )}
    </div>
  );
}