import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

const LoginPage = () => {
  const [showPassword, setShowPassword] =
    useState(false)

  return (
    <div
      className="
        min-h-screen
        bg-[#f5f7fb]
        flex
        items-center
        justify-center
        p-4
      "
    >
      {/* CARD */}
      <div
        className="
          w-full
          max-w-5xl
          bg-[#fff7f5]
          rounded-3xl
          shadow-2xl
          overflow-hidden
          relative
        "
      >
        {/* LOGIN TEXT */}
        <div
          className="
            absolute
            top-4
            left-6
            text-blue-500
            font-semibold
            text-xl
          "
        >
          Login
        </div>

        {/* CONTENT */}
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            min-h-[650px]
          "
        >
          {/* LEFT */}
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              p-6
              md:p-10
              order-1
            "
          >
            {/* IMAGE */}
            <img
              src="/images/flood.png"
              alt="Flood"
              className="
                w-full
                max-w-md
                object-contain
                mb-6
              "
            />

            {/* TITLE */}
            <h1
              className="
                text-center
                text-xl
                md:text-3xl
                font-bold
                text-gray-800
                leading-snug
              "
            >
              HỆ THỐNG
              <br />
              CẢNH BÁO & CỨU HỘ LŨ LỤT
            </h1>

            {/* SOS */}
            <div
              className="
                mt-8
                bg-red-500
                rounded-full
                px-5
                py-3
                flex
                items-center
                gap-3
                shadow-lg
              "
            >
              {/* ICON */}
              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-white
                  flex
                  items-center
                  justify-center
                  text-red-500
                  font-bold
                "
              >
                SOS
              </div>

              {/* TEXT */}
              <div className="text-white">
                <p className="font-semibold">
                  GỬI SOS KHẨN CẤP
                </p>

                <p className="text-xs">
                  Hỗ trợ cứu hộ nhanh
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div
            className="
              flex
              items-center
              justify-center
              p-6
              md:p-10
              order-2
            "
          >
            <div className="w-full max-w-md">
              {/* FORM */}
              <form className="space-y-5">
                {/* EMAIL */}
                <div>
                  <label
                    className="
                      block
                      mb-2
                      text-sm
                      font-medium
                      text-red-500
                    "
                  >
                    Số điện thoại / Email
                  </label>

                  <input
                    type="text"
                    placeholder="Nhập email hoặc số điện thoại"
                    className="
                      w-full
                      px-4
                      py-3
                      rounded-xl
                      border-2
                      border-blue-400
                      outline-none
                      focus:border-blue-600
                      transition
                      bg-white
                    "
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    className="
                      block
                      mb-2
                      text-sm
                      font-medium
                      text-red-500
                    "
                  >
                    Mật khẩu
                  </label>

                  <div className="relative">
                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Nhập mật khẩu"
                      className="
                        w-full
                        px-4
                        py-3
                        pr-12
                        rounded-xl
                        border-2
                        border-blue-400
                        outline-none
                        focus:border-blue-600
                        transition
                        bg-white
                      "
                    />

                    {/* SHOW HIDE */}
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                      "
                    >
                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* FORGOT */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="
                      text-sm
                      text-red-500
                      hover:underline
                    "
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="
                    w-full
                    py-3
                    rounded-full
                    bg-orange-400
                    hover:bg-orange-500
                    transition
                    text-white
                    font-semibold
                    shadow-lg
                  "
                >
                  Đăng nhập
                </button>

                {/* REGISTER */}
                <div
                  className="
                    text-center
                    text-sm
                    text-gray-500
                  "
                >
                  Chưa có tài khoản?

                  <button
                    type="button"
                    className="
                      ml-1
                      text-blue-600
                      font-semibold
                      hover:underline
                    "
                  >
                    Đăng ký
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage