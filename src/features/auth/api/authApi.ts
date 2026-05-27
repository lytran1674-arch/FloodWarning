import axios from "axios";


const API_URL="/api/auth"

export const authAPI={
    login (loginInfo:string, password:string){
        return axios.post(`${API_URL}/token`,{
            loginInfo,
            password,
        });
        },
    

    register(data:any){
        return axios.post(`${API_URL}/register`,data)
    },

    forgotPassword(email:string){
        return axios.post(`${API_URL}/forgotpwd`,{email})
    }
}