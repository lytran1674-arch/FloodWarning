import { useEffect, useState } from "react"
import { calltaskService, type CallResultOption } from "../service/calltaskService"
import type { UpdateCallTaskResponse, UpdateCallTaskPayLoad } from "../type/CallTaskType";


export const useCallTask = () => {
  const [result, setResult] = useState<CallResultOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [update, setUpdate] = useState<UpdateCallTaskResponse | null>(null);

  const getResult = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError("");
      const res = await calltaskService.ResultCall();
      setResult(res);
      return true;
    } catch (error) {
      console.error(error);
      setError("Không thể lấy dữ liệu");
      return false;
    } finally {
      setLoading(false);
    }
  }

  const UpdateCallTask = async (
    id: string,
    payload: UpdateCallTaskPayLoad
  ): Promise<UpdateCallTaskResponse | null> => {
    try {
      setLoading(true);
      setError("");
      const res = await calltaskService.UpdateCallTask(id, payload);
      setUpdate(res);
      return res;
    } catch (error) {
      console.error(error);
      setError("Lỗi không thể cập nhật");
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { result, update, loading, error, UpdateCallTask }
}