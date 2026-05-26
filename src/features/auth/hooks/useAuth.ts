import { useSelector } from "react-redux"

export const useAuth = ()=>{
    const user= useSelector(
        (state: any)=> state.auth.user
    )

    return {
        user,
        isAuthenticated: !! user,
        role: user?.role ?? null,
    }
}
