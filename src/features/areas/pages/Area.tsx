import { Import, MapIcon, Search } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { AreaTable } from "../components/AreaTable";
import { AreaTree } from "../components/AreaTree";
import { useArea } from "../hooks/useArea";

export const Area = () => {
  const { areas, loading } = useArea();
  const [search, setSearch] = useState("");

  const filteredAreas = areas.filter((area) =>
    area.tenkhuvuc.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <>
      <div className="flex w-full justify-between">
        <div className="flex justify-start gap-2 font-medium lg:mt-20 sm:ml-5 sm:mt-28 mt-24 ml-4">
          <MapIcon className="text-[#20458E] sm:text-sm text-xs lg:text-xl" />
          <p className="text-black text-sm sm:text-sm lg:text-xl font-medium">
            Quản lý khu vực
          </p>
        </div>

        <div className="flex justify-end gap-2 lg:mr-3 mt-24 mr-6">
          <Button
            type="button"
            className="border bg-[#FFC44A] p-1 rounded-md text-black font-medium sm:text-sm text-xs lg:text-xl w-30 h-8"
          >
            <FaPlus />
            Thêm khu vực
          </Button>

          <Button
            type="button"
            className="border border-[#31D239] bg-[#B1FBB5] p-1 rounded-md text-black font-medium w-30 h-8 sm:text-sm text-xs lg:text-xl"
          >
            <Import />
            Import excel
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
        <div className="w-[278px] bg-white rounded shadow p-3">
         

          <AreaTree areas={areas} />
        </div>

        <div className="flex-1 bg-white rounded shadow p-3 border-[#c2c3c5]">
         <Input
            type="text"
            icon={Search}
            placeholder="Tìm kiếm khu vực..."
            value={search}
            onChange={setSearch}
            className="w-full border rounded-md px-4 py-2 outline-none focus:border-blue-500"
          />
          <AreaTable data={filteredAreas} />
        </div>
      </div>
    </>
  );
};