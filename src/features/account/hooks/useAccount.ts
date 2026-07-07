import { useEffect, useState } from "react"
import type { Account } from "../type/accountType"
import { AccountService } from "../services/accountService";

export const UseAccount=()=>{
    const [account,setAccount]=useState<Account>();
    const [loading, setLoading]=useState(false);
    const [error,setError]=useState("");

const getInfAccount=async()=>{
    try{
        setLoading(true);
       const res= await AccountService.getAccount()
        setAccount(res)
    }catch(error){
        console.error(error)
        setError("Lỗi tải thông tin")
    }finally{
        setLoading(false)
    }
}


useEffect(()=>{
    getInfAccount();
})

return {
    account,
    loading
}
}