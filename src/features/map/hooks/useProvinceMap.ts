// features/map/hooks/useProvinceMap.ts
import { useEffect, useState } from "react";
import { areaService } from "../../areas/services/areaService";
import mapService from "../services/mapService";
import type { AreaWithRisk } from "../types/mapType";
import type { Area } from "../../areas/types/areaType";

interface ProvinceMapState {
  areas: AreaWithRisk[];
  loading: boolean;
  error: string | null;
}

const getAllLeafAreas = async (parentId: string): Promise<Area[]> => {
  const children = await areaService.getFilterChildren(parentId);
  if (!children || children.length === 0) return [];

  const nested = await Promise.all(
    children.map(async (child) => {
      const grandChildren = await areaService.getFilterChildren(child.id);
      if (!grandChildren || grandChildren.length === 0) return [child];
      return getAllLeafAreas(child.id);
    })
  );

  return nested.flat();
};

export const useProvinceMap = (
  provinceId: string | null,
  lead: 1 | 2 | 3 = 1          // ← thêm param
) => {
  const [state, setState] = useState<ProvinceMapState>({
    areas: [],
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!provinceId) return;

    const load = async () => {
      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        const leafAreas = await getAllLeafAreas(provinceId);

        const results = await Promise.allSettled(
          leafAreas.map(async (child) => {
            const [polygonResult, riskResult] = await Promise.allSettled([
              mapService.getPolygonById(child.id),
              mapService.getRiskByAreaId(child.id, lead), // ← truyền đúng
            ]);

            return {
              ...child,
              geometry:
                polygonResult.status === "fulfilled"
                  ? polygonResult.value?.geometry
                  : null,
              riskLevel:
                riskResult.status === "fulfilled"
                  ? riskResult.value
                  : "LOW",
            } as AreaWithRisk;
          })
        );

        const areas = results
          .filter(
            (r): r is PromiseFulfilledResult<AreaWithRisk> =>
              r.status === "fulfilled"
          )
          .map((r) => r.value)
          .filter((area) => area.geometry != null);

        setState({ areas, loading: false, error: null });
      } catch (err: any) {
        setState((s) => ({
          ...s,
          loading: false,
          error: err?.message ?? "Lỗi tải dữ liệu bản đồ",
        }));
      }
    };

    load();
  }, [provinceId, lead]); // ← thêm lead vào deps

  return state;
};