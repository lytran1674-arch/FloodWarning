import { axiosClient } from '@/api/axiosClient';
import type {
  CallResultOption,
  UpdateCallTaskPayLoad,
  UpdateCallTaskResponse,
} from '../type/CallTaskType';

const API_URL = "/call-tasks";

export const calltaskApi = {

  // hiển thị combobox kết quả cuộc gọi
  async ResultCall(): Promise<CallResultOption[]> {
    const response = await axiosClient.get(`${API_URL}/call-results`); // đã sửa: thêm "s"
    return response.data.result ?? [];
  },

  // Hotline cập nhật trạng thái cuộc gọi
  // Team leader không bắt máy -> hiển thị thông tin để gọi lần 2
  // Nếu team không bắt máy 3 lần sẽ chuyển sang gọi Deputy Leader
  // Nếu Deputy Leader không bắt máy sẽ chuyển sang gọi cho Province Operator
  // => dùng chung 1 api này cho cả 3 trường hợp
  async UpdateCallTask(
    id: string,
    payload: UpdateCallTaskPayLoad
  ): Promise<UpdateCallTaskResponse> {
    const response = await axiosClient.put(`${API_URL}/${id}/result`, payload);
    return response.data.result;
  },

};