import React, { useEffect, useState } from 'react'
import type { PredictionJobs, PredictionJobsDetail } from '../types/floodriskType'
import { FloodriskdataService } from '../services/floodriskService';

export const usePredictionJobs = () => {
 const [predictjobs,setPredictionJobs]=useState<PredictionJobs[]>([]);
 //const [detail,setDetail]=useState<PredictionJobsDetail>;
 const [loading,setLoading]=useState(false)
 const [error,setError]=useState("")

 const getListPredictionJobs=async()=>{
    try{
        setLoading(true)
        const res=await FloodriskdataService.getPredictionJobs();
        setPredictionJobs(res);

    }catch(error){
        console.error(error)
    }
 }
  useEffect(()=>{
    getListPredictionJobs();
  })
  return {
    predictjobs,
    loading,
    setError,
    getListPredictionJobs
  }
}
