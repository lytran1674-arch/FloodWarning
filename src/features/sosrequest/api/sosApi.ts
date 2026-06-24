import axios from "axios";
import type { ListSOS, SoSRequest } from "../types/sosType";
import { axiosClient } from "@/api/axiosClient";

const API_URL="/sos-request";
export const SoSAPI={

    async createsos(data:SoSRequest):Promise<SoSRequest>{
        const response=await axiosClient.post(`${API_URL}`,data)
        return response.data.result;
    }
    ,
    async updateSoSRequest(id:string):Promise<SoSRequest>{
        const response=await axiosClient.put(`${API_URL}/${id}`)
        return response.data.result
    },
    async updateAnonymousSosRequest(id:string):Promise<SoSRequest>{
        const response=await axiosClient.put(`${API_URL}/${id}/anonymous`)
        return response.data.result
    },
    async getListSosRequest():Promise<ListSOS[]>{
        const response=await axiosClient.get(`${API_URL}/my-sos`)
       return response.data.result?.content ?? []
    }

    ,
    async getListAnonymousSosRequest():Promise<ListSOS[]>{
        const response=await axiosClient.get(`${API_URL}/my-active-anonymous`)
       return response.data.result?.content ?? []
    }
}