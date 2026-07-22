// src/features/support-request/components/RequestSupportButton.tsx
import { useState } from "react";
import { CreateSupportRequestModal } from "./CreateSupportRequestModal.tsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface RequestSupportButtonProps {
  sosId: string;
  onCreated?: (requestId: string) => void;
}

export function RequestSupportButton({
  sosId,
  onCreated,
}: RequestSupportButtonProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <button
        className="border bg-fuchsia-500 text-white"
        onClick={() => setOpen(true)}
      >
        Yêu cầu hỗ trợ
      </button>

      <CreateSupportRequestModal
        sosId={sosId}
        open={open}
        onClose={() => setOpen(false)}
       onSuccess={(supportRequestId, callTask) => {
          setOpen(false);

          if (callTask) {
            // Có callTask → mở màn gọi điện ngay.
            // KHÔNG gọi onCreated ở đây — onCreated (ở component cha) thường
            // tự điều hướng đi chỗ khác (VD navigate(-1)), sẽ xung đột với
            // navigate("/call-workflow") bên dưới nếu gọi cả 2.
            navigate("/call-workflow", {
              state: { initialCallTask: callTask, supportRequestId },
            });
          } else {
            // Không có callTask (VD BE không cần gọi điện) → báo thành công
            // và để component cha tự quyết định điều hướng tiếp theo.
            toast.success("Đã tạo yêu cầu hỗ trợ");
            onCreated?.(supportRequestId);
          }
        }}
      />
    </>
  );
}