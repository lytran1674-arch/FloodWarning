import { useEffect, useState } from "react";
import { useWeatherData } from "../hooks/useWeatherData";
import { CloudFog, FilterIcon } from "lucide-react";
import { Button } from "../../../components/ui/Button";

import { IoReload } from "react-icons/io5";
import { Combobox } from "../../../components/ui/Combobox";
import { useAreaOptions } from "../../areas/hooks/useAreaOption";
import { Input } from "../../../components/ui/Input";
import { WeatherDataTable } from "../component/WeatherDataTable";
import { WeatherDataChart } from "../component/WeatherDataChart";
import type { Weather_datas } from "../types/weatherdataType";

export const WeatherDataPage = () => {
  const [selectedArea, setSelectedArea] = useState(
    () => localStorage.getItem("selectedArea") ?? ""
  );

  const {
    weatherdata,
    loading,
    FilterByArea,
    FilterByTime,
    FilterByTimeAndArea,
    error,
  } = useWeatherData(selectedArea);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Lỗi validate ở phía client (khác với `error` trả về từ API trong hook)
  const [formError, setFormError] = useState("");

  // Dữ liệu thực sự hiển thị ra bảng/biểu đồ: mặc định là weatherdata theo khu vực,
  // sau khi bấm "Bộ lọc" sẽ chuyển sang kết quả đã lọc.
  const [displayData, setDisplayData] = useState<Weather_datas[]>([]);

  const areaOption = useAreaOptions();

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
    localStorage.setItem("selectedArea", value);
  };

  // Khi đổi khu vực (tức weatherdata load lại), reset về dữ liệu chưa lọc theo ngày
  useEffect(() => {
    setDisplayData(weatherdata);
  }, [weatherdata]);

  const handleFilter = async () => {
    const hasArea = !!selectedArea;
    const hasFrom = !!fromDate;
    const hasTo = !!toDate;

    // Nhập 1 trong 2 ngày mà thiếu ngày còn lại -> báo lỗi ngay, không cho lọc lơ lửng
    if (hasFrom !== hasTo) {
      setFormError("Vui lòng nhập đủ cả Từ ngày và Đến ngày!");
      return;
    }

    const hasDateRange = hasFrom && hasTo;

    if (!hasArea && !hasDateRange) {
      setFormError("Vui lòng nhập đủ các điều kiện!");
      return;
    }

    setFormError("");

    if (hasArea && hasDateRange) {
      const res = await FilterByTimeAndArea(fromDate, selectedArea, toDate);
      setDisplayData(res ?? []);
    } else if (hasDateRange) {
      const res = await FilterByTime(fromDate, toDate);
      setDisplayData(res ?? []);
    } else if (hasArea) {
      const res = await FilterByArea(selectedArea);
      setDisplayData(res ?? []);
    }
  };

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
            onClick={() => window.location.reload()}
            type="button"
            className="border border-[#31D239] bg-[#B1FBB5] p-1 rounded-md text-black font-medium sm:text-sm text-xs lg:text-xl w-30 h-8"
          >
            <IoReload />
            Cập nhật tự động
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
            onChange={handleAreaChange}
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

          {/* Button bộ lọc */}
          <div className="flex flex-col gap-1">
            <label className="h-5 text-sm font-medium text-transparent">Button</label>
            <Button
              type="button"
              onClick={handleFilter}
              className="h-9 w-full text-sm text-black bg-white border border-black rounded-md whitespace-nowrap flex items-center justify-center gap-1"
            >
              <FilterIcon size={16} />
              Bộ lọc
            </Button>
          </div>
        </div>

        {(formError || error) && (
          <p className="mt-2 text-xs text-red-600">{formError || error}</p>
        )}
      </div>

      {/* Table */}
      <div className="mx-3 sm:mx-5 mt-4">
        <WeatherDataTable data={displayData} />
      </div>
      <WeatherDataChart weatherdata={displayData} />
    </>
  );
};