import { useCallback, useEffect, useState } from "react";

import { provinceoperatorApi } from "../api/provinceoperatorApi";
import { type RequestSupportMyTeam, type ProvinceOperator, type ProvinceOperatorItem, type ProvinceOperatorDetail } from "../types/provinceType";
import { provinceService } from "../services/provinceService";
import type { PayLoadAddProvinceOperator, UpdateResCue } from "@/features/rescue/types/rescueType";

export const useProvince = () => {
  const [operators, setOperators] = useState<ProvinceOperatorItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [add,setAdd]=useState<ProvinceOperatorItem>();
 const [requestsupport, setrequestsupport] =
  useState<RequestSupportMyTeam[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<string>();
  const [update,setUpdate]=useState<ProvinceOperatorDetail>();
  const [search,setSearch]=useState<ProvinceOperator[]>([])

/************THÊM ĐIỀU PHỐI CẤP TỈNH*******************/
const addProvinceOperator=useCallback(async(payload:PayLoadAddProvinceOperator)=>{
try{
  setLoading(true);
  const res=await provinceService.addProvinceOperator(payload);
  setAdd(res);
  return res;
}catch(err){
console.error(err);
setError("Thêm thành viên thất bại");
}finally{
  setLoading(false)
}
},[])

/************XÓA ĐIỀU PHỐI CẤP TỈNH*******************/
const deleteProvinceOperator = useCallback(
  async (payload: { ids: string[] }) => {
    try {
      setLoading(true);

      const res = await provinceService.deleteProvinceOperator(payload);

      setDeleteMessage(res);

      return res;
    } catch (err) {
      console.error(err);
      setError("Xóa thành viên thất bại");
    } finally {
      setLoading(false);
    }
  },
  []
);
/************CẬP NHẬT THÔNG TIN ĐIỀU PHỐI CẤP TỈNH*******************/
const updateProvinceOperator=useCallback(async(data:UpdateResCue)=>{
  try{
    setLoading(true);
    const res=await provinceService.updateProvinceOperator(data);
    setUpdate(res)
    return res;

  }catch(err:any){
     const message: string = err.response?.data?.message ?? "Cập nhật thất bại, vui lòng thử lại!"
     setError(message);
     throw err;
  }finally{
    setLoading(false)
  }
},[])
/************SEARCH ĐIỀU PHỐI CẤP TỈNH*******************/
const searchProvinceOperator = useCallback(async (keyword: string) => {
  try {
    setLoading(true);
    setError("");

    const res = await provinceService.searchProvinceOperator(keyword);

    setSearch(res);

    return res;
  } catch (err: any) {
    console.error(err);

    const message =
      err.response?.data?.message ||
      "Không thể tìm kiếm thành viên.";

    setError(message);

    throw err;
  } finally {
    setLoading(false);
  }
}, []);


  const getProvinceOperators = async () => {
    try {
      setLoading(true);

      const res: ProvinceOperator =
        await provinceoperatorApi.getListProvinceOperator();

      setOperators(res.result.content);
    } catch (err:any) {
      const message: string = err.response?.data?.message??"Không thể tải danh sách điều hành cấp tỉnh";
      setError(message)
      throw err;
    } finally {
      setLoading(false);
    }
  };
const getTeamsByProvinceOperator = async (id: string) => {
  return await provinceService.getTeamsByProvinceOperator(id);
};


const getListRequestSupportMyTeam=async()=>{
  try{
    setLoading(true);
    const res:RequestSupportMyTeam[]=await provinceService.getListRequestSupportMyTeam()
    setrequestsupport(res)
  }catch (err:any) {
      const message: string = err.response?.data?.message;
      setError(message)
      throw err;
  }finally{
    setLoading(false);
  }
}


  useEffect(() => {
 getProvinceOperators();
    getListRequestSupportMyTeam();
    
  }, []);

  return {
    requestsupport,
    setrequestsupport,
    operators,
    loading,
    error,
    reload: getProvinceOperators,
    getTeamsByProvinceOperator,
    getListRequestSupportMyTeam,
    add,
    addProvinceOperator,
    deleteMessage,
    deleteProvinceOperator,
    update,
    updateProvinceOperator,
    search,
    searchProvinceOperator
  };
};