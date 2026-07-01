import {
  GlassWaterIcon,
  TriangleAlert,
  Waves,
} from "lucide-react";

import { useDataEvalution } from "@/features/dataevaluation/hooks/useDataEvalution";

interface Props {
  areaId: string;
}

export const PredictCard = ({ areaId }: Props) => {

  const {
    data: snapshot,
    loading,
  } = useDataEvalution(areaId);

  const cards = [
    {
      title: "Rủi ro ngập lụt",
      value: snapshot?.riskLevel || "--",
      sub: "Mức độ khu vực",
      icon: GlassWaterIcon,
      color: "text-blue-700",
      bg: "hover:bg-blue-500",
      iconBg: "bg-blue-100",
      border: "border-[#E5E7EB]",
    },

    {
      title: "Xác suất",
      value: snapshot?.predictionProbaility
        ? `${(snapshot.predictionProbaility * 100).toFixed(1)}%`
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
      value: snapshot?.waterRiseRatePerMinute
        ? `${snapshot.waterRiseRatePerMinute} cm/phút`
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
    return (
      <div className="p-4 text-sm text-slate-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div
      className="
      grid
      grid-cols-1
      md:grid-cols-2
      lg:grid-cols-3
      gap-4
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
            p-4
            shadow-sm
            transition-all
            duration-300
            hover:shadow-lg
            hover:-translate-y-1
            ${card.bg}
            `}
          >

            {/* glow */}
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

              <div>

                <p
                  className="
                  text-sm
                  text-slate-500
                  group-hover:text-white
                  transition-colors
                  "
                >
                  {card.title}
                </p>

                <h2
                  className={`
                  mt-2
                  text-3xl
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
                  text-xs
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
                w-12
                h-12
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