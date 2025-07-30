import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Spinner,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { orderAPI } from "../../../../api/api";
import { Order } from "../../../../types";
import { useAuthRedirect } from "../../../../hooks/useAuthRedirect";
import Breadcrumb, {
  BreadcrumbItemData,
} from "../../../../components/common/Breadcrumb";
// import '../../../../styles/orderDetail.css';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuthRedirect();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderAPI.getById(id!);

      if ((response.data as any).success) {
        setOrder((response.data as any).data);
      } else {
        setError("Failed to fetch order details");
      }
    } catch (err: any) {
      console.error("Error fetching order:", err);
      setError(
        err.response?.data?.error?.detail?.message ||
          "Failed to fetch order details"
      );
    } finally {
      setLoading(false);
    }
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

  const getBreadcrumbItems = (): BreadcrumbItemData[] => {
    return [
      { label: "Home", href: "/" },
      { label: "Orders", href: "/orders" },
      { label: `Order #${order?.orderNumber || "Loading..."}`, isActive: true },
    ];
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
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600 font-medium">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={getBreadcrumbItems()} className="mb-8" />

          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Icon icon="mdi:alert-circle" className="text-2xl text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Order Not Found
            </h3>
            <p className="text-gray-500 mb-6">
              {error ||
                "The order you are looking for does not exist or you do not have permission to view it."}
            </p>
            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Button
                color="primary"
                size="lg"
                className="font-medium bg-gray-900 text-white"
                onPress={() => navigate("/orders")}
                startContent={
                  <Icon icon="mdi:arrow-left" className="h-5 w-5" />
                }>
                Back to Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb items={getBreadcrumbItems()} />

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Icon icon="mdi:receipt" className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order #{order.orderNumber}
                  </h1>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Icon icon="mdi:calendar" className="h-4 w-4 mr-1" />
                    Placed on {formatDate(order.orderDate.toString())}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-center lg:text-right space-y-3">
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(order.totalPrice)}
              </div>
              <Chip
                size="lg"
                color={statusColors[order.status as keyof typeof statusColors]}
                variant="flat"
                className="font-semibold"
                startContent={getStatusIcon(order.status)}>
                {order.status.toUpperCase()}
              </Chip>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Icon icon="mdi:information" className="h-5 w-5 mr-2" />
                  Order Information
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Order Number
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {order.orderNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Order Date
                    </p>
                    <p className="text-gray-900">
                      {formatDate(order.orderDate.toString())}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Delivery Date
                    </p>
                    <p className="text-gray-900">
                      {formatDate(order.deliveryDate.toString())}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Delivery Type
                    </p>
                    <p className="text-gray-900 capitalize">
                      {order.deliveryType}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Payment Information */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Icon icon="mdi:credit-card" className="h-5 w-5 mr-2" />
                  Payment Information
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Payment Method
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {
                        paymentTypeLabels[
                          order.paymentType as keyof typeof paymentTypeLabels
                        ]
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Payment Status
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
                        className="font-medium">
                        {order.paymentStatus.toUpperCase()}
                      </Chip>
                    )}
                  </div>
                  {order.paidAt && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Paid At
                      </p>
                      <p className="text-gray-900">
                        {formatDate(order.paidAt.toString())}
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment Actions */}
                {order.paymentType !== "cod" &&
                  order.paymentStatus === "pending" && (
                    <div className="pt-4 border-t border-gray-100">
                      <Button
                        size="lg"
                        className="font-medium bg-gray-900 text-white"
                        onPress={() => {
                          if (order.paymentUrl) {
                            window.location.href = order.paymentUrl;
                          }
                        }}
                        startContent={
                          <Icon icon="mdi:credit-card" className="h-5 w-5" />
                        }>
                        Pay Now
                      </Button>
                    </div>
                  )}
              </CardBody>
            </Card>

            {/* Shipping Information */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Icon icon="mdi:map-marker" className="h-5 w-5 mr-2" />
                  Shipping Information
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-2">
                  <p className="text-gray-900">{order.shippingAddress}</p>
                  {order.township && (
                    <p className="text-gray-600">{order.township}</p>
                  )}
                  {order.city && <p className="text-gray-600">{order.city}</p>}
                  {order.state && (
                    <p className="text-gray-600">{order.state}</p>
                  )}
                  {order.zipCode && (
                    <p className="text-gray-600">{order.zipCode}</p>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Products */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Icon
                    icon="mdi:package-variant-closed"
                    className="h-5 w-5 mr-2"
                  />
                  Products ({order.products.length} items)
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                {order.products.map((item, index) => (
                  <div key={item._id}>
                    <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                      <div className="relative">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">
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
                    {index < order.products.length - 1 && (
                      <Divider className="my-4" />
                    )}
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Status */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Icon icon="mdi:progress-clock" className="h-5 w-5 mr-2" />
                  Order Status
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {order.status.toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {getOrderStatusMessage(order.status)}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Order Summary */}
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Icon icon="mdi:calculator" className="h-5 w-5 mr-2" />
                  Order Summary
                </h3>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-gray-900">
                    {order.deliveryType === "express" ? "Express" : "Standard"}
                  </span>
                </div>
                <Divider />
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
              </CardBody>
            </Card>

            {/* Actions */}
            <Card className="bg-white shadow-sm">
              <CardBody className="space-y-3">
                <Button
                  size="lg"
                  variant="bordered"
                  className="w-full font-medium"
                  onPress={() => navigate("/orders")}
                  startContent={
                    <Icon icon="mdi:arrow-left" className="h-4 w-4" />
                  }>
                  Back to Orders
                </Button>

                {order.paymentType !== "cod" &&
                  order.paymentStatus === "pending" && (
                    <Button
                      size="lg"
                      className="w-full font-medium bg-gray-900 text-white"
                      onPress={() => {
                        if (order.paymentUrl) {
                          window.location.href = order.paymentUrl;
                        }
                      }}
                      startContent={
                        <Icon icon="mdi:credit-card" className="h-4 w-4" />
                      }>
                      Pay Now
                    </Button>
                  )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
