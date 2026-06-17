// hooks/useRegisterForm.ts
import { useState } from "react";

export const useRegisterForm = () => {
  const [hoten, setHoTen] = useState("");
  const [sodt, setSodt] = useState("");
  const [email, setEmail] = useState("");
  const [matkhau, setMatKhau] = useState("");
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState("");
  const [soNha, setSoNha] = useState("");
  const [gioitinh, setGioitinh] = useState<string>("0"); // "0": Nam, "1": Nữ
  const [ngaysinh, setNgaysinh] = useState<string>("2000-01-01");

  return {
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
  };
};