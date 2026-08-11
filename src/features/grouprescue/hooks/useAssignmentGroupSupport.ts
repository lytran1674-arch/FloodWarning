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
  try {
    setLoading(true);
    setError("");

    const res = await groupService.AssignmentSupportGroup(
      payload.supportRequestItemId,
      payload.groupId,
      payload.note ?? "",
    );

    setAssignResult(res);
    toast.success("Phân công đội thành công");
    return true;
  }catch (err:any) {
      const message: string = err.response?.data?.message??"Lỗi không thể phân công đội";
      setError(message)
      throw err;
  } finally {
    setLoading(false);
  }
};

  return { loading, error, assignResult, AssignSupportGroup };
};