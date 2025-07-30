import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { orderAPI } from "@/api/api";
// import "@/styles/qrisPayment.css";

interface QRISPaymentProps {
  orderId: string;
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

const QRISPayment: React.FC<QRISPaymentProps> = ({
  orderId,
  amount,
  onClose,
  onSuccess,
}) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");

  useEffect(() => {
    getQRISCode();
    // Poll for payment status every 5 seconds
    const interval = setInterval(checkPaymentStatus, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const getQRISCode = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getQRISCode(orderId);

      if ((response.data as any).success) {
        setQrCode((response.data as any).data.qrCode);
      } else {
        setError("Failed to get QRIS code");
      }
    } catch (error: any) {
      console.error("QRIS code error:", error);
      setError(
        error.response?.data?.error?.detail?.message ||
          "Failed to get QRIS code"
      );
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await orderAPI.checkPaymentStatus(orderId);

      if ((response.data as any).success) {
        const status = (response.data as any).data.transaction_status;
        setPaymentStatus(status);

        if (status === "settlement" || status === "capture") {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error("Payment status check error:", error);
    }
  };

  const generateQRCode = (qrString: string) => {
    // In a real implementation, you would use a QR code library
    // For now, we'll show a placeholder
    return (
      <div className="text-center">
        <div className="qr-code-container qris-qr-code">
          <Icon icon="mdi:qrcode" className="w-32 h-32 text-gray-400" />
        </div>
        <p className="text-xs text-gray-500 mt-2 font-mono">
          {qrString.substring(0, 30)}...
        </p>
      </div>
    );
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case "settlement":
      case "capture":
        return "success";
      case "pending":
        return "warning";
      case "deny":
      case "cancel":
      case "expire":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "settlement":
      case "capture":
        return "Payment Successful!";
      case "pending":
        return "Waiting for Payment";
      case "deny":
        return "Payment Denied";
      case "cancel":
        return "Payment Cancelled";
      case "expire":
        return "Payment Expired";
      default:
        return "Processing Payment";
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="max-w-md w-full mx-4">
          <CardBody className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-lg">Generating QR Code...</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="max-w-md w-full mx-4">
          <CardBody className="text-center">
            <Icon
              icon="mdi:close-circle"
              className="text-6xl text-danger mx-auto mb-4"
            />
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Button color="primary" onPress={getQRISCode}>
                Try Again
              </Button>
              <Button variant="bordered" onPress={onClose}>
                Close
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 qris-payment-modal">
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <h2 className="text-xl font-bold">QRIS Payment</h2>
          <p className="text-gray-600">Scan QR code with your payment app</p>
        </CardHeader>

        <CardBody className="text-center">
          <div className="mb-6">
            <Chip
              color={getStatusColor() as any}
              variant="flat"
              className="mb-4">
              {getStatusMessage()}
            </Chip>

            <div className="text-2xl font-bold text-gray-900 mb-2">
              Rp {amount.toLocaleString("id-ID")}
            </div>

            <p className="text-sm text-gray-500">Order ID: {orderId}</p>
          </div>

          {qrCode && (
            <div className="mb-6">
              {generateQRCode(qrCode)}

              <div className="payment-instructions qris-payment-steps">
                <p>📱 Open your payment app</p>
                <p>📷 Scan the QR code above</p>
                <p>✅ Complete the payment</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button
              color="primary"
              className="w-full"
              onPress={checkPaymentStatus}>
              Check Payment Status
            </Button>

            <Button variant="bordered" className="w-full" onPress={onClose}>
              Close
            </Button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 Supported apps: GoPay, ShopeePay, OVO, DANA, LinkAja, and other
              QRIS-enabled apps
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default QRISPayment;
