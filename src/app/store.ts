import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/store/authSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

// Xuất type để dùng trong useSelector/useDispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch