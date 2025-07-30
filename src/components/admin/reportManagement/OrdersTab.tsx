import React from "react";
import { OrderAnalytics } from "../../../types";
import MetricCard from "./MetricCard";
import { formatCurrency, formatNumber } from "./utils";

interface OrdersTabProps {
  data: OrderAnalytics | null;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ data }) => {
  if (!data) return null;

  const { ordersByStatus, avgOrderValue, summary } = data;

  const safeSummary = summary || {
    totalOrders: 0,
    totalValue: 0,
    avgOrderValue: 0,
  };
  const safeOrdersByStatus = ordersByStatus || [];
  const safeAvgOrderValue = avgOrderValue || [];

  return (
    <div className="space-y-8">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Orders"
          value={formatNumber(safeSummary.totalOrders)}
          icon="lucide:shopping-cart"
          color="blue"
        />
        <MetricCard
          title="Total Value"
          value={formatCurrency(safeSummary.totalValue)}
          icon="lucide:dollar-sign"
          color="green"
        />
        <MetricCard
          title="Avg Order Value"
          value={formatCurrency(safeSummary.avgOrderValue)}
          icon="lucide:trending-up"
          color="purple"
        />
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Orders by Status
          </h3>
          <div className="space-y-4">
            {safeOrdersByStatus.map((status) => (
              <div
                key={status._id}
                className="flex justify-between items-center">
                <span className="font-medium text-gray-700 capitalize">
                  {status._id}
                </span>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatNumber(status.count)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(status.totalValue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Average Order Value
          </h3>
          <div className="space-y-4">
            {safeAvgOrderValue.map((status) => (
              <div
                key={status._id}
                className="flex justify-between items-center">
                <span className="font-medium text-gray-700 capitalize">
                  {status._id}
                </span>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(status.avgValue)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatNumber(status.count)} orders
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersTab;
