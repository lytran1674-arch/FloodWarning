import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface AuthState{
    email: string |null
    hoten:string | null
    role: string | null
    accessToken: string | null
}

const initialState: AuthState={
    email: null,
    hoten: null,
    role: null,
    accessToken: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setUser(state,action:PayloadAction<AuthState>){
           const {email,hoten,role,accessToken}=action.payload
           state.email=email
           state.hoten=hoten
           state.role=role
           state.accessToken=accessToken
           
        },

        logout(state){
           state.email=null
            state.hoten=null
            state.role=null
            state.accessToken=null
        },
    },
})

export const {setUser,logout}=authSlice.actions

export default authSlice.reducer