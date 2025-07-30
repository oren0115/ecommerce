import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { reportAPI } from "../../../api/api";
import { ReportData, TabType } from "./types";
import { TABS, PERIODS } from "./constants";
import OverviewTab from "./OverviewTab";
import SalesTab from "./SalesTab";
import UsersTab from "./UsersTab";
import ProductsTab from "./ProductsTab";
import OrdersTab from "./OrdersTab";
import LoadingSkeleton from "./LoadingSkeleton";
// import "../../../styles/reportManagement.css";

const ReportManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [period, setPeriod] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData>({
    sales: null,
    users: null,
    products: null,
    orders: null,
    overview: null,
  });

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const promises = [];

      if (!reportData.overview) {
        promises.push(reportAPI.getDashboardOverview());
      }

      if (!reportData.sales) {
        promises.push(reportAPI.getSalesAnalytics(period));
      }

      if (!reportData.users) {
        promises.push(reportAPI.getUserAnalytics(period));
      }

      if (!reportData.products) {
        promises.push(reportAPI.getProductAnalytics(period));
      }

      if (!reportData.orders) {
        promises.push(reportAPI.getOrderAnalytics(period));
      }

      if (promises.length > 0) {
        const results = await Promise.all(promises);

        setReportData((prev) => {
          const newData = { ...prev };
          results.forEach((result, index) => {
            const data = (result.data as any)?.data;
            if (data) {
              if (index === 0 && !newData.overview) newData.overview = data;
              if (index === 1 && !newData.sales) newData.sales = data;
              if (index === 2 && !newData.users) newData.users = data;
              if (index === 3 && !newData.products) newData.products = data;
              if (index === 4 && !newData.orders) newData.orders = data;
            }
          });
          return newData;
        });
      }
    } catch (err: any) {
      console.error("Error fetching report data:", err);
      setError(err.response?.data?.message || "Failed to fetch report data");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    // Only fetch data if it's not already available
    if (!reportData[tabId]) {
      fetchData();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab data={reportData.overview} />;
      case "sales":
        return <SalesTab data={reportData.sales} />;
      case "users":
        return <UsersTab data={reportData.users} />;
      case "products":
        return <ProductsTab data={reportData.products} />;
      case "orders":
        return <OrdersTab data={reportData.orders} />;
      default:
        return null;
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
          <div className="flex items-center">
            <Icon icon="lucide:alert-circle" className="w-5 h-5 mr-2" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>

        {/* Period Selector */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-600">Period</span>
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">
            {PERIODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-50 rounded-2xl p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex-1 ${
              activeTab === tab.id
                ? "bg-black text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-300"
            }`}>
            <Icon icon={tab.icon} className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">{renderContent()}</div>
    </div>
  );
};

export default ReportManagement;
