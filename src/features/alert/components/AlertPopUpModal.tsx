import { Modal, Button, Tag } from "antd"
import { useAppSelector } from "@/hooks/redux.hooks"
import { useAlertPopup } from "../hooks/useAlertPopup"

const RISK_TAG_COLOR: Record<string, string> = {
  HIGH: "red",
  MEDIUM: "orange",
  LOW: "green",
}

export function AlertPopupModal() {

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  // Chỉ bật luồng popup cảnh báo này cho người dân (CITIZEN) đã đăng nhập,
  // đúng theo mô tả nghiệp vụ.
  const { current, remainingCount, closing, error, closeCurrent } =
    useAlertPopup(isAuthenticated)

  return (
    <Modal
      open={!!current}
      closable={false}
      mask={{ closable: false }}
      centered
      footer={[
        <Button
          key="ack"
          type="primary"
          danger
          loading={closing}
          onClick={closeCurrent}
          block
        >
          Đã hiểu
        </Button>,
      ]}
    >
      {current && (
        <div>
          <h2 className="text-lg font-bold text-red-600 mb-2">
            {current.title}
          </h2>
          <p className="text-gray-800 mb-3">{current.message}</p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>
              Khu vực: <Tag>{current.tenkhuvuc}</Tag>
            </p>
            <p>
              Mức độ:{" "}
              <Tag color={RISK_TAG_COLOR[current.riskLevel] ?? "default"}>
                {current.riskLevel}
              </Tag>
            </p>
            <p>Thời gian: {new Date(current.createdAt).toLocaleString("vi-VN")}</p>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          {remainingCount > 1 && (
            <p className="mt-2 text-xs text-gray-400">
              Còn {remainingCount - 1} cảnh báo khác đang chờ
            </p>
          )}
        </div>
      )}
    </Modal>
  )
}