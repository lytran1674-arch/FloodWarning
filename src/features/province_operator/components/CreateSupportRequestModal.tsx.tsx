// src/features/support-request/components/CreateSupportRequestModal.tsx

import { useState } from "react";
import { createSupportRequest } from "../api/supportRequestApi";
import type { SupportType } from "../types/provinceType";

interface CreateSupportRequestModalProps {
  sosId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: (requestId: string) => void;
}

interface SupportItem {
  supportType: SupportType;
  requiredGroupCount: number;
}

const SUPPORT_TYPE_OPTIONS: {
  value: SupportType;
  label: string;
}[] = [
  {
    value: "BOAT",
    label: "Xuồng cứu hộ",
  },
  {
    value: "MEDICAL",
    label: "Y tế",
  },
  {
    value: "SEARCH_RESCUE",
    label: "Tìm kiếm cứu nạn",
  },
  {
    value: "LOGISTICS",
    label: "Hậu cần",
  },
];

export function CreateSupportRequestModal({
  sosId,
  open,
  onClose,
  onSuccess,
}: CreateSupportRequestModalProps) {
  const [reason, setReason] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [supportItems, setSupportItems] =
    useState<SupportItem[]>([
      {
        supportType: "BOAT",
        requiredGroupCount: 1,
      },
    ]);

  if (!open) return null;

  const resetState = () => {
    setReason("");

    setError(null);

    setSupportItems([
      {
        supportType: "BOAT",
        requiredGroupCount: 1,
      },
    ]);
  };

  const handleClose = () => {
    resetState();

    onClose();
  };

  const handleChangeItem = (
    index: number,
    field:
      | "supportType"
      | "requiredGroupCount",
    value: string | number
  ) => {
    const updated = [...supportItems];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setSupportItems(updated);
  };

  const handleAddItem = () => {
    setSupportItems([
      ...supportItems,
      {
        supportType: "BOAT",
        requiredGroupCount: 1,
      },
    ]);
  };

  const handleRemoveItem = (
    index: number
  ) => {
    if (supportItems.length === 1)
      return;

    setSupportItems(
      supportItems.filter(
        (_, i) => i !== index
      )
    );
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError(
        "Vui lòng nhập lý do yêu cầu hỗ trợ"
      );

      return;
    }

    const hasInvalidGroup =
      supportItems.some(
        (item) =>
          item.requiredGroupCount <= 0
      );

    if (hasInvalidGroup) {
      setError(
        "Số group cần hỗ trợ phải lớn hơn 0"
      );

      return;
    }

    setLoading(true);

    setError(null);

    try {
      const payload = {
        sosId,

        reason,

        items: supportItems,
      };

      console.log(payload);

      const res =
        await createSupportRequest(
          payload
        );

      onSuccess(res.result);

      resetState();

      onClose();
    } catch (err: any) {
      console.error(err);

      const code =
        err?.response?.data?.code;

      const message =
        err?.response?.data?.message;

      if (code === 1044) {
        setError(
          "Đơn yêu cầu hỗ trợ đã tồn tại cho SOS này!"
        );
      } else if (code === 1939) {
        setError(
          "Bạn không có quyền tạo yêu cầu hỗ trợ cho SOS này!"
        );
      } else {
        setError(
          message ||
            "Có lỗi xảy ra, vui lòng thử lại"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

        <h2 className="mb-5 text-xl font-bold text-slate-800">
          Tạo yêu cầu hỗ trợ
        </h2>

        <div className="space-y-4">

          {supportItems.map(
            (item, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 p-4"
              >

                <div className="mb-3 flex items-center justify-between">

                  <h3 className="font-medium text-slate-700">
                    Loại hỗ trợ #
                    {index + 1}
                  </h3>

                  {supportItems.length >
                    1 && (
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveItem(
                          index
                        )
                      }
                      className="text-sm text-red-500 hover:text-red-600"
                    >
                      Xóa
                    </button>
                  )}

                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  <div>

                    <label className="mb-1 block text-sm font-medium text-slate-600">
                      Loại hỗ trợ
                    </label>

                    <select
                      value={
                        item.supportType
                      }
                      onChange={(e) =>
                        handleChangeItem(
                          index,
                          "supportType",
                          e.target
                            .value
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    >

                      {SUPPORT_TYPE_OPTIONS.map(
                        (opt) => (
                          <option
                            key={
                              opt.value
                            }
                            value={
                              opt.value
                            }
                          >
                            {opt.label}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div>

                    <label className="mb-1 block text-sm font-medium text-slate-600">
                      Số group cần
                    </label>

                    <input
                      type="number"
                      min={1}
                      value={
                        item.requiredGroupCount
                      }
                      onChange={(e) =>
                        handleChangeItem(
                          index,
                          "requiredGroupCount",
                          Number(
                            e.target
                              .value
                          )
                        )
                      }
                      className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    />

                  </div>

                </div>

              </div>
            )
          )}

          <button
            type="button"
            onClick={handleAddItem}
            className="rounded-xl border border-dashed border-fuchsia-400 px-4 py-3 text-sm font-medium text-fuchsia-600 transition hover:bg-fuchsia-50"
          >
            + Thêm loại hỗ trợ
          </button>

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">
              Lý do yêu cầu
            </label>

            <textarea
              rows={4}
              value={reason}
              onChange={(e) =>
                setReason(
                  e.target.value
                )
              }
              placeholder="Ví dụ: Thiếu xuồng cứu hộ và đội y tế"
              className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
            />

          </div>

          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

        </div>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={handleClose}
            disabled={loading}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-xl bg-fuchsia-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-fuchsia-700 disabled:opacity-60"
          >
            {loading
              ? "Đang gửi..."
              : "Gửi yêu cầu"}
          </button>

        </div>

      </div>

    </div>
  );
}