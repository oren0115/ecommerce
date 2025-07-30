import React, { useState, useEffect } from "react";
import { Alert } from "@heroui/react";
import { orderAPI } from "../../../api/api";
import { Order } from "../../../types";
import OrderHeader from "./OrderHeader";
import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";
import OrderDetailModal from "./OrderDetailModal";
// import '../../../styles/orderManagement.css';

interface OrderManagementProps {}

const OrderManagement: React.FC<OrderManagementProps> = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await orderAPI.getAllAdmin({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      });

      if ((response.data as any).success) {
        setOrders((response.data as any).data.items);
        setTotalPages((response.data as any).data.pagination.totalPages);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      setError(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(orderId);
      const response = await orderAPI.updateStatus(orderId, newStatus as any);

      if ((response.data as any).success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, status: newStatus as any }
              : order
          )
        );
      } else {
        setError("Failed to update order status");
      }
    } catch (error: any) {
      console.error("Error updating order status:", error);
      setError(
        error.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setUpdating(null);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleExportOrders = () => {
    // TODO: Implement export functionality
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <OrderHeader onExport={handleExportOrders} />

      {/* Error Alert */}
      {error && (
        <Alert
          color="danger"
          variant="flat"
          onClose={() => setError(null)}
          className="mb-4">
          {error}
        </Alert>
      )}

      {/* Filters */}
      <OrderFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
      />

      {/* Orders Table */}
      <OrderTable
        orders={orders}
        loading={loading}
        updating={updating}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onStatusUpdate={handleStatusUpdate}
        onViewOrder={handleViewOrder}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isModalOpen}
        order={selectedOrder}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default OrderManagement;
