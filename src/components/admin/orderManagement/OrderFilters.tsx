import React from "react";
import {
  Input,
  Select,
  SelectItem,
  Button,
  Card,
  CardBody,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface OrderFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusChange,
}) => {
  const statusOptions = [
    { key: "", label: "All Status" },
    { key: "pending", label: "Pending" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
    { key: "paid", label: "Paid" },
    { key: "unpaid", label: "Unpaid" },
  ];

  return (
    <Card className="shadow-sm">
      <CardBody>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Input
              placeholder="Search orders by order number, customer name, or email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              startContent={
                <Icon icon="mdi:magnify" className="text-default-400" />
              }
              size="sm"
              variant="bordered"
              classNames={{
                input: "focus:ring-0 focus:outline-none",
                inputWrapper: "focus:ring-0 focus:outline-none",
              }}
            />
          </div>
          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-48"
            size="sm"
            variant="bordered"
            aria-label="Filter orders by status">
            {statusOptions.map((option) => (
              <SelectItem key={option.key}>{option.label}</SelectItem>
            ))}
          </Select>
          <Button
            color="secondary"
            size="sm"
            variant="flat"
            startContent={<Icon icon="mdi:filter" />}>
            Filter
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default OrderFilters;
