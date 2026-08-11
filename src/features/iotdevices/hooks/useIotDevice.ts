import { useCallback, useEffect, useMemo, useState } from "react";
import type { Device, UpdateDevicePayload } from "../types/deviceType";
import { DeviceService } from "../services/iotdeviceService";
import {Modal} from "antd";
import { toast } from "react-toastify";


export type FilterStatus= "ALL" | "ACTIVE" | "ERROR" | "PENDING" | "REJECT"
export const useIotDevice = () => {
  const [iotdevice, setIotDevice] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter]=useState<FilterStatus>("ALL");
  const [search,setSearch]=useState("");
  const [updateIoT,setUpdateIoT]=useState<Device>();
  const [error,setError]=useState("");
  const [detailIot,setDetailIot]=useState<Device>();

  const fetchIotDevice = async () => {
    try {
      setLoading(true);
      const data = await DeviceService.getDevices();
      setIotDevice(data);
    } catch (err:any) {
      const message: string = err.response?.data?.message;
      setError(message)
      throw err;
    } finally {
      setLoading(false);
    }
  };

 /*********Chi tiết thiết bị****************** */
 const DetailIotDevice=async(deviceId:string)=>{
  try{
    setLoading(true);
    const res=await DeviceService.DetailIotDevice(deviceId);
    setDetailIot(res);
    return res;

  }catch (err:any) {
      const message: string = err.response?.data?.message;
      setError(message)
      throw err;
  }finally{
  setLoading(false);
  }
 }
  /*********Update IoT Device****************** */
  const updateIoTDevice=useCallback(async(deviceId:string,payload:UpdateDevicePayload)=>{
    try{
      setLoading(true);
      const res= await DeviceService.updateIotDevice(deviceId,payload);
      setUpdateIoT(res);
      return res;
    }catch (err:any) {
      const message: string = err.response?.data?.message;
      setError(message)
      throw err;
    }finally{
      setLoading(false);
    }
  },[])
   const handleApprove=async(id:string)=>{
   try{
     const userString = localStorage.getItem("user");
    const currentUser = userString ? JSON.parse(userString) : null;
    const adminId = currentUser?.id;

    if(!adminId){
      toast.error("Không tìm thấy adminId.Vui lòng đăng nhập lại!")
    return
    }
   
    await DeviceService.patchApprove(id, adminId);
    toast.success("Phê duyệt thiết bị thành công");
    fetchIotDevice(); 
  } catch (err:any) {
      const message: string = err.response?.data?.message;
      setError(message)
      throw err;
  }
  }
  


const handleReject = async (id: string) => {
  try {
    await DeviceService.patchReject(id);
    toast.success("Từ chối thiết bị thành công");
    fetchIotDevice();
  } catch (err:any) {
      const message: string = err.response?.data?.message;
      setError(message)
      throw err;
  }
};

const showRejectConfirm = (id: string) => {
  Modal.confirm({
    title: "Xác nhận từ chối",
    content: "Bạn có chắc muốn từ chối thiết bị này không?",
    okText: "Từ chối",
    okType: "danger",
    cancelText: "Hủy",
    onOk: () => handleReject(id),
  });
};

const filteredData = useMemo(() => {
    if (filter === "ALL") return iotdevice;
    return iotdevice.filter((item) => item.trang_thai === filter);
  }, [iotdevice, filter]);

  const countByStatus = (status: FilterStatus): number =>
    status === "ALL"
      ? iotdevice.length
      : iotdevice.filter((d) => d.trang_thai === status).length;

      const searchResult = useMemo(() => {
  if (search.trim() === "") return null; // không search thì không có kết quả riêng
  const keyword = search.trim().toLowerCase();
  return iotdevice.filter(
    (item) =>
      item.ten_thietbi?.toLowerCase().includes(keyword) ||
      item.device_code?.toLowerCase().includes(keyword) ||
      item.tenkhuvuc?.toLowerCase().includes(keyword)
  );
}, [iotdevice, search]);


// Data cuối cùng đưa ra bảng: nếu có search thì ưu tiên search, không thì dùng statusFiltered
const displayData = search.trim() !== "" ? searchResult ?? [] : filteredData;

  useEffect(() => {
    fetchIotDevice();
   
  }, []);

  

  return {
    iotdevice: displayData,
    loading,
    handleApprove,
    showRejectConfirm,
    filter,
    setFilter,
    countByStatus,
    search,
    setSearch,
    updateIoT,
    updateIoTDevice,
    detailIot,
    DetailIotDevice,
    error
  };
}
