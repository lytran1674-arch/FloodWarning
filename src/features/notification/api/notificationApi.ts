import { axiosClient } from "@/api/axiosClient";
import type { Alarm, NotificationPopup } from "../type/notificationType";

const API_URL = "/notification";

export const notificationApi = {
  // lấy danh sách notification popup
  async getPopupNotifications(): Promise<NotificationPopup[]> {
    const response = await axiosClient.get(`${API_URL}/popup`);
    return response.data.result ?? [];
  },

  // đóng popup (đánh dấu đã đọc)
  async closePopup(id: string): Promise<void> {
    await axiosClient.put(`${API_URL}/${id}/read`);
  },

  // lịch sử alarm
  async getAlarms(): Promise<Alarm[]> {
    const response = await axiosClient.get("/alarms");
    return response.data.result?.content ?? [];
  },
};