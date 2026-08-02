import { useCallback, useEffect, useState } from "react";
import { groupService } from "../../grouprescue/services/groupService";
import { rescueService } from "../services/rescueService";
import type { Group } from "../types/rescueType";
import type { DetailResGroup } from "../types/grouptype";

export const useGroup = (teamId?: string) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailgroup, setDetailGroup] = useState<DetailResGroup | undefined>(undefined);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchGroups = useCallback(async () => {
    if (!teamId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await groupService.getGroupsByTeam(teamId);
      setGroups(data);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Không thể tải danh sách nhóm");
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  const removeMemberGroup = useCallback(
    async (groupId: string, userId: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        await rescueService.RemoveMemberGroup(groupId, userId);
        await fetchGroups();

        return true;
      } catch (err: any) {
        setError(err?.response?.data?.message ?? "Không thể loại thành viên");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchGroups]
  );

  /*****Chi tiết thông tin nhóm ******/
  const detailGroup = useCallback(async (groupId: string) => {
    try {
      setDetailLoading(true);
      setError(null);

      const res = await rescueService.DetailResGroup(groupId);
      setDetailGroup(res);
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Không thể tải chi tiết nhóm");
      setDetailGroup(undefined);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const clearDetailGroup = useCallback(() => {
    setDetailGroup(undefined);
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    groups,
    loading,
    error,
    refetch: fetchGroups,
    removeMemberGroup,
    detailGroup,
    detailgroup,
    detailLoading,
    clearDetailGroup,
  };
};