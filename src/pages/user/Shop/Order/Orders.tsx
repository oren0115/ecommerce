import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Spinner,
  Pagination,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "../../../../api/api";
import { Order } from "../../../../types";
import { useAuthRedirect } from "../../../../hooks/useAuthRedirect";

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuthRedirect();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<string>("all");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const statusColors = {
    pending: "warning",
    processing: "primary",
    shipped: "secondary",
    delivered: "success",
    cancelled: "danger",
    paid: "success",
    unpaid: "warning",
  } as const;

  const paymentStatusColors = {
    pending: "warning",
    paid: "success",
    failed: "danger",
    expired: "danger",
  } as const;

  const paymentTypeLabels = {
    cod: "Cash on Delivery",
    bank_transfer: "Bank Transfer",
    credit_card: "Credit Card",
    e_wallet: "E-Wallet",
    qris: "QRIS",
  } as const;

  const statusFilters = [
    { key: "all", label: "All Orders", icon: "mdi:view-list" },
    { key: "pending", label: "Pending", icon: "mdi:clock" },
    { key: "processing", label: "Processing", icon: "mdi:cog" },
    { key: "shipped", label: "Shipped", icon: "mdi:truck" },
    { key: "delivered", label: "Delivered", icon: "mdi:check-circle" },
    { key: "cancelled", label: "Cancelled", icon: "mdi:close-circle" },
  ];

  // Fetch all orders once on component mount and when page changes
  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
      };
      const response = await orderAPI.getAll(params);

      if ((response.data as any).success) {
        setAllOrders((response.data as any).data.items);
        setTotalPages((response.data as any).data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders on client side for smooth transitions
  const filteredOrders = allOrders.filter(
    (order) => filter === "all" || order.status === filter
  );

  // Handle filter change with smooth transition
  const handleFilterChange = (newFilter: string) => {
    if (newFilter === filter) return;

    setIsTransitioning(true);

    // Small delay to show transition effect
    setTimeout(() => {
      setFilter(newFilter);
      setCurrentPage(1);
      setIsTransitioning(false);
    }, 150);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
      case "paid":
        return <Icon icon="mdi:check-circle" className="text-success" />;
      case "shipped":
        return <Icon icon="mdi:truck" className="text-secondary" />;
      case "processing":
        return <Icon icon="mdi:cog" className="text-primary" />;
      case "cancelled":
        return <Icon icon="mdi:close-circle" className="text-danger" />;
      default:
        return <Icon icon="mdi:clock" className="text-warning" />;
    }
  };

  const getOrderStatusMessage = (status: string) => {
    const messages = {
      pending: "Order is being processed",
      processing: "Order is being prepared",
      shipped: "Order is on the way",
      delivered: "Order has been delivered",
      cancelled: "Order has been cancelled",
      paid: "Payment completed",
      unpaid: "Payment pending",
    };
    return messages[status as keyof typeof messages] || "Status unknown";
  };

  // Show loading while checking authentication
  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="relative">
              <Spinner size="lg" color="primary" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track and manage all your orders in one place
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filterItem) => (
              <Button
                key={filterItem.key}
                size="sm"
                variant={filter === filterItem.key ? "solid" : "light"}
                color={filter === filterItem.key ? "primary" : "default"}
                className={`
                  transition-all duration-300 ease-in-out transform
                  ${
                    filter === filterItem.key
                      ? "bg-gray-900 text-white scale-105 shadow-md"
                      : "hover:bg-gray-100 text-gray-600 hover:scale-105"
                  }
                  ${isTransitioning && filter === filterItem.key ? "animate-pulse" : ""}
                `}
                onPress={() => handleFilterChange(filterItem.key)}
                startContent={
                  <Icon icon={filterItem.icon} className="h-4 w-4" />
                }
                disabled={isTransitioning}>
                {filterItem.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Content with transition */}
        <div
          className={`
          transition-all duration-300 ease-in-out
          ${isTransitioning ? "opacity-50 transform scale-98" : "opacity-100 transform scale-100"}
        `}>
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110">
                <Icon
                  icon="mdi:package-variant"
                  className="text-2xl text-gray-400"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === "all" ? "No Orders Yet" : `No ${filter} Orders`}
              </h3>
              <p className="text-gray-500 mb-6">
                {filter === "all"
                  ? "Start shopping to see your orders here"
                  : `You don't have any ${filter} orders at the moment`}
              </p>
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                <Button
                  color="primary"
                  size="lg"
                  className="font-medium bg-gray-900 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  onPress={() => (window.location.href = "/shop")}
                  startContent={
                    <Icon icon="mdi:shopping" className="h-5 w-5" />
                  }>
                  Start Shopping
                </Button>
                {filter !== "all" && (
                  <Button
                    variant="bordered"
                    size="lg"
                    className="font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    onPress={() => handleFilterChange("all")}>
                    View All Orders
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order, index) => (
                <Card
                  key={order._id}
                  className={`
                    bg-white shadow-sm hover:shadow-md transition-all duration-300 ease-in-out
                    transform hover:scale-[1.01] hover:-translate-y-1
                    ${isTransitioning ? "opacity-70" : "opacity-100"}
                  `}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}>
                  <CardHeader className="pb-4 border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0 w-full">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg transition-all duration-300 hover:bg-gray-200">
                            <Icon
                              icon="mdi:receipt"
                              className="h-5 w-5 text-gray-600"
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              Order #{order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <Icon
                                icon="mdi:calendar"
                                className="h-4 w-4 mr-1"
                              />
                              {formatDate(order.orderDate.toString())}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-center lg:text-right space-y-2">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(order.totalPrice)}
                        </div>
                        <Chip
                          size="md"
                          color={
                            statusColors[
                              order.status as keyof typeof statusColors
                            ]
                          }
                          variant="flat"
                          className="font-semibold transition-all duration-300 hover:scale-105"
                          startContent={getStatusIcon(order.status)}>
                          {order.status.toUpperCase()}
                        </Chip>
                      </div>
                    </div>
                  </CardHeader>

                  <CardBody className="space-y-6">
                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:bg-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Icon
                            icon="mdi:credit-card"
                            className="h-4 w-4 mr-2"
                          />
                          Payment Method
                        </h4>
                        <p className="text-gray-600 font-medium">
                          {
                            paymentTypeLabels[
                              order.paymentType as keyof typeof paymentTypeLabels
                            ]
                          }
                        </p>
                        {order.paymentStatus && (
                          <Chip
                            size="sm"
                            color={
                              paymentStatusColors[
                                order.paymentStatus as keyof typeof paymentStatusColors
                              ]
                            }
                            variant="flat"
                            className="mt-2 font-medium">
                            {order.paymentStatus.toUpperCase()}
                          </Chip>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:bg-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Icon
                            icon="mdi:map-marker"
                            className="h-4 w-4 mr-2"
                          />
                          Delivery Address
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {order.shippingAddress}
                          {order.city && `, ${order.city}`}
                          {order.state && `, ${order.state}`}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 transition-all duration-300 hover:bg-gray-100">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                          <Icon
                            icon="mdi:truck-delivery"
                            className="h-4 w-4 mr-2"
                          />
                          Delivery Date
                        </h4>
                        <p className="text-gray-600 font-medium">
                          {formatDate(order.deliveryDate.toString())}
                        </p>
                      </div>
                    </div>

                    {/* Products Section */}
                    <div className="bg-gray-50 rounded-lg p-6 transition-all duration-300 hover:bg-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <Icon
                          icon="mdi:package-variant-closed"
                          className="h-5 w-5 mr-2"
                        />
                        Products ({order.products.length} items)
                      </h4>
                      <div className="space-y-4">
                        {order.products.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
                            <div className="relative">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg transition-all duration-300 hover:scale-110"
                              />
                              <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center transition-all duration-300 hover:scale-110">
                                {item.quantity}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.quantity} × {formatCurrency(item.price)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-gray-900">
                                {formatCurrency(item.totalPrice)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg transition-all duration-300 hover:bg-gray-200">
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Order Status
                          </p>
                          <p className="text-sm text-gray-500">
                            {getOrderStatusMessage(order.status)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          size="md"
                          variant="bordered"
                          className="font-medium transition-all duration-300 hover:scale-105 hover:shadow-md"
                          onPress={() => navigate(`/orders/${order._id}`)}
                          startContent={
                            <Icon icon="mdi:eye" className="h-4 w-4" />
                          }>
                          View Details
                        </Button>

                        {order.paymentType !== "cod" &&
                          order.paymentStatus === "pending" && (
                            <Button
                              size="md"
                              className="font-medium text-black transition-all duration-300 hover:scale-105 hover:shadow-md"
                              onPress={() => {
                                if (order.paymentUrl) {
                                  window.location.href = order.paymentUrl;
                                }
                              }}
                              startContent={
                                <Icon
                                  icon="mdi:credit-card"
                                  className="h-4 w-4"
                                />
                              }>
                              Pay Now
                            </Button>
                          )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="bg-white rounded-lg shadow-sm p-4 transition-all duration-300 hover:shadow-md">
                    <Pagination
                      total={totalPages}
                      page={currentPage}
                      onChange={setCurrentPage}
                      showControls
                      color="primary"
                      size="lg"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
