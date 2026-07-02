// src/features/support-request/components/RequestSupportButton.tsx
import { useState } from "react";
import { CreateSupportRequestModal } from "./CreateSupportRequestModal.tsx";

interface RequestSupportButtonProps {
  sosId: string;
  onCreated?: (requestId: string) => void;
}

export function RequestSupportButton({
  sosId,
  onCreated,
}: RequestSupportButtonProps) {
  const [open, setOpen] = useState(false);

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
        onSuccess={(requestId) => {
          onCreated?.(requestId);
        }}
      />
    </>
  );
}