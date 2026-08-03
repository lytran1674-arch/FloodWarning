import { useAppSelector } from "@/hooks/redux.hooks";
import type { ResGroup } from "../types/rescueType"

import { Trash } from "lucide-react";
import { useGroup } from "../hooks/useGroup";
import { toast } from "react-toastify";

type Props={
    group:ResGroup;
    onSuccess?:()=>void;
}
export const DeleteGroup = ({group,onSuccess}:Props) => {
    const user=useAppSelector((state)=>state.auth.user);
    const isTeamLeader=user?.isTeamLeader==true;
    const {deleteGroup}=useGroup();


const handleDelete = async (
  e: React.MouseEvent<HTMLButtonElement>
) => {
  e.stopPropagation();

  try {
    await deleteGroup(group.id, "DISBANDED");
    await onSuccess?.();
    toast.success("Đã giải tán nhóm")
  } catch (error) {
    console.error(error);
  }
};
const statusgroup = group.status === "AVAILABLE" || group.status === "OFFLINE";
  return (
    <>
    {(isTeamLeader&& statusgroup)&&(
    <div>
        <button
    onClick={handleDelete}
    className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50"
>
    <Trash size={18}/>
    Giải tán nhóm
</button>
    </div>
    )}
    </>
  )
}
