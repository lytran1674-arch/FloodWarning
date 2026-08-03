import { useCallback, useEffect, useState } from "react";
import { groupService } from "../../grouprescue/services/groupService";
import { rescueService } from "../services/rescueService";
import type { Group } from "../types/rescueType";
import {type DisbandedGroup, type DetailResGroup } from "../types/grouptype";

export const useGroup = (teamId?: string) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailgroup, setDetailGroup] = useState<DetailResGroup | undefined>(undefined);
  const [detailLoading, setDetailLoading] = useState(false);
  const [listDisbanded,setListDisbanded]=useState<DisbandedGroup[]>([]);
    const [xoaGroup,setXoaGroup]=useState("");
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

//*******DELETE GROUP **********/
const deleteGroup=async(groupId:string,status:string)=>{
  try{
    setLoading(true);
    const res=await rescueService.ResetStatusGroup(groupId,status);
    setXoaGroup(res);
    
  }catch(error){
  console.error(error);
  setError("Không thể giải tán nhóm");
    throw error;
}finally{
  setLoading(false);
}
}
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


  /*************Danh sách nhóm Disbanded******************/
  const fetchListGroupDisbanded=useCallback(async()=>{
    try{
      setLoading(true);
      const res=await rescueService.ListGroupDisbanded();
      setListDisbanded(res);
      return true;
    }catch(error){
    console.error(error);
    setError("Không tải được danh sách nhóm đã giải tán");
    }finally{
    setLoading(false);
    }
  },[])
  const clearDetailGroup = useCallback(() => {
    setDetailGroup(undefined);
  }, []);

  useEffect(() => {
    fetchGroups();
    fetchListGroupDisbanded();
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
    listDisbanded,
    xoaGroup,
    deleteGroup
  };
};