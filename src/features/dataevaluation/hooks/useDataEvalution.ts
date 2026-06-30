import { useEffect, useState } from 'react';
import type { SnapShot } from '../types/dataevaluationType';
import { dataevaluationService } from '../services/dataevaluationService';
import { toast } from 'react-toastify';


export const useDataEvalution = (areaId:string) => {
  

  // snapshot mới nhất
  const [data,setData]=useState<SnapShot|null>(null);


  // dữ liệu 1 ngày cho chart
  const [chartData,setChartData]=useState<SnapShot[]>([]);


  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");



  useEffect(() => {

    if (!areaId) {

      setData(null);
      setChartData([]);

      return;
    }


    loadData();
    loadChartData();


  }, [areaId]);




  // lấy snapshot mới nhất
  const loadData=async()=>{

    try{

      setLoading(true);


      const result =
        await dataevaluationService
        .getSnapShotSumById(areaId);


      setData(result);


    }catch(error:any){


      if(error.response?.data?.code===1020){

        setData(null);
        setError("");

      }else{

        console.error(error);
        setError("Không tải được dữ liệu");

      }


    }finally{

      setLoading(false);

    }

  }







  // lấy dữ liệu trong 1 ngày
  const loadChartData=async()=>{

    try{


      const result =
        await dataevaluationService
        .getSnapShotSumOneDay(areaId);


      // nếu API trả result.content
      setChartData( result);


    }catch(err){

      console.log(err);

    }

  }







  const handleSnapShot=async()=>{

    try{


      await dataevaluationService
      .buttonSnapShot();


      await loadData();

      await loadChartData();


      toast.success(
        "Tổng hợp dữ liệu đánh giá thành công"
      );


    }catch(err){

      console.error(err);

      toast.error(
        "Không thể tổng hợp dữ liệu"
      );

    }

  }




  return {

    // card mới nhất
    data,


    // chart 1 ngày
    chartData,


    loading,
    error,

    loadData,
    loadChartData,

    handleSnapShot

  }
}