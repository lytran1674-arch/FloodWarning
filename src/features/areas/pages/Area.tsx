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
import { useState } from "react";

export const Area = () => {
  const { areas } = useArea(); // chỉ lấy areas gốc cho cây
  const [selectedArea, setSelectedArea] = useState<any>(null);
const { keyword, setKeyword, result: tableData, searching } = useSearch(
  areaService.getSearchArea,
  areas,
);
  const handleSelectFromTree = () => {
  //  try {
  //   const data = await areaService.getSearchArea(area.tenkhuvuc);
  //   const found = data.find((a) => a.id === area.id);
  //   setTableData(found ? [found] : []);
  //   setKeyword("");
  // } catch {
  //   toast.error("Lỗi tải dữ liệu");
  // }
};

  const handleSelectArea = async (area: any) => {
    try {
      const res = await fetch(`/api/area/polygon-by-id?id=${area.id}`);
      const polygon = await res.json();
      setSelectedArea({ ...area, geometry: polygon.geometry });
    } catch (error) {
      console.error("Lỗi lấy polygon:", error);
    }
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

        <div className="flex justify-end gap-2 lg:mr-3 mt-10 mr-6">
          <Button
            type="button"
            className="border bg-[#FFC44A] p-1 rounded-md text-black font-medium sm:text-sm text-xs lg:text-xl w-30 h-8"
          >
            <FaPlus />
            Thêm khu vực
          </Button>

          <Button
            onClick={() => window.location.reload()}
            type="button"
            className="border border-[#E5E7EB] bg-white p-1 rounded-md text-black font-medium w-30 h-8"
          >
            <IoReload />
          </Button>
        </div>
      </div>

      <div className="flex justify-start gap-4 p-4">
        {/* Cây dùng areas gốc, không bị ảnh hưởng bởi search */}
        <div className="w-[278px] bg-white rounded shadow p-3">
          <AreaTree areas={areas} onSelect={handleSelectFromTree}/>
        </div>

        <div className="flex-1 bg-white rounded shadow p-3 border-[#c2c3c5]">
          <SearchBar value={keyword} onChange={setKeyword}  />

          {searching && (
            <p className="text-sm text-gray-400 animate-pulse py-1">Đang tìm kiếm...</p>
          )}

          {/* Bảng dùng tableData riêng */}
          <AreaTable data={tableData ?? []} onRowClick={handleSelectArea} />

          <p className="mt-4 mb-2 font-medium">
            Vị trí trên bản đồ{" "}
            {selectedArea && (
              <span className="text-blue-600">- {selectedArea.tenkhuvuc}</span>
            )}
          </p>

          <GeoMap
            defaultCenter={[10.7769, 106.7009]}
            defaultZoom={15}
            height="500px"
            selectedGeometry={selectedArea?.geometry}
            selectedName={selectedArea?.tenkhuvuc}
          />
        </div>
      </div>
    </>
  );
};