// features/hotline/components/CreateSosFromCallDrawer.tsx
import { useEffect, useState } from "react";
import { Drawer, Form, InputNumber, Checkbox, Input, Button, Descriptions, Spin } from "antd";
import { toast } from "react-toastify";
import type { DetailHotlineCall } from "../../types/emergencyType";
import { useCreateHotlineSos } from "../../hooks/test/createHotlineSos";
import { emergencyApi } from "../../api/emergencyApi";


const { TextArea } = Input;

interface CreateSosFromCallDrawerProps {
  /** callEventId của cuộc gọi đang được chọn để tạo SOS, null = đóng drawer. */
  callEventId: string | null;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateSosFromCallDrawer({
  callEventId,
  onClose,
  onCreated,
}: CreateSosFromCallDrawerProps) {
  const [detail, setDetail] = useState<DetailHotlineCall | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [form] = Form.useForm();
  const { createSos, isSubmitting, error } = useCreateHotlineSos();

  useEffect(() => {
    if (!callEventId) {
      setDetail(null);
      return;
    }

    let cancelled = false;
    setIsLoadingDetail(true);

    emergencyApi
      .getCallEventDetail(callEventId)
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch(() => {
        if (!cancelled) toast.error("Không thể tải chi tiết cuộc gọi.");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingDetail(false);
      });

    return () => {
      cancelled = true;
    };
  }, [callEventId]);

  const handleSubmit = async () => {
    if (!callEventId) return;
    const values = await form.validateFields();

    const result = await createSos({
      callEventId,
      victimCount: values.victimCount,
      injured: !!values.injured,
      trapped: !!values.trapped,
      vulnerable: !!values.vulnerable,
      mota: values.mota ?? "",
    });

    if (result) {
      toast.success(`Đã tạo SOS (độ ưu tiên: ${result.priority}).`);
      form.resetFields();
      onCreated();
    }
  };

  return (
    <Drawer
      title="Tạo yêu cầu SOS từ cuộc gọi"
      open={!!callEventId}
      onClose={onClose}
      width={420}
      destroyOnClose
    >
      {isLoadingDetail && (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      )}

      {!isLoadingDetail && detail && (
        <>
          <Descriptions column={1} size="small" bordered className="mb-4">
            <Descriptions.Item label="Số điện thoại">
              {detail.callerPhoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Vị trí">
              {detail.callerLat.toFixed(5)}, {detail.callerLon.toFixed(5)}
            </Descriptions.Item>
            <Descriptions.Item label="Đội phụ trách">
              {detail.teamName}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian gọi">
              {new Date(detail.createdAt).toLocaleString("vi-VN")}
            </Descriptions.Item>
          </Descriptions>

          <Form form={form} layout="vertical" initialValues={{ victimCount: 1 }}>
            <Form.Item
              label="Số người cần cứu"
              name="victimCount"
              rules={[{ required: true, message: "Nhập số người cần cứu" }]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>

            <Form.Item name="injured" valuePropName="checked">
              <Checkbox>Có người bị thương</Checkbox>
            </Form.Item>
            <Form.Item name="trapped" valuePropName="checked">
              <Checkbox>Có người mắc kẹt</Checkbox>
            </Form.Item>
            <Form.Item name="vulnerable" valuePropName="checked">
              <Checkbox>Có người già/trẻ em/mang thai</Checkbox>
            </Form.Item>

            <Form.Item label="Mô tả tình trạng" name="mota">
              <TextArea
                rows={3}
                placeholder="Mô tả theo lời kể của người gọi..."
              />
            </Form.Item>

            {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

            <Button
              type="primary"
              danger
              block
              loading={isSubmitting}
              onClick={handleSubmit}
            >
              Tạo SOS
            </Button>
          </Form>
        </>
      )}
    </Drawer>
  );
}