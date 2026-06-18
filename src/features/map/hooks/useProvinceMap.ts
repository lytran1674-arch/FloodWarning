// features/map/hooks/useProvinceMap.ts
import { useEffect, useState } from "react";
import { areaService } from "../../areas/services/areaService";
import mapService from "../services/mapService";
import type { AreaWithRisk } from "../types/mapType";

interface ProvinceMapState {
  areas: AreaWithRisk[];
  loading: boolean;
  error: string | null;
}

export const useProvinceMap = (
  provinceId: string | null,
  lead: 1 | 2 | 3 = 1
) => {
  const [state, setState] = useState<ProvinceMapState>({
    areas: [],
    loading: false,
    error: null,
  });


  useEffect(() => {
    if (!provinceId) return;


    const load = async () => {
      setState((s) => ({
        ...s,
        loading: true,
        error: null,
      }));

      try {

        // chỉ gọi API bằng tỉnh
        const areasByProvince =
          await areaService.getFilterChildren(provinceId);


        const results = await Promise.allSettled(
          areasByProvince.map(async (area) => {

            const [polygonResult, riskResult] =
              await Promise.allSettled([
                mapService.getPolygonById(area.id),
                mapService.getRiskByAreaId(area.id, lead),
              ]);


            const geometry =
              polygonResult.status === "fulfilled"
                ? polygonResult.value?.geometry
                : null;


           const riskLevel =
  riskResult.status === "fulfilled"
    ? riskResult.value
    : "LOW";

            console.log("AREA MAP:", {
              id: area.id,
              name: area.tenkhuvuc,
              geometry,
              riskLevel,
            });


            return {
              ...area,
              geometry,
              riskLevel,
            } as AreaWithRisk;

          })
        );


        const areas = results
          .filter(
            (r): r is PromiseFulfilledResult<AreaWithRisk> =>
              r.status === "fulfilled"
          )
          .map((r) => r.value);


        console.log("FINAL MAP AREAS:", areas);


        setState({
          areas,
          loading: false,
          error: null,
        });


      } catch (err: any) {

        console.error(err);

        setState({
          areas: [],
          loading: false,
          error: err?.message ?? "Lỗi tải dữ liệu bản đồ",
        });

      }
    };


    load();

  }, [provinceId, lead]);


  return state;
};