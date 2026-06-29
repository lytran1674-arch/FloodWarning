import { BellIcon, Calendar, Files, FileText, GlassWater, GlassWaterIcon, Home, MapPin, PieChart, Send, Snowflake, StarHalf, User, Users, WavesArrowUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import MenuRescuer from "../assets/menurescuer.png"
import type { CSSProperties } from "react"
import IconRescuer from "../assets/rescuer.png"



export type MenuItem = {
  text: string
  icon: LucideIcon | string
  path: string

}

export const adminMenu: MenuItem[] = [
  { text: "Thống kê",                       icon: PieChart,  path: "/thongke"            },
  { text: "Quản lý lực lượng cứu hộ",       icon: Files,     path: "/rescue-management"},
   
   
  { text: "Quản lý dữ liệu thời tiết",      icon: Calendar,  path: "/weather-data"      },
  { text: "Quản lý người dùng",             icon: Users,     path: "/users-management"        },
  { text: "Quản lý khu vực",                icon: MapPin,    path: "/areas-management"        },
  { text: "Quản lý dữ liệu nguy cơ lũ lụt",         icon: Snowflake, path: "/flood-risk" },
  {text:"Quản lý dữ liệu mực nước tổng hợp",icon:GlassWaterIcon, path:"/summary-water"},
  {text:"Quản lý dữ liệu đánh giá", icon:StarHalf,path:"/evaluation"},
  {text:"Quản lý thiết bị", icon:WavesArrowUp,path:"/iot-device" },
]

export const rescuerMenu: MenuItem[] = [
  {text: "RESCUER     Lực Lượng Cứu Hộ", icon: IconRescuer,path:"/sos-assign/:sosId" },
  { text: "Trang chủ",              icon: PieChart, path: "/sos-assign/:sosId"       },
  { text: "Danh sách yêu cầu",      icon: Files,    path: "/team-sos" },
  { text: "Yêu cầu đã nhận",      icon: Files,    path: "/received-requests" },
  { text: "Tài khoản ",      icon: User,    path: "/account" },
  {text:"Quản lý đội cứu hội", icon:FileText ,path:"/team-management"}
  ,{text:"Quản lý nhóm cứu hộ" ,icon:FileText, path:"/group-management"}
]

export const userMenu: MenuItem[] = [
  { text: "Trang chủ",         icon: Home,  path: "/dashboard"       },
  { text: "Gửi cứu hộ", icon: FileText, path: "/request-sos" },
  {text:"Yêu cầu đã gửi", icon:Send, path:"/sent-request"},
 // { text: "Dữ liệu dự đoán nguy cơ lũ lụt", icon:FileQuestion , path: "/prediction" },
  {
    text:"Dữ liệu mực nước" ,icon: GlassWater, path:"/water-data"
  },
  {text:"Cảnh báo gần đây",icon:BellIcon, path:"/alerthistory"},
  { text: "Tài khoản", icon: User, path: "/account" },
]

export type RoleConfig={
    menu:MenuItem[]
    bgColor:string
    hover: string 
    color:string
    bgStyle?:CSSProperties  
    children?:MenuItem[];
}

export const roleConfig: Record<string,RoleConfig>={
    ADMIN:{
        menu:adminMenu,
        bgColor:"bg-[#1E4DAF]",
        hover:"hover:bg-[#1D3178]",
       color:"#ffffff"
    },
    RESCUER:{
        menu:rescuerMenu,
        bgColor:"",
        bgStyle: {
      backgroundImage: `url(${MenuRescuer})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
        hover: "hover:bg-[#1160FD]",
        color:"#ffffff"
    },
    CITIZEN:{
        menu:userMenu,
        bgColor:"bg-white",
        hover:"hover:bg-[#F5ACAC]",
        color:"#f00000",
    },

}

export const defaultConfig:RoleConfig={
    menu:[],
    bgColor:"bg-white",
        hover:"bg-white",
        color:"#ff0000",
}