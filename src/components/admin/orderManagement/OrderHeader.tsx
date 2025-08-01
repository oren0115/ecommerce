import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface OrderHeaderProps {
  onExport: () => void;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ onExport }) => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
          <p className="text-gray-600 text-sm">
            Manage and track all customer orders
          </p>
        </div>
        <Button
          color="primary"
          size="sm"
          className="bg-gray-900 text-white hover:bg-gray-800"
          onPress={onExport}
          startContent={<Icon icon="mdi:download" />}>
          Export Orders
        </Button>
      </div>
    </div>
  );
};

export default OrderHeader;
