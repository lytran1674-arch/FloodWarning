import { useCallback, useEffect, useState } from "react";
import { rescueApi } from "../api/rescureApi";
import type { ResCue, ResGroup } from "../types/rescueType";

export const useAvailableMembers = (teamId?: string) => {
  const [members, setMembers] = useState<ResCue[]>([]);
  const [groups, setGroups] = useState<ResGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!teamId) return;

    try {
      setLoading(true);

      const [memberData, groupData] = await Promise.all([
        rescueApi.getTeamMembersWithoutGroup(teamId),
        rescueApi.getGroupByTeam(teamId),
      ]);

      setMembers(memberData);
      setGroups(groupData);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    members,
    groups,
    loading,
    refresh: fetchData,
  };
};