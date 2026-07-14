import { useState } from "react"
import { FAILEDREASONOPTIONS, getFailedReasonOption, type FailedReason } from "../constants/FailedReason"
import { useSoSAssignment } from "../hooks/useSoSAssignment"
import { TriangleAlert } from "lucide-react"
import { Combobox } from "@/components/ui/Combobox"

interface Props{
    isOpen:boolean
    assignmentId:string
    onClose:()=>void
    onSuccess?:(reason:FailedReason)=>void
}
export const ModalFailedAssigment = ({isOpen,assignmentId,onClose,onSuccess}:Props) => {
    const {failed,loading,error,FailedAssignment}=useSoSAssignment();
    const [reason, setReason]=useState<FailedReason | "">("");
    const [note, setNote]=useState("")
    const [formerror,setFormError]=useState("")

    if(!isOpen) return null;

    const selectedOption=reason?getFailedReasonOption(reason):undefined
    const noteRequired=!selectedOption?.requiredNote

    const resetAndClose=()=>{
        setReason("");
        setNote("")
        setFormError("")
        onClose()
    }

    const handleSubmit=async()=>{
        if(!reason){
            setFormError("Vui lòng chọn lý do thất bại")
            return;
        }
        if(noteRequired && !note.trim()){
            setFormError("Vui lòng nhập ghi chú cho lý do khác ")
                return;
        }
        setFormError("")
        const success= await FailedAssignment(assignmentId,reason,note.trim())

        if(success){
            onSuccess?.(reason)
            resetAndClose();
        }
    }

  return (
    <div>
        <div className="lg:flex lg:justify-start lg:items-center lg:gap-2">
            <div className="bg-red-300 rounded-full lg:p-2">
                <TriangleAlert className="text-red-500 lg:w-8 lg:h-8"/>
                </div>
                <p>Báo cáo nhiệm vụ thất bại</p>
        </div>
         <div className="lg:flex lg:justify-start lg:items-center lg:gap-2">
            <TriangleAlert className="text-red-500"/>
            <div className="lg:flex-col lg:space-y-1 rounded-md border border-red-500 bg-red-300">
                <p className="lg:text-sm text-xs text-red-500">Xác nhận báo cáo thất bại</p>
                <span className="lg:text-xs text-red-800">Sau khi xác nhận, nhiệm vụ này sẽ được đánh dấu là THẤT BẠI 
                    và thông tin sẽ được gửi đến đội trưởng
                </span>
            </div>
            </div>
             {/* Lý do thất bại */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Lý do thất bại <span className="text-red-500">*</span>
          </label>
          <div className="mt-2 space-y-2">
            {FAILEDREASONOPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                  reason === option.value
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="failedReason"
                  value={option.value}
                  checked={reason === option.value}
                  onChange={() => setReason(option.value)}
                  className="h-4 w-4 text-red-500 focus:ring-red-400"
                />
                <span className="text-gray-800">{option.label}</span>
                <span className="ml-auto text-xs text-gray-400">
                  → {option.resultingGroupStatus}
                </span>
              </label>
            ))}
          </div>
        </div>
            <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Ghi chú {noteRequired && <span className="text-red-500">*</span>}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Mô tả thêm về sự cố (nếu có)..."
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
          />
        </div>
 
        {(formerror || error) && (
          <p className="mt-3 text-sm text-red-600">{formerror || error}</p>
        )}
 
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={resetAndClose}
            disabled={loading}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Đang gửi..." : "Xác nhận báo thất bại"}
          </button>
        </div>
      </div>


  )
}
