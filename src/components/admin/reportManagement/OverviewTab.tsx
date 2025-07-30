import React from 'react';
import { DashboardOverview } from '../../../types';
import MetricCard from './MetricCard';
import { formatCurrency, formatNumber } from './utils';

interface OverviewTabProps {
  data: DashboardOverview | null;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ data }) => {
  if (!data) return null;

  const { today, month, year, counts } = data;
  
  const safeToday = today || { orders: 0, revenue: 0 };
  const safeMonth = month || { orders: 0, revenue: 0 };
  const safeYear = year || { orders: 0, revenue: 0 };
  const safeCounts = counts || { users: 0, products: 0, orders: 0, pendingOrders: 0 };

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 ">
        <MetricCard
          title="Total Users"
          value={formatNumber(safeCounts.users)}
          icon="lucide:users"
          color="blue"
        />
        <MetricCard
          title="Total Products"
          value={formatNumber(safeCounts.products)}
          icon="lucide:package"
          color="green"
        />
        <MetricCard
          title="Total Orders"
          value={formatNumber(safeCounts.orders)}
          icon="lucide:shopping-cart"
          color="purple"
        />
        <MetricCard
          title="Pending Orders"
          value={formatNumber(safeCounts.pendingOrders)}
          icon="lucide:clock"
          color="yellow"
        />
      </div>

      {/* Revenue Overview */}
      <div className="bg-white border border-gray-100 rounded-2xl p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Overview</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="text-center lg:text-left">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatCurrency(safeToday.revenue)}
            </div>
            <div className="text-sm text-gray-500 mb-2">Today's Revenue</div>
            <div className="text-sm text-gray-400">
              {formatNumber(safeToday.orders)} orders
            </div>
          </div>
          
          <div className="text-center lg:text-left">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatCurrency(safeMonth.revenue)}
            </div>
            <div className="text-sm text-gray-500 mb-2">This Month</div>
            <div className="text-sm text-gray-400">
              {formatNumber(safeMonth.orders)} orders
            </div>
          </div>
          
          <div className="text-center lg:text-left">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {formatCurrency(safeYear.revenue)}
            </div>
            <div className="text-sm text-gray-500 mb-2">This Year</div>
            <div className="text-sm text-gray-400">
              {formatNumber(safeYear.orders)} orders
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab; 