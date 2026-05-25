import { useState } from 'react'
import { useAuth } from '../features/auth/hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'
import { defaultConfig, roleConfig } from './menuItem'  // ✅
import { Header } from '../components/sidebar/Header'
import { Menu } from '../components/sidebar/Menu'

export const MainLayout = () => {
  const [openMenu, setOpenMenu] = useState(false)
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Navigate to="/" />  // ✅ thêm />

  const config = roleConfig[user?.role as string] ?? defaultConfig

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Header
        title="HỆ THỐNG CẢNH BÁO VÀ CỨU HỘ LŨ LỤT"
        bgColor={config.bgColor}
        textColor="text-white"
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
      />
      <Menu
        textColor="text-white"
        bgColor={config.bgColor}
        activeColor={config.activeColor}
        hover={config.hover}
        openMenu={openMenu}
        items={config.menu}
      />
      <div className="lg:ml-[240px]">
        <Outlet />
      </div>
    </div>
  )
}