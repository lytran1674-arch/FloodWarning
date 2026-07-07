import { useEffect, useState, useCallback } from "react"
import { rescueService } from "../services/rescueService";
import { type ResTeam, type ResCue } from "../types/rescueType";

export const useResCue = (teamId: string) => {
  const [rescue, setResCue] = useState<ResCue[]>([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<ResTeam | undefined>(undefined);
  const [error, setError] = useState("");

  const fetchResCue = useCallback(async () => {
    if (!teamId) {
      setResCue([]);
      return;
    }

    try {
      setLoading(true);
      setError(""); // reset lỗi cũ trước khi gọi lại

      const data = await rescueService.getTeamMembersWithoutGroup(teamId);
      setResCue(data);
    } catch (err) {
      console.error("Lỗi lấy danh sách:", err);
      setResCue([]);
      setError("Lỗi lấy danh sách, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  // Đổi tên tham số để tránh trùng/che khuất teamId của hook,
  // cho phép gọi lấy chi tiết đội KHÁC (không nhất thiết trùng
  // teamId ban đầu) nếu cần
  const detailTeam = useCallback(async (targetTeamId: string) => {
    if (!targetTeamId) {
      setDetail(undefined);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await rescueService.getDetailTeam(targetTeamId);
      setDetail(res);
    } catch (err) {
      console.error(err);
      setError("Lấy thông tin đội lỗi, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResCue();
  }, [fetchResCue]);

  // Export đầy đủ để nơi dùng hook có thể truy cập
  // detail/detailTeam/error, không chỉ rescue/loading
  return { rescue, loading, error, fetchResCue, detail, detailTeam };
};