import { Button } from "@/components/ui/Button";
import { Info, Search } from "lucide-react";

export const Tracking = () => {
  return (
    <div
      className="
        w-full
        max-w-sm lg:max-w-md
        rounded-xl
        border border-gray-200
        bg-white
        shadow-sm
        p-4
        space-y-4
      "
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-blue-100 p-2">
          <Search className="h-5 w-5 text-blue-600" />
        </div>

        <div className="flex-1">
          <h2 className="text-base font-semibold text-gray-800">
            Tra cứu mã SOS
          </h2>

          <p className="mt-1 text-xs text-gray-500 leading-5">
            Nhập mã Tracking (mã SOS) để xem trạng thái và thông tin yêu cầu
            cứu hộ.
          </p>
        </div>
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder="Nhập mã Tracking"
        className="
          h-8
          w-full
          rounded-lg
          border
          border-gray-300
          px-3
          text-sm
          outline-none
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-200
        "
      />

      {/* Button */}
      <Button
        className="
          h-8
          w-full
          rounded-lg
          bg-blue-600
          text-white
          font-medium
          hover:bg-blue-700
        "
      >
        Tra cứu
      </Button>

      {/* Note */}
      <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-2">
        <Info className="mt-0.5 h-4 w-4 text-blue-600 flex-shrink-0" />

        <p className="text-xs leading-5 text-blue-700">
          Mã Tracking (SOS) được cung cấp sau khi bạn
          gọi đến tổng đài Hotline.
        </p>
      </div>
    </div>
  );
};