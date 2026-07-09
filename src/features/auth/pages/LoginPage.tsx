import { LoginForm } from "../components/LoginForm";
import SOSImage from "../../../assets/sos.png";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { CallHotlineButton } from "@/features/emergency/components/test/CallHotlineButton";

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate("/sos-request-anonymous");
  };

  return (
    <div
      className="
        flex flex-col-reverse lg:flex-row
        items-center justify-center
        lg:gap-10
        min-h-screen
        px-4 lg:px-10
        bg-white
        
      "
    >
      {/* Ảnh SOS và nút gọi: trên desktop nằm bên trái, trên mobile nằm dưới form */}
      <div className="flex lg:flex-col items-center gap-4 -mt-10">
        <Button
          onClick={handleOnClick}
          imageSrc={SOSImage}
          className="
            w-44 h-44
            sm:w-52 sm:h-52
            lg:w-60 lg:h-60
            rounded-full
          "
        />
        <CallHotlineButton />
      </div>

      {/* Form đăng nhập: trên desktop nằm bên phải, trên mobile nằm trên cùng */}
      <div className="w-full max-w-lg">
        <LoginForm />
      </div>
    </div>
  );
};