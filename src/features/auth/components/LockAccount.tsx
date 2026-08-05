import { Lock, Loader2 } from 'lucide-react'
import { useState }      from 'react'
import { authService }   from '../services/authService'
import { toast }         from 'react-toastify'
import { useNavigate }   from 'react-router-dom'
import { useAppSelector } from '@/hooks/redux.hooks'

export const LockAccount = () => {
  const [loading,  setLoading]  = useState(false)
  const user=useAppSelector((state)=>state.auth.user)
  const citizen=user?.role==="CITIZEN"
  const navigate = useNavigate()
    console.log("AccessToken:", localStorage.getItem("accessToken"))
console.log("User:", localStorage.getItem("user"))
  const handleLockAccount = async () => {
    const confirmed = window.confirm("Bạn có chắc muốn khóa tài khoản không?")
    if (!confirmed) return

    try {
      setLoading(true)
      await authService.lockAccount()
      localStorage.clear()
      toast.success("Khóa tài khoản thành công")
      navigate("/")
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.message ?? "Có lỗi xảy ra!")
    } finally {
      setLoading(false)
    }
  }


  return (
    <>
    {citizen&&(
    <div>
      <button
        type="button"
        onClick={handleLockAccount}
        disabled={loading}
        className="flex shrink-0 justify-center gap-2 items-center
          bg-neutral-500 hover:bg-neutral-300 text-white font-medium rounded-lg
          px-3 py-2 lg:px-5 lg:py-2.5
          text-xs lg:text-sm shadow-sm
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <Lock    className="w-4 h-4" />
        }
        <p>{loading ? "Đang khóa..." : "Khóa tài khoản"}</p>
      </button>
    </div>

    )
    }
    </>
  )
}