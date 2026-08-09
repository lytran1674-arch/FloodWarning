import { useEffect, useState, useCallback } from "react"
import { rescueService } from "../services/rescueService";
import { type ResTeam, type ResCue, type InfoMemberTeam, type PayLoaAddMemberTeam, type UpdateResCue, type AvailableMember } from "../types/rescueType";

export const useResCue = (teamId: string) => {
  const [rescue, setResCue] = useState<ResCue[]>([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<ResTeam | undefined>(undefined);
  const [error, setError] = useState("");
  const [updatestatus,setUpdateStatus]=useState("");
  const [add,setAdd]=useState<InfoMemberTeam>();  
  const [update,setUpdate]=useState<InfoMemberTeam>()
  const [search,setSearch]=useState<AvailableMember[]>([]);

  const fetchResCue = useCallback(async () => {
    if (!teamId) {
      setResCue([]);
      return;
    }

    try {
      setLoading(true);
      setError(""); // reset lỗi cũ trước khi gọi lại

      const data = await rescueService.getTeamMembersWithoutGroup(teamId);
      setResCue(data);
    } catch (err) {
      console.error("Lỗi lấy danh sách:", err);
      setResCue([]);
      setError("Lỗi lấy danh sách, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  }, [teamId]);

//***** UPDATE STATUS GROUP: OFFLINE -> AVAILABLE *****
const updateStatusGroup = async (groupId: string) => {
  try {
    setLoading(true);
    setError("");

    const res = await rescueService.updateStatusgroup(groupId);

    setUpdateStatus(res);

    return res;
  } catch (error) {
    console.error(error);
    setError("Cập nhật trạng thái thất bại");
    throw error;
  } finally {
    setLoading(false);
  }
};
//*******ADD MEMBER TEAM**********/
const addMemberTeam=useCallback(async(payload:PayLoaAddMemberTeam)=>{
  try{
    setLoading(true);
    const res=await rescueService.AddMemberTeam(payload);
    setAdd(res);
    return res;
  }catch(err){
    console.error(err);
    setError("Không thể thêm thành viên vào đội!");
    throw err;
  }finally{
    setLoading(false);
  }
},[]);

//*******UPDATE MEMBER TEAM**********/
const updateResCue = async (userId: string,data:UpdateResCue) => {
  try {
    setLoading(true);
    setError("");

    const res = await rescueService.updateResCue(userId,data);

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

//*******SEARCH MEMBER TEAM**********/
const searchRescue=useCallback(async(keyword:string)=>{
try{
  setLoading(true);
  const res=await rescueService.SearchRescue(keyword);
  setSearch(res);
  return res;
  }catch(err:any){
    console.error(err);
   const message: string = err.response?.data?.message;
   setError(message);
   throw err;
  }finally{
    setLoading(false);
  }
},[])

  // Đổi tên tham số để tránh trùng/che khuất teamId của hook,
  // cho phép gọi lấy chi tiết đội KHÁC (không nhất thiết trùng
  // teamId ban đầu) nếu cần
  const detailTeam = useCallback(async (targetTeamId: string) => {
    if (!targetTeamId) {
      setDetail(undefined);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await rescueService.getDetailTeam(targetTeamId);
      setDetail(res);
    } catch (err) {
      console.error(err);
      setError("Lấy thông tin đội lỗi, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResCue();
  }, [fetchResCue]);

  // Export đầy đủ để nơi dùng hook có thể truy cập
  // detail/detailTeam/error, không chỉ rescue/loading
  return { rescue, loading, error, fetchResCue, detail, detailTeam
    ,updateStatusGroup,updatestatus,add, addMemberTeam,update,updateResCue,
    search, searchRescue
   }
}