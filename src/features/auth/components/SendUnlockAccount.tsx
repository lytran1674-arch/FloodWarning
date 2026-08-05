import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import NenForm from "@/assets/nenform.png";
import { Button } from "../../../components/ui/Button";
import { authService } from "../services/authService";
import { LockIcon } from "lucide-react";

export const SendUnlockAccount = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading,setLoading] = useState(false);
  const [seconds, setSeconds] = useState(300);
  const navigate = useNavigate();
const location = useLocation();

const email = location.state?.email;
  const minutes = Math.floor(seconds / 60);
  const remain = seconds % 60;

  useEffect(() => {
  if (!email) {
    toast.error("Không tìm thấy email.");
    navigate("/unlock-account");
  }
}, [email, navigate]);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
setError("");

    if (value && index < 5) {
      (
        document.getElementById(`otp-${index + 1}`) as HTMLInputElement
      )?.focus();
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const token = otp.join("");

  if (token.length !== 6) {
    setError("Vui lòng nhập đầy đủ 6 số.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const response = await authService.unlockAccount(email, token);

    toast.success(response.result?.message || "Mở khóa tài khoản thành công.");

    navigate("/");
  } catch (err: any) {
    setError(
      err?.response?.data?.message ||
      "Mã OTP không chính xác."
    );
  } finally {
    setLoading(false);
  }
};

 const handleResendOtp = async () => {
  if (seconds > 0) return;

  try {
    await authService.sendUnlockCode(email);

    toast.success("Đã gửi lại mã OTP.");
    setOtp(["", "", "", "", "", ""]);
setError("");
setSeconds(300);    

    setSeconds(900);
  } catch (err: any) {
    toast.error(
      err?.response?.data?.message ??
      "Không thể gửi lại mã OTP."
    );
  }
};

  return (
    <div
      style={{ backgroundImage: `url(${NenForm})` }}
      className="w-screen h-screen bg-cover bg-center bg-no-repeat overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-center items-center p-2">
        <p className="font-bold text-xl sm:text-2xl lg:text-3xl text-[#1D3178]">
          HỆ THỐNG CẢNH BÁO VÀ CỨU HỘ LŨ LỤT
        </p>
      </div>

      <div className="w-full h-[calc(100vh-90px)] flex justify-center lg:justify-start items-center px-4">
        <div className="bg-white/90 backdrop-blur-sm w-full max-w-[600px] lg:ml-14 p-6 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit}>
            {/* Top */}
            <div className="flex flex-col items-center">
              <MdEmail className="rounded-full text-6xl border p-3 bg-[#B1C9F9] border-[#B1C9F9] text-white" />

              <p className="font-bold text-2xl mt-3">
               MỞ KHÓA TÀI KHOẢN
              </p>

              <p className="text-center text-gray-700 mt-2">
                Chúng tôi đã gửi mã xác nhận đến
              </p>

              <p className="font-semibold text-[#1C5FE5]">
                {email}
              </p>
            </div>

            {/* OTP */}
            <div className="flex justify-center gap-3 mt-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleChange(index, e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Backspace" &&
                      !otp[index] &&
                      index > 0
                    ) {
                      (
                        document.getElementById(
                          `otp-${index - 1}`
                        ) as HTMLInputElement
                      )?.focus();
                    }
                  }}
                  className="w-12 h-12 border rounded-lg text-center text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-center mt-3 text-sm">
                {error}
              </p>
            )}

            {/* Timer */}
            <p className="text-sm mt-5 text-center">
              Mã xác nhận sẽ hết hạn sau{" "}
              <span className="text-red-500 font-semibold">
                {minutes}:{remain.toString().padStart(2, "0")}
              </span>
            </p>

            {/* Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-5 h-11 bg-[#1C5FE5]"
            >
                <LockIcon/>
              {loading ? "Đang xác nhận..." : "Xác nhận và mở khóa"}
            </Button>

            {/* Resend */}
            <p className="text-center mt-4 text-sm">
              Không nhận được mã?

              <button
                type="button"
                disabled={seconds > 0}
                onClick={handleResendOtp}
                className="ml-1 text-blue-600 disabled:text-gray-400"
              >
                Gửi lại
              </button>

              {seconds > 0 && (
                <span className="ml-1 text-gray-500">
                  ({minutes}:{remain.toString().padStart(2, "0")})
                </span>
              )}
            </p>

            {/* Back */}
            <div
  onClick={() => navigate("/unlock-account")}
  className="mt-4 flex justify-start items-center gap-2 text-[#1C5FE5] cursor-pointer hover:text-black"
>
  <FaArrowLeft />
  <p>Quay lại </p>
</div>

          
          
          </form>
        </div>
      </div>
    </div>
  );
};