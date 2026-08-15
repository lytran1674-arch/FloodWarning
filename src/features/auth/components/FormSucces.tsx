import {
  CheckCircle2,
  ShieldCheck,

  ArrowLeft,
} from "lucide-react";
import {  useNavigate } from "react-router-dom";

export default function FormSuccess() {
    const navigate=useNavigate();
    const handleOnClick=()=>{
        navigate("/");
    }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex"
      style={{
        backgroundImage:
          "url('/images/flood-background.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="w-full bg-white/25 backdrop-blur-[2px] flex">
        {/* Left */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Logo */}
          <div className="p-10">
            <div className="flex items-center gap-4">
              <img
                src="/logo.png"
                alt=""
                className="w-16 h-16"
              />

              <div>
                <h1 className="text-3xl font-bold text-blue-900 leading-tight">
                  HỆ THỐNG
                  <br />
                  CẢNH BÁO & CỨU HỘ LŨ LỤT
                </h1>
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="flex justify-center items-center flex-1 px-5 pb-10">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-10">
              {/* Back */}
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8">
                <ArrowLeft size={18} />
                Tạo mật khẩu mới
              </button>

              {/* Step */}
              <div className="flex justify-between relative mb-12">
                <div className="absolute top-4 left-0 right-0 h-[2px] bg-gray-200" />

                {[
                  "Xác thực",
                  "Đặt lại mật khẩu",
                  "Hoàn tất",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                      ${
                        index <= 2
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <span className="text-xs mt-2 text-gray-600">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Success Icon */}

              <div className="flex justify-center mb-6">
                <div className="w-28 h-28 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                  <CheckCircle2
                    size={72}
                    className="text-white"
                  />
                </div>
              </div>

              {/* Title */}

              <h2 className="text-3xl font-bold text-center">
                ĐẶT LẠI MẬT KHẨU
                <br />
                THÀNH CÔNG!
              </h2>

              <p className="text-center text-gray-500 mt-3">
                Mật khẩu của bạn đã được thay đổi thành công.
              </p>

              {/* Security */}

              <div className="mt-8 rounded-xl border border-green-300 bg-green-50 p-5">
                <div className="flex gap-3">
                  <ShieldCheck
                    className="text-green-600 mt-1"
                    size={20}
                  />

                  <div>
                    <h3 className="font-semibold text-green-700">
                      Lời khuyên bảo mật
                    </h3>

                    <p className="text-sm text-gray-600 mt-2 leading-6">
                      Không chia sẻ mật khẩu với người khác và
                      thường xuyên thay đổi mật khẩu để bảo vệ
                      tài khoản của bạn.
                    </p>
                  </div>
                </div>
              </div>

              {/* Button */}

              <button className="mt-8 w-full rounded-xl bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold py-3 text-lg" onClick={handleOnClick  }>
                Đăng nhập ngay
              </button>
{/* 
              <Link
                to="/"
                className="mt-6 flex justify-center items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <Home size={18} />
                Quay về trang chủ
              </Link> */}
            </div>
          </div>
        </div>

        {/* Right side chỉ hiển thị background */}

        <div className="hidden lg:block flex-1" />
      </div>
    </div>
  );
}