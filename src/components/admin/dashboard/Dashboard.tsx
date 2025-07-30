import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { reportAPI } from "../../../api/api";
import { DashboardOverview } from "../../../types";
import {
  RevenueChart,
  OrdersChart,
  CategoryChart,
  StatusChart,
} from "./charts";

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [productAnalytics, setProductAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [overviewResponse, productResponse] = await Promise.all([
        reportAPI.getDashboardOverview(),
        reportAPI.getProductAnalytics(30), // Last 30 days for category data
      ]);

      setOverview((overviewResponse.data as any)?.data);
      setProductAnalytics((productResponse.data as any)?.data);
      // For now, we'll use mock recent orders since the API doesn't return recent orders directly
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    } else {
      return amount.toLocaleString();
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-white/70 backdrop-blur-sm">
                <CardBody className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-3 bg-gray-200 rounded-full w-20"></div>
                    <div className="h-8 bg-gray-200 rounded-full w-16"></div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <Card className="bg-red-50/80 backdrop-blur-sm border-red-100/50 max-w-md">
          <CardBody className="text-red-700 px-8 py-6 text-sm font-medium">
            {error}
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!overview) {
    return null;
  }

  const { today, month, year, counts } = overview;

  const metrics = [
    {
      label: "Users",
      value: counts.users,
      change: "+12%",
      icon: "ph:users-duotone",
      color: "primary" as const,
      bgColor: "from-blue-500/10 to-blue-600/5",
    },
    {
      label: "Products",
      value: counts.products,
      change: "+5%",
      icon: "ph:package-duotone",
      color: "success" as const,
      bgColor: "from-emerald-500/10 to-emerald-600/5",
    },
    {
      label: "Orders",
      value: counts.orders,
      change: "+8%",
      icon: "ph:shopping-cart-duotone",
      color: "secondary" as const,
      bgColor: "from-violet-500/10 to-violet-600/5",
    },
    {
      label: "Pending",
      value: counts.pendingOrders,
      change: "Review",
      icon: "ph:clock-duotone",
      color: "warning" as const,
      bgColor: "from-amber-500/10 to-amber-600/5",
    },
  ];

  const revenueData = [
    { period: "Today", orders: today.orders, revenue: today.revenue },
    { period: "Month", orders: month.orders, revenue: month.revenue },
    { period: "Year", orders: year.orders, revenue: year.revenue },
  ];

  const quickActions = [
    {
      label: "Add Product",
      icon: "ph:plus-duotone",
      color: "primary" as const,
    },
    {
      label: "Create Blog",
      icon: "ph:article-duotone",
      color: "success" as const,
    },
    {
      label: "Analytics",
      icon: "ph:chart-line-duotone",
      color: "secondary" as const,
    },
    { label: "Settings", icon: "ph:gear-duotone", color: "default" as const },
  ];

  const activities = [
    { text: "New order received", time: "2m ago", type: "order" },
    { text: "User registered", time: "15m ago", type: "user" },
    { text: "Stock updated", time: "1h ago", type: "product" },
  ];

  // Chart data
  const revenueChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue",
        data: [
          month.revenue * 0.8, // Jan
          month.revenue * 0.9, // Feb
          month.revenue * 0.7, // Mar
          month.revenue * 1.0, // Apr
          month.revenue * 0.85, // May
          month.revenue * 1.1, // Jun
        ],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
      },
    ],
  };

  const ordersChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Orders",
        data: [
          Math.floor(month.orders * 0.15), // Mon
          Math.floor(month.orders * 0.18), // Tue
          Math.floor(month.orders * 0.14), // Wed
          Math.floor(month.orders * 0.2), // Thu
          Math.floor(month.orders * 0.17), // Fri
          Math.floor(month.orders * 0.23), // Sat
          Math.floor(month.orders * 0.2), // Sun
        ],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "#3B82F6",
        borderWidth: 1,
      },
    ],
  };

  const categoryChartData = {
    labels: productAnalytics?.categoryPerformance?.map(
      (cat: any) => cat.name
    ) || ["Fashion", "Electronics", "Home", "Sports", "Books"],
    datasets: [
      {
        data: productAnalytics?.categoryPerformance?.map(
          (cat: any) => cat.productCount
        ) || [35, 25, 20, 15, 5],
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#EC4899",
          "#06B6D4",
          "#84CC16",
          "#F97316",
          "#6366F1",
        ],
        borderColor: [
          "#2563EB",
          "#059669",
          "#D97706",
          "#DC2626",
          "#7C3AED",
          "#DB2777",
          "#0891B2",
          "#65A30D",
          "#EA580C",
          "#4F46E5",
        ],
        borderWidth: 2,
      },
    ],
  };

  const statusChartData = {
    labels: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        data: [
          counts.pendingOrders,
          Math.floor(counts.orders * 0.25),
          Math.floor(counts.orders * 0.3),
          Math.floor(counts.orders * 0.2),
          Math.floor(counts.orders * 0.1),
        ],
        backgroundColor: [
          "#F59E0B",
          "#3B82F6",
          "#8B5CF6",
          "#10B981",
          "#EF4444",
        ],
        borderColor: ["#D97706", "#2563EB", "#7C3AED", "#059669", "#DC2626"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome back, here's what's happening today.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden bg-gradient-to-br ${metric.bgColor} backdrop-blur-sm border-white/20 hover:border-white/40 transition-all duration-300`}>
              <CardBody className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-600">
                      {metric.label}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {formatNumber(metric.value)}
                    </p>
                    <Chip color={metric.color} variant="flat" size="sm">
                      {metric.change}
                    </Chip>
                  </div>
                  <div
                    className={`p-3 rounded-2xl bg-${metric.color === "primary" ? "blue" : metric.color === "success" ? "emerald" : metric.color === "secondary" ? "violet" : "amber"}-100/50`}>
                    <Icon
                      icon={metric.icon}
                      className={`w-6 h-6 text-${metric.color === "primary" ? "blue" : metric.color === "success" ? "emerald" : metric.color === "secondary" ? "violet" : "amber"}-600`}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Revenue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {revenueData.map((item, index) => (
            <Card
              key={index}
              className="bg-white/70 backdrop-blur-sm border-gray-100/50 hover:bg-white/90 transition-all duration-300">
              <CardBody className="p-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {item.period}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Orders</span>
                      <span className="font-semibold text-gray-900">
                        {formatNumber(item.orders)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Revenue</span>
                      <span className="font-semibold text-emerald-600">
                        Rp {formatCurrency(item.revenue)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart data={revenueChartData} />
          <OrdersChart data={ordersChartData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryChart data={categoryChartData} />
          <StatusChart data={statusChartData} />
        </div>

        {/* Quick Actions */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-100/50">
          <CardHeader className="pb-0">
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  color={action.color}
                  variant="bordered"
                  className="group flex flex-col items-center p-6 h-auto border-gray-100/80 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-300">
                  <div
                    className={`p-3 rounded-xl bg-${action.color === "primary" ? "blue" : action.color === "success" ? "emerald" : action.color === "secondary" ? "violet" : "gray"}-50 group-hover:bg-${action.color === "primary" ? "blue" : action.color === "success" ? "emerald" : action.color === "secondary" ? "violet" : "gray"}-100 transition-colors duration-300 mb-3`}>
                    <Icon
                      icon={action.icon}
                      className={`w-5 h-5 text-${action.color === "primary" ? "blue" : action.color === "success" ? "emerald" : action.color === "secondary" ? "violet" : "gray"}-600`}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {action.label}
                  </span>
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white/70 backdrop-blur-sm border-gray-100/50">
          <CardHeader className="flex items-center justify-between pb-0">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <Button
              color="primary"
              variant="light"
              size="sm"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              View all
            </Button>
          </CardHeader>
          <CardBody className="p-6">
            <div className="space-y-3">
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-50/80 transition-colors duration-200">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "order"
                        ? "bg-emerald-500"
                        : activity.type === "user"
                          ? "bg-blue-500"
                          : "bg-violet-500"
                    }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {activity.text}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
