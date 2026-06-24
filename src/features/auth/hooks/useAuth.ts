import { useSelector } from "react-redux"

export const useAuth = () => {
  const user = useSelector((state: any) => state.auth.user)
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated) // ✅ lấy thẳng từ store

  return {
    user,
    isAuthenticated, // đã có sẵn trong authSlice, không tính lại
    role: user?.role ?? null,
  }
}