import React, { useState } from 'react'
import ImageLogin from "../../../assets/nenlogin.png"
import { Input } from '../../../components/ui/Input'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api/authApi'
import { setAudioUnlocked, setCredentials } from '../store/authSlice'
import type { AppDispatch } from '../../../app/store'
import { flushPendingFcmToken } from '@/utils/firebaseNotification'
import { unlockAudioContext } from '../utils/audioUnlock'

export const LoginForm: React.FC = () => {
  // Gộp email và số điện thoại thành một ô nhập duy nhất
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]       = useState("")
  const [isLocked, setIsLocked] = useState(false)

  const dispatch  = useDispatch<AppDispatch>()
  const navigate  = useNavigate()

  const primeAlarmAudio = () => {
    try {
      const audio = new Audio("/sounds/alarm.mp3");
      audio.volume = 0;
      audio.play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
        })
        .catch(() => {
          // một số trình duyệt vẫn chặn — không sao, chỉ là không mở khoá được lần này
        });
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const unlocked = unlockAudioContext();

    const value = account.trim()

    if (!value || !password) {
      setError("Vui lòng nhập đầy đủ email/số điện thoại và mật khẩu!")
      return
    }

    // Nhận diện: có "@" thì coi là email, ngược lại coi là số điện thoại
    const isEmailFormat = /\S+@\S+\.\S+/.test(value)
    const emailValue = isEmailFormat ? value : ""
    const sodtValue   = isEmailFormat ? "" : value

    try {
      setIsLoading(true)
      setError("")
      setIsLocked(false)

      const res = await authAPI.login({
        loginInfo: value,
        sodt: sodtValue,
        password,
      })

      const { accessToken, role, authenticated, hoten, id, areaId, teamId, teamName, isTeamLeader, isGroupLeader, isTeamDeputy, sodt, groupType, refreshToken } = res.data.result
      console.log("LOGIN RESULT:", res.data.result);

      if (!authenticated) {
        setError("Đăng nhập thất bại!")
        return
      }

      dispatch(setAudioUnlocked(unlocked));
      dispatch(setCredentials({ user: { role, hoten, id, areaId, teamId, teamName, isTeamLeader, isGroupLeader, isTeamDeputy, sodt, groupType }, refreshToken, accessToken }))
      await flushPendingFcmToken(accessToken, id)
      localStorage.setItem("userId", id)
      localStorage.removeItem("sos_anonymous_sodt");
      localStorage.removeItem("deviceId");

      flushPendingFcmToken(accessToken, id).catch((err) => {
        console.error("Lỗi khi đồng bộ FCM token sau đăng nhập:", err)
      })

      switch (role) {
        case "ADMIN":   navigate("/evaluation"); break
        case "RESCUER":
          if (groupType === "HOTLINE") {
            navigate("/hotline");
          } else {
            navigate("/homerescue");
          }
          break;
        case "CITIZEN": navigate("/dashboard");             break
        case "PROVINCE_OPERATOR": navigate("/homeprovince"); break
        default:        navigate("/")
      }

    } catch (err: any) {
      const message: string = err.response?.data?.message ?? "Email/Số điện thoại hoặc mật khẩu không đúng!"

      if (message.includes("khóa")) {
        setIsLocked(true)
      }

      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const formQMK = () => {
    navigate("/forgot-password")
  }
  const handleOnClick = () => {
    navigate("/register")
  }

  const handleUnlockClick = () => {
    navigate("/unlock-account", { state: { account } })
  }

  return (
    <div className="flex items-center justify-center overflow-hidden p-0 m-10 sm:w-50 ">
      <div className="overflow-hidden bg-white border border-blue-500 rounded-lg w-full max-w-md p-5 shadow-lg">

        <img
          src={ImageLogin}
          className="w-full h-auto rounded-lg"
          alt="Login"
        />

        <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-gray-800">
          HỆ THỐNG CẢNH BÁO VÀ CỨU HỘ LŨ LỤT
        </h2>

        {error && (
          <div className="mb-3 px-3 py-2 bg-red-50 border border-red-300 rounded-lg text-red-600 text-sm text-center">
            <p>{error}</p>

            {isLocked && (
              <button
                type="button"
                onClick={handleUnlockClick}
                className="mt-2 text-blue-600 font-semibold underline hover:text-blue-800"
              >
                Mở lại tài khoản
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <Input
              label="Email / Số điện thoại"
              type="text"
              placeholder="abc@gmail.com hoặc 09xxxxxxxx"
              value={account}
              onChange={setAccount}
              required
            />
          </div>

          <div className="mb-2">
            <Input
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={setPassword}
              required
            />
          </div>

          <div className="mb-3">
            <button
              type="button"
              className="block text-sm font-medium text-[#EE0F0F] flex justify-end cursor-pointer"
              onClick={formQMK}
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            onClick={primeAlarmAudio}
            type="submit"
            disabled={isLoading}
            className="w-full text-xl bg-[#FFD66D] text-black p-2 rounded-3xl hover:bg-[#EF960F] transition-colors font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <h5 className="mt-1 text-xl font-medium text-black flex justify-center gap-1">
            Chưa có tài khoản?
            <span className="text-[#1C5FE5] cursor-pointer" onClick={handleOnClick}>Đăng ký</span>
          </h5>
        </form>

      </div>
    </div>
  )
}