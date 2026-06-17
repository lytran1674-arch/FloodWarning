// RegisterForm.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Input } from "../../../components/ui/Input";
import { SelectField } from "../../../components/ui/SelectField";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { useAreaSelect } from "../../areas/hooks/useAreaSelect";
import { authAPI } from "../../auth/api/authApi";
import imageLogin from "../../../assets/nenlogin.png";
import { toast } from "react-toastify";

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();

  // Lấy toàn bộ state từ hook
  const {
    hoten,
    setHoTen,
    sodt,
    setSodt,
    email,
    setEmail,
    matkhau,
    setMatKhau,
    xacNhanMatKhau,
    setXacNhanMatKhau,
    soNha,
    setSoNha,
    gioitinh,
    setGioitinh,
    ngaysinh,
    setNgaysinh,
  } = useRegisterForm();

  // State địa chỉ (tỉnh, phường/xã)
  const {
    loading,
    tinhId,
    setTinhId,
    phuongXaId,
    setPhuongXaId,
    tinhOptions,
    phuongXaOptions,
  } = useAreaSelect();

  // UI state
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validation
  const validate = () => {
    if (!hoten.trim()) return "Vui lòng nhập họ tên";
    if (!sodt.trim()) return "Vui lòng nhập số điện thoại";
    if (!/^\d{10}$/.test(sodt.trim())) return "Số điện thoại phải gồm 10 chữ số";
    if (!email.trim()) return "Vui lòng nhập email";
    if (!matkhau.trim()) return "Vui lòng nhập mật khẩu";
    if (matkhau.length < 6) return "Mật khẩu tối thiểu 6 ký tự";
    if (matkhau !== xacNhanMatKhau) return "Mật khẩu xác nhận không khớp";
    if (!tinhId) return "Vui lòng chọn tỉnh/thành";
    if (!phuongXaId) return "Vui lòng chọn phường/xã";
    if (!soNha.trim()) return "Vui lòng nhập số nhà";
    return "";
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");

    const error = validate();
    if (error) {
      setErrorMsg(error);
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        hoten: hoten.trim(),
        gioitinh: parseInt(gioitinh, 10), // chuyển thành number
        ngaysinh,
        diachi: soNha.trim(),
        sodt: sodt.trim(),
        email: email.trim(),
        password: matkhau,
        area_id: phuongXaId,
        ghichu: null,
      };

      await authAPI.register(payload);
      toast.success("Đăng ký thành công")

      // Đăng ký thành công -> về trang đăng nhập
      navigate("/");
    } catch (err: any) {
      console.error(err);
      const message = err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center justify-center overflow-hidden p-0 m-0 h-full"
    >
      <div className="overflow-hidden bg-white border border-blue-500 rounded-lg w-full max-w-md p-2 mb-3 shadow-lg mt-5">
        {/* Banner */}
        <img
          src={imageLogin}
          className="w-full h-[150px] rounded-lg object-cover"
          alt="Banner"
        />

        <h2 className="text-sm md:text-xl font-bold text-center my-2 text-gray-800">
          HỆ THỐNG CẢNH BÁO VÀ CỨU HỘ LŨ LỤT
        </h2>

        <p className="text-center text-xs text-gray-500 mb-3">
          Tạo tài khoản mới
        </p>

        {/* Lỗi */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-300 text-red-600 rounded-lg px-3 py-2 text-sm mb-3">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Họ tên */}
          <Input
            id="hoten"
            label="Họ và tên"
            type="text"
            placeholder="Trần Văn A"
            value={hoten}
            onChange={setHoTen}
            required
            className="h-1"
          />

          {/* Số điện thoại */}
          <Input
            id="sodt"
            label="Số điện thoại"
            type="text"
            placeholder="0901234567"
            value={sodt}
            onChange={setSodt}
            required
            className="h-1"
          />

          {/* Email */}
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="abc@gmail.com"
            value={email}
            onChange={setEmail}
            required
            className="h-1"
          />

          {/* Giới tính */}
          <SelectField
            id="gioitinh"
            label="Giới tính"
            value={gioitinh}
            onChange={setGioitinh}
            options={[
              { value: "0", label: "Nam" },
              { value: "1", label: "Nữ" },
            ]}
            required
          />

          {/* Ngày sinh */}
          <Input
            id="ngaysinh"
            label="Ngày sinh"
            type="date"
            value={ngaysinh}
            onChange={setNgaysinh}
            required
            className="h-1"
          />

          {/* Địa chỉ */}
          <div className="mb-1">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
              📍 Địa chỉ
            </p>

            {loading ? (
              <p className="text-xs text-gray-400 text-center py-2">
                Đang tải danh sách khu vực...
              </p>
            ) : (
              <>
                <SelectField
                  id="tinh"
                  label="Tỉnh / Thành phố"
                  value={tinhId}
                  onChange={setTinhId}
                  options={tinhOptions}
                  placeholder="-- Chọn tỉnh/thành phố --"
                  required
                />

                <SelectField
                  id="phuongxa"
                  label="Phường / Xã"
                  value={phuongXaId}
                  onChange={setPhuongXaId}
                  options={phuongXaOptions}
                  placeholder={tinhId ? "-- Chọn phường/xã --" : "-- Chọn tỉnh trước --"}
                  disabled={!tinhId}
                  required
                />
              </>
            )}

            <Input
              id="sonha"
              label="Số nhà, tên đường"
              type="text"
              placeholder="123 Đường Lê Lợi"
              value={soNha}
              onChange={setSoNha}
              required
              className="h-1"
            />
          </div>

          {/* Mật khẩu */}
          <Input
            id="matkhau"
            label="Mật khẩu"
            type="password"
            placeholder="Ít nhất 6 ký tự"
            value={matkhau}
            onChange={setMatKhau}
            required
            className="h-1"
          />

          {/* Xác nhận mật khẩu */}
          <Input
            id="xacnhanmatkhau"
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={xacNhanMatKhau}
            onChange={setXacNhanMatKhau}
            required
            className="h-1"
          />

          {/* Nút submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 text-base bg-[#FFD66D] text-black p-2 rounded-3xl
                       hover:bg-[#EF960F] transition-colors font-bold mt-2
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          {/* Chuyển hướng đăng nhập */}
          <h5 className="mt-2 text-sm font-medium text-black flex justify-center gap-1">
            Đã có tài khoản?
            <span
              className="text-[#1C5FE5] cursor-pointer hover:underline"
              onClick={() => navigate("/")}
            >
              Đăng nhập
            </span>
          </h5>
        </form>
      </div>
    </motion.div>
  );
};