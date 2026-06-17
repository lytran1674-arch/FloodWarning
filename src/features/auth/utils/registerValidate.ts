interface ValidateParams {
  hoten: string;
  sodt: string;
  email: string;
  matkhau: string;
  xacNhanMatKhau: string;
  tinhId: string;
  phuongXaId: string;
  soNha: string;
}

export const validateRegister = ({
  hoten,
  sodt,
  email,
  matkhau,
  xacNhanMatKhau,
  tinhId,
  phuongXaId,
  soNha,
}: ValidateParams): string => {
  if (!hoten.trim()) return "Vui lòng nhập họ và tên.";

  if (!/^(0[3|5|7|8|9])\d{8}$/.test(sodt)) {
    return "Số điện thoại không hợp lệ.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Email không hợp lệ.";
  }

  if (matkhau.length < 6) {
    return "Mật khẩu phải có ít nhất 6 ký tự.";
  }

  if (matkhau !== xacNhanMatKhau) {
    return "Mật khẩu xác nhận không khớp.";
  }

  if (!tinhId) return "Vui lòng chọn tỉnh.";
  if (!phuongXaId) return "Vui lòng chọn phường/xã.";
  if (!soNha.trim()) return "Vui lòng nhập số nhà.";

  return "";
};