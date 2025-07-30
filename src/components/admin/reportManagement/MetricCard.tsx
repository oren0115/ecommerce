import React from "react";
import { Icon } from "@iconify/react";
import { MetricCardProps } from "./types";

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  color = "gray",
  trend,
}) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-sm transition-shadow duration-200">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-semibold text-gray-900 mb-2">{value}</p>
        {trend && (
          <div className="flex items-center">
            <Icon
              icon={
                trend.value >= 0 ? "lucide:trending-up" : "lucide:trending-down"
              }
              className={`w-4 h-4 mr-1 ${trend.value >= 0 ? "text-green-500" : "text-red-500"}`}
            />
            <span
              className={`text-sm ${trend.value >= 0 ? "text-green-600" : "text-red-600"}`}>
              {Math.abs(trend.value)}% {trend.label}
            </span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-xl bg-${color}-50`}>
        <Icon icon={icon} className={`w-6 h-6 text-${color}-600`} />
      </div>
    </div>
  </div>
);

export default MetricCard;
