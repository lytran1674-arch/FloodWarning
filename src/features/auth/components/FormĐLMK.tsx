import React, { useState } from "react";
import { FaArrowLeft, FaLock } from "react-icons/fa";

import { ShieldCheckIcon } from "lucide-react";
import NenForm from "@/assets/nenform.png";

import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { toast } from "react-toastify";
import { authService } from "../services/authService";
import { useLocation, useNavigate } from "react-router-dom";

export const FormĐLMK = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPW, setConfirmPW] = useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("")
const location = useLocation();
const navigate = useNavigate();

const email = location.state?.email;
const otp = location.state?.otp;
 
  const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  if (!email || !otp) {
    toast.error("Thông tin xác thực không hợp lệ.");
    navigate("/forgot-password");
    return;
  }

  if (!newPassword.trim()) {
    setError("Vui lòng nhập mật khẩu mới.");
    return;
  }

  if (!confirmPW.trim()) {
    setError("Vui lòng xác nhận mật khẩu.");
    return;
  }

  if (newPassword.length < 8) {
    setError("Mật khẩu phải có ít nhất 8 ký tự.");
    return;
  }

  if (newPassword !== confirmPW) {
    setError("Mật khẩu xác nhận không khớp.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    await authService.resetpassword(
      email,
      otp,
      newPassword
    );

    toast.success("Đổi mật khẩu thành công!");

    // Chuyển sang trang hoàn tất hoặc đăng nhập
    navigate("/login");
    // hoặc:
    // navigate("/reset-password-success");

  } catch (err: any) {
    console.error(err);

    setError(
      err?.response?.data?.message ??
      "Đổi mật khẩu thất bại."
    );
  } finally {
    setLoading(false);
  }
};

  return (
  <div
    style={{ backgroundImage: `url(${NenForm})` }}
    className="min-h-screen bg-cover bg-center bg-no-repeat"
  >
    {/* Header */}
    <div className="absolute top-8 left-10 flex items-center gap-3">
      <div className="w-14 h-14 rounded-full bg-blue-700 flex items-center justify-center">
        <ShieldCheckIcon className="text-white w-8 h-8" />
      </div>

      <div>
        <h1 className="text-3xl font-bold text-[#173E8F] leading-tight">
          HỆ THỐNG
        </h1>
        <h1 className="text-3xl font-bold text-[#173E8F] leading-tight">
          CẢNH BÁO & CỨU HỘ LŨ LỤT
        </h1>
      </div>
    </div>

    <div className="min-h-screen flex items-center">
      <div className="ml-24 w-[420px] bg-white/85 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <form onSubmit={handleSubmit}>
          {/* Back */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-700"
          >
            <FaArrowLeft />
            Tạo mật khẩu mới
          </button>

          {/* Step */}
          <div className="mt-5 flex justify-between text-center">
            {[
              {
                number: 1,
                text: "Xác thực",
                active: false,
              },
              {
                number: 2,
                text: "Đặt lại mật khẩu",
                active: true,
              },
              {
                number: 3,
                text: "Hoàn tất",
                active: false,
              },
            ].map((item) => (
              <div
                key={item.number}
                className="flex flex-col items-center flex-1"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold
                  ${
                    item.active
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {item.number}
                </div>

                <span className="text-xs mt-2">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Lock */}
          <div className="flex justify-center mt-8">
            <div className="w-24 h-24 rounded-full bg-[#DCE9FF] flex items-center justify-center">
              <FaLock className="text-5xl text-[#173E8F]" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mt-5">
            TẠO MẬT KHẨU MỚI
          </h2>

          <p className="text-center text-gray-500 text-sm mt-2">
            Vui lòng tạo mật khẩu mới cho tài khoản của bạn
          </p>

          {/* Input */}
          <div className="space-y-5 mt-8">
            <Input
              id="newPassword"
              label="Mật khẩu mới"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
            />

            <Input
              id="confirmPassword"
              label="Xác nhận mật khẩu mới"
              type="password"
              value={confirmPW}
              onChange={setConfirmPW}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-3">
              {error}
            </p>
          )}

          {/* Password rules */}
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
              Tối thiểu 8 ký tự
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
              Bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <ShieldCheckIcon className="w-4 h-4 text-blue-600" />
              Mật khẩu xác nhận khớp
            </div>
          </div>

          {/* Button */}
          <Button
            type="submit"
            disabled={loading}
            className="mt-8 w-full h-11 rounded-lg bg-[#2E6AF4] hover:bg-[#1C4FD7]"
          >
            {loading ? "Đang xử lý..." : "Tiếp tục"}
          </Button>
        </form>
      </div>
    </div>
  </div>
);
};

