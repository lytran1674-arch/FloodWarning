import type { SoSResponse } from "@/features/sosrequest/types/sosType";

import { Table } from "@/components/ui/Table";
import { usePagination } from "@/hooks/usePagination";
import { useListSoSHotlineCreated, type EditableFields } from "../hooks/useListSoSHotlineCreated";
import { useEffect, useState } from "react";
import type { UpdateSoSHotlinePayLoad } from "../types/emergencyType";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Calendar, Edit, MapIcon, MapPin, PhoneCall, Users } from "lucide-react";
import { Button, Checkbox, Input, Modal, Select } from "antd";

interface Props{
    data?:SoSResponse[];
    onClick?:(SoSResponse:SoSResponse)=>void

}
export const ListSoSHotline = ({data=[],onClick}:Props) => {
   
    const defaultEditable: EditableFields = {
  sodt: false,
  lat: false,
  lon: false,
  diachi: false,
  victimCount: false,
  injured: false,
  trapped: false,
  vulnerable: false,
  mota: false,
};
    const navigate=useNavigate();
    const [selectedSos,setSelectedSos]=useState<SoSResponse|null>(null)
    const {loading,error,updateSoSHotLine,getEdittableFields}=useListSoSHotlineCreated();
    const [detailOpen,setDetailOpen]=useState(false);
    const [formData, setFormData] = useState<Partial<UpdateSoSHotlinePayLoad>>({})
     const editable: EditableFields=selectedSos?getEdittableFields(selectedSos.status):defaultEditable
    const handleUpdate=async(sosId:string,payload:UpdateSoSHotlinePayLoad)=>{
        try{
            await updateSoSHotLine(sosId,payload)
      
            toast.success("Cập nhật thành công")
            navigate("/hotline")
        }catch(error){
            console.error(error);
            toast.error("Cập nhật thất bại")
        }
    }

    useEffect(() => {
  if (selectedSos) {
    setFormData({
      sodt: selectedSos.sodt,
      lat: selectedSos.lat,
      lon: selectedSos.lon,
      diachi: selectedSos.diachi,
      victimCount: selectedSos.victimCount,
      injured: selectedSos.injured,
      trapped: selectedSos.trapped,
      vulnerable: selectedSos.vulnerable,
      mota: selectedSos.mota,
    });
  }
}, [selectedSos]);
const safeData = Array.isArray(data) ? data : [];

  const { page, setPage, totalPages, paginated } = usePagination(safeData, 10);

   const formatDate = (date?: string | null) => {
    if (!date) return "--";

    return new Date(date).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    
  };

  
    const columns = [
      {
        title: "Mã tracking",
        key: "trackingCode" as keyof SoSResponse,
        render: (item: SoSResponse) => item.trackingCode || "--",
      },
      {
        title: "Độ ưu tiên",
        key: "priority" as keyof SoSResponse,
        render: (item: SoSResponse) => item.priority || "--",
      },
      {
        title: "Trạng thái",
        key: "status" as keyof SoSResponse,
        render: (item: SoSResponse) => item.status || "--",
      },
      {
        title: "Độ nguy hiểm",
        key: "environmentRisk" as keyof SoSResponse,
        render: (item: SoSResponse) => item.environmentRisk || "-"
          
      },
      {
        title: "Số nạn nhân",
        key: "victimCount" as keyof SoSResponse,
        render: (item: SoSResponse) =>item.victimCount || "-"
      },
        {
        title: "Mô tả",
        key: "mota" as keyof SoSResponse,
        render: (item: SoSResponse) =>item.mota || "-"
      },

      {
        title: "Đăng ký lúc",
        key: "createdAt" as keyof SoSResponse,
        render: (item: SoSResponse) => formatDate(item.createdAt),
      },
      {
  title: "Thao tác",
  key: "id" as keyof SoSResponse,
  render: (item: SoSResponse) => {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedSos(item);
          setDetailOpen(true);
        }}
        className="px-3 py-1 rounded-lg text-xs bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Cập nhật
      </button>
    );
  },
},
    ]
     const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce<(number | "...")[]>((acc, p) => {
      const last = acc[acc.length - 1];

      if (typeof last === "number" && p - last > 1) {
        acc.push("...");
      }

      acc.push(p);
      return acc;
    }, []);


     return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <Table<SoSResponse>
            columns={columns}
            data={paginated}
           // onClick={}
          />
    
          <div className="flex items-center justify-between px-3 py-2 border-t mt-2">
            <span className="text-xs text-slate-400">
              {safeData.length === 0
                ? "Không có dữ liệu"
                : `${(page - 1) * 5 + 1}–${Math.min(
                    page * 5,
                    safeData.length
                  )} / ${safeData.length} bản ghi`}
            </span>
    
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-7 h-7 rounded border text-sm disabled:opacity-30 hover:bg-slate-100 transition-colors"
              >
                ‹
              </button>
    
              {pageNumbers.map((p, i) =>
                p === "..." ? (
                  <span
                    key={`dot-${i}`}
                    className="w-7 h-7 flex items-center justify-center text-slate-400 text-sm"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded border text-sm transition-colors ${
                      page === p
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
    
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="w-7 h-7 rounded border text-sm disabled:opacity-30 hover:bg-slate-100 transition-colors"
              >
                ›
              </button>
            </div>
          </div>
         <Modal
  open={detailOpen}
  onCancel={() => setDetailOpen(false)}
  footer={null}
  width={1100}
  centered
>
  <div className="space-y-6">

    {/* Header */}
    <div className="flex items-start gap-3">
      <div className="bg-blue-100 p-3 rounded-xl">
        <Edit className="text-blue-600 w-6 h-6" />
      </div>

      <div>
        <h2 className="text-2xl font-bold">
          Cập nhật yêu cầu SOS
        </h2>
        <p className="text-gray-500">
          Cập nhật thông tin chi tiết của yêu cầu cứu hộ
        </p>
      </div>
    </div>

    <hr />

    {/* Form */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

      {/* Phone */}
      <div>
        <label className="font-medium">
          Số điện thoại <span className="text-red-500">*</span>
        </label>

        <div className="mt-2 flex items-center border rounded-lg px-3">
          <PhoneCall className="text-gray-400 w-5" />
          <Input
        
            className="border-none shadow-none"
            placeholder="090xxxxxxx"
            value={formData.sodt}
              disabled={!editable}
            onChange={(e)=>setFormData(prev=>({...prev,sodt:e.target.value}))}
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="font-medium">
          Địa chỉ <span className="text-red-500">*</span>
        </label>

        <div className="mt-2 flex items-center border rounded-lg px-3">
          <MapPin className="text-gray-400 w-5" />
          <Input
            className="border-none shadow-none"
            placeholder="Nhập địa chỉ"
             value={formData.diachi}
             disabled={!editable.diachi}
            onChange={(e)=>setFormData(prev=>({...prev,diachi:e.target.value}))}
          />
        </div>
      </div>

      {/* Latitude */}
      <div>
        <label className="font-medium">Latitude</label>

        <div className="mt-2 flex items-center border rounded-lg px-3">
          <MapPin className="text-gray-400 w-5" />
          <Input className="border-none shadow-none" 
           value={formData.lat}
           disabled={!editable.lat}
             onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          lat: e.target.value === "" ? undefined : Number(e.target.value),
        }))
      }/>
        </div>
      </div>

      {/* Longitude */}
      <div>
        <label className="font-medium">Longitude</label>

        <div className="mt-2 flex items-center border rounded-lg px-3">
          <MapPin className="text-gray-400 w-5" />
          <Input className="border-none shadow-none"
           value={formData.lon}
           disabled={!editable}
            onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          lon: e.target.value === "" ? undefined : Number(e.target.value),
        }))
      }/>
        </div>
      </div>

      {/* Victim */}
      <div>
        <label className="font-medium">
          Số lượng nạn nhân
        </label>

        <div className="mt-2 flex items-center border rounded-lg px-3">
          <Users className="text-gray-400 w-5" />
          <Input
            type="number"
            disabled={!editable.victimCount}
            className="border-none shadow-none"
             value={formData.victimCount}
            onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          victimCount: e.target.value === "" ? undefined : Number(e.target.value),
        }))
      }
          />
        </div>
      </div>
    </div>

    {/* Victim Status */}
    <div>
      <label className="font-medium">
        Tình trạng nạn nhân
      </label>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-3">
       <Checkbox 
       disabled={!editable.injured}
  checked={formData.injured} 
  onChange={(e) => setFormData(prev => ({ ...prev, injured: e.target.checked }))}
>
  Bị thương
</Checkbox>
<Checkbox 
disabled={!editable}
  checked={formData.trapped} 
  onChange={(e) => setFormData(prev => ({ ...prev, trapped: e.target.checked }))}
>
  Mắc kẹt
</Checkbox>
<Checkbox 
disabled={!editable.vulnerable}    
  checked={formData.vulnerable} 
  onChange={(e) => setFormData(prev => ({ ...prev, vulnerable: e.target.checked }))}
>
  Đối tượng dễ bị tổn thương
</Checkbox>
      </div>
    </div>

    {/* Description */}
    <div>
      <label className="font-medium">
        Ghi chú / Mô tả
      </label>

      <textarea
        rows={4}
        disabled={!editable.mota}
        className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
        placeholder="Nhập mô tả..."
      />
    </div>

    {/* Time */}
    <div>
      <label className="font-medium">
        Thời gian cập nhật
      </label>

      <div className="mt-2 flex items-center border rounded-lg px-3">
        <Calendar className="text-gray-400 w-5" />
        <Input
          type="datetime-local"
          className="border-none shadow-none"
        />
      </div>
    </div>

    {/* Footer */}
    <div className="flex justify-end gap-3 pt-4 border-t">
      <Button onClick={() => setDetailOpen(false)}>
        Hủy
      </Button>
      
      <Button type="primary"
      onClick={async () => {
    if (!selectedSos) return;
    await handleUpdate(selectedSos.id, formData as UpdateSoSHotlinePayLoad);
          
    setDetailOpen(false);
  }}>
        Cập nhật & Lưu
      </Button>
    </div>
  </div>
</Modal>
        </div>
        
      );
}
