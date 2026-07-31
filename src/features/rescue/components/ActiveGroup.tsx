
import { useAppSelector } from "@/hooks/redux.hooks";
import { useResCue } from "../hooks/useResCue";
import type { ResGroup } from "../types/rescueType";


type Props = {
  group: ResGroup;
  onSuccess?: () => void;
};

export const ActiveGroup = ({ group, onSuccess }: Props) => {
    const user=useAppSelector((state)=>state.auth.user);
    const isGroupLeader=user?.isGroupLeader==true;
  const { updateStatusGroup, loading } = useResCue("");

  const enabled = group.status !== "OFFLINE";

  // OFFLINE -> AVAILABLE
  const handleRepair = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    try {
      await updateStatusGroup(group.id);
      onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };



  if (group.status === "OFFLINE") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="font-semibold text-red-600">
          Đang hỏng
        </p>

        <button
          disabled={loading}
          onClick={handleRepair}
          className="mt-3 w-full rounded-lg bg-red-600 py-2 text-white"
        >
          Đã sửa xong
        </button>
      </div>
    );
  }

  return (
    <>
  {isGroupLeader&&(
    <div className="flex items-center justify-between rounded-xl border p-4">
      <span className="font-medium">
        {enabled ? "Đang hoạt động" : "Không hoạt động"}
      </span>

      <button
   
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all ${
          enabled ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white transition-all ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
)}
          </>
  );

};