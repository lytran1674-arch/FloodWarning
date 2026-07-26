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
      <div className="flex flex-col items-center lg:grid lg:grid-rows-3 lg:gap-0 lg:-mt-10 lg:w-[400px]">
        {/* Tracking: mobile = hàng trên cùng | desktop = hàng giữa */}
        <div className="order-1 lg:order-2 w-full flex justify-center">
          <Tracking />
        </div>

        {/* Mobile: SOS + Hotline chung 1 hàng, nằm dưới Tracking
            Desktop: lg:contents "tháo" div này ra, để 2 con trở thành
            2 hàng riêng biệt (row 1 và row 3) trong grid-rows-3 */}
        <div className="order-2 flex flex-row items-center justify-center w-full lg:contents">
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
          <div className="lg:order-3 flex-1 lg:flex-none">
            <CallHotlineButton />
          </div>
        </div>
      </div>

      {/* Form đăng nhập: trên desktop nằm bên phải, trên mobile nằm trên cùng */}
      <div className="w-full max-w-lg">
        <LoginForm />
      </div>
    </div>
  );
};