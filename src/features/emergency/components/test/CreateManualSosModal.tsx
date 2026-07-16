// features/hotline/components/CreateManualSosModal.tsx
import { Modal, Form, Input, InputNumber, Checkbox, Button } from "antd";
import { toast } from "react-toastify";

import type { SosHotlineCreateResult } from "../../types/emergencyType";
import { useCreateHotlineSos } from "../../hooks/test/createHotlineSos";


const { TextArea } = Input;
// Số điện thoại VN: đầu số 03/05/07/08/09, đúng 10 chữ số (đã sửa bug (...)+ cho phép lặp)
const PHONE_REGEX = /^0[35789][0-9]{8}$/;

interface CreateManualSosModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (result: SosHotlineCreateResult) => void; // nhận kết quả để lấy initialCallTask
}

/**
 * Dùng khi dân gọi điện thoại thường tới hotline (không qua web, không có
 * EmergencyCallEvent). Người trực hotline nghe điện và tự nhập toàn bộ
 * thông tin: số điện thoại, vị trí, tình trạng nạn nhân.
 */
export function CreateManualSosModal({
  open,
  onClose,
  onCreated,
}: CreateManualSosModalProps) {
  const [form] = Form.useForm();
  const { createSos, isSubmitting, error } = useCreateHotlineSos();

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const result = await createSos({
      sodt: values.sodt.trim(),
      lat: values.lat,
      lon: values.lon,
      victimCount: values.victimCount,
      injured: !!values.injured,
      trapped: !!values.trapped,
      vulnerable: !!values.vulnerable,
      mota: values.mota ?? "",
      diachi: values.diachi?.trim() ?? "",
    });

    if (result) {
      toast.success(`Đã tạo SOS (độ ưu tiên: ${result.sos.priority}).`);
      form.resetFields();
      onCreated(result);
      console.log(result);
    }
  };

  return (
    <Modal
      title="Tạo SOS thủ công (dân gọi điện thoại thường)"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ victimCount: 1 }}>
        <Form.Item
          label="Số điện thoại người gọi"
          name="sodt"
          rules={[
            { required: true, message: "Nhập số điện thoại" },
            {
              pattern: PHONE_REGEX,
              message: "Số điện thoại không hợp lệ",
            },
          ]}
        >
          <Input placeholder="Nhập số điện thoại người dân" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ (theo lời kể)"
          name="diachi"
          rules={[{ required: true, message: "Nhập địa chỉ" }]}
        >
          <Input placeholder="VD: 25 Võ Văn Ngân, Linh Chiểu" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            label="Vĩ độ (lat)"
            name="lat"
            rules={[{ required: true, message: "Nhập vĩ độ" }]}
          >
            <InputNumber className="w-full" placeholder="10.879..." />
          </Form.Item>
          <Form.Item
            label="Kinh độ (lon)"
            name="lon"
            rules={[{ required: true, message: "Nhập kinh độ" }]}
          >
            <InputNumber className="w-full" placeholder="106.767..." />
          </Form.Item>
        </div>

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
          <TextArea rows={3} placeholder="Mô tả theo lời kể của người gọi..." />
        </Form.Item>

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <Button type="primary" danger block loading={isSubmitting} onClick={handleSubmit}>
          Tạo SOS
        </Button>
      </Form>
    </Modal>
  );
}