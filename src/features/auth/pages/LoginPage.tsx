import { LoginForm } from "../components/LoginForm";
import SOSImage from "../../../assets/sos.png";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { CallHotlineButton } from "@/features/emergency/components/test/CallHotlineButton";
import { Tracking } from "@/features/emergency/components/Tracking";

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate("/sos-request-anonymous");
  };

  return (
    <div
      className="
          h-screen
      overflow-hidden
      flex flex-col-reverse lg:flex-row
      items-center justify-center
      lg:gap-5
      px-4 lg:px-10
      bg-white
      "
    >
      {/* Ảnh SOS và nút gọi: trên desktop nằm bên trái, trên mobile nằm dưới form */}
      <div className="flex flex-col items-center lg:gap-4 lg:-mt-10 lg:w-[400px]">
        {/* Mobile: SOS + Hotline chung 1 hàng, đứng trước Tracking
            Desktop: lg:contents "tháo" div này ra, để 2 con trở thành
            2 phần tử flex độc lập (order-1 và order-2) trong flex-col cha */}
        <div className="order-1 flex flex-row items-center justify-center w-full lg:contents">
          <div className="lg:order-1 flex justify-center">
            <Button
              onClick={handleOnClick}
              imageSrc={SOSImage}
              className="
                w-36 h-36
                sm:w-44 sm:h-44
                lg:w-60 lg:h-60
                rounded-full
              "
            />
          </div>
          <div className="lg:order-2 flex-1 lg:flex-none lg:-mt-20">
            <CallHotlineButton />
          </div>
        </div>

        {/* Tracking: luôn nằm cuối cùng (mobile lẫn desktop) */}
        <div className="order-3 w-full flex justify-center">
          <Tracking />
        </div>
      </div>

      {/* Form đăng nhập: trên desktop nằm bên phải, trên mobile nằm trên cùng */}
      <div className="w-full max-w-lg">
        <LoginForm />
      </div>
    </div>
  );
};