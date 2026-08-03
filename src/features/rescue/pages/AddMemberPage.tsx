import { useState } from "react";
import type { ListMembers } from "../types/grouptype";
import { useAppSelector } from "@/hooks/redux.hooks";
import { useAvailableMembers } from "../hooks/useAvailableMembers";
import { AddListMember } from "../components/AddListMember";
import { useParams } from "react-router-dom";

export const AddMembersPage = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const user=useAppSelector((state)=>state.auth.user);
    const teamId=user?.teamId;
  const {members}=useAvailableMembers(teamId);
  const [groupMembers, setGroupMembers] = useState<ListMembers[]>([]);

  const handleAdded = (newMembers: ListMembers[]) => {
    // cập nhật danh sách thành viên trong group
    setGroupMembers((prev) => [...prev, ...newMembers]);
  }
  const availableMembers = members.filter(
  (m) => !groupMembers.some((gm) => gm.userId === m.userId)
);

if (!groupId) {
  return <div>Không tìm thấy nhóm</div>;
}
  return (
    <AddListMember
      groupId={groupId}
      members={availableMembers}
      onAdded={handleAdded}
    />
  );
};