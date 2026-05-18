import axios from "axios";


const API_URL=""

export const authAPI={
    login (data: any){
        return axios.post(`${API_URL}/login`,data)
    },

    register(data:any){
        return axios.post(`${API_URL}/register`,data)
    },

    forgotPassword(email:string){
        return axios.post(`${API_URL}/forgotpwd`,{email})
    }
}