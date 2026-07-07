

import { useEffect, useState } from "react";
import { groupService } from "../../grouprescue/services/groupService";
import type { Group } from "../types/rescueType";


export const useGroup = (teamId?: string) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchGroups = async () => {
    if (!teamId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = await groupService.getGroupsByTeam(teamId);
      setGroups(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Không thể tải danh sách đội cứu hộ"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  return { groups, loading, error, refetch: fetchGroups };
};