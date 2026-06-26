// features/alert/components/AlertHistory.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Globe,
  Smartphone,
  Loader2,
} from "lucide-react";

type Alert = {
  tenkhuvuc: string;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  channel: "WEB_PUSH" | "EMAIL" | "SMS" | "APP_PUSH";
  status: "PENDING" | "SENT" | "FAILED";
  createdAt: string;
};

type AlertHistoryResponse = {
  code: number;
  result: {
    content: Alert[];
  };
};

export const AlertHistory = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---- Hàm lấy userId từ nhiều nguồn ----
  const getUserId = (): string | null => {
    // 1. Kiểm tra key "id" (ưu tiên)
    let userId = localStorage.getItem("id");
    if (userId) return userId;

    // 2. Kiểm tra key "userId"
    userId = localStorage.getItem("userId");
    if (userId) return userId;

    // 3. Kiểm tra object "user" lưu dạng JSON
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.id) return user.id;
        if (user?.userId) return user.userId;
      } catch (_) {}
    }

    // 4. Fallback cho dev (nếu cần)
    // return "019effb1-bf56-7387-989a-f714b0b9003a"; // tạm thời
    return null;
  };

  const userId = getUserId();

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!userId) {
        setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
          setLoading(false);
          return;
        }

        const response = await axios.get<AlertHistoryResponse>(
          `https://api-lulut.io.vn/alert/my-alerts/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data;
        if (data.code === 0 && data.result?.content) {
          setAlerts(data.result.content);
        } else {
          setAlerts([]);
          setError(data.code !== 0 ? "Lỗi từ server" : null);
        }
      } catch (err) {
        console.error("Lỗi tải lịch sử cảnh báo:", err);
        setError("Không thể tải dữ liệu, vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [userId]);

  // ---- Helper hiển thị (giữ nguyên) ----
  const riskColor = (level: Alert["riskLevel"]) => {
    switch (level) {
      case "HIGH":
        return "bg-red-100 text-red-700 border-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const riskLabel = (level: Alert["riskLevel"]) => {
    switch (level) {
      case "HIGH":
        return "Cao";
      case "MEDIUM":
        return "Trung bình";
      default:
        return "Thấp";
    }
  };

  const channelIcon = (channel: Alert["channel"]) => {
    switch (channel) {
      case "EMAIL":
        return <Mail className="w-4 h-4" />;
      case "WEB_PUSH":
        return <Globe className="w-4 h-4" />;
      case "SMS":
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const statusColor = (status: Alert["status"]) => {
    switch (status) {
      case "SENT":
        return "text-green-600 bg-green-50";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50";
      case "FAILED":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const statusLabel = (status: Alert["status"]) => {
    switch (status) {
      case "SENT":
        return "Đã gửi";
      case "PENDING":
        return "Đang chờ";
      case "FAILED":
        return "Thất bại";
      default:
        return status;
    }
  };

  // ---- Render ----
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-600">Đang tải lịch sử cảnh báo...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-xl">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl">
        <Bell className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p className="text-lg font-medium">Chưa có cảnh báo nào</p>
        <p className="text-sm">Khi có cảnh báo mới, chúng sẽ hiển thị ở đây.</p>
      </div>
    );
  }

  // ---- Giao diện chính ----
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-800">Lịch sử cảnh báo</h1>
        <span className="ml-auto bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
          {alerts.length} cảnh báo
        </span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <span className="font-medium text-gray-800 text-base">
                  {alert.tenkhuvuc}
                </span>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${riskColor(
                  alert.riskLevel
                )}`}
              >
                <AlertTriangle className="w-4 h-4" />
                {riskLabel(alert.riskLevel)}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                {channelIcon(alert.channel)}
                <span>{alert.channel.replace("_", " ")}</span>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(
                  alert.status
                )}`}
              >
                {alert.status === "SENT" && <CheckCircle className="w-3.5 h-3.5" />}
                {alert.status === "PENDING" && <Clock className="w-3.5 h-3.5" />}
                {statusLabel(alert.status)}
              </span>
              <div className="flex items-center gap-1 ml-auto text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" />
                {new Date(alert.createdAt).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};