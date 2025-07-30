import React from 'react';
import { Icon } from '@iconify/react';
import { ProductAnalytics } from '../../../types';
import MetricCard from './MetricCard';
import { formatCurrency, formatNumber } from './utils';

interface ProductsTabProps {
  data: ProductAnalytics | null;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ data }) => {
  if (!data) return null;

  const { productPerformance, lowStockProducts, summary } = data;
  
  const safeSummary = summary || { totalProducts: 0, totalStock: 0, avgPrice: 0, lowStockCount: 0 };
  const safeProductPerformance = productPerformance || [];
  const safeLowStockProducts = lowStockProducts || [];

  return (
    <div className="space-y-8">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total Products"
          value={formatNumber(safeSummary.totalProducts)}
          icon="lucide:package"
          color="blue"
        />
        <MetricCard
          title="Total Stock"
          value={formatNumber(safeSummary.totalStock)}
          icon="lucide:warehouse"
          color="green"
        />
        <MetricCard
          title="Avg Price"
          value={formatCurrency(safeSummary.avgPrice)}
          icon="lucide:dollar-sign"
          color="purple"
        />
        <MetricCard
          title="Low Stock Alert"
          value={formatNumber(safeSummary.lowStockCount)}
          icon="lucide:alert-triangle"
          color="red"
        />
      </div>

      {/* Product Performance */}
      <div className="bg-white border border-gray-100 rounded-2xl p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Products</h3>
        <div className="space-y-4">
          {safeProductPerformance.slice(0, 8).map((product, index) => (
            <div key={product._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-4">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(product.price)} • {formatNumber(product.stock)} in stock
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{formatCurrency(product.totalRevenue)}</div>
                <div className="text-sm text-gray-500">{formatNumber(product.salesCount)} sold</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Low Stock Alert */}
      {safeLowStockProducts.length > 0 && (
        <div className="bg-white border border-red-100 rounded-2xl p-8">
          <div className="flex items-center mb-6">
            <Icon icon="lucide:alert-triangle" className="w-5 h-5 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Products</h3>
          </div>
          <div className="space-y-4">
            {safeLowStockProducts.slice(0, 5).map((product) => (
              <div key={product._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">{formatCurrency(product.price)}</div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock < 5 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {formatNumber(product.stock)} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTab; 