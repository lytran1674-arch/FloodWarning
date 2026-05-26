import React, { useState } from 'react'
import ImageLogin from "../../../assets/nenlogin.png"
import { Input } from '../../../components/ui/Input';
import { useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/authApi';
import { setCredentials } from '../store/authSlice';
import type { AppDispatch } from '../../../app/store';

export const LoginForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error,setError]=useState("")
    const dispatch=useDispatch<AppDispatch>();
    const navigate=useNavigate();
   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu!")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const res = await authAPI.login({ email, password })
    //  const { user, accessToken } = res.data
        const data=res.data
      // ← lưu vào Redux
      dispatch(setCredentials({ user:data, accessToken:"" }))

      // ← navigate theo role
      switch (data?.role) {
        case "admin":   navigate("/areas-management"); break
        case "rescuer": navigate("/home");             break
        case "user":    navigate("/home");             break
        default:        navigate("/")
      }

    } catch (err: any) {
      setError(err.response?.data?.message ?? "Email hoặc mật khẩu không đúng!")
    } finally {
      setIsLoading(false)
    }
  }

    return (
        // Container cha: full màn hình, flex để canh giữa
        <div className=" flex items-center justify-center overflow-hidden p-0 m-0">
            
            {/* Form đăng nhập */}
            <div className="overflow-hidden bg-white border border-blue-500 rounded-lg w-full max-w-md p-5 shadow-lg">
                
                {/* Ảnh login - sửa: h-auto để ảnh tự động theo kích thước thật */}
                <img 
                     src={ImageLogin}
                    className="w-full h-auto rounded-lg " 
                    alt="Login"
                />
                
                {/* Tiêu đề */}
                <h2 className="text-xl md:text-2xl font-bold text-center mb-2 text-gray-800">
                    HỆ THỐNG CẢNH BÁO VÀ CỨU HỘ LŨ LỤT
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="mb-2">
                       <Input
                                   label="Họ và tên"
                                   type="text"
                                   placeholder="Trần Văn A"
                                   value={email}
                                   onChange={setEmail}
                                   required
                                 />
                               
                                 
                    </div>

                    {/* Mật khẩu */}
                    <div className="mb-2">
                        <Input
                                   label="Mật khẩu"
                                   type="password"
                                   value={password}
                                   onChange={setPassword}
                                   required
                                 />
                    </div>
                          <div className='mb-3'>
                            <label className='block text:sm  font-medium text-[#EE0F0F] flex items-center justify-end'>Quên mật khẩu?</label>
                          </div>
                    {/* Nút đăng nhập */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full text-xl bg-[#FFD66D] text-black p-2 rounded-3xl hover:bg-[#EF960F] transition-colors font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                    <h5 className='mt-1 text:xl font-medium text-black flex justify-center'>Chưa có tài khoản?  <u className='text-[#1C5FE5]'>Đăng ký</u></h5> 
                   
                </form>
            </div>
        </div>
    )
}