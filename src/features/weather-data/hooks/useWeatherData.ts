import  { useEffect, useState } from 'react'
import type { Weather_datas } from '../types/weatherdataType'
import { weatherdataService } from '../services/weatherdataservice';
import { useParams } from 'react-router-dom';

export const useWeatherData = () => {

  const [weatherdata,setWeatherData]=useState<Weather_datas>();
  const [loading,setLoading]=useState(false);
  const {area_id}=useParams<{area_id:string}>()
  const fetchWeatherData=async()=>{
    if(!area_id) return 
    try{
        setLoading(true);
        const data=await weatherdataService.getWeatherDataById(area_id);
        console.log(data);
        setWeatherData(data);
    }catch(error){
        console.log(error);

    }
    finally{
        setLoading(false);
    }
  }

  useEffect(()=>{
    fetchWeatherData();
  },[area_id])

  return{
    weatherdata,
    loading,
    fetchWeatherData,
  }
}
