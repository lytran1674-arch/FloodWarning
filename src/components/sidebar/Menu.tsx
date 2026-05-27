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
  textColor?: string;
  openMenu: boolean;
  hover?: string;
  bgStyle?: CSSProperties;
};

export const Menu = ({
  items,
  bgColor = "",
  textColor = "text-white",
  openMenu,
  hover = "",
  bgStyle,
}: Props) => {
  return (
    <div
      style={bgStyle}
      className={`
        ${bgColor}
        fixed left-0 z-50 h-screen
        sm:mt-[60px] lg:mt-[61px]
        sm:w-[180px] lg:w-[240px]
        sm:p-0 lg:p-3
        transition-transform duration-300
        ${openMenu ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        mt-[60px] w-[150px]
      `}
    >
      <ul className="mt-3 space-y-2 sm:space-y-3 lg:space-y-4">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              to={item.path}
              key={`${item.path}-${index}`}
              className={`
                flex items-center gap-3
                border-b-2 pb-5 mx-2
                text-xs sm:text-sm lg:text-[18px]
                font-medium ${textColor}
                px-4 py-3 transition-all duration-300 cursor-pointer
                ${hover}
              `}
            >
              {typeof Icon === "string" ? (
                <img
                  src={Icon}
                  alt={item.text}
                  className=" w-8 sm:w-6 lg:w-6 object-contain"
                />
              ) : (
                <Icon className=" w-6 sm:w-6 lg:w-11" />
              )}

              <span>{item.text}</span>
            </NavLink>
          );
        })}
      </ul>
    </div>
  );
};