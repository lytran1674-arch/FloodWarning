// src/components/sidebar/Header.tsx
import { FaBars } from "react-icons/fa";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { BellIcon } from "lucide-react";


type Props = {
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
};



// ════════════════════════════════════
// ADMIN HEADER
// ════════════════════════════════════
const AdminHeader = ({ openMenu, setOpenMenu, user }: any) => (
  <div className="w-full px-4 py-3 flex items-center justify-between bg-[#1E4DAF] fixed shadow-md z-[2000]">
    <div className="flex items-center gap-3 ">
      <FaBars
        onClick={() => setOpenMenu(!openMenu)}
         className="text-sm lg:ml-40 sm:text-sm lg:text-3xl  cursor-pointer text-white " />
      <span className="text-white font-bold text-sm sm:text-sm lg:text-2xl tracking-wide">
         HỆ THỐNG CỨU HỘ LŨ LỤT
      </span>
    </div>
    <div className="flex items-center lg:gap-3 gap-1">
       <BellIcon className="h-6 w-6 text-yellow-300" />
      <div className="text-right ">
       
        <p className="text-white text-xs font-semibold">{user?.hoten ?? "Admin"}</p>
        <p className="text-blue-200 text-xs">Quản trị viên</p>
      </div>
      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#1E4DAF] font-bold text-xs sm:text-sm lg:text-sm">
        {user?.hoten?.[0] ?? "A"}
      </div>
    </div>
  </div>
);

// ════════════════════════════════════
// RESCUER HEADER
// ════════════════════════════════════
const RescuerHeader = ({ openMenu, setOpenMenu, user }: any) => (
  <div className="w-full px-4 py-3 flex items-center justify-between bg-[#020f40] fixed shadow-md z-[2000]">
    <div className="flex items-center gap-3 ">
      <FaBars
        onClick={() => setOpenMenu(!openMenu)}
         className="text-sm lg:ml-40 sm:text-sm lg:text-3xl  cursor-pointer text-white " />
      <span className="text-white font-bold text-sm sm:text-sm lg:text-2xl tracking-wide">
         HỆ THỐNG CỨU HỘ LŨ LỤT
      </span>
    </div>
    <div className="flex items-center lg:gap-3">
      <div className="text-right">
        <p className="text-white text-xs lg:text-sm sm:text-sm font-semibold">{user?.hoten ?? "Admin"}</p>
        <p className="text-white text-xs">Lực lượng cứu hộ </p>
      </div>
      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#111B3F] font-bold text-xs sm:text-sm lg:text-sm">
        {user?.hoten?.[0] ?? "A"}
      </div>
    </div>
  </div>
);


// ════════════════════════════════════
// CITIZEN HEADER
// ════════════════════════════════════
const CitizenHeader = ({ openMenu, setOpenMenu, user }: any) => (
  
  <div className="w-full px-4 py-3 flex items-center justify-between fixed top-0 left-0 right-0 shadow-md z-[5000] bg-[#248BD6]">
    <div className="flex items-start gap-3 ">
      <FaBars
        onClick={() => setOpenMenu(!openMenu)}
         className="text-sm lg:ml-40 sm:text-sm lg:text-3xl  cursor-pointer text-white " />
      <span className="text-white font-bold text-sm sm:text-sm lg:text-2xl tracking-wide">
         HỆ THỐNG CỨU HỘ LŨ LỤT
      </span>
    </div>
    <div className="flex items-center lg:gap-3">
         <BellIcon className="h-6 w-6 text-[#313866]" />
      <div className="text-right">
       
        <p className="text-white text-xs sm:text-sm lg:text-sm font-semibold">{user?.hoten ?? "Admin"}</p>
        <p className="text-white text-xs">Người dân</p>
      </div>
      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#1E4DAF] font-bold text-xs sm:text-sm lg:text-sm">
        {user?.hoten?.[0] ?? "A"}
      </div>
    </div>
  </div>
);

// ════════════════════════════════════
// PROVINCE HEADER
// ════════════════════════════════════
const ProvinceHeader = ({ openMenu, setOpenMenu, user }: any) => (
  <div className="w-full px-4 py-3 flex items-center justify-between bg-[#020f40] fixed shadow-md z-[2000]">
    <div className="flex items-center gap-3 ">
      <FaBars
        onClick={() => setOpenMenu(!openMenu)}
         className="text-sm lg:ml-40 sm:text-sm lg:text-3xl  cursor-pointer text-white " />
      <span className="text-white font-bold text-sm sm:text-sm lg:text-2xl tracking-wide">
         HỆ THỐNG CỨU HỘ LŨ LỤT
      </span>
    </div>
    <div className="flex items-center lg:gap-3">
      <div className="text-right">
        <p className="text-white text-xs lg:text-sm sm:text-sm font-semibold">{user?.hoten ?? "Admin"}</p>
        <p className="text-white text-xs">Lực lượng cứu hộ </p>
      </div>
      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#111B3F] font-bold text-xs sm:text-sm lg:text-sm">
        {user?.hoten?.[0] ?? "A"}
      </div>
    </div>
  </div>
);

// ════════════════════════════════════
// MAIN HEADER — tự chọn theo role
// ════════════════════════════════════
export const Header = ({ openMenu, setOpenMenu }: Props) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated || !user) return null;

  const props = { openMenu, setOpenMenu, user }

  // ✅ Render đúng header theo role
  switch (user.role as string) {
    case "ADMIN":   return <AdminHeader   {...props} />
    case "RESCUER": return <RescuerHeader {...props} />
    case "CITIZEN": return <CitizenHeader {...props} />
    case "PROVINCE_OPERATOR": return <ProvinceHeader {...props}/>
    default:        return <AdminHeader   {...props} />
  }
};