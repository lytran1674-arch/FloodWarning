// import { useEffect, useState } from 'react'
// import type { FloodRiskData } from '../../floodriskdata/types/floodriskType'
// import { FloodriskdataService } from '../../floodriskdata/services/floodriskService';

// export const useFloodRisk = (areaId:string) => {
//     const [floodrisk,setFloodRisk]=useState<FloodRiskData[]>([]);
//     const [loading,setLoading]=useState(false);
 

//     const fetchFloodRiskData=async()=>{
//         if(!areaId){
//         setFloodRisk([]);
//         return;

//     }
//     try{
//         setLoading(true);
//         const data=await FloodriskdataService.getListPredictById(areaId);
//         console.log("Dữ liệu dự đoán lũ:",data);
//         setFloodRisk(data);
//     }catch(error){
//          console.log("Lỗi lấy dữ liệu dự báo thời tiết:", error);
//          setFloodRisk([]);
//     }finally{
//         setLoading(false);
//     }
    
//     };

//     useEffect(()=>{
//         fetchFloodRiskData();

//     },[areaId]);

//     return {floodrisk,loading,fetchFloodRiskData}
// }

