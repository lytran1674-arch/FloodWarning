import {
  GlassWaterIcon,
  Radio,
  Shield,
  TriangleAlert,
} from "lucide-react";

import type { IoTAggregate } from "../types/waterlevelType";

interface Props {
  data: IoTAggregate[];
}

export const StatusCard = ({ data }: Props) => {

  const totalAreas = data.length;

  const dangerAreas = data.filter(
    (x) => (x.dangerRatio || 0) > 0.8
  ).length;

  const totalDevices = data.reduce(
    (sum, x) => sum + (x.totalDeviceCount || 0),
    0
  );

  const safeAreas = data.filter(
    (x) => (x.dangerRatio || 0) < 0.3
  ).length;

  const warningAreas = data.filter(
    (x) =>
      (x.dangerRatio || 0) >= 0.3 &&
      (x.dangerRatio || 0) < 0.6
  ).length;

  const cards = [
    {
      title: "Khu vực giám sát",
      value: totalAreas,
      sub: "khu vực",
      icon: GlassWaterIcon,
      color: "text-blue-700",
      bg: "hover:bg-blue-500",
      iconBg: "bg-blue-100",
      border: "border-blue-100",
    },

    {
      title: "Khu vực nguy hiểm",
      value: dangerAreas,
      sub: "khu vực",
      icon: TriangleAlert,
      color: "text-red-600",
      bg: "hover:bg-red-500",
      iconBg: "bg-red-100",
      border: "border-red-100",
    },

    {
      title: "Khu vực cảnh báo",
      value: warningAreas,
      sub: "khu vực",
      icon: TriangleAlert,
      color: "text-yellow-600",
      bg: "hover:bg-yellow-500",
      iconBg: "bg-yellow-100",
      border: "border-yellow-100",
    },

    {
      title: "Khu vực an toàn",
      value: safeAreas,
      sub: "khu vực",
      icon: Shield,
      color: "text-green-600",
      bg: "hover:bg-green-500",
      iconBg: "bg-green-100",
      border: "border-green-100",
    },

    {
      title: "Tổng thiết bị",
      value: totalDevices,
      sub: "thiết bị",
      icon: Radio,
      color: "text-purple-600",
      bg: "hover:bg-purple-500",
      iconBg: "bg-purple-100",
      border: "border-purple-100",
    },
  ];

  return (

    <div
      className="
      grid
      grid-cols-2
      lg:grid-cols-5
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

            <div
              className="
              relative
              flex
              items-start
              justify-between
              "
            >

              {/* text */}
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

              {/* icon */}
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