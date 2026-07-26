import { useEffect, useState } from "react";
import { Send, Siren } from "lucide-react";
import { NavLink } from "react-router-dom";

const GUEST_MENU_ITEMS = [
  {
    text: "Gửi yêu cầu cứu hộ",
    icon: Siren,
    path: "/sos-request-anonymous",
  },
  {
    text: "Yêu cầu đã gửi",
    icon: Send,
    path: "/sent-request-anonymous",
  },
];

export const Menu = () => {
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const handleToggle = () => setOpenMenu((prev) => !prev);
    window.addEventListener("toggle-menu", handleToggle);
    return () => window.removeEventListener("toggle-menu", handleToggle);
  }, []);

  return (
    <div
      className={`
        fixed left-0 top-0 z-[2000]
        h-screen
        sm:mt-[58px] lg:mt-[64px]
        sm:w-[180px] lg:w-[240px] w-[150px]
        md:mt-[61px]
        p-0 lg:p-3
        border
        mt-[61px]
        bg-blue-950
        text-white
        transition-transform duration-300
        ${openMenu ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      <ul className="space-y-2 sm:space-y-2">
        {GUEST_MENU_ITEMS.map((item, index) => {
          const Icon = item.icon;

          return (
            <li key={`${item.path}-${index}`}>
              <NavLink
                to={item.path}
                className="
                  flex items-center gap-1
                  mx-2 border-b-2
                  py-[7px]
                  hover:bg-blue-700
                  hover:rounded-md
                  text-xs sm:text-sm lg:text-[15px]
                  font-medium
                  transition-all duration-300
                  cursor-pointer
                  text-white
                "
              >
                <Icon className="w-6 sm:w-6 lg:w-8 text-white" />
                <span className="text-white">{item.text}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};