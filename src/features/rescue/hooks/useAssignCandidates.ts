import { useState } from "react";
import { axiosClient } from "@/api/axiosClient";

export interface AssignCandidateGroup {
  id: string;
  name: string;
  type: string;
  status: string;
  memberCount: number;
  leaderId: string;
  leaderName: string;
  callFailed:boolean
}

export const useAssignCandidates = () => {
  const [groups, setGroups] = useState<AssignCandidateGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getAssignCandidates = async (sosId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError("");
      const res = await axiosClient.get(`/sos-assignment/assign-candidates/${sosId}`);
      setGroups(res.data.result ?? []);
      return true;
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách nhóm phù hợp");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { groups, loading, error, getAssignCandidates };
};