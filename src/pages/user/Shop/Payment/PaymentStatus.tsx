import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardBody, Button, Chip, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { orderAPI } from "@/api/api";

const PaymentStatus: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get("order_id");
  const transactionStatus = searchParams.get("transaction_status");
  const paymentType = searchParams.get("payment_type");

  useEffect(() => {
    if (orderId) {
      checkPaymentStatus();
    } else {
      setLoading(false);
      setError("No order ID found");
    }
  }, [orderId]);

  const checkPaymentStatus = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.checkPaymentStatus(orderId!);

      if ((response.data as any).success) {
        setPaymentStatus((response.data as any).data);
      } else {
        setError("Failed to get payment status");
      }
    } catch (error: any) {
      console.error("Payment status check error:", error);
      setError(
        error.response?.data?.error?.detail?.message ||
          "Failed to check payment status"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (transactionStatus === "settlement" || transactionStatus === "capture") {
      return <Icon icon="mdi:check-circle" className="text-6xl text-success" />;
    } else if (transactionStatus === "pending") {
      return <Icon icon="mdi:clock" className="text-6xl text-warning" />;
    } else {
      return <Icon icon="mdi:close-circle" className="text-6xl text-danger" />;
    }
  };

  const getStatusColor = () => {
    if (transactionStatus === "settlement" || transactionStatus === "capture") {
      return "success";
    } else if (transactionStatus === "pending") {
      return "warning";
    } else {
      return "danger";
    }
  };

  const getStatusMessage = () => {
    switch (transactionStatus) {
      case "settlement":
      case "capture":
        return "Payment Successful!";
      case "pending":
        return "Payment Pending";
      case "deny":
        return "Payment Denied";
      case "cancel":
        return "Payment Cancelled";
      case "expire":
        return "Payment Expired";
      default:
        return "Payment Status Unknown";
    }
  };

  const getStatusDescription = () => {
    switch (transactionStatus) {
      case "settlement":
      case "capture":
        return "Your payment has been processed successfully. Your order will be processed soon.";
      case "pending":
        return "Your payment is being processed. Please wait for confirmation.";
      case "deny":
        return "Your payment was denied. Please try again with a different payment method.";
      case "cancel":
        return "Your payment was cancelled. You can try again or choose a different payment method.";
      case "expire":
        return "Your payment has expired. Please place a new order.";
      default:
        return "Please contact customer support for assistance.";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "gopay":
        return "simple-icons:gopay";
      case "shopeepay":
        return "simple-icons:shopeepay";
      case "ovo":
        return "simple-icons:ovo";
      case "dana":
        return "simple-icons:dana";
      case "linkaja":
        return "simple-icons:linkaja";
      case "qris":
        return "mdi:qrcode";
      case "credit_card":
        return "mdi:credit-card";
      case "bank_transfer":
        return "mdi:bank";
      default:
        return "mdi:credit-card";
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "gopay":
        return "GoPay";
      case "shopeepay":
        return "ShopeePay";
      case "ovo":
        return "OVO";
      case "dana":
        return "DANA";
      case "linkaja":
        return "LinkAja";
      case "qris":
        return "QRIS";
      case "credit_card":
        return "Credit Card";
      case "bank_transfer":
        return "Bank Transfer";
      default:
        return method;
    }
  };

  const renderPaymentMethodInfo = () => {
    if (!paymentStatus?.payment_type) return null;

    return (
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <div className="flex items-center gap-3 mb-2">
          <Icon
            icon={getPaymentMethodIcon(paymentStatus.payment_type)}
            className="w-6 h-6 text-blue-600"
          />
          <span className="font-semibold text-blue-900">
            {getPaymentMethodName(paymentStatus.payment_type)}
          </span>
        </div>

        {paymentStatus.payment_type === "qris" && paymentStatus.qr_string && (
          <div className="mt-3 p-3 bg-white rounded border">
            <p className="text-sm text-gray-600 mb-2">
              Scan QR Code with your payment app:
            </p>
            <div className="text-center">
              <div className="inline-block p-2 bg-white border rounded">
                <Icon icon="mdi:qrcode" className="w-16 h-16 text-gray-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              QR Code: {paymentStatus.qr_string.substring(0, 20)}...
            </p>
          </div>
        )}

        {paymentStatus.va_numbers && paymentStatus.va_numbers.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">
              Virtual Account Numbers:
            </p>
            {paymentStatus.va_numbers.map((va: any, index: number) => (
              <div key={index} className="bg-white p-2 rounded border mb-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {va.bank.toUpperCase()}
                  </span>
                  <span className="text-sm font-mono">{va.va_number}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-lg">Checking payment status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardBody className="text-center">
            <Icon
              icon="mdi:close-circle"
              className="text-6xl text-danger mx-auto mb-4"
            />
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button color="primary" onPress={() => navigate("/")}>
              Back to Home
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardBody className="text-center">
          {getStatusIcon()}

          <h2 className="text-xl font-bold mt-4 mb-2">{getStatusMessage()}</h2>

          <Chip color={getStatusColor() as any} variant="flat" className="mb-4">
            {transactionStatus?.toUpperCase()}
          </Chip>

          <p className="text-gray-600 mb-6">{getStatusDescription()}</p>

          {renderPaymentMethodInfo()}

          {paymentStatus && (
            <div className="text-left bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Payment Details</h3>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">Order ID:</span>{" "}
                  {paymentStatus.order_id}
                </div>
                <div>
                  <span className="font-medium">Amount:</span> Rp{" "}
                  {paymentStatus.gross_amount?.toLocaleString("id-ID")}
                </div>
                <div>
                  <span className="font-medium">Payment Type:</span>{" "}
                  {getPaymentMethodName(
                    paymentStatus.payment_type || paymentType || "unknown"
                  )}
                </div>
                {paymentStatus.transaction_time && (
                  <div>
                    <span className="font-medium">Transaction Time:</span>{" "}
                    {new Date(paymentStatus.transaction_time).toLocaleString(
                      "id-ID"
                    )}
                  </div>
                )}
                {paymentStatus.fraud_status && (
                  <div>
                    <span className="font-medium">Security Status:</span>{" "}
                    {paymentStatus.fraud_status}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button
              color="primary"
              className="w-full"
              onPress={() => navigate("/orders")}>
              View My Orders
            </Button>

            <Button
              variant="bordered"
              className="w-full"
              onPress={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PaymentStatus;
