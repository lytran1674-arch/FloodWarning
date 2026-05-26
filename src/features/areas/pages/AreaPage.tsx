import { useState } from "react";
import {
  Calendar,
  Files,
  MapIcon,
  MapPin,
  PieChart,
  Snowflake,
  Users,
} from "lucide-react";

import { Header } from "../../../components/sidebar/Header";
import { Menu } from "../../../components/sidebar/Menu";
import { AreaTable } from "../components/AreaTable";
import { AreaTree } from "../components/AreaTree";
import { useArea } from "../hooks/useArea";
import { Button } from "../../../components/ui/Button";

export const AreaPage = () => {
  const { areas, loading } = useArea();
  const [openMenu, setOpenMenu] = useState(false);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      <Header
        title="HỆ THỐNG CẢNH BÁO VÀ CỨU HỘ LŨ LỤT"
        bgColor="bg-[#1E4DAF]"
        textColor="text-white"
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
      />

      <div className="flex flex-1 overflow-hidden">
        <Menu
          textColor="text-white"
          bgColor="bg-[#1E4DAF]"
          activeColor="bg-[#1D3178] text-white rounded-md"
          hover="hover:bg-[#1D3178] hover:rounded-md"
          openMenu={openMenu}
          items={[
            { text: "Thống kê", icon: PieChart, path: "/thongke" },
            {
              text: "Quản lý lực lượng cứu hộ",
              icon: Files,
              path: "/quanlyrescuer",
            },
            {
              text: "Quản lý dữ liệu thời tiết",
              icon: Calendar,
              path: "/quanlyweather",
            },
            {
              text: "Quản lý người dùng",
              icon: Users,
              path: "/quanlyusers",
            },
            {
              text: "Quản lý khu vực",
              icon: MapPin,
              path: "/quanlyareas",
            },
            {
              text: "Quản lý dữ liệu nguy cơ lũ lụt",
              icon: Snowflake,
              path: "/quanlyweatheralert",
            },
          ]}
        />

        <main className="flex-1 overflow-auto p-4 lg:ml-52 mt-16">
          <div className="flex w-full justify-between mb-5">
      <div className="flex justify-start gap-2 font-medium">
    <MapIcon/>
    <p>Quản lý khu vực </p>
    </div>
    <div>
      <Button type="button" className="text-black"/>
    </div>
    </div>
          <div className="flex h-full gap-4">
            <aside className="w-[300px] shrink-0 overflow-auto rounded-xl bg-white p-4 shadow">
              <AreaTree areas={areas} />
            </aside>

            <section className="flex-1 overflow-auto rounded-xl bg-white p-4 shadow">
              <p className="mb-4 font-bold">Quản lý khu vực</p>
              <AreaTable data={areas} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};