// pages/AlarmHistory.tsx
import { useEffect, useState } from "react";

import type { Alarm } from "../type/notificationType";
import { notificationApi } from "../api/notificationApi";

export function AlarmHistory() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationApi
      .getAlarms()
      .then(setAlarms)
      .catch((err) => console.error("Lỗi lấy lịch sử alarm:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Lịch sử cảnh báo</h1>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Tiêu đề</th>
            <th className="p-2 border">Nội dung</th>
            <th className="p-2 border">Mã tracking</th>
            <th className="p-2 border">Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {alarms.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="p-2 border font-medium">{a.title}</td>
              <td className="p-2 border">{a.message}</td>
              <td className="p-2 border font-mono">{a.trackingCode}</td>
              <td className="p-2 border">{new Date(a.createdAt).toLocaleString("vi-VN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {alarms.length === 0 && <p className="mt-4 text-gray-400">Không có dữ liệu</p>}
    </div>
  );
}