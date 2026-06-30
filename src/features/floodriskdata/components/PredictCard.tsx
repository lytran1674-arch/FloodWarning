import type { SnapShot } from "@/features/dataevaluation/types/dataevaluationType";
import {
  GlassWaterIcon,
  TriangleAlert,
  Waves,
} from "lucide-react";

import { useEffect } from "react";
import { useFloodRiskData } from "../hooks/useFloodRiskData";
import { useDataEvalution } from "@/features/dataevaluation/hooks/useDataEvalution";
import { data } from "react-router-dom";

interface Props {
  areaId: string;
}

export const PredictCard = ({ areaId }: Props) => {

 const {data:SnapShot}=useDataEvalution(areaId)

 

  const cards = [
    {
      title: "Rủi ro ngập lụt",
      value: data?. || "--",
      sub: "Mức độ khu vực",
      icon: GlassWaterIcon,
      color: "text-blue-700",
      bg: "hover:bg-blue-500",
      iconBg: "bg-blue-100",
      border: "border-[#E5E7EB]",
    },

    {
      title: "Xác suất",
      value: floodRiskData?.predictionProbability
        ? `${(floodRiskData.predictionProbability * 100).toFixed(1)}%`
        : "--",
      sub: "Khả năng xảy ra",
      icon: TriangleAlert,
      color: "text-red-600",
      bg: "hover:bg-red-500",
      iconBg: "bg-red-100",
      border: "border-[#E5E7EB]",
    },

    {
      title: "Tốc độ mực nước",
      value: floodRiskData?.waterRiseRatePerMinute
        ? `${floodRiskData.waterRiseRatePerMinute} cm/phút`
        : "--",
      sub: "Mực nước tăng",
      icon: Waves,
      color: "text-yellow-600",
      bg: "hover:bg-yellow-500",
      iconBg: "bg-yellow-100",
      border: "border-[#E5E7EB]",
    },
  ];

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div
      className="
      grid
      grid-cols-2
      lg:grid-cols-3
      gap-3
      lg:gap-5
      px-2
      lg:px-5
      py-2
      "
    >
      {cards.map((card, index) => {

        const Icon = card.icon;

        return (
          <div
            key={index}
            className={`
            group
            relative
            overflow-hidden
            rounded-2xl
            border
            ${card.border}
            bg-white
            p-3
            lg:p-4
            shadow-sm
            transition-all
            duration-300
            hover:shadow-lg
            hover:-translate-y-1
            ${card.bg}
            `}
          >

            <div
              className={`
              absolute
              -top-8
              -right-8
              w-24
              h-24
              rounded-full
              opacity-10
              blur-2xl
              ${card.iconBg}
              `}
            />

            <div className="relative flex items-start justify-between">

              <div className="min-w-0">

                <p
                  className="
                  text-[11px]
                  lg:text-sm
                  text-slate-500
                  group-hover:text-white
                  transition-colors
                  truncate
                  "
                >
                  {card.title}
                </p>

                <h2
                  className={`
                  mt-2
                  text-xl
                  lg:text-3xl
                  font-bold
                  ${card.color}
                  group-hover:text-white
                  transition-colors
                  `}
                >
                  {card.value}
                </h2>

                <p
                  className="
                  mt-1
                  text-[10px]
                  lg:text-xs
                  text-slate-400
                  group-hover:text-white/80
                  transition-colors
                  "
                >
                  {card.sub}
                </p>

              </div>

              <div
                className={`
                flex
                items-center
                justify-center
                w-10
                h-10
                lg:w-12
                lg:h-12
                rounded-xl
                ${card.iconBg}
                group-hover:bg-white/20
                transition-colors
                `}
              >

                <Icon
                  className={`
                  ${card.color}
                  group-hover:text-white
                  transition-colors
                  `}
                  size={22}
                />

              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
};