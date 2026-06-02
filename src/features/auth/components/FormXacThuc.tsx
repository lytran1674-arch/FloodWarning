
import { FaArrowLeft } from "react-icons/fa";
import { MdEmail, MdSecurity } from "react-icons/md";

import { Button } from "../../../components/ui/Button";
import { OTPInput } from "../../../components/ui/OTPInput";

interface FrormXacThucProps{
    onNext:()=>void;
}
export const FormXacThuc = ({onNext}:FrormXacThucProps) => {
 /* const [email, setEmail] = useState("");*/

  return (
    <div
      className="
        w-screen
    h-screen
    bg-[url('/image/nenform.png')]
    bg-cover
    bg-center
    bg-no-repeat
    overflow-hidden
      "
    >
      {/* Header */}
      <div
        className="
          flex
          justify-center
          items-center
          
          p-4
  
          text-center
        "
      >
        <MdSecurity
          className="
            text-5xl
            sm:text-6xl
            lg:text-5xl
            text-[#1D3178]
            shrink-0
          "
        />

        <p
          className="
            font-bold
            text-xl
            sm:text-2xl
            lg:text-3xl
            text-[#1D3178]
          "
        >
          HỆ THỐNG CẢNH BÁO VÀ CỨU HỘ LŨ LỤT
        </p>
      </div>

      {/* Container */}
      <div
        className="
          w-full
          h-[calc(100vh-90px)]
          flex
          justify-center
          lg:justify-start
          items-center
          px-4
        "
      >
        {/* Card */}
        <div
          className="
            bg-white/90
            backdrop-blur-sm
            w-full
            max-w-[600px]
            lg:ml-14
            p-6
            rounded-2xl
            shadow-2xl
          "
        >
          <form>
            {/* Top */}
            <div className="flex justify-start gap-3 font-semibold ">
                <FaArrowLeft className="text-black text-sm sm:text-xl lg:text-2xl"/>
                <p className="text-black text-sm sm:text-xl lg:text-2xl">Đặt lại mật khẩu</p>
                </div>
                <div className="text-sm sm:text-xl text-black">

                </div>
            <div className="flex flex-col justify-center items-center">
                
              <MdEmail
                className="
                  rounded-full
                  text-5xl
                  sm:text-6xl
                  lg:text-7xl
                  border
                  p-2
                  lg:p-3
                  bg-[#B1C9F9]
                  border-[#B1C9F9]
                  text-[#0C317B]
                "
              />

              <p
                className="
                  font-bold
                  text-xl
                  sm:text-2xl
                  text-black
                  mt-3
                "
              >
                NHẬP MÃ XÁC NHẬN
              </p>

              <p
                className="
                  text-xs
                  sm:text-sm
                  lg:text-base
                  text-center
                  text-gray-700
                  mt-2
                  leading-5
                "
              >
                Chúng tôi sẽ gửi mã đến 
              </p>
            </div>
            <OTPInput />
            <p>Mã xác nhận sẽ hết hạn sau 02:00</p>
            
            
            {/* Button */}
            <Button
            onClick={onNext}
              className="
                bg-[#1C5FE5]
                text-white
                mt-4
                w-full
                rounded-lg
                h-11
                hover:bg-[#0C317B]
                transition-all
              "
              children="Xác nhận"
            />
            <p>Không nhận được mã?<u>Gửi lại(00:45)</u></p>
            {/* Back */}
            <div
              className="
                mt-4
                font-light
                flex
                justify-center
                items-center
                gap-2
                text-[#1C5FE5]
                hover:text-black
                cursor-pointer
                transition-all
              "
            >
              <FaArrowLeft />
              <p>Quay lại</p>
            </div>

           
          </form>
        </div>
      </div>
    </div>
  );
};