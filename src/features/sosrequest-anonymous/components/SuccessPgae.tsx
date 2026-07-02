// features/sos/pages/SuccessPage.tsx

import { useNavigate } from "react-router-dom"
import { Check, } from "lucide-react"
import { useAppSelector } from "../../../hooks/redux.hooks"

import anh from "../../../assets/4bf97db0-6d66-45d2-bfe3-de444053b78c.png"
import { StatusTimeline } from "../../sosrequest/components/StatusTimeline"

export default function SuccessPage() {
  const navigate = useNavigate()

  // Người đã đăng nhập → xem đầy đủ lịch sử yêu cầu (/sent-request)
  // Người chưa có tài khoản → chỉ xem được yêu cầu vừa gửi trên thiết bị này
  const user = useAppSelector((state) => state.auth.user)
  const isLoggedIn = !!user

  const handleViewMyRequests = () => {
    navigate(isLoggedIn ? "/sent-request" : "/sent-request-anonymous")
  }

  return (
    <div className="p-2 md:p-2 lg:mt-2 flex-1">
      <div
        className="
          bg-white rounded-3xl overflow-hidden shadow-xl border
          min-h-[550px]
          flex flex-col
          lg:grid lg:grid-cols-2
        "
      >
        {/* ========================= */}
        {/* LEFT                      */}
        {/* ========================= */}
        <div
          className="
            relative flex flex-col justify-center items-center
            p-4 sm:p-6 lg:p-10
            bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100
          "
        >
          <div className="absolute top-10 left-10 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-52 h-52 bg-indigo-300/20 rounded-full blur-3xl" />

          <div className="relative z-10 w-full max-w-xl">
            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60">
              <img
                src={anh}
                alt="Rescue"
                className="w-full h-[240px] sm:h-[300px] lg:h-[320px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div
                className="
                  absolute top-5 left-1/2 -translate-x-1/2
                  bg-green-500 text-white rounded-full p-4 shadow-xl
                "
              >
                <Check className="w-10 h-10" strokeWidth={5} />
              </div>
            </div>

            {/* Text */}
            <div className="mt-6 text-center">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                Gửi yêu cầu thành công
              </h1>
              <p className="mt-2 text-slate-600 leading-relaxed text-sm md:text-base">
                Yêu cầu cứu hộ của bạn đã được gửi đến trung tâm điều phối.
                <br />
                Hệ thống sẽ cập nhật trạng thái theo thời gian thực.
              </p>

              {!isLoggedIn && (
                <p className="mt-3 text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 inline-block">
                  Bạn đang xem với tư cách khách. Đăng nhập để xem toàn bộ
                  lịch sử yêu cầu của mình.
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleViewMyRequests}
                className="
                  flex-1 bg-indigo-600 hover:bg-indigo-700 text-white
                  py-3.5 rounded-2xl font-semibold transition-all
                  shadow-lg hover:scale-[1.02]
                "
              >
                Xem yêu cầu của tôi
              </button>
              <button
                onClick={() => navigate("/request-sos")}
                className="
                  flex-1 bg-white hover:bg-slate-100 border text-slate-700
                  py-3.5 rounded-2xl font-semibold transition-all
                "
              >
                Gửi yêu cầu khác
              </button>
            </div>

            {!isLoggedIn && (
              <button
                onClick={() => navigate("/login")}
                className="mt-3 w-full text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-2"
              >
                Đăng nhập để xem thêm dữ liệu khác
              </button>
            )}
          </div>
        </div>

        {/* ========================= */}
        {/* RIGHT — Timeline          */}
        {/* Mobile: nằm ngang bên dưới*/}
        {/* Desktop: cột bên phải dọc */}
        {/* ========================= */}
        <div
          className="
            bg-slate-50
            border-t lg:border-t-0 lg:border-l
            p-4 sm:p-6 lg:p-10
            flex flex-col
          "
        >
          {/* Heading chỉ hiện trên desktop (vertical đã có heading trong component) */}
          <div className="hidden lg:block mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Tiến trình cứu hộ</h2>
            <p className="text-sm text-slate-500 mt-1">
              Theo dõi trạng thái xử lý yêu cầu của bạn
            </p>
          </div>

          {/* Mobile: heading nhỏ gọn */}
          <div className="lg:hidden mb-3">
            <h2 className="text-base font-bold text-slate-800">Tiến trình cứu hộ</h2>
          </div>

          {/* Timeline: horizontal trên mobile, vertical trên desktop */}
          <div className="flex-1 lg:overflow-auto">
            {/* Mobile */}
            <div className="lg:hidden">
              <StatusTimeline horizontal />
            </div>
            {/* Desktop */}
            <div className="hidden lg:flex lg:flex-col lg:h-full">
              <StatusTimeline />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}