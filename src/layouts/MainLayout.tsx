import { useState } from "react";
import { useAuth } from "../features/auth/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { defaultConfig, roleConfig } from "./menuItem";
import { Header } from "../components/sidebar/Header";
import { Menu } from "../components/sidebar/Menu";
import { AreaProvider } from "../features/areas/components/AreaContext";

export const MainLayout = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [openLogout, setOpenLogout] = useState(false);
  if (!isAuthenticated) return <Navigate to="/" />;

  const config = roleConfig[user?.role as string] ?? defaultConfig;

  return (
    <AreaProvider> {/* ✅ wrap toàn bộ layout, không bị unmount khi navigate */}
      <div className="w-full min-h-screen">
        <Header openMenu={openMenu} setOpenMenu={setOpenMenu} openLogout={openLogout} setOpenLogout={setOpenLogout} />

        <Menu
  
          bgColor={config.bgColor}
          hover={config.hover}
          items={config.menu}
          openMenu={openMenu}
          bgStyle={config.bgStyle}
          color={config.color}
        />

        <main className="pt-[60px] lg:ml-[240px] min-h-screen">
          <Outlet />
        </main>
      </div>
    </AreaProvider>
  );
};