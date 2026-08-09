import { useCallback, useEffect, useState } from "react";
import { groupService } from "../../grouprescue/services/groupService";
import { rescueService } from "../services/rescueService";
import {   type Group, type InfoMemberTeam, type UpdateResCue } from "../types/rescueType";
import {
  type DisbandedGroup,
  type DetailResGroup,
  type ListMembers,


} from "../types/grouptype";

export const useGroup = (teamId?: string) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [detailgroup, setDetailGroup] = useState<DetailResGroup | undefined>(undefined);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [listDisbanded, setListDisbanded] = useState<DisbandedGroup[]>([]);
  const [disbandedLoading, setDisbandedLoading] = useState(false);
  const [disbandedError, setDisbandedError] = useState<string | null>(null);

  const [add, setAdd] = useState<ListMembers[]>([]);
  const [xoaGroup, setXoaGroup] = useState("");

  // Kết quả cập nhật rescuer / province-operator (dùng chung)
  const [update, setUpdate] = useState<InfoMemberTeam | null>(null);

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

  /*********Xóa thành viên ra khỏi nhóm*****************************/
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

  //*******ADD MEMBERS **********/
  const AddMembersGroup = useCallback(async (groupId: string, payload: { userIds: string[] }) => {
    try {
      setLoading(true);
      setError(null);

      const res = await rescueService.addMember(groupId, payload);
      setAdd(res);
      return res;
    } catch (err) {
      console.error(err);
      setError("Số lượng thành viên thêm đã vượt quá giới hạn của nhóm!");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  //*******DELETE GROUP **********/
  const deleteGroup = async (groupId: string, status: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await rescueService.ResetStatusGroup(groupId, status);
      setXoaGroup(res);
    } catch (error) {
      console.error(error);
      setError("Không thể giải tán nhóm");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /*****Chi tiết thông tin nhóm ******/
  const detailGroup = useCallback(async (groupId: string) => {
    try {
      setDetailLoading(true);
      setDetailError(null);

      const res = await rescueService.DetailResGroup(groupId);
      setDetailGroup(res);
    } catch (err: any) {
      setDetailError(err?.response?.data?.message ?? "Không thể tải chi tiết nhóm");
      setDetailGroup(undefined);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const clearDetailGroup = useCallback(() => {
    setDetailGroup(undefined);
    setDetailError(null);
  }, []);

  /*************Danh sách nhóm Disbanded******************/
  // Có state loading/error riêng, và KHÔNG tự động gọi trong useEffect mặc định.
  // Chỉ trang nào cần danh sách nhóm giải tán mới tự gọi hàm này.
  const fetchListGroupDisbanded = useCallback(async () => {
    try {
      setDisbandedLoading(true);
      setDisbandedError(null);

      const res = await rescueService.ListGroupDisbanded();
      setListDisbanded(res);
      return true;
    } catch (error) {
      console.error(error);
      setDisbandedError("Không tải được danh sách nhóm đã giải tán");
      return false;
    } finally {
      setDisbandedLoading(false);
    }
  }, []);

  /*************Cập nhật thông tin rescuer / province-operator (dùng chung)******************/
  // Với rescuer: userId dùng để build URL /res-team/rescuers/{userId}, data không cần id/areaId.
  // Với province-operator: data.id + data.areaId là bắt buộc, endpoint /province-operator không
  // dùng userId trên URL — rescueService.updateResCue tự định tuyến theo dữ liệu truyền vào.
  const updateResCue = async (userId: string, data: UpdateResCue) => {
    try {
      setLoading(true);
      setError("");

      const res = await rescueService.updateResCue(userId, data);

      setUpdate(res);

      return res;
    } catch (error) {
      console.error(error);
      setError("Cập nhật trạng thái thất bại");
      throw error;
    } finally {
      setLoading(false);
    }
  };

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
    detailError,
    clearDetailGroup,

    listDisbanded,
    disbandedLoading,
    disbandedError,
    fetchListGroupDisbanded,

    xoaGroup,
    deleteGroup,
    add,
    AddMembersGroup,

    update,
    updateResCue,
  };
};