import { useNavigate } from "react-router-dom"

import RescueIllustration from "../components/RescueIllustration"
import StatusTimeline from "../components/StatusTimeline"

export default function SuccessPage() {

  const navigate = useNavigate()

  return (
    <div className="p-5 flex-1">

      <div className="bg-blue-50 rounded-2xl p-6 flex gap-6 min-h-[480px]">

        {/* Left panel */}
        <div className="flex-1 flex flex-col items-center justify-center">

          <RescueIllustration />

          <div className="mt-5 text-center">

            <h2 className="text-xl font-bold text-gray-900 mb-1.5">
              Gửi yêu cầu thành công!
            </h2>

            <p className="text-sm text-gray-500 leading-relaxed">
              Yêu cầu cứu hộ của bạn đã được gửi thành công.
              <br />
              Chúng tôi sẽ thông báo khi có thông tin cập nhật mới
            </p>

          </div>

          <div className="mt-5 flex flex-col gap-2.5 w-full max-w-xs">

            <button
              onClick={() => navigate("/sent-request")}
              className="
                w-full
                bg-indigo-500 hover:bg-indigo-600
                text-white font-medium
                py-3 rounded-lg
                transition-colors text-sm
              "
            >
              Xem yêu cầu của tôi
            </button>

            <button
              onClick={() => navigate("/request-sos")}
              className="
                w-full
                bg-indigo-200 hover:bg-indigo-300
                text-indigo-800 font-medium
                py-3 rounded-lg
                transition-colors text-sm
              "
            >
              Gửi yêu cầu khác
            </button>

          </div>
        </div>

        {/* Right panel */}
        <div className="w-64 flex-shrink-0 flex flex-col">
          <StatusTimeline />
        </div>

      </div>
    </div>
  )
}