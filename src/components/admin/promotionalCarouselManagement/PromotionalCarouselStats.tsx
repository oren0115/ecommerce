import React from "react";
import { PromotionalSlide } from "../../../types";
import { BarChart3, Eye, EyeOff, TrendingUp } from "lucide-react";
import { Icon } from "@iconify/react";

interface PromotionalCarouselStatsProps {
  slides: PromotionalSlide[];
}

const PromotionalCarouselStats: React.FC<PromotionalCarouselStatsProps> = ({
  slides,
}) => {
  const totalSlides = slides.length;
  const activeSlides = slides.filter(
    (slide) => slide.status === "active"
  ).length;
  const inactiveSlides = slides.filter(
    (slide) => slide.status === "inactive"
  ).length;

  const stats = [
    {
      title: "Total Slides",
      value: totalSlides,
      icon: BarChart3,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "Active Slides",
      value: activeSlides,
      icon: Eye,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Inactive Slides",
      value: inactiveSlides,
      icon: EyeOff,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
    },
    {
      title: "Active Rate",
      value:
        totalSlides > 0
          ? `${Math.round((activeSlides / totalSlides) * 100)}%`
          : "0%",
      icon: TrendingUp,
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
              <Icon
                icon={stat.icon.name}
                className={`w-6 h-6 ${stat.textColor}`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromotionalCarouselStats;
