import { Modal, Button, Tag } from "antd";
import { useNotificationPopup } from "../hooks/useNotificationPopup";

export function AlarmPopup() {
  const {
    current,
    remainingCount,
    closeCurrent,
    claimCurrent,
    claiming,
    claimError,
    audioRef,
  } = useNotificationPopup();

  const canClaim = !!current && (!!current.sosId || !!current.supportRequestId);

  return (
    <Modal
  open={!!current}
  closable={false}
  mask={{ closable: false }}
  centered
      footer={[
        ...(canClaim
          ? [
             <Button
                key="claim"
                type="primary"
                loading={claiming}
                onClick={claimCurrent}
                block
              >
                Xử lý ngay
              </Button>,
            ]
          : []),
        <Button key="close" danger type={canClaim ? "default" : "primary"} onClick={closeCurrent} block>
          Đóng
        </Button>,
      ]}
    >
      <audio ref={audioRef} src="/sounds/alarm.mp3" preload="auto" />
      {current && (
        <div>
          <h2 className="text-lg font-bold text-red-600 mb-2">{current.title}</h2>
          <p className="text-gray-800 mb-3">{current.message}</p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Mã tracking: <Tag color="red">{current.trackingCode}</Tag></p>
            <p>Thời gian: {new Date(current.createdAt).toLocaleString("vi-VN")}</p>
          </div>
          {claimError && (
            <p className="mt-2 text-sm text-red-600">{claimError}</p>
          )}
          {remainingCount > 1 && (
            <p className="mt-2 text-xs text-gray-400">
              Còn {remainingCount - 1} cảnh báo khác đang chờ
            </p>
          )}
        </div>
      )}
    </Modal>
  );
}