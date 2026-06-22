import { useMemo } from "react";
import { useArea } from "./useArea";

export const useAreaOptions = () => {
  const { areas } = useArea();

  return useMemo(() => {
    return areas.flatMap((area) =>
      (area.children || []).map((child) => ({
        label: child.tenkhuvuc,
        value: child.id,
        parent_id: area.id,
        parent_name: area.tenkhuvuc,
      }))
    );
  }, [areas]);
};