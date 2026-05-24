import { useState } from "react"
import { Header } from "../../../components/sidebar/Header"
import { Menu } from "../../../components/sidebar/Menu"
import { AreaTable } from "../components/AreaTable"
import { AreaTree } from "../components/AreaTree"

import { useArea } from "../hooks/useArea"

import { buildTree } from "../utils/buildTree"
import { Calendar, Files, HeartOffIcon, Home, MapPin, PieChart, Settings, Snowflake, User, Users } from "lucide-react"

export const AreaPage = () => {
  const { areas, loading } = useArea();
  const [openMenu,setOpenMenu]=useState(false);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  const treeData = buildTree(areas);

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <Header
        title="HỆ THỐNG CẢNH BÁO VÀ CỨU HỘ LŨ LỤT"
        bgColor="bg-[#1E4DAF]"
        textColor="text-white"
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
      />

      <Menu textColor="text-white"  
   bgColor="bg-[#1E4DAF]"
   activeColor="bg-[#1D3178] text-white rounded-md" 
  hover="hover:bg-[#1D3178] hover:rounded-md  "
    openMenu={openMenu} 
    items={[
    { text: "Thống kê",     icon: PieChart  ,path:"/thongke"  },
    { text: "Quản lý lực lượng cứu hộ",  icon:Files  , path:"/quanlyrescuer"   },
    { text: "Quản lý dữ liệu thời tiết", icon: Calendar ,path:"/quanlyweather"},
    { text: "Quản lý người dùng", icon: Users ,path:"/quanlyusers"},
    { text: "Quản lý khu vực", icon: MapPin,path:"/quanlyareas" },
    { text: "Quản lý dữ liệu nguy cơ lũ lụt", icon:Snowflake,path:"/quanlyweatheralert" },
  ]}/>

      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-12 md:col-span-3 bg-white rounded shadow p-3">
          <AreaTree areas={treeData} />
        </div>

        <div className="col-span-12 md:col-span-9 bg-white rounded shadow p-3">
          <p className="font-bold mb-3">Nội dung bên phải</p>
          <AreaTable data={areas} />
        </div>
      </div>
    </div>
  );
};