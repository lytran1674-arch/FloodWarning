import { FaBars, FaChevronUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useState } from "react";

type Props = {
  title: string;
  bgColor?: string;
  textColor?: string;
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Header = ({ title, bgColor, textColor,openMenu,
  setOpenMenu }: Props) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);


  return (
    <div className={`w-full p-2 flex items-center justify-between ${bgColor}`}>
      <FaBars onClick={()=>setOpenMenu(!openMenu)} 
      className="text-sm lg:ml-40 sm:text-sm lg:text-3xl  cursor-pointer text-white " />
      <p className={`text-sm sm:text-xs lg:text-2xl font-bold m-1 ${textColor}`}>{title}</p>

      <div className="flex items-center gap-2">
        {isAuthenticated && user && (
          <p className={`${textColor} font`}>{user.hoten}</p>
        )}
        <FaChevronUp className={`${textColor} text-sm sm:text-sm lg:text-xl`} />
      </div>
    </div>
  );
};
