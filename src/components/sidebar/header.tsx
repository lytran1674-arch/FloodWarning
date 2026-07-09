// src/components/sidebar/Header.tsx
import { useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { BellIcon } from "lucide-react";
import { LogOut } from "@/features/auth/components/LogOut";


type Props = {
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  openLogout: boolean;
  setOpenLogout: React.Dispatch<React.SetStateAction<boolean>>;
};

type HeaderUser = {
  hoten?: string;
  role?: string;
};

type RoleHeaderProps = Props & { user: HeaderUser | null };

// ════════════════════════════════════
// CẤU HÌNH THEO ROLE
// ════════════════════════════════════
const ROLE_CONFIG: Record<
  string,
  { bg: string; label: string; showBell: boolean; bellColor: string; avatarBg: string; avatarText: string }
> = {
  ADMIN: {
    bg: "bg-[#1E4DAF]",
    label: "Quản trị viên",
    showBell: true,
    bellColor: "text-yellow-300",
    avatarBg: "bg-white",
    avatarText: "text-[#1E4DAF]",
  },
  RESCUER: {
    bg: "bg-[#020f40]",
    label: "Lực lượng cứu hộ",
    showBell: false,
    bellColor: "text-yellow-300",
    avatarBg: "bg-white",
    avatarText: "text-[#111B3F]",
  },
  CITIZEN: {
    bg: "bg-[#248BD6]",
    label: "Người dân",
    showBell: true,
    bellColor: "text-[#313866]",
    avatarBg: "bg-blue-50",
    avatarText: "text-[#1E4DAF]",
  },
  PROVINCE_OPERATOR: {
    bg: "bg-[#020f40]",
    label: "Lực lượng cứu hộ cấp tỉnh",
    showBell: false,
    bellColor: "text-yellow-300",
    avatarBg: "bg-white",
    avatarText: "text-[#111B3F]",
  },
};

// ════════════════════════════════════
// HEADER DÙNG CHUNG CHO MỌI ROLE
// ════════════════════════════════════
const RoleHeader = ({
  openMenu,
  setOpenMenu,
  user,
  openLogout,
  setOpenLogout,
}: RoleHeaderProps) => {
  const config = ROLE_CONFIG[user?.role ?? ""] ?? ROLE_CONFIG.ADMIN;
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    if (!openLogout) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenLogout(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openLogout, setOpenLogout]);

  return (
    <div
      className={`w-full px-4 py-3 flex items-center justify-between fixed shadow-md z-[2000] ${config.bg}`}
    >
      <div className="flex items-center gap-3">
        <FaBars
          onClick={() => setOpenMenu(!openMenu)}
          className="text-sm lg:ml-40 sm:text-sm lg:text-3xl cursor-pointer text-white"
        />
        <span className="text-white font-bold text-sm sm:text-sm lg:text-2xl tracking-wide">
          HỆ THỐNG CỨU HỘ LŨ LỤT
        </span>
      </div>

      <div className="flex items-center lg:gap-3 gap-1 relative" ref={dropdownRef}>
        {config.showBell && (
          <BellIcon
            className={`h-6 w-6 ${config.bellColor} cursor-pointer`}
            onClick={(e) => {
              e.stopPropagation();
              // TODO: mở panel thông báo — tách riêng khỏi logic logout
            }}
          />
        )}

        <div
          className="flex items-center lg:gap-3 gap-1 cursor-pointer"
          onClick={() => setOpenLogout(!openLogout)}
        >
          <div className="text-right">
            <p className="text-white text-xs sm:text-sm lg:text-sm font-semibold">
              {user?.hoten ?? "Admin"}
            </p>
            <p className="text-blue-200 text-xs">{config.label}</p>
          </div>
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm lg:text-sm ${config.avatarBg} ${config.avatarText}`}
          >
            {user?.hoten?.[0] ?? "A"}
          </div>
        </div>

        {/* Dropdown logout */}
        {openLogout && (
          <div className="absolute top-full right-0 mt-4 bg-white rounded-lg shadow-lg z-[3000] border border-black
          hover:bg-blue-500 hover:border-blue-600
          ">
            <LogOut className="hover:text-white"/>
          </div>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════
// MAIN HEADER
// ════════════════════════════════════
export const Header = ({
  openMenu,
  setOpenMenu,
  openLogout,
  setOpenLogout,
}: Props) => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated || !user) return null;

  return (
    <RoleHeader
      openMenu={openMenu}
      setOpenMenu={setOpenMenu}
      user={user}
      openLogout={openLogout}
      setOpenLogout={setOpenLogout}
    />
  );
};