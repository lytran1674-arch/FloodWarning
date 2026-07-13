import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "antd";

import { Input } from "@/components/ui/Input";
import { Combobox } from "@/components/ui/Combobox";
import { useTracking } from "../hooks/useTracking";

export const TraCuuSoS = () => {
  const [keyword, setKeyword] = useState("");
  // const [status, setStatus] = useState("");
   const [selectedStatus, setSelectedStatus] = useState("");
  const { loading, statusOptions,getStaus,error, KeywordandStatus, searchStatus, KeyWord, search } =
    useTracking();

   useEffect(() => {
    getStaus();
  }, []);
  const handleSearch = () => {
    const hasKeyword = !!keyword.trim();
    const hasStatus = !!selectedStatus;

    if (hasKeyword && hasStatus) {
      KeywordandStatus(selectedStatus, keyword.trim());
    } else if (hasKeyword) {
      KeyWord(keyword.trim());
    } else if (hasStatus) {
      searchStatus(selectedStatus );
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Form tìm kiếm */}
      <div className="rounded-xl border bg-white shadow-sm p-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mã Tracking hoặc Số điện thoại
            </label>
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e)}
              placeholder="VD: YXH4TS hoặc 0987654321"
            />
          </div>

          <div className="lg:col-span-3">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <Combobox
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { label: "Tất cả", value: "" },
                ...statusOptions.map((s) => ({ label: s.label, value: s.value })),
              ]}  
              placeholder="Tất cả"
            />
          </div>

          <div className="flex items-end lg:col-span-3">
            <Button
              type="primary"
              onClick={handleSearch}
              loading={loading}
              className="h-11 w-full rounded-lg bg-blue-600 hover:!bg-blue-700"
            >
              <div className="flex items-center justify-center gap-2">
                <Search size={18} />
                Tra cứu
              </div>
            </Button>
          </div>
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Kết quả — bảng HTML thuần, không dùng component Table */}
      {search.length > 0 && (
        <div className="w-full overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[700px] table-auto border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="border p-2 text-left font-semibold sm:p-3">Mã tracking</th>
                <th className="border p-2 text-left font-semibold sm:p-3">Độ ưu tiên</th>
                <th className="border p-2 text-left font-semibold sm:p-3">Trạng thái</th>
                <th className="border p-2 text-left font-semibold sm:p-3">Độ nguy hiểm</th>
                <th className="border p-2 text-left font-semibold sm:p-3">Số nạn nhân</th>
                <th className="border p-2 text-left font-semibold sm:p-3">Mô tả</th>
                <th className="border p-2 text-left font-semibold sm:p-3">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {search.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="whitespace-nowrap border p-2 sm:p-3">{item.trackingCode || "-"}</td>
                  <td className="whitespace-nowrap border p-2 sm:p-3">{item.priority || "-"}</td>
                  <td className="whitespace-nowrap border p-2 sm:p-3">{item.status || "-"}</td>
                  <td className="whitespace-nowrap border p-2 sm:p-3">{item.environmentRisk || "-"}</td>
                  <td className="whitespace-nowrap border p-2 sm:p-3">{item.victimCount ?? "-"}</td>
                  <td className="border p-2 sm:p-3">{item.mota || "-"}</td>
                  <td className="whitespace-nowrap border p-2 sm:p-3">{formatDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {search.length === 0 && !loading && (
        <p className="text-center text-sm text-slate-500">Chưa có kết quả tra cứu</p>
      )}
    </div>
  );
};