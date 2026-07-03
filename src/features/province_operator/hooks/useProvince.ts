import { useEffect, useState } from "react";

import { provinceoperatorApi } from "../api/provinceoperatorApi";
import { type RequestSupportMyTeam, type ProvinceOperator, type ProvinceOperatorItem } from "../types/provinceType";
import { provinceService } from "../services/provinceService";

export const useProvince = () => {
  const [operators, setOperators] = useState<ProvinceOperatorItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 const [requestsupport, setrequestsupport] =
  useState<RequestSupportMyTeam[]>([]);



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
    getListRequestSupportMyTeam

  };
};