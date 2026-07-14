import { useState } from 'react'
import { groupService } from '../services/groupService';
import { toast } from 'react-toastify';

interface AssignSupportGroupPayload {
  supportRequestItemId: string;
  groupId: string;
  note?: string;
}

export const useAssignmentGroupSupport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [assignResult, setAssignResult] = useState<string | undefined>();

  const AssignSupportGroup = async (payload: AssignSupportGroupPayload) => {
    if(!payload.note) return;
    try {
      setLoading(true);
      setError("");
      const res = await groupService.AssignmentSupportGroup(
        payload.supportRequestItemId,
        payload.groupId,
        payload.note,
      );
      setAssignResult(res);
      toast.success("Phân công đội thành công");
      return true;
    } catch (error) {
      console.error(error);
      setError("Lỗi không thể phân công đội");
      toast.error("Lỗi không thể phân công đội");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, assignResult, AssignSupportGroup };
};