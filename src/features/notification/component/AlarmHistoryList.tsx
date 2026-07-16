// component/AlarmHistoryList.tsx
import { Table, Tag, Button, Alert } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ReloadOutlined } from "@ant-design/icons";
import { useAlarmHistory } from "../hooks/useAlarmHistory";
import type { Alarm } from "../type/notificationType";

const columns: ColumnsType<Alarm> = [
  {
    title: "Tiêu đề",
    dataIndex: "title",
    key: "title",
    width: 260,
  },
  {
    title: "Nội dung",
    dataIndex: "message",
    key: "message",
  },
  {
    title: "Mã tracking",
    dataIndex: "trackingCode",
    key: "trackingCode",
    width: 140,
    render: (code: string) => <Tag color="red">{code}</Tag>,
  },
  {
    title: "Thời gian",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 180,
    render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    defaultSortOrder: "descend",
  },
];

export function AlarmHistoryList() {
  const { alarms, loading, error, refetch } = useAlarmHistory();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">Lịch sử cảnh báo</h2>
        <Button icon={<ReloadOutlined />} onClick={refetch} loading={loading}>
          Làm mới
        </Button>
      </div>

      {error && <Alert type="error" message={error} className="mb-3" showIcon />}

      <Table
        rowKey="id"
        columns={columns}
        dataSource={alarms}
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />
    </div>
  );
}