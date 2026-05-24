import React, { useState } from "react";
import imageLogin from "../../../assets/nenlogin.png";
import { Input } from "./ui/Input";
import { motion } from "framer-motion";

export const RegisterForm : React.FC = () => {
  const [hoten,setHoTen]=useState("");
  const [sodt,setSodt]=useState("");
  const [diachi,setDiaChi]=useState("");
  const [email, setEmail] = useState("");
  const [matkhau, setMatKhau] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !matkhau) {
      alert("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    setIsLoading(true);
    console.log("Đăng nhập với:", { email, matkhau });

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <motion.div
  initial={{
    opacity: 0,
    y: 50,
    scale: 0.9,
  }}
  animate={{
    opacity: 1,
    y: 0,
    scale: 1,
  }}
  transition={{
    duration: 0.6,
    ease: "easeOut",
  }}
  className="flex items-center justify-center overflow-hidden p-0 m-0"
>
      <div className="overflow-hidden bg-white border border-blue-500 rounded-lg w-full max-w-md p-3 shadow-lg mt-5">
        <img
          src={imageLogin}
          className="w-full h-auto rounded-lg"
          alt="Login"
        />

        <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-gray-800">
          HỆ THỐNG CẢNH BÁO VÀ CỨU HỘ LŨ LỤT
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
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
           {/* Địa chỉ */}
          <Input
          id="diachi"
            label="Địa chỉ"
            type="text"
            placeholder=" abc phường 5 quận 5 TPHCM"
            value={diachi}
            onChange={setDiaChi}
            required
            className="h-1"
            
          />
        
           {/* Email */}
          <Input
          id="matkhau"
            label="Mật khẩu"
            type="password"
            value={matkhau}
            onChange={setMatKhau}
            required
            className="h-1"
          />
          

          <button
            type="submit"
            disabled={isLoading}
            className="w-full  h-10 text-xl bg-[#FFD66D] text-black p-2 rounded-3xl hover:bg-[#EF960F] transition-colors font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <h5 className="mt-1 text-sm font-medium text-black flex justify-center">
            Đã có tài khoản? <u className="text-[#1C5FE5]">Đăng nhập</u>
          </h5>
        </form>
      </div>
    </motion.div>
  );
};


