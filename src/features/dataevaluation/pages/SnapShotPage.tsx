import { Button } from "antd";
import { DataEvaluationTable } from "../component/DataEvaluationTable";
import { Combobox } from "@/components/ui/Combobox";
import { useAreaOptions } from "@/features/areas/hooks/useAreaOption";
import { useDataEvalution } from "../hooks/useDataEvalution";
import { useState } from "react";
import { RiskScore } from "../component/RiskScore";
import { NotepadText } from "lucide-react";

export const SnapShotPage = () => {
  const [selectedArea, setSelectedArea] = useState(
    () => localStorage.getItem("selectedArea") ?? ""
  );

  const { data,handleSnapShot,chartData } = useDataEvalution(selectedArea);

  const areaOption = useAreaOptions();

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
    localStorage.setItem("selectedArea", value);
  };

  return (

    <div className="p-3 lg:p-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

        {/* Tiêu đề */}
        <div>
          <h1 className="text-xl lg:text-3xl font-bold">
            Dữ liệu đánh giá rủi ro
          </h1>

          <p className="text-xs lg:text-sm text-gray-500 mt-1">
            Đánh giá rủi ro ngập lụt dựa trên 15 bản tổng hợp gần nhất
          </p>
        </div>

        {/* Combobox + Button */}
        <div className="flex justify-between sm:flex-row items-center lg:ju sm:items-end lg:gap-3 gap-1 mb-5">

          <div className="min-w-[220px]">
            <Combobox
              label="Khu vực"
              value={selectedArea}
              options={areaOption}
              placeholder="Chọn khu vực"
              onChange={handleAreaChange}
              labelClassName="text-xs
               lg:text-base
               sm:text-sm"
              className="w-full
              lg:h-[40px]
              "
              
            />
          </div>

          <div className="flex flex-col ">
            <Button
              className="
            
                bg-red-500
                text-white
                h-6
                text-xs
                lg:h-9
                px-5
                sm:h-8
                mt-6
                lg:font-medium

              "
              onClick={handleSnapShot}
            >
              Đánh giá dữ liệu
            </Button>

           <p className="hidden lg:block text-[11px] text-gray-500 text-center mt-1 lg:-mb-7">
  Đánh giá thủ công (2 phút/lần)
</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className=" overflow-x-auto lg:mt-8 sm:mt-8">
        <DataEvaluationTable data={data ? [data] : []} />
      </div>

     {/* MAIN CONTENT */}

<div className="
grid
grid-cols-1
xl:grid-cols-3
gap-5
">



{/* CHART */}

<div className="
xl:col-span-2
w-full
">

<RiskScore

data={chartData}

/>

</div>





{/* INFO */}

<div className="
border
border-[#E5E7EB]
rounded-md
p-4
space-y-4
">


<p className="
font-semibold
">

Thông tin đánh giá

</p>



<InfoItem>

Đánh giá dựa trên

<br/>

15 bản tổng hợp mực nước gần nhất

</InfoItem>



<InfoItem>

Chu kỳ đánh giá

<br/>

2 phút/lần (thủ công)

</InfoItem>




<InfoItem>

Mô hình AI

<br/>

LSTM + XGBoost

</InfoItem>




<InfoItem>

Ghi chú

<br/>

AI xem xét 15 bản tổng hợp để đánh giá rủi ro

</InfoItem>



</div>



</div>



</div>

  );
};





const InfoItem=({
children
}:{
children:React.ReactNode
})=>{


return (

<div className="
flex
gap-2
items-start
text-xs
text-gray-600
">


<NotepadText
size={18}
className="shrink-0"
/>


<p>
{children}
</p>

    </div>
  );
};