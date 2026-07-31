import { useAppSelector } from "@/hooks/redux.hooks";
import type { ResGroup } from "../types/rescueType"
import { useResCue } from "../hooks/useResCue";

type Props={
    group:ResGroup;
    onSuccess?:()=>void;
}
export const DeleteGroup = ({group,onSuccess}:Props) => {
    const user=useAppSelector((state)=>state.auth.user);
    const isTeamLeader=user?.isLeader==true;
    const {deleteGroup}=useResCue("");

    const handleDelete=async( e: React.MouseEvent<HTMLButtonElement>)=>{
        try{
            await deleteGroup(group.id);
            onSuccess?.();
        }catch(error){
            console.error(error);
        }
    }
  return (
    <>
    <div>
        <button>Gianr </button>
    </div>
    </>
  )
}
