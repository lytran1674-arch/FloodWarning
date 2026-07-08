import { useCallback, useEffect, useState } from "react";
import { groupService } from "../../grouprescue/services/groupService";
import { rescueService } from "../services/rescueService";
import type { Group } from "../types/rescueType";

export const useGroup = (teamId?: string) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError(
        err?.response?.data?.message ??
          "Không thể tải danh sách nhóm"
      );
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
        setError(
          err?.response?.data?.message ??
            "Không thể loại thành viên"
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchGroups]
  );

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    groups,
    loading,
    error,
    refetch: fetchGroups,
    removeMemberGroup,
  };
};