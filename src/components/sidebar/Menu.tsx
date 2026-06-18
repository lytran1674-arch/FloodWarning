import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type MenuItem = {
  text: string;
  icon: LucideIcon | string;
  path: string;
  children?: MenuItem[];
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
  textColor = "text-black",
  openMenu,
  hover = "",
  bgStyle,
}: Props) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  return (
    <div
      style={bgStyle}
      className={`
        ${bgColor}
        fixed left-0 top-0 z-[2000]
        h-screen
        sm:mt-[60px] lg:mt-[68px]
        sm:w-[180px] lg:w-[240px] w-[150px]
        p-0 lg:p-3
        border
        transition-transform duration-300
        ${openMenu ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      <ul className="space-y-2 sm:space-y-2 lg:space-y-3">
        {items.map((item, index) => {
          const Icon = item.icon;

          const hasChildren = item.text === "Quản lý lực lượng cứu hộ" && item.children;

          return (
            <li key={`${item.path}-${index}`}>
              <div
                className={`
                  flex items-center justify-between
                  mx-2 pb-3 border-b-2
                  rounded-md  py-3
                  text-xs sm:text-sm lg:text-[18px]
                  font-medium
                  transition-all duration-300
                  cursor-pointer
                  ${hover} ${textColor}
                `}
                onClick={() =>
                  hasChildren
                    ? setOpenSubmenu(openSubmenu === item.text ? null : item.text)
                    : null
                }
              >
                <div className="flex items-center gap-3">
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={item.text}
                      className="w-6 sm:w-6 lg:w-8 object-contain"
                    />
                  ) : (
                    <Icon className="w-6 sm:w-6 lg:w-8 text-current" />
                  )}
                  <span className={textColor}>{item.text}</span>
                </div>

                {hasChildren && <ChevronDown className="w-8 h-8 text-current" />}
              </div>

              {hasChildren && openSubmenu === item.text && (
                <ul className="ml-6 mt-1 space-y-1">
                  {item.children?.map((child, i) => {
                    const ChildIcon = child.icon;
                    return (
                      <NavLink
                        key={`${child.path}-${i}`}
                        to={child.path}
                        className={`
                          flex items-center gap-2
                          px-2 py-2
                          text-xs sm:text-sm lg:text-[16px]
                          transition-all duration-300
                          cursor-pointer
                          ${hover} ${textColor}
                        `}
                      >
                        {typeof ChildIcon === "string" ? (
                          <img
                            src={ChildIcon}
                            alt={child.text}
                            className="w-4 sm:w-4 lg:w-6 object-contain"
                          />
                        ) : (
                          <ChildIcon className="w-4 sm:w-4 lg:w-6 text-current" />
                        )}
                        <span>{child.text}</span>
                      </NavLink>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
