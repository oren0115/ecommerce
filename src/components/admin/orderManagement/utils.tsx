import { Chip } from "@heroui/react";

export const statusColors = {
  pending: "warning",
  processing: "primary",
  shipped: "secondary",
  delivered: "success",
  cancelled: "danger",
  paid: "success",
  unpaid: "warning",
} as const;

export const paymentStatusColors = {
  pending: "warning",
  paid: "success",
  failed: "danger",
  expired: "danger",
} as const;

export const paymentTypeLabels = {
  cod: "Cash on Delivery",
  bank_transfer: "Bank Transfer",
  credit_card: "Credit Card",
  e_wallet: "E-Wallet",
  qris: "QRIS",
} as const;

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

export const renderStatusChip = (
  status: string,
  type: "order" | "payment" = "order"
) => {
  const colors = type === "order" ? statusColors : paymentStatusColors;
  const color = colors[status as keyof typeof colors] || "default";

  return (
    <Chip size="sm" color={color} variant="flat" className="capitalize">
      {status}
    </Chip>
  );
};
