import type { SoSResponse } from "@/features/sosrequest/types/sosType";
import { useState } from "react"

export const useTracking = () => {
const [loading,setLoading]=useState(false);
const [error,setError]=useState("");
const [trackingCode,setTrackingCode]=useState<SoSResponse>()

const search=async()=>{
    
}

}
