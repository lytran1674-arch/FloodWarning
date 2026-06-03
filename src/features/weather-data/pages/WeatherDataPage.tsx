import { useState } from "react";
import { useWeatherData } from "../hooks/useWeatherData";
import { CloudFog, FilterIcon, ImportIcon, Search } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { FaPlus } from "react-icons/fa";
import { IoReload } from "react-icons/io5";
import { Combobox } from "../../../components/ui/Combobox";
import { useAreaOptions } from "../../areas/hooks/useAreaOption";
import { Input } from "../../../components/ui/Input";
import { WeatherDataTable } from "../component/WeatherDataTable";

export const WeatherDataPage = () => {
  const { weatherdata, loading } = useWeatherData();

  const [selectedArea, setSelectedArea] = useState("");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const areaOption = useAreaOptions();

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <>
      {/* Header */}
      <div className="flex w-full justify-between">
        <div className="flex items-center gap-2 font-medium mt-5 ml-4 sm:ml-5 sm:mt-11 lg:mt-5">
          <CloudFog className="text-[#20458E] text-xs sm:text-sm lg:text-xl" />
          <p className="text-black text-xs sm:text-sm lg:text-xl font-medium">
            Quản lý dữ liệu thời tiết
          </p>
        </div>

        <div className="flex justify-end gap-1 lg:mr-3 mt-5 mr-2 text-xs lg:text-sm lg:gap-2">
          <Button
            type="button"
            className="border bg-[#FFC44A] p-1 rounded-md text-black font-medium sm:text-sm text-xs lg:text-xl w-30 h-8"
          >
            <FaPlus />
            Thêm dữ liệu
          </Button>

          <Button
            onClick={() => window.location.reload()}
            type="button"
            className="border border-[#31D239] bg-[#B1FBB5] p-1 rounded-md text-black font-medium sm:text-sm text-xs lg:text-xl w-30 h-8"
          >
            <IoReload />
            Cập nhật tự động
          </Button>

          <Button
            type="button"
            className="border border-[#E5E7EB] bg-white p-1 rounded-md text-black font-medium sm:text-sm text-xs lg:text-xl w-30 h-8"
          >
            <ImportIcon />
            Import excel
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="border border-[#E5E7EB] rounded-md bg-white mt-5 mx-3 sm:mx-5 p-4">
        <div className="grid grid-cols-3 lg:grid-cols-[180px_160px_160px_minmax(220px,1fr)_120px_120px] gap-3 items-end">

          {/* Khu vực */}
          <Combobox
            label="Khu vực"
            value={selectedArea}
            options={areaOption}
            placeholder="Chọn khu vực"
            onChange={setSelectedArea}
            containerClassName="w-full"
            labelClassName="h-5 text-sm font-medium"
            className="h-9 w-full text-sm"
          />

          {/* Từ ngày */}
          <div className="flex flex-col gap-1">
            <label className="h-5 text-sm font-medium text-black">Từ ngày</label>
            <Input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={setFromDate}
              containerClassName="mb-0"
              className="h-9 w-full border border-[#C9B8B8] rounded-md px-3 text-sm outline-none focus:border-[#20458E]"
            />
          </div>

          {/* Đến ngày */}
          <div className="flex flex-col gap-1">
            <label className="h-5 text-sm font-medium text-black">Đến ngày</label>
            <Input
              id="toDate"
              type="date"
              value={toDate}
              onChange={setToDate}
              containerClassName="mb-0"
              className="h-9 w-full border border-[#C9B8B8] rounded-md px-3 text-sm outline-none focus:border-[#20458E]"
            />
          </div>

          {/* Search */}
          <div className="flex flex-col gap-1">
            <label className="h-5 text-sm font-medium text-transparent">Tìm kiếm</label>
            <Input
              id="search"
              type="text"
              icon={Search}
              placeholder="Tìm kiếm khu vực..."
              value={search}
              onChange={setSearch}
              containerClassName="mb-0"
              className="h-9 w-full border border-[#C9B8B8] rounded-md px-4 py-2 outline-none focus:border-[#20458E]"
            />
          </div>

          {/* Button tìm kiếm */}
          <div className="flex flex-col gap-1">
            <label className="h-5 text-sm font-medium text-transparent">Button</label>
            <Button
              type="button"
              className="h-9 w-full text-sm text-white bg-[#1C5FE5] rounded-md whitespace-nowrap flex items-center justify-center"
            >
              Tìm kiếm
            </Button>
          </div>

          {/* Button bộ lọc */}
          <div className="flex flex-col gap-1">
            <label className="h-5 text-sm font-medium text-transparent">Button</label>
            <Button
              type="button"
              className="h-9 w-full text-sm text-black bg-white border border-black rounded-md whitespace-nowrap flex items-center justify-center gap-1"
            >
              <FilterIcon size={16} />
              Bộ lọc
            </Button>
          </div>

        </div>
      </div>

      {/* Table */}
      <div className="mx-3 sm:mx-5 mt-4">
        <WeatherDataTable data={weatherdata ?? []} />
      </div>
    </>
  );
};