import { useAppSelector } from "@/hooks/redux.hooks";
import { Button } from "antd";
import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { NavLink } from "react-router-dom";

type MenuItem = {
  text: string;
  icon: LucideIcon | string;
  path: string;
};

type Props = {
  items: MenuItem[];
  bgColor?: string;
  color?: string;          // 👈 nhận hex trực tiếp
  openMenu: boolean;
  hover?: string;
  bgStyle?: CSSProperties;
};

export const Menu = ({
  items,
  bgColor = "",
  color = "#000000",       // 👈 mặc định đen
  openMenu,
  hover = "",
  bgStyle,
}: Props) => {

    const user = useAppSelector((state) => state.auth.user);
    const role = user?.role==="CITIZEN"
    const admin = user?.role==="ADMIN"
  return (

    <div
      style={bgStyle}
      className={`
        ${bgColor}
        fixed left-0 top-0 z-[2000]
        h-screen
        sm:mt-[58px] lg:mt-[64px]
        sm:w-[180px] lg:w-[240px] w-[150px]
        md:mt-[61px]
        p-0 lg:p-3
        border
        mt-[61px]
        transition-transform duration-300
        ${openMenu ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      <ul className="space-y-2 sm:space-y-2 ">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <li key={`${item.path}-${index}`}>
              <NavLink
                to={item.path}
                className={`
                  flex items-center gap-1
                  mx-2 border-b-2
                  rounded-md py-[7px]
                  text-xs sm:text-sm lg:text-[15px]
                  font-medium
                  transition-all duration-300
                  cursor-pointer
                  ${hover}
                `}
              >
                {typeof Icon === "string" ? (
                  <img
                    src={Icon}
                    alt={item.text}
                    className="w-6 sm:w-6 lg:w-8 object-contain"
                  />
                ) : (
                  <Icon style={{ color }} className="w-6 sm:w-6 lg:w-8" />
                )}
                <span style={{ color }}>{item.text}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
        <div className="lg:mt-[100px] lg:ml-[45px] mt-[200px] ml-[30px]">
            {role&&
      <Button className="border border-red-600 font-bold lg:p-4 bg-red-600 text-white text-xs sm:text-sm lg:text-xl rounded-3xl">Gọi SOS</Button>
}
        </div>
    </div>
  );
};