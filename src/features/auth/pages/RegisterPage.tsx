import { Phone } from "lucide-react";
import SOSImage from "../../../assets/sos.png";
import { Button } from "../../../components/ui/Button";
import { RegisterForm } from "../components/RegisterForm";

export const RegisterPage = () => {
  return (
    <div
      className="
        flex flex-col lg:flex-row 
        items-center justify-center
        bg-white
        gap-8 lg:gap-10
        lg:px-10
      
        sm:-ml-28
      "
    >
      {/* Form đăng ký - Đặt trước để hiện trên cùng ở mobile */}
      <div className="w-full  max-w-lg order-1 lg:order-2">
        <RegisterForm />
      </div>

      {/* Nút SOS - Đặt sau để hiện dưới form ở mobile */}
      <div className="flex flex-row lg:flex-col items-center justify-center gap-4 lg:gap-6 order-2 lg:order-1 lg:mr-4">
        
        {/* Nút SOS lớn */}
        <Button
          imageSrc={SOSImage}
          className="
            w-80 h-16 
            sm:w-80 sm:h-16 
            lg:w-80 lg:h-16 
            rounded-full 
            p-0 
           
          "
        />

        {/* Nút Gọi 116 */}
        <Button 
          className="
            flex items-center justify-center gap-3 
            bg-red-600 hover:bg-red-700 
            text-white font-bold text-lg 
            px-10 py-4 
            rounded-full 
            border-2 border-red-300 
            shadow-lg 
            hover:shadow-xl 
            transition-all duration-200
            whitespace-nowrap
            w-full max-w-[280px]
          "
        >
          <Phone className="w-6 h-6" />
          Gọi 116
        </Button>

      </div>
    </div>
  );
};