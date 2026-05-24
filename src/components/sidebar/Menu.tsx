import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

type MenuItem = {
  text: string;
  icon: LucideIcon; 
  path:string
};

type Props = {
  items: MenuItem[]; // ← đổi từ text[] sang MenuItem[]
  bgColor?: string;
  textColor?: string;
  openMenu: boolean;
  hover?: string;
   activeColor?: string;
};

export const Menu = ({ items, bgColor, textColor, openMenu, hover,activeColor }: Props) => {
  return (
    <div
      className={`
        ${bgColor} p-3 w-[240px] fixed sm:top-[41px] lg:top-[64px]
        left-0 h-screen z-50 transition-transform duration-300
        ${openMenu ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      <ul className="mt-3 space-y-6">
        {items.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className={({ isActive }) => `
              flex items-center gap-3
              border-b-2 pb-5 mx-2 
              text-sm sm:text-sm lg:text-[18px]
              font-medium ${textColor}
              px-4 py-3 transition-all duration-300 cursor-pointer
              ${isActive ? activeColor : hover}  
            `}
          >
         
            <item.icon className="sm:size-5 lg:size-8" /> 
            {item.text}
          </NavLink>
        ))}
      </ul>
    </div>
  );
};