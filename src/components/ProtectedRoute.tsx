// components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom"

type Role = "TEAM_LEADER" | "GROUP_LEADER" | "MEMBER" | "ADMIN" | "CITIZEN"

interface Props {
  allowedRoles?: Role[]
}

/**
 * Lấy role từ localStorage user object.
 * Backend trả về user.role = "TEAM_LEADER" | "GROUP_LEADER" | "MEMBER" | ...
 */
function getUserRole(): Role | null {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    return user.role ?? null
  } catch {
    return null
  }
}

function isLoggedIn(): boolean {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    return !!user?.userId || !!user?.id
  } catch {
    return false
  }
}

export const ProtectedRoute = ({ allowedRoles }: Props) => {
  if (!isLoggedIn()) {
    return <Navigate to="/" replace />
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const role = getUserRole()
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return <Outlet />
}