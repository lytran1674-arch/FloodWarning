import { calltaskApi } from '../api/calltaskApi';
import type {
  CallResultOption,
  UpdateCallTaskPayLoad,
  UpdateCallTaskResponse,
} from '../type/CallTaskType';

// re-export để các nơi khác (vd hook) có thể import type này thẳng từ service nếu muốn
export type { CallResultOption };

export const calltaskService = {

  // hiển thị combobox kết quả cuộc gọi
  async ResultCall(): Promise<CallResultOption[]> {
    return await calltaskApi.ResultCall();
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
    return await calltaskApi.UpdateCallTask(id, payload);
  },

};