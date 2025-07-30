import { TabConfig, PeriodOption } from "./types";

export const TABS: TabConfig[] = [
  { id: "overview", label: "Overview", icon: "lucide:layout-dashboard" },
  { id: "sales", label: "Sales", icon: "lucide:trending-up" },
  { id: "users", label: "Users", icon: "lucide:users" },
  { id: "products", label: "Products", icon: "lucide:package" },
  { id: "orders", label: "Orders", icon: "lucide:shopping-cart" },
] as const;

export const PERIODS: PeriodOption[] = [
  { value: 7, label: "7 Days" },
  { value: 30, label: "30 Days" },
  { value: 90, label: "90 Days" },
  { value: 365, label: "1 Year" },
];
