import { Calendar, FileQuestion, Files, FileText, Home, List, ListMinus, MapPin, PieChart, Snowflake, User, Users, WavesArrowUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import MenuRescuer from "../assets/menurescuer.png"
import type { CSSProperties } from "react"
import IconRescuer from "../assets/rescuer.png"


export type MenuItem = {
  text: string
  icon: LucideIcon | string
  path: string
  children?:MenuItem[]
}

export const adminMenu: MenuItem[] = [
  { text: "Thống kê",                       icon: PieChart,  path: "/thongke"            },
  { text: "Quản lý lực lượng cứu hộ",       icon: Files,     path: "/rescuers-management",
    children:[
      {
        text:"Danh sách group", path:"/listgroup", icon:List
      },
      {text:"Danh sách đội", path:"/listteam",icon:ListMinus}
      
    ]
        },
  { text: "Quản lý dữ liệu thời tiết",      icon: Calendar,  path: "/weather-data"      },
  { text: "Quản lý người dùng",             icon: Users,     path: "/users-management"        },
  { text: "Quản lý khu vực",                icon: MapPin,    path: "/areas-management"        },
  { text: "Quản lý dữ liệu nguy cơ lũ lụt",         icon: Snowflake, path: "/flood-risk" },
  {text:"Quản lý thiết bị", icon:WavesArrowUp,path:"/iot-device" },
]

export const rescuerMenu: MenuItem[] = [
  {text: "RESCUER     Lực Lượng Cứu Hộ", icon: IconRescuer,path:"/home" },
  { text: "Trang chủ",              icon: PieChart, path: "/home"       },
  { text: "Danh sách yêu cầu",      icon: Files,    path: "/requests-list" },
  { text: "Yêu cầu đã nhận",      icon: Files,    path: "/received-requests" },
  { text: "Tài khoản ",      icon: User,    path: "/account" },
  {text:"Quản lý đội cứu hội", icon:FileText ,path:"/team-management"}
  ,{text:"Quản lý nhóm cứu hộ" ,icon:FileText, path:"/group-management"}
]

export const userMenu: MenuItem[] = [
  { text: "Trang chủ",         icon: Home,  path: "/dashboard"       },
  { text: "Gửi cứu hộ", icon: FileText, path: "/request-sos" },
  { text: "Dữ liệu dự đoán nguy cơ lũ lụt", icon:FileQuestion , path: "/prediction" },
  { text: "Danh sách yêu cầu đã gửi", icon: FileText, path: "/sent-request" },
  { text: "Tài khoản", icon: User, path: "/account" },
]

export type RoleConfig={
    menu:MenuItem[]
    bgColor:string
    hover: string 
    textColor:string
    bgStyle?:CSSProperties  
    children?:MenuItem[];
}

export const roleConfig: Record<string,RoleConfig>={
    ADMIN:{
        menu:adminMenu,
        bgColor:"bg-[#1E4DAF]",
        hover:"hover:bg-[#1D3178]",
        textColor:"text-white"
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
        textColor:"text-white"
    },
    CITIZEN:{
        menu:userMenu,
        bgColor:"bg-white",
        hover:"hover:bg-[#F5ACAC]",
        textColor:"text-black",
    },

}

export const defaultConfig:RoleConfig={
    menu:[],
    bgColor:"bg-white",
        hover:"bg-white",
        textColor:"text-black",
}