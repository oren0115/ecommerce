import React from 'react';
import { UserAnalytics } from '../../../types';
import MetricCard from './MetricCard';
import { formatCurrency, formatNumber } from './utils';

interface UsersTabProps {
  data: UserAnalytics | null;
}

const UsersTab: React.FC<UsersTabProps> = ({ data }) => {
  if (!data) return null;

  const { topCustomers, summary } = data;
  
  const safeSummary = summary || { totalUsers: 0, activeUsers: 0, newUsers: 0 };
  const safeTopCustomers = topCustomers || [];

  return (
    <div className="space-y-8">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Users"
          value={formatNumber(safeSummary.totalUsers)}
          icon="lucide:users"
          color="blue"
        />
        <MetricCard
          title="Active Users"
          value={formatNumber(safeSummary.activeUsers)}
          icon="lucide:user-check"
          color="green"
        />
        <MetricCard
          title="New Users"
          value={formatNumber(safeSummary.newUsers)}
          icon="lucide:user-plus"
          color="purple"
        />
      </div>

      {/* Top Customers */}
      <div className="bg-white border border-gray-100 rounded-2xl p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Customers</h3>
        <div className="space-y-4">
          {safeTopCustomers.slice(0, 8).map((customer, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-4">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{customer.customerName}</div>
                  <div className="text-sm text-gray-500">{customer.email}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{formatCurrency(customer.totalSpent)}</div>
                <div className="text-sm text-gray-500">{formatNumber(customer.orderCount)} orders</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersTab; 