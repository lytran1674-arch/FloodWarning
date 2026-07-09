import { LoginForm } from "../components/LoginForm";
import SOSImage from "../../../assets/sos.png";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { CallHotlineButton } from "@/features/emergency/components/test/CallHotlineButton";

export const LoginPage = () => {
  const navigate=useNavigate();

  const handleOnClick=()=>{
    navigate("/sos-request-anonymous")
  }
  return (
    <div
      className="
        flex flex-col items-center justify-start
        bg-white
        gap-0
        lg:flex-row
        lg:justify-center
        lg:items-center
        lg:gap-10
        lg:px-10
      "
    >
      {/* Nút SOS */}
      <div className="flex justify-center -mb-8 sm:-mb-10 lg:mb-0 lg:mr-4">
        <Button
        onClick={handleOnClick}
          imageSrc={SOSImage}
          className="
            w-44 h-44
            sm:w-52 sm:h-52
           
            lg:w-60 lg:h-60
            rounded-full
            p-0
          "
        />
        <CallHotlineButton/>
      </div>

      {/* Form đăng nhập */}
      <div className="w-full max-w-lg -mt-10 lg:mt-0 sm:-mt-12">
        <LoginForm />
      </div>
    </div>
  );
};