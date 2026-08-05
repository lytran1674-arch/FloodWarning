import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Shield,
  KeyRound,
  User,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { toast } from "react-toastify";

export default function ChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if(!oldPassword){
      toast.error("Mật khẩu hiện tại không chính xác")
      return 
    }

    if(oldPassword==newPassword){
      toast.error("Mật khẩu mới phải khác mật khẩu hiện tại");
      return 
    }
  if (!oldPassword || !newPassword || !confirmPassword) {
    toast.error("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error("Mật khẩu xác nhận không khớp.");
    return;
  }

  try {
    setLoading(true);

    const response = await authService.changepassword(
      oldPassword,
      newPassword
    );

    toast.success(
      response.result?.message || "Đổi mật khẩu thành công."
    );

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");

    navigate("/account");
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        "Đổi mật khẩu thất bại."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex-1 bg-[#F6F8FC] p-5 overflow-hidden">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        Trang chủ
        <span className="mx-2">/</span>
        Tài khoản
        <span className="mx-2">/</span>

        <span className="text-blue-600 font-semibold">
          Đổi mật khẩu
        </span>
      </div>

      {/* Main Card */}

      <div className="bg-white rounded-2xl shadow-sm border p-5">

        {/* Header */}

        <div className="flex items-center gap-3">

          <div className="w-14 h-14 rounded-full bg-blue-100 flex justify-center items-center">

            <Lock
              className="text-blue-600"
              size={30}
            />

          </div>

          <div>

            <h1 className="lg:text-2xl text-xl font-bold">
              Đổi mật khẩu
            </h1>

            <p className="text-gray-500 mt-1">
              Vì lý do bảo mật, vui lòng không chia sẻ mật khẩu cho người khác.
            </p>

          </div>

        </div>

        <hr className="my-5" />

        <div className="grid grid-cols-12 gap-5">

          {/* LEFT */}

          <div className="col-span-8">

            {/* Current */}

            <div className="mb-3">

              <label className="font-semibold">

                Mật khẩu hiện tại
                <span className="text-red-500">*</span>

              </label>

              <div className="relative mt-2">

               <Input
  type={showCurrent ? "text" : "password"}
  placeholder="Nhập mật khẩu hiện tại"
  value={oldPassword}
  onChange={setOldPassword}
  className="h-12 pr-12"
/>

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrent(!showCurrent)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showCurrent ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* New */}

            <div className="mb-5">

              <label className="font-semibold">

                Mật khẩu mới
                <span className="text-red-500">*</span>

              </label>

              <div className="relative mt-2">

               <Input
  type={showNew ? "text" : "password"}
  placeholder="Nhập mật khẩu mới"
  value={newPassword}
  onChange={ setNewPassword}
  className="h-12 pr-12"
/>

                <button
                  type="button"
                  onClick={() =>
                    setShowNew(!showNew)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showNew ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* Strength */}

            <div className="mb-6">

              <p className="text-sm text-gray-500 mt-2">
                Mật khẩu nên có ít nhất 8 ký tự,
                bao gồm chữ hoa, chữ thường,
                số và ký tự đặc biệt.
              </p>

            </div>

            {/* Confirm */}

            <div>

              <label className="font-semibold">

                Xác nhận mật khẩu mới
                <span className="text-red-500">*</span>

              </label>

              <div className="relative mt-2">
<Input
  type={showConfirm ? "text" : "password"}
  placeholder="Nhập lại mật khẩu mới"
  value={confirmPassword}
  onChange={ setConfirmPassword}
  className="h-12 pr-12"
/>

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showConfirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* Buttons */}

            <div className="flex gap-4 mt-8">

              <Button
              onClick={()=>navigate(-1)}
                className="flex-1 h-11 border rounded-md border-black text-black font-medium"
              >
                <ArrowLeft
                  size={18}
                 
                />
                Quay lại
              </Button>

             <Button
  onClick={handleChangePassword}
  disabled={loading}
  className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
>
  <Lock size={18} />

  {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
</Button>

            </div>

          </div>

          {/* RIGHT */}

          <div className="col-span-4">

            <div className="rounded-xl border bg-blue-50 p-6">

              <div className="flex items-center gap-2 mb-5">

                <Shield
                  className="text-blue-600"
                  size={22}
                />

                <h2 className="font-bold text-blue-700">
                  Gợi ý tạo mật khẩu mạnh
                </h2>

              </div>

              <div className="space-y-6">

                <div className="flex gap-3">
                  <KeyRound className="text-blue-600" />
                  <div>
                    <p className="font-semibold">
                      Ít nhất 8 ký tự
                    </p>
                    <p className="text-sm text-gray-500">
                      Mật khẩu tối thiểu 8 ký tự.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="font-bold text-green-600 text-xl">
                    Aa
                  </span>

                  <div>

                    <p className="font-semibold">
                      Chữ hoa và chữ thường
                    </p>

                    <p className="text-sm text-gray-500">
                      Sử dụng cả A-Z và a-z.
                    </p>

                  </div>

                </div>

                <div className="flex gap-3">
                  <span className="font-bold text-orange-500">
                    123
                  </span>

                  <div>

                    <p className="font-semibold">
                      Bao gồm số
                    </p>

                    <p className="text-sm text-gray-500">
                      Có ít nhất một số.
                    </p>

                  </div>

                </div>

                <div className="flex gap-3">
                  <span className="font-bold text-purple-600">
                    #@!
                  </span>

                  <div>

                    <p className="font-semibold">
                      Ký tự đặc biệt
                    </p>

                    <p className="text-sm text-gray-500">
                      Ví dụ: ! @ # $ %
                    </p>

                  </div>

                </div>

                <div className="flex gap-3">

                  <User className="text-red-500" />

                  <div>

                    <p className="font-semibold">
                      Không dùng thông tin cá nhân
                    </p>

                    <p className="text-sm text-gray-500">
                      Không dùng tên, ngày sinh hoặc số điện thoại.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

       

      </div>

    </div>
  );
}