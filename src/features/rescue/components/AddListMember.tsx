import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useGroup } from "../hooks/useGroup";
import type { ListMembers } from "../types/grouptype";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type Props = {
  groupId: string;
  members: ListMembers[];
  onAdded: (newMembers: ListMembers[]) => void;
};

export const AddListMember = ({
  groupId,
  members,
  onAdded,
}: Props) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigate=useNavigate();
  const { AddMembersGroup } = useGroup();

  const toggleMember = (userId: string) => {
    setSelectedIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

const handleSubmit = async () => {
  try {
    const newMembers = await AddMembersGroup(groupId, {
      userIds: selectedIds,
    });

    onAdded(newMembers);
    toast.success("Thêm thành viên vào nhóm thành công");
    setSelectedIds([]);
    navigate(-1);

  } catch (err: any) {
    const code = err?.response?.data?.code ?? err?.code;
    const message = err?.response?.data?.message ?? err?.message;

    if (code === 2003) {
      toast.warning("Nhóm đã đạt giới hạn số lượng thành viên tối đa!");
    
    } else {
      console.error(err);
      toast.error(message ?? "Có lỗi xảy ra, vui lòng thử lại.");
    }
  }
};
const handleQuaylai=()=>{
    navigate(-1);
}

  return (
    <div className="lg:m-5">
        <div className="flex justify-start items-center lg:gap-3 gap-1">
            <ArrowLeft className="text-black" onClick={handleQuaylai}/>
        <p className="text-xl lg:text-2xl font-medium text-black">Thêm thành viên</p>
        </div>
    <div className="space-y-4 lg:mt-5 mt-2">
      <div className="max-h-80 space-y-2 overflow-y-auto text-black">
        {members.map((member) => {
          const checked = selectedIds.includes(member.userId);

          return (
            <button
              key={member.userId}
              type="button"
              onClick={() => toggleMember(member.userId)}
              className={`flex w-full items-center justify-between rounded-xl border p-3 transition
                ${
                  checked
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
            >
              <div className="text-left">
                <p className="font-medium">{member.fullName}</p>
                <p className="text-sm text-gray-500">{member.phone}</p>
              </div>

              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border
                  ${
                    checked
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-300"
                  }`}
              >
                {checked && <Check size={16} className="text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={selectedIds.length === 0}
        className="w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        Thêm {selectedIds.length > 0 && `(${selectedIds.length})`}
      </button>
    </div>
    </div>
  );
};