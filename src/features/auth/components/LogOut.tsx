import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { Button } from "@/components/ui/Button";
import { authAPI, type LogoutPayload } from "../api/authApi";
import { logout } from "../store/authSlice";



type Props = {
  className?: string;
};

export const LogOut = ({ className }: Props) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnClick = async (payload:LogoutPayload) => {
    if (loading) return;
    setLoading(true);
    try {
      await authAPI.logout(payload);
    } catch (e) {
      console.error(e);
    } finally {
      // Xóa sạch FCM token + unregister Service Worker TRƯỚC khi xóa accessToken,
      // vì deleteToken(messaging) cần Firebase vẫn còn nhận diện được app instance hiện tại


      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("sos_anonymous_sodt");
      localStorage.removeItem("deviceId");

      dispatch(logout());
      setLoading(false);
      navigate("/", { replace: true });
    }
  };

  return (
    <Button
      onClick={(value)=>handleOnClick()}
      disabled={loading}
      className={`lg:p-2 p-1 text-black flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        className ?? ""
      }`}
    >
      <IoLogOut />
      {loading ? "Đang đăng xuất..." : "Đăng xuất"}
    </Button>
  );
};