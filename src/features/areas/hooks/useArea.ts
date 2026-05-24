import type { Area, AreaTree } from "../types/areaType";
import { areaService } from "../services/areaService";
import { useEffect, useState } from "react";

export const useArea = () =>{
    const [areas, setAreas] =useState<AreaTree[]>([])
    const [loading, setLoading]=useState(false)

    const fetchAreas = async() =>{
        try {
            setLoading(true);
            const data=await areaService.getAreas();
            console.log(data)
            setAreas(data);

        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }
    
    useEffect(()=>{
        fetchAreas()
    },[])

    return {
        areas,
        loading,
        fetchAreas,
    }
}   
