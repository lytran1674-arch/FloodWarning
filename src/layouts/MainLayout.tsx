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

  if (!isAuthenticated) return <Navigate to="/" />;

  const config = roleConfig[user?.role as string] ?? defaultConfig;



  return (
    <div className="w-full min-h-screen">
      <Header openMenu={openMenu} setOpenMenu={setOpenMenu} />

      <Menu
        bgColor={config.bgColor}
        hover={config.hover}
        items={config.menu}
        openMenu={openMenu}
        bgStyle={config.bgStyle}
        color={config.color}
      />

      <main className="pt-[60px] lg:ml-[240px] min-h-screen">
         <AreaProvider>
        <Outlet />
        </AreaProvider>
      </main>
    </div>
  );
};