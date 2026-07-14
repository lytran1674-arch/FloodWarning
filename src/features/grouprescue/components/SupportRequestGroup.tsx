import { ArrowBigLeft, Plus, Send, Trash2 } from 'lucide-react'
import { SUPPORT_TYPE_OPTIONS, type SupportType } from '../constants/SupportTypeConstant';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateSupportRequestGroup } from '../hooks/useCreateSupportRequestGroup';
import { useState } from 'react';
import type { LeaderCreateSupport } from '../types/groupType';


interface SupportItemRow {
  key: string;
  supportType: SupportType | "";
  requiredGroupCount: number;
}

const createEmptyRow = (): SupportItemRow => ({
  key: crypto.randomUUID(),
  supportType: "",
  requiredGroupCount: 1,
});
export const SupportRequestGroup = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { loading, error, CreateSupportRequestGroup } = useCreateSupportRequestGroup();

  const [reason, setReason] = useState("");
  const [items, setItems] = useState<SupportItemRow[]>([createEmptyRow()]);
  const [formError, setFormError] = useState("");

  // thêm 1 loại mới
  const handleAddRow = () => {
    setItems((prev) => [...prev, createEmptyRow()]);
  };

  // xóa 1 loại 1 support
  const handleRemoveRow = (key: string) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((i) => i.key !== key) : prev));
  };

  // số lượng cần support theo loại
  const handleChangeCount = (key: string, value: number) => {
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, requiredGroupCount: value } : i))
    );
  };

  // thay đổi loại cần hỗ trợ 
  const handleChangeType = (key: string, value: SupportType) => {
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, supportType: value } : i))
    );
  };

  const validate = (): string => {
    if (!reason.trim()) return "Vui lòng nhập lý do chi viện";
    if (items.length === 0) return "Cần ít nhất 1 loại hỗ trợ";
    const seenTypes = new Set<string>();
    for (const item of items) {
      if (!item.supportType) return "Vui lòng chọn loại hỗ trợ cho tất cả các dòng";
      if (item.requiredGroupCount < 1) return "Số lượng nhóm phải lớn hơn 0";
      if (seenTypes.has(item.supportType)) return "Không được chọn trùng loại hỗ trợ";
      seenTypes.add(item.supportType);
    }
    return "";
  }

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (!assignmentId) {
      setFormError("Thiếu assignmentId, không thể gửi yêu cầu");
      return;
    }

    const validationError = validate();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError("");

    const payload: LeaderCreateSupport = {
      reason: reason.trim(),
      items: items.map((i) => ({
        supportType: i.supportType as SupportType,
        requiredGroupCount: i.requiredGroupCount,
      })),
    };

    const success = await CreateSupportRequestGroup(assignmentId, payload);
    if (success) {
      navigate(-1);
    }
  };

  return (
    <div className="flex-col lg:space-y-5 lg:m-7 lg:p-5 border border-[#] bg-white rounded-lg shadow-sm">
      <button
        type="button"
        onClick={handleCancel}
        className="lg:flex lg:justify-start items-center lg:gap-2 text-left"
      >
        <ArrowBigLeft className='text-blue-600 lg:w-10 lg:h-10' />
        <div className="lg:flex-col lg:space-y-1">
          <p className='text-sm lg:text-xl text-black font-bold'>Tạo yêu cầu chi viện</p>
          <p className="text-sm text-slate-500">Gửi yêu cầu hỗ trợ đến đội trưởng</p>
        </div>
      </button>

      <div className='flex-col space-y-1'>
        <label className="font-semibold text-black">
          Lý do chi viện <span className="text-red-500">*</span>
        </label>

        <textarea
          rows={5}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do cần chi viện..."
          className="mt-2 w-full rounded-xl border border-gray-200 p-4
        focus:ring-2 focus:ring-blue-500 outline-none resize-none
        shadow-sm"
        />
      </div>

      <div>
        <h3 className="font-semibold mb-4">
          Loại hỗ trợ cần yêu cầu
        </h3>

        <div className="border rounded-2xl overflow-hidden lg:p-2">

          <table className="w-full">

            <thead className="bg-slate-100 ">

              <tr>

                <th className="text-left p-4">
                  Loại hỗ trợ
                </th>

                <th className="text-center">
                  Số lượng nhóm
                </th>

                <th className="text-center">
                  Thao tác
                </th>

              </tr>

            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.key}>
                  <td className="pr-2 py-1">
                    <select
                      value={item.supportType}
                      onChange={(e) =>
                        handleChangeType(item.key, e.target.value as SupportType)
                      }
                      className="w-full rounded-xl border border-gray-200 p-3 "
                    >
                      <option value="">-- Chọn loại --</option>
                      {SUPPORT_TYPE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="pr-2 py-1">
                    <input
                      type="number"
                      min={1}
                      value={item.requiredGroupCount}
                      onChange={(e) =>
                        handleChangeCount(item.key, Number(e.target.value))
                      }

                      className="w-24 rounded-xl border border-gray-200 p-3"
                    />
                  </td>
                  <td className="py-1">
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(item.key)}
                      disabled={items.length === 1}
                      className="w-11 h-11 border border-red-200 rounded-xl
text-red-500 hover:bg-red-50 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="button"
            onClick={handleAddRow}
            className="mt-5 w-full border-2 border-dashed border-blue-500
rounded-xl py-4 text-blue-600 font-semibold
hover:bg-blue-50 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Thêm loại hỗ trợ
          </button>
        </div>
      </div>

      {(formError || error) && (
        <p className="text-sm text-red-600">{formError || error}</p>
      )}

      <div className="flex justify-end gap-3 mt-6">

        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="px-8 py-3 border rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Hủy
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-blue-600 text-white
hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
          {loading ? "Đang gửi..." : "Gửi yêu cầu"}
        </button>

      </div>
    </div>
  )
}