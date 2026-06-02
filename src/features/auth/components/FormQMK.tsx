import { useState } from "react";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { ShieldCheckIcon } from "lucide-react";

import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

export const FormQMK = () => {
  const [email, setEmail] = useState("");

  return (
    <div
      className="
        w-screen
    h-screen
    bg-[url('/image/nenform.png')]
    bg-cover
    bg-center
    bg-no-repeat
    overflow-hidden
      "
    >
      {/* Header */}
      <div
        className="
          flex
          justify-center
          items-center
          
          p-4
  
          text-center
        "
      >
        <MdSecurity
          className="
            text-5xl
            sm:text-6xl
            lg:text-5xl
            text-[#1D3178]
            shrink-0
          "
        />

        <p
          className="
            font-bold
            text-xl
            sm:text-2xl
            lg:text-3xl
            text-[#1D3178]
          "
        >
          HỆ THỐNG CẢNH BÁO VÀ CỨU HỘ LŨ LỤT
        </p>
      </div>

      {/* Container */}
      <div
        className="
          w-full
          h-[calc(100vh-90px)]
          flex
          justify-center
          lg:justify-start
          items-center
          px-4
        "
      >
        {/* Card */}
        <div
          className="
            bg-white/90
            backdrop-blur-sm
            w-full
            max-w-[600px]
            lg:ml-14
            p-6
            rounded-2xl
            shadow-2xl
          "
        >
          <form>
            {/* Top */}
            <div className="flex flex-col justify-center items-center">
              <FaLock
                className="
                  rounded-full
                  text-5xl
                  sm:text-6xl
                  lg:text-7xl
                  border
                  p-2
                  lg:p-3
                  bg-[#B1C9F9]
                  border-[#B1C9F9]
                  text-[#0C317B]
                "
              />

              <p
                className="
                  font-bold
                  text-xl
                  sm:text-2xl
                  text-black
                  mt-3
                "
              >
                QUÊN MẬT KHẨU
              </p>

              <p
                className="
                  text-xs
                  sm:text-sm
                  lg:text-base
                  text-center
                  text-gray-700
                  mt-2
                  leading-5
                "
              >
                Nhập email hoặc số điện thoại mà bạn đã đăng ký
                để nhận hướng dẫn đặt lại mật khẩu
              </p>
            </div>

            {/* Input */}
            <div className="mt-5">
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="Nhập email bạn đã đăng ký"
                onChange={setEmail}
                value={email}
              />
            </div>

            {/* Button */}
            <Button
              className="
                bg-[#1C5FE5]
                text-white
                mt-4
                w-full
                rounded-lg
                h-11
                hover:bg-[#0C317B]
                transition-all
              "
              children="Gửi mã xác nhận"
            />

            {/* Back */}
            <div
              className="
                mt-4
                font-light
                flex
                justify-center
                items-center
                gap-2
                text-[#1C5FE5]
                hover:text-black
                cursor-pointer
                transition-all
              "
            >
              <FaArrowLeft />
              <p>Quay về trang chủ</p>
            </div>

            {/* Note */}
            <div
              className="
                mt-6
                border
                border-[#1C5FE5]
                bg-[#EEF4FF]
                rounded-xl
                p-4
                flex
                items-start
                gap-4
              "
            >
              {/* Icon */}
              <div
                className="
                  min-w-[40px]
                  h-10
                  flex
                  items-start
                  justify-center
                  text-[#1C5FE5]
                "
              >
                <ShieldCheckIcon className="w-7 h-7" />
              </div>

              {/* Content */}
              <div className="flex flex-col">
                <p className="text-black font-bold text-lg">
                  Lưu ý
                </p>

                <p className="text-gray-700 text-sm mt-1 leading-5">
                  Vui lòng kiểm tra hộp thư (bao gồm Spam)
                  để nhận email hướng dẫn đặt lại mật khẩu.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};