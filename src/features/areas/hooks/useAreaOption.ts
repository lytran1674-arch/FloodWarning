import { useMemo } from "react";
import { useArea } from "../../areas/hooks/useArea";

export const useAreaOptions = () => {
  const { areas } = useArea();

  return useMemo(
    () =>
      areas.map((area) => ({
        label: area.tenkhuvuc,
        value: area.id,
      })),
    [areas]
  );
};