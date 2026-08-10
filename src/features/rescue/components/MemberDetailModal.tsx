// src/features/rescue/components/MemberDetailModal.tsx
import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, DatePicker, Button, Descriptions, Spin } from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import type { DetailMember, UpdateResCue } from "../types/rescueType";

interface Props {
  open: boolean;
  memberId: string | null;
  loading: boolean;
  detail?: DetailMember;
  onClose: () => void;
  onUpdate: (id: string, data: UpdateResCue) => Promise<any>;
  onUpdated: () => void; // gọi refresh() danh sách sau khi cập nhật xong
}

export default function MemberDetailModal({
  open,
  memberId,
  detail,
  loading,
  onClose,
  onUpdate,
  onUpdated,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  // Reset về chế độ xem mỗi khi mở modal cho thành viên khác
  useEffect(() => {
    if (open) setEditing(false);
  }, [open, memberId]);

  // Đổ dữ liệu vào form khi có detail
  useEffect(() => {
    if (detail) {
      form.setFieldsValue({
        hoten: detail.hoten,
        gioitinh: detail.gioitinh,
        ngaysinh: detail.ngaysinh ? dayjs(detail.ngaysinh) : null,
        sodt: detail.sodt,
        diachi: detail.diachi,
        email: detail.email,
        ghichu: detail.ghichu ?? "",
      });
    }
  }, [detail, form]);

  const handleSubmit = async () => {
    if (!memberId) return;

    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const payload: UpdateResCue = {
        ...values,
        ngaysinh: values.ngaysinh ? values.ngaysinh.format("YYYY-MM-DD") : undefined,
      };

      await onUpdate(memberId, payload);
      toast.success("Cập nhật thành viên thành công.");
      setEditing(false);
      onUpdated();
    } catch (err: any) {
      if (err?.errorFields) return; // lỗi validate form (đã hiện dưới input), không toast
      toast.error(err.response?.data?.message ?? "Cập nhật thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={editing ? "Cập nhật thành viên" : "Chi tiết thành viên"}
      width={600}
      footer={
        editing
          ? [
              <Button key="cancel" onClick={() => setEditing(false)}>
                Hủy
              </Button>,
              <Button key="save" type="primary" loading={submitting} onClick={handleSubmit}>
                Lưu
              </Button>,
            ]
          : [
              <Button key="close" onClick={onClose}>
                Đóng
              </Button>,
              <Button key="edit" type="primary" onClick={() => setEditing(true)}>
                Cập nhật
              </Button>,
            ]
      }
    >
      {loading || !detail ? (
        <div className="flex justify-center py-10">
          <Spin />
        </div>
      ) : editing ? (
        <Form form={form} layout="vertical">
          <Form.Item name="hoten" label="Họ tên" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="gioitinh" label="Giới tính" rules={[{ required: true }]}>
            <Select
              options={[
                { value: true, label: "Nam" },
                { value: false, label: "Nữ" },
              ]}
            />
          </Form.Item>

          <Form.Item name="ngaysinh" label="Ngày sinh">
            <DatePicker className="w-full" format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item name="sodt" label="Số điện thoại" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="diachi" label="Địa chỉ">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ type: "email", message: "Email không hợp lệ" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="ghichu" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      ) : (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Họ tên">{detail.hoten}</Descriptions.Item>
          <Descriptions.Item label="Giới tính">{detail.gioitinh ? "Nam" : "Nữ"}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">{detail.ngaysinh}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{detail.sodt}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{detail.diachi}</Descriptions.Item>
          <Descriptions.Item label="Email">{detail.email}</Descriptions.Item>
          <Descriptions.Item label="Ghi chú">{detail.ghichu ?? "—"}</Descriptions.Item>
          <Descriptions.Item label="Vai trò">{detail.role}</Descriptions.Item>
          <Descriptions.Item label="Đội trực thuộc">{detail.tenDoiTrucThuoc}</Descriptions.Item>
          <Descriptions.Item label="Nhóm phụ trách">{detail.tenNhomPhuTrach}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái hoạt động">{detail.trangThaiHoatDong}</Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}