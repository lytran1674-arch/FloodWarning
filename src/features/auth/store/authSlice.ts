// import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
// import type {
//     User,
//     Role,
// } from "../types/authType"
// interface AuthState{
//     user: User | null
//     accessToken: string | null
// }

// const initialState: AuthState={
//   user: null,
//   accessToken: null
// }

// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers:{
//         setUser(state,action:PayloadAction<AuthState>){
//           state.user=action.payload.user
//           state.accessToken=action.payload.accessToken
//         },

//         logout(state){
//           state.user=null
//             state.accessToken=null
//         },
//     },
// })

// export const {setUser,logout}=authSlice.actions

// export default authSlice.reducer

import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit"

import type { User } from "../types/authType"

interface AuthState {
  user: User | null

  accessToken: string | null

  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,

  accessToken: null,

  isAuthenticated: false,
}

interface SetCredentialsPayload {
  user: User

  accessToken: string
}

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<SetCredentialsPayload>
    ) => {
      state.user = action.payload.user

      state.accessToken =
        action.payload.accessToken

      state.isAuthenticated = true
    },

    logout: (state) => {
      state.user = null

      state.accessToken = null

      state.isAuthenticated = false
    },
  },
})

export const {
  setCredentials,
  logout,
} = authSlice.actions

export default authSlice.reducer