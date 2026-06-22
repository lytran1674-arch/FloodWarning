// // features/map/hooks/useProvinceMap.ts

// import { useEffect, useState } from "react";
// import { areaService } from "../../areas/services/areaService";
// import mapService from "../services/mapService";
// import type { AreaWithRisk } from "../types/mapType";

// interface ProvinceMapState {
//   areas: AreaWithRisk[];
//   loading: boolean;
//   error: string | null;
// }

// export const useProvinceMap = (
//   provinceId: string | null,
//   lead: 1 | 2 | 3 = 1,
//   selectedAreaId?: string
// ) => {

//   const [state, setState] = useState<ProvinceMapState>({
//     areas: [],
//     loading: false,
//     error: null,
//   });

//   useEffect(() => {

//     if (!provinceId) return;

//     const load = async () => {

//       setState((s) => ({
//         ...s,
//         loading: true,
//         error: null,
//       }));

//       try {

//         let parentId = provinceId;

//         // =====================================================
//         // nếu chọn combobox
//         // lấy khu vực con -> lấy cha
//         // =====================================================

//         if (selectedAreaId) {

//           const selectedArea =
//             await areaService.getById(selectedAreaId);

//           if (selectedArea?.parent_id) {
//             parentId = selectedArea.parent_id;
//           }
//         }

//         // =====================================================
//         // load area theo cha
//         // =====================================================

//         const areasByProvince =
//           await areaService.getFilterChildren(parentId);

//         const results = await Promise.allSettled(

//           areasByProvince.map(async (area) => {

//             const [polygonResult, riskResult] =
//               await Promise.allSettled([
//                 mapService.getPolygonById(area.id),
//                 mapService.getRiskByAreaId(area.id, lead),
//               ]);

//             const geometry =
//               polygonResult.status === "fulfilled"
//                 ? polygonResult.value?.geometry
//                 : null;

//             const riskLevel =
//               riskResult.status === "fulfilled"
//                 ? riskResult.value
//                 : "LOW";

//             return {
//               ...area,
//               geometry,
//               riskLevel,
//             } as AreaWithRisk;

//           })
//         );

//         const areas = results
//           .filter(
//             (
//               r
//             ): r is PromiseFulfilledResult<AreaWithRisk> =>
//               r.status === "fulfilled"
//           )
//           .map((r) => r.value);

//         setState({
//           areas,
//           loading: false,
//           error: null,
//         });

//       } catch (err: any) {

//         console.error(err);

//         setState({
//           areas: [],
//           loading: false,
//           error:
//             err?.message ??
//             "Lỗi tải dữ liệu bản đồ",
//         });

//       }
//     };

//     load();

//   }, [provinceId, lead, selectedAreaId]);

//   return state;
// };

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
  parentId: string | null,
  lead: 1 | 2 | 3 = 1
) => {

  const [state, setState] =
    useState<ProvinceMapState>({
      areas: [],
      loading: false,
      error: null,
    });

  useEffect(() => {

    if (!parentId) return;

    const load = async () => {

      setState((s) => ({
        ...s,
        loading: true,
        error: null,
      }));

      try {

        // load toàn bộ con của cha

        const areasByProvince =
          await areaService.getFilterChildren(
            parentId
          );

        const results = await Promise.allSettled(

          areasByProvince.map(async (area) => {

            const [
              polygonResult,
              riskResult,
            ] = await Promise.allSettled([
              mapService.getPolygonById(area.id),
              mapService.getRiskByAreaId(
                area.id,
                lead
              ),
            ]);

            const geometry =
              polygonResult.status === "fulfilled"
                ? polygonResult.value?.geometry
                : null;

            const riskLevel =
              riskResult.status === "fulfilled"
                ? riskResult.value
                : "LOW";

            return {
              ...area,
              geometry,
              riskLevel,
            } as AreaWithRisk;

          })
        );

        const areas = results
          .filter(
            (
              r
            ): r is PromiseFulfilledResult<AreaWithRisk> =>
              r.status === "fulfilled"
          )
          .map((r) => r.value);

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
          error:
            err?.message ??
            "Lỗi tải dữ liệu bản đồ",
        });

      }
    };

    load();

  }, [parentId, lead]);

  return state;
};