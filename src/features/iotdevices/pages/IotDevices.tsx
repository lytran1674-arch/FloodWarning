import { useEffect, useState } from "react";
import axios from "axios";
import { IotDeviceTable } from "../components/IotDeviceTable";
import type { IotDevice } from "../types/iotdeviceType";
import { data } from "react-router-dom";

export const IotDevices = () => {
  const [devices, setDevices] = useState<IotDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPendingDevices = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("/api/iot-device/pending");

      const result = res.data?.result;

      setDevices(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Lỗi lấy danh sách thiết bị:", err);
      setError("Không thể tải danh sách thiết bị");
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

const handleApprove = async (device: IotDevice) => {
  try {
    console.log("Thiết bị đang duyệt:", device);

    const adminId = "ADMIN_TEST";

    const res = await axios.patch(
      `/api/iot-device/${device.id}/approve?adminId=${adminId}`
    );

    console.log("Kết quả phê duyệt:", res.data);

    alert("Phê duyệt thiết bị thành công");

    fetchPendingDevices();
  } catch (error: any) {
    console.error("Lỗi phê duyệt thiết bị:", error);
    console.error("Backend trả về:", error.response?.data);

    alert(error.response?.data?.message || "Phê duyệt thiết bị thất bại");
  }
};

 const handleReject = async (device: IotDevice) => {
  try {
    const userString = localStorage.getItem("user");
    const currentUser = userString ? JSON.parse(userString) : null;

    const adminId = currentUser?.id;

    if (!adminId) {
      alert("Không tìm thấy adminId. Vui lòng đăng nhập lại.");
      return;
    }

    await axios.patch(`/api/iot-device/${device.id}/reject`, null, {
      params: {
        adminId: adminId,
      },
    });

    await fetchPendingDevices();
  } catch (err) {
    console.error("Lỗi từ chối thiết bị:", err);
    alert("Từ chối thiết bị thất bại");
  }
};

  useEffect(() => {
    fetchPendingDevices();
  }, []);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-xl font-semibold text-slate-800">
          Quản lý thiết bị IoT
        </h1>
        <p className="text-sm text-slate-500">
          Danh sách thiết bị đang chờ Admin phê duyệt
        </p>
      </div>

      {loading && (
        <div className="text-sm text-slate-500">Đang tải dữ liệu...</div>
      )}

      {error && <div className="text-sm text-red-500">{error}</div>}

      {!loading && !error && (
        <IotDeviceTable
          data={devices}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};