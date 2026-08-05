import { useCallback, useEffect, useState } from "react";

import { provinceoperatorApi } from "../api/provinceoperatorApi";
import { type RequestSupportMyTeam, type ProvinceOperator, type ProvinceOperatorItem } from "../types/provinceType";
import { provinceService } from "../services/provinceService";
import type { PayLoadAddProvinceOperator } from "@/features/rescue/types/rescueType";

export const useProvince = () => {
  const [operators, setOperators] = useState<ProvinceOperatorItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [add,setAdd]=useState<ProvinceOperatorItem>();
 const [requestsupport, setrequestsupport] =
  useState<RequestSupportMyTeam[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<string>();

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



  const getProvinceOperators = async () => {
    try {
      setLoading(true);

      const res: ProvinceOperator =
        await provinceoperatorApi.getListProvinceOperator();

      setOperators(res.result.content);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách điều hành cấp tỉnh");
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
  }catch(err){
    console.error(err)
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
    deleteProvinceOperator

  };
};