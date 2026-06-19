import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

export function usePermission() {
  const user = useSelector(
    (state: RootState) => state.auth.user
  );

  const isLeader = user?.isLeader === true;

  return {
    canCreateGroup: isLeader,
    canAssignMember: isLeader,
    canViewAllGroups: isLeader,
  };
}