import { BaggageClaim, BoomBox, Cable, Home, PhoneCall } from 'lucide-react';

export const HuongDan = () => {
  const instructions = [
    { icon: Home, text: 'Di chuyển lên vị trí cao khi có cảnh báo ngập lụt' },
    { icon: BoomBox, text: 'Theo dõi thông tin cảnh báo thường xuyên' },
    { icon: BaggageClaim, text: 'Chuẩn bị đồ dùng thiết yếu, nước uống, thức ăn' },
    { icon: Cable, text: 'Ngắt điện khi nước bắt đầu dâng cao' },
    { icon: PhoneCall, text: 'Liên hệ khẩn cấp khi cần hỗ trợ' },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-2 m-2 border border-[#E5E7EB] ">
      <p className="text-base sm:text-lg font-bold text-black border-l-4  pl-2 mb-1">
        HƯỚNG DẪN AN TOÀN
      </p>
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:flex-wrap">
        {instructions.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start items-center gap-2 lg:text-sm text-sm sm:text-base bg-gray-50 p-2 rounded-md md:flex-1 min-w-[180px]"
          >
            <item.icon className="text-blue-600 w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};