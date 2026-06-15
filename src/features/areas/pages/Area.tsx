import { MapIcon } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import { Button } from "../../../components/ui/Button";
import { AreaTable } from "../components/AreaTable";
import { AreaTree } from "../components/AreaTree";
import { useArea } from "../hooks/useArea";
import { areaService } from "../services/areaService";
import GeoMap from "../../map/components/GeoMap";
import { SearchBar } from "../../../components/ui/SearchBar";
import { useSearch } from "../../../hooks/useSearch";
import { useState, useMemo } from "react";
import useGeolocation from "../../map/hooks/useGeolocation";
import { useAreaPolygon } from "../../map/hooks/usePolygon";
import type { AreaTree as AreaTreeType } from "../types/areaType"; // chỉnh đúng path/type name

export const Area = () => {
  const { areas } = useArea(); // chỉ lấy areas gốc cho cây

  const { keyword, setKeyword, result: tableData, searching } = useSearch(
    areaService.getSearchArea,
    areas,
  );

  const [areaId, setAreaId] = useState<string>("");
  const geo = useGeolocation();
  const { polygon } = useAreaPolygon(areaId);

  // Tìm thông tin khu vực đang chọn (tenkhuvuc, lat, lon) từ areas (cây gốc)
  const selectedArea = useMemo(() => {
    if (!areaId || !areas) return null;

    const findInTree = (nodes: AreaTreeType[]): AreaTreeType | null => {
      for (const node of nodes) {
        if (node.id === areaId) return node;
        if (node.children?.length) {
          const found = findInTree(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findInTree(areas);
  }, [areaId, areas]);

  // Khi chọn khu vực từ cây
  const handleSelectFromTree = (area: AreaTreeType) => {
    setAreaId(area.id);
  };

  // Khi click vào một dòng trong bảng kết quả search
  const handleRowClick = (row: AreaTreeType) => {
    setAreaId(row.id);
  };

  return (
    <>
      <div className="flex w-full justify-between">
        <div className="flex justify-start gap-2 font-medium lg:mt-10 sm:ml-5 sm:mt-28 mt-10 ml-4">
          <MapIcon className="text-[#20458E] sm:text-sm text-xs lg:text-xl" />
          <p className="text-black text-sm sm:text-sm lg:text-xl font-medium">
            Quản lý khu vực
          </p>
        </div>

        <div className="flex justify-end gap-2 lg:mr-3 mt-10 mr-10">
          <Button
            onClick={() => window.location.reload()}
            type="button"
            className="border border-[#E5E7EB] bg-white p-1 rounded-md text-black font-medium w-20 h-8 "
          >
            <IoReload />
          </Button>
        </div>
      </div>

      <div className="flex justify-start gap-4 p-4">
        <div className="w-[278px] bg-white rounded shadow p-3">
          <AreaTree areas={areas} onSelect={handleSelectFromTree} />
        </div>

        <div className="flex-1 bg-white rounded shadow p-3 border-[#c2c3c5]">
          <SearchBar value={keyword} onChange={setKeyword} />

          {searching && (
            <p className="text-sm text-gray-400 animate-pulse py-1">Đang tìm kiếm...</p>
          )}

          <AreaTable data={tableData ?? []} onRowClick={handleRowClick} />

          <p className="mt-4 mb-2 font-medium">
            Vị trí trên bản đồ{" "}
            {selectedArea && (
              <span className="text-blue-600">- {selectedArea.tenkhuvuc}</span>
            )}
          </p>

        <GeoMap
  defaultCenter={
    selectedArea && selectedArea.lat != null && selectedArea.lon != null
      ? [selectedArea.lat, selectedArea.lon]
      : [10.7769, 106.7009]
  }
  defaultZoom={selectedArea ? 9 : 6}
 className="lg:h-[500px] sm:h-[350px] h-[300px] w-[550px] lg:w-full"
  selectedGeometry={polygon?.geometry}
  selectedName={selectedArea?.tenkhuvuc}
/>
        </div>
      </div>
    </>
  );
};