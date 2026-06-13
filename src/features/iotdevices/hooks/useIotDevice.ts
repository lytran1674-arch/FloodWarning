import { useEffect, useState } from "react";
import type { IotDevice } from "../types/iotdeviceType";
import { iotdeviceService } from "../services/iotdeviceService";
import {Modal} from "antd";
import { toast } from "react-toastify";

export const useIotDevice = () => {
  const [iotdevice, setIotDevice] = useState<IotDevice[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchIotDevice = async () => {
    try {
      setLoading(true);
      const data = await iotdeviceService.getIotDevices();
      setIotDevice(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

   const handleApprove=async(device_id:string)=>{
   try{
     const userString = localStorage.getItem("user");
    const currentUser = userString ? JSON.parse(userString) : null;
    const adminId = currentUser?.id;

    if(!adminId){
      toast.error("Không tìm thấy adminId.Vui lòng đăng nhập lại!")
    return
    }
   
    await iotdeviceService.patchApprove(device_id, adminId);
    toast.success("Phê duyệt thiết bị thành công");
    fetchIotDevice(); 
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Phê duyệt thiết bị thất bại");
  }
  }

const handleReject = async (device_id: string) => {
  try {
    await iotdeviceService.patchReject(device_id);
    toast.success("Từ chối thiết bị thành công");
    fetchIotDevice();
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Từ chối thiết bị thất bại");
  }
};

const showRejectConfirm = (device_id: string) => {
  Modal.confirm({
    title: "Xác nhận từ chối",
    content: "Bạn có chắc muốn từ chối thiết bị này không?",
    okText: "Từ chối",
    okType: "danger",
    cancelText: "Hủy",
    onOk: () => handleReject(device_id),
  });
};
  useEffect(() => {
    fetchIotDevice();
  }, []);

  return { iotdevice, loading ,handleApprove,showRejectConfirm};
};
