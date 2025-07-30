import React from "react";
import { SalesAnalytics } from "../../../types";
import MetricCard from "./MetricCard";
import { formatCurrency, formatNumber } from "./utils";

interface SalesTabProps {
  data: SalesAnalytics | null;
}

const SalesTab: React.FC<SalesTabProps> = ({ data }) => {
  if (!data) return null;

  const { topProducts, salesByCategory, paymentMethods, summary } = data;

  const safeSummary = summary || {
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    pendingOrders: 0,
  };
  const safeTopProducts = topProducts || [];
  const safeSalesByCategory = salesByCategory || [];
  const safePaymentMethods = paymentMethods || [];

  return (
    <div className="space-y-8">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(safeSummary.totalRevenue)}
          icon="lucide:dollar-sign"
          color="green"
        />
        <MetricCard
          title="Total Orders"
          value={formatNumber(safeSummary.totalOrders)}
          icon="lucide:shopping-cart"
          color="blue"
        />
        <MetricCard
          title="Avg Order Value"
          value={formatCurrency(safeSummary.avgOrderValue)}
          icon="lucide:trending-up"
          color="purple"
        />
        <MetricCard
          title="Pending Orders"
          value={formatNumber(safeSummary.pendingOrders)}
          icon="lucide:clock"
          color="yellow"
        />
      </div>

      {/* Top Products */}
      <div className="bg-white border border-gray-100 rounded-2xl p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Top Selling Products
        </h3>
        <div className="space-y-4">
          {safeTopProducts.slice(0, 5).map((product, index) => (
            <div
              key={product._id}
              className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-4">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatNumber(product.totalSold)} units sold
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(product.totalRevenue)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Sales by Category
          </h3>
          <div className="space-y-4">
            {safeSalesByCategory.slice(0, 5).map((category) => (
              <div
                key={category._id}
                className="flex justify-between items-center">
                <span className="font-medium text-gray-700">
                  {category.categoryName}
                </span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(category.totalSales)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Payment Methods
          </h3>
          <div className="space-y-4">
            {safePaymentMethods.map((method) => (
              <div
                key={method._id}
                className="flex justify-between items-center">
                <span className="font-medium text-gray-700 capitalize">
                  {method._id.replace("_", " ")}
                </span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(method.totalSales)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesTab;
