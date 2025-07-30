import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface OrderHeaderProps {
  onExport: () => void;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ onExport }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl text-foreground">Order</h1>
        <p className="text-sm text-default-500 mt-1">
          Manage and track all customer orders
        </p>
      </div>
      <Button
        color="primary"
        size="sm"
        className="bg-gray-900 text-white"
        onPress={onExport}
        startContent={<Icon icon="mdi:download" />}>
        Export Orders
      </Button>
    </div>
  );
};

export default OrderHeader;
