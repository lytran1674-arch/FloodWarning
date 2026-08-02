import { useAppSelector } from "@/hooks/redux.hooks";
import { useResCue } from "../hooks/useResCue";
import type { ResGroup } from "../types/rescueType";

type Props = {
  group: ResGroup;
  onSuccess?: () => void;
};

export const ActiveGroup = ({ group, onSuccess }: Props) => {
  const user = useAppSelector((state) => state.auth.user);
  const isGroupLeader = user?.isGroupLeader === true;

  const { updateStatusGroup, loading } = useResCue("");

  const enabled = group.status !== "OFFLINE";

  const handleToggle = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();

    if (loading) return;

    try {
      await updateStatusGroup(group.id);
      await onSuccess?.();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isGroupLeader) return null;

  return (
 
    
    <div className="flex justify-end ">
      <button
        type="button"
        disabled={loading}
        onClick={handleToggle}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${
          enabled ? "bg-blue-600" : "bg-gray-300"
        } ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-300 ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      </div>

  );
};