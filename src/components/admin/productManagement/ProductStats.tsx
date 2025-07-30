import React from "react";
import { Product } from "../../../types";
import { Card, CardBody, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ProductStatsProps {
  products: Product[];
  totalProducts: number;
  onQuickAction: (action: string) => void;
}

const ProductStats: React.FC<ProductStatsProps> = ({
  products,
  totalProducts,
  onQuickAction,
}) => {
  const calculateStats = () => {
    const productsArray = Array.isArray(products) ? products : [];

    const totalValue = productsArray.reduce(
      (sum, product) => sum + product.price * product.stock,
      0
    );
    const lowStock = productsArray.filter(
      (product) => product.stock <= 10 && product.stock > 0
    ).length;
    const outOfStock = productsArray.filter(
      (product) => product.stock === 0
    ).length;
    const discountedProducts = productsArray.filter(
      (product) => product.discountPercent > 0
    ).length;

    return {
      totalValue,
      lowStock,
      outOfStock,
      discountedProducts,
    };
  };

  const stats = calculateStats();

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(1)}K`;
    } else {
      return `Rp ${amount.toLocaleString()}`;
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      icon: "ph:package-duotone",
      color: "default" as const,
      action: null,
    },
    {
      title: "Total Value",
      value: formatCurrency(stats.totalValue),
      icon: "ph:currency-dollar-duotone",
      color: "success" as const,
      action: null,
    },
    {
      title: "Low Stock",
      value: stats.lowStock.toString(),
      icon: "ph:warning-duotone",
      color: "warning" as const,
      action: stats.lowStock > 0 ? "lowStock" : null,
      actionText: "View low stock items",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStock.toString(),
      icon: "ph:x-circle-duotone",
      color: "danger" as const,
      action: stats.outOfStock > 0 ? "outOfStock" : null,
      actionText: "View out of stock items",
    },
    {
      title: "On Sale",
      value: stats.discountedProducts.toString(),
      icon: "ph:tag-duotone",
      color: "secondary" as const,
      action: stats.discountedProducts > 0 ? "discounted" : null,
      actionText: "View sale items",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statCards.map((card, index) => (
        <Card
          key={index}
          className="group hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-200 hover:-translate-y-0.5">
          <CardBody className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {card.title}
                </p>
                <p
                  className="text-2xl font-bold text-gray-900 tracking-tight"
                  title={card.value}>
                  {card.value}
                </p>
              </div>
              <div
                className={`p-2 rounded-lg bg-${card.color === "default" ? "gray" : card.color === "success" ? "emerald" : card.color === "warning" ? "amber" : card.color === "danger" ? "red" : "violet"}-50`}>
                <Icon
                  icon={card.icon}
                  className={`w-5 h-5 text-${card.color === "default" ? "gray" : card.color === "success" ? "emerald" : card.color === "warning" ? "amber" : card.color === "danger" ? "red" : "violet"}-600`}
                />
              </div>
            </div>

            {card.action && (
              <Button
                variant="light"
                size="sm"
                color={card.color}
                onClick={() => onQuickAction(card.action!)}
                className="mt-3 text-sm font-medium transition-colors duration-150 flex items-center gap-1 group-hover:text-gray-700"
                endContent={
                  <Icon
                    icon="ph:arrow-right"
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  />
                }>
                {card.actionText}
              </Button>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default ProductStats;
