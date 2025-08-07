import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Pagination,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Order } from "../../../types";
import {
  formatDate,
  formatCurrency,
  renderStatusChip,
  paymentTypeLabels,
} from "./utils.tsx";

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  updating: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onStatusUpdate: (orderId: string, status: string) => void;
  onViewOrder: (order: Order) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  loading,
  updating,
  currentPage,
  totalPages,
  onPageChange,
  onStatusUpdate,
  onViewOrder,
}) => {
  const columns = [
    { key: "orderNumber", label: "Order Number" },
    { key: "customer", label: "Customer" },
    { key: "totalPrice", label: "Total" },
    { key: "paymentType", label: "Payment" },
    { key: "status", label: "Status" },
    { key: "paymentStatus", label: "Payment Status" },
    { key: "orderDate", label: "Order Date" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-foreground">Orders</h3>
        </div>
      </CardHeader>
      <CardBody>
        <Table
          aria-label="Orders table"
          classNames={{
            wrapper: "min-h-[400px]",
          }}>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key} className="text-sm font-semibold">
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={orders}
            isLoading={loading}
            loadingContent={
              <div className="flex justify-center items-center py-8">
                <Spinner size="lg" />
                <span className="ml-2">Loading orders...</span>
              </div>
            }
            emptyContent={
              <div className="text-center py-8">
                <Icon
                  icon="mdi:package-variant"
                  className="text-4xl text-default-400 mx-auto mb-2"
                />
                <p className="text-default-500">No orders found</p>
              </div>
            }>
            {(order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <div className="font-medium text-foreground">
                    {order.orderNumber}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-foreground">
                      {order.customerId?.fullname || "-"}
                    </div>
                    <div className="text-sm text-default-500">
                      {order.customerId?.email || "-"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-foreground">
                    {formatCurrency(order.totalPrice)}
                  </div>
                </TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat" color="secondary">
                    {
                      paymentTypeLabels[
                        order.paymentType as keyof typeof paymentTypeLabels
                      ]
                    }
                  </Chip>
                </TableCell>
                <TableCell>{renderStatusChip(order.status, "order")}</TableCell>
                <TableCell>
                  {order.paymentStatus &&
                    renderStatusChip(order.paymentStatus, "payment")}
                </TableCell>
                <TableCell>
                  <div className="text-sm text-default-600">
                    {formatDate(order.orderDate.toString())}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onPress={() => onViewOrder(order)}
                      isIconOnly>
                      <Icon icon="mdi:eye" />
                    </Button>
                    <Select
                      size="sm"
                      placeholder="Update Status"
                      variant="bordered"
                      onSelectionChange={(value) => {
                        if (value) {
                          onStatusUpdate(order._id, value.toString());
                        }
                      }}
                      isDisabled={updating === order._id}
                      aria-label="Update order status">
                      <SelectItem key="pending">Pending</SelectItem>
                      <SelectItem key="processing">Processing</SelectItem>
                      <SelectItem key="shipped">Shipped</SelectItem>
                      <SelectItem key="delivered">Delivered</SelectItem>
                      <SelectItem key="cancelled">Cancelled</SelectItem>
                    </Select>
                    {updating === order._id && <Spinner size="sm" />}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              total={totalPages}
              page={currentPage}
              onChange={onPageChange}
              showControls
              showShadow
              color="primary"
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default OrderTable;
