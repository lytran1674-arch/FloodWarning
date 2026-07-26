import { FaBars } from "react-icons/fa";

export const Header = () => {
  const handleToggleMenu = () => {
    window.dispatchEvent(new Event("toggle-menu"));
  };

  return (
    <div className="w-full px-4 py-3 flex items-center justify-between fixed shadow-md z-[2000] bg-blue-950">
      <div className="flex items-center gap-3">
        <FaBars
          onClick={handleToggleMenu}
          className="text-sm lg:ml-40 sm:text-sm lg:text-3xl cursor-pointer text-white"
        />
        <span className="text-white font-bold text-sm sm:text-sm lg:text-2xl tracking-wide">
          HỆ THỐNG CỨU HỘ LŨ LỤT
        </span>
      </div>
    </div>
  );
};