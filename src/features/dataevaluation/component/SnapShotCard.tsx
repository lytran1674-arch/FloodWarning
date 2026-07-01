import {
  GlassWaterIcon,
  TriangleAlert,
  Waves,
} from "lucide-react";

import { useDataEvalution } from "@/features/dataevaluation/hooks/useDataEvalution";

interface Props {
  areaId: string;
}

// Xác định bộ màu theo mức độ rủi ro: Cao (đỏ), Trung bình (vàng), Thấp (xanh lá)
const getRiskLevelStyle = (riskLevel?: string) => {
  const level = (riskLevel || "").toLowerCase();

  const isHigh = ["cao", "high", "nguy hiểm", "nghiêm trọng"].some((k) =>
    level.includes(k)
  );
  const isMedium = ["trung bình", "medium", "vừa"].some((k) =>
    level.includes(k)
  );
  const isLow = ["thấp", "low", "an toàn"].some((k) => level.includes(k));

  if (isHigh) {
    return {
      color: "text-red-700",
      bg: "hover:bg-red-500",
      iconBg: "bg-red-100",
    };
  }

  if (isMedium) {
    return {
      color: "text-yellow-600",
      bg: "hover:bg-yellow-500",
      iconBg: "bg-yellow-100",
    };
  }

  if (isLow) {
    return {
      color: "text-green-600",
      bg: "hover:bg-green-500",
      iconBg: "bg-green-100",
    };
  }

  // Mặc định khi chưa có dữ liệu
  return {
    color: "text-slate-500",
    bg: "hover:bg-slate-400",
    iconBg: "bg-slate-100",
  };
};

export const SnapShotCard = ({ areaId }: Props) => {

  const {
    data: snapshot,
    loading,
  } = useDataEvalution(areaId);

  const riskStyle = getRiskLevelStyle(snapshot?.riskLevel);

  const cards = [
    {
      title: "Rủi ro ngập lụt",
      value: snapshot?.riskLevel || "--",
      sub: "Mức độ khu vực",
      icon: GlassWaterIcon,
      color: riskStyle.color,
      bg: riskStyle.bg,
      iconBg: riskStyle.iconBg,
      border: "border-[#E5E7EB]",
    },

    {
      title: "Xác suất",
      value: snapshot?.predictionProbability
        ? `${(snapshot.predictionProbability * 100).toFixed(1)}%`
        : "--",
      sub: "Khả năng xảy ra",
      icon: TriangleAlert,
      color: "text-orange-600",
      bg: "hover:bg-orange-500",
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
      {
      title: "% Nguy hiểm",
      value: snapshot?.dangerPercent
        ? `${snapshot.dangerPercent} %`
        : "--",
      sub: "",
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
      grid-cols-2
      md:grid-cols-2
      lg:grid-cols-4
      gap-2
      px-2
     
      lg:w-[950px]
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
                p-2
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
                  text-sm
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