import { FaBars, FaChevronUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

type Props = {
  title: string;
  bgColor?: string;
  textColor?: string;
};

export const Header = ({ title, bgColor, textColor }: Props) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className={`w-full p-2 flex items-center justify-between ${bgColor}`}>
      <FaBars className="text-xl lg:ml-36 sm:text-xl lg:text-3xl  cursor-pointer text-white " />
      <p className={`text-xl sm:text-xl lg:text-2xl font-bold m-1 ${textColor}`}>{title}</p>

      <div className="flex items-center gap-2">
        {isAuthenticated && user && (
          <p className={`${textColor} font`}>{user.hoten}</p>
        )}
        <FaChevronUp className={`${textColor} text-xl`} />
      </div>
    </div>
  );
};
