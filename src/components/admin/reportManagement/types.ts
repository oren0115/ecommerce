import {
  SalesAnalytics,
  UserAnalytics,
  ProductAnalytics,
  OrderAnalytics,
  DashboardOverview,
} from "../../../types";

export interface ReportData {
  sales: SalesAnalytics | null;
  users: UserAnalytics | null;
  products: ProductAnalytics | null;
  orders: OrderAnalytics | null;
  overview: DashboardOverview | null;
}

export type TabType = "overview" | "sales" | "users" | "products" | "orders";

export interface TabConfig {
  id: TabType;
  label: string;
  icon: string;
}

export interface PeriodOption {
  value: number;
  label: string;
}

export interface MetricCardProps {
  title: string;
  value: string;
  icon: string;
  color?: "gray" | "blue" | "green" | "purple" | "yellow" | "red";
  trend?: { value: number; label: string };
}
