import { Button } from "antd";
import anh from "../../../assets/4bf97db0-6d66-45d2-bfe3-de444053b78c.png";
import { CheckCircleFilled } from "@ant-design/icons";

export default function RescueIllustration() {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
      {/* Phần ảnh nền + icon */}
      <div className="relative w-full h-56 rounded-t-xl overflow-hidden" 
           style={{ background: 'linear-gradient(180deg,#b8d9f0 0%,#7ab8e0 60%,#5a9fd4 100%)' }}>
        <img 
          src={anh} 
          alt="Minh họa cứu hộ" 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white rounded-full p-2 shadow-lg">
          <CheckCircleFilled className="text-4xl" />
        </div>
      </div>

      {/* Phần nội dung và nút bên dưới */}
      <div className="p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold text-black">
          Gửi yêu cầu thành công!
        </h2>
        <p className="text-gray-600 text-sm max-w-xs mx-auto">
          Yêu cầu cứu hộ của bạn đã được gửi thành công.
          <br />
          Chúng tôi sẽ thông báo khi có thông tin cập nhật mới.
        </p>

        {/* 2 nút xếp dọc, căn giữa, mỗi nút rộng tối đa */}
        <div className="flex flex-col items-center gap-3 mt-2">
          <Button 
            type="primary" 
            className="bg-[#6C7EE1] hover:bg-[#5a6fd1] border-none rounded-lg px-6 py-2 h-auto font-medium w-full max-w-xs"
          >
            Xem yêu cầu của tôi
          </Button>
          <Button 
            className="border border-[#92B9EB] text-[#4a6a9e] hover:border-[#6C7EE1] hover:text-[#6C7EE1] rounded-lg px-6 py-2 h-auto font-medium w-full max-w-xs"
          >
            Cập nhật yêu cầu
          </Button>
        </div>
      </div>
    </div>
  );
}