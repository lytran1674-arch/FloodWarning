import { Calendar, FileQuestion, Files, FileText, Home, MapPin, PieChart, Snowflake, User, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type MenuItem = {
  text: string
  icon: LucideIcon
  path: string
}

export const adminMenu: MenuItem[] = [
  { text: "Thống kê",                       icon: PieChart,  path: "/thongke"            },
  { text: "Quản lý lực lượng cứu hộ",       icon: Files,     path: "/rescuers-management"      },
  { text: "Quản lý dữ liệu thời tiết",      icon: Calendar,  path: "/weather-data"      },
  { text: "Quản lý người dùng",             icon: Users,     path: "/users-management"        },
  { text: "Quản lý khu vực",                icon: MapPin,    path: "/areas-management"        },
  { text: "Quản lý nguy cơ lũ lụt",         icon: Snowflake, path: "/flood-risk-management" },
]

export const rescuerMenu: MenuItem[] = [
  { text: "Trang chủ",              icon: PieChart, path: "/home"       },
  { text: "Danh sách yêu cầu",      icon: Files,    path: "/requests-list" },
  { text: "Yêu cầu đã nhận",      icon: Files,    path: "/received-requests" },
  { text: "Tài khoản ",      icon: User,    path: "/account" },

]

export const userMenu: MenuItem[] = [
  { text: "Trang chủ",         icon: Home,  path: "/home"       },
  { text: "Gửi cứu hộ", icon: FileText, path: "/request" },
  { text: "Dữ liệu dự đoán nguy cơ lũ lụt", icon:FileQuestion , path: "/prediction" },
  { text: "Danh sách yêu cầu đã gửi", icon: FileText, path: "/sent-request" },
  { text: "Tài khoản", icon: User, path: "/account" },
]

export type RoleConfig={
    menu:MenuItem[]
    bgColor:string
    activeColor: string 
    hover: string 
}

export const roleConfig: Record<string,RoleConfig>={
    admin:{
        menu:adminMenu,
        bgColor:"bg-[#1E4DAF]",
        activeColor:"bg-[#1D3178]",
        hover:"bg-[#1D3178]",
    },
    rescuer:{
        menu:rescuerMenu,
        bgColor:"bg-[url('images/menurescuer.png')",
        activeColor:"bg-[#1160FD]",
        hover: "bg-[#1160FD]"

    },
    user:{
        menu:userMenu,
        bgColor:"bg-white",
        activeColor:"bg-[#F5ACAC]",
        hover:"bg-[#F5ACAC]"
    },

}

export const defaultConfig:RoleConfig={
    menu:[],
    bgColor:"bg-white",
        activeColor:"bg-[#F5ACAC]",
        hover:"bg-[#F5ACAC]"
}