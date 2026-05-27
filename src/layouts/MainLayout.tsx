import { useState } from 'react'
import { useAuth } from '../features/auth/hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'
import { defaultConfig, roleConfig } from './menuItem'  // ✅
import { Header } from '../components/sidebar/Header'
import { Menu } from '../components/sidebar/Menu'

export const MainLayout = () => {
  const [openMenu, setOpenMenu] = useState(false)
  const { user, isAuthenticated } = useAuth()

  console.log("isAuthenticated:", isAuthenticated)
  console.log("user:", user)
  console.log("user.role:", user?.role)

  if (!isAuthenticated) return <Navigate to="/" />

  const config = roleConfig[user?.role as string] ?? defaultConfig
  console.log("config:", config)

  return (
    <div className="w-full min-h-screen ">
      <Header
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
      />
      <Menu
        bgColor={config.bgColor}
        hover={config.hover}
        items={config.menu}
        openMenu={openMenu}
        bgStyle={config.bgStyle}
      />
      <div className="lg:ml-[240px]">
        <Outlet />
      </div>
    </div>
  )
}