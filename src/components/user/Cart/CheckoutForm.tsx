import React, { useState } from "react";
import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { orderAPI } from "@/api/api";

interface ShippingForm {
  shippingAddress: string;
  township: string;
  city: string;
  state: string;
  zipCode: string;
  deliveryDate: string;
  paymentType: string;
  deliveryType: string;
}

interface CheckoutFormProps {
  onSuccess: (data: any) => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess, onError }) => {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ShippingForm>({
    shippingAddress: user?.shippingAddress || "",
    township: "",
    city: "",
    state: "",
    zipCode: "",
    deliveryDate: "",
    paymentType: "cod",
    deliveryType: "standard",
  });

  const paymentMethods = [
    {
      value: "cod",
      label: "Cash on Delivery",
      shortLabel: "COD",
      icon: "lucide:banknote",
      description: "Pay when you receive your order",
      color: "success",
      popular: true,
    },
    {
      value: "bank_transfer",
      label: "Bank Transfer",
      shortLabel: "Bank",
      icon: "lucide:building-2",
      description: "BCA, BNI, BRI, Mandiri Virtual Account",
      color: "primary",
    },
    {
      value: "credit_card",
      label: "Credit Card",
      shortLabel: "Card",
      icon: "lucide:credit-card",
      description: "Visa, Mastercard, JCB, American Express",
      color: "secondary",
    },
    {
      value: "e_wallet",
      label: "E-Wallet",
      shortLabel: "E-Wallet",
      icon: "lucide:smartphone",
      description: "GoPay, ShopeePay, OVO, DANA, LinkAja",
      color: "warning",
    },
    {
      value: "qris",
      label: "QRIS",
      shortLabel: "QRIS",
      icon: "lucide:qr-code",
      description: "Universal QR code payment - scan with any payment app",
      color: "danger",
    },
  ];

  const deliveryTypes = [
    {
      value: "standard",
      label: "Standard Delivery",
      subtitle: "3-5 business days",
      price: 0,
      icon: "lucide:truck",
    },
    {
      value: "express",
      label: "Express Delivery",
      subtitle: "1-2 business days",
      price: 15000,
      icon: "lucide:zap",
    },
  ];

  const handleInputChange = (field: keyof ShippingForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateDeliveryFee = () => {
    const selectedDelivery = deliveryTypes.find(
      (d) => d.value === formData.deliveryType
    );
    return selectedDelivery?.price || 0;
  };

  const calculateTotal = () => {
    return cart.total + calculateDeliveryFee();
  };

  const getMinDeliveryDate = () => {
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 1);
    return minDate.toISOString().split("T")[0];
  };

  const getMaxDeliveryDate = () => {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      onError("Please log in to place an order");
      return;
    }

    if (cart.items.length === 0) {
      onError("Your cart is empty");
      return;
    }

    // Validate cart items
    const invalidItems = cart.items.filter(
      (item) => !item.productId || item.quantity <= 0
    );
    if (invalidItems.length > 0) {
      onError(
        "Some items in your cart are invalid. Please refresh and try again."
      );
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        totalPrice: calculateTotal(),
        products: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: formData.shippingAddress,
        township: formData.township,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        deliveryDate: formData.deliveryDate,
        paymentType: formData.paymentType,
        deliveryType: formData.deliveryType,
      };

      const response = await orderAPI.create(orderData as any);

      if ((response.data as any).success) {
        clearCart();

        if (formData.paymentType === "cod") {
          onSuccess({
            orderId: (response.data as any).order._id,
            message: "Order placed successfully! You will pay on delivery.",
            type: "cod",
          });
        } else if ((response.data as any).paymentUrl) {
          // For QRIS payments, show QR code if available
          if (
            formData.paymentType === "qris" &&
            (response.data as any).qrCode
          ) {
            onSuccess({
              orderId: (response.data as any).order._id,
              message:
                "QRIS payment initiated. Please scan the QR code with your payment app.",
              type: "qris",
              qrCode: (response.data as any).qrCode,
              paymentUrl: (response.data as any).paymentUrl,
              amount: calculateTotal(),
            });
          } else {
            // Redirect to payment gateway
            window.location.href = (response.data as any).paymentUrl;
          }
        } else {
          onSuccess({
            orderId: (response.data as any).order._id,
            message: "Order placed successfully!",
            type: "online",
          });
        }
      }
    } catch (error: any) {
      console.error("Error creating order:", error);
      console.error("Error response:", error.response?.data);

      // Extract detailed error message from backend
      let errorMessage = "Failed to create order";

      if (error.response?.data?.error?.detail?.errors) {
        // Handle validation errors
        const validationErrors = error.response.data.error.detail.errors;
        errorMessage = validationErrors
          .map((err: any) => `${err.path}: ${err.msg}`)
          .join(", ");
      } else if (error.response?.data?.error?.detail?.message) {
        errorMessage = error.response.data.error.detail.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
        <h1 className="text-lg font-semibold text-gray-900">Complete Order</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in your shipping and payment details
        </p>
      </div>

      <div className="px-4 py-4 space-y-4 sm:px-6 sm:space-y-6 pb-32">
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Shipping Information */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 sm:p-6 sm:rounded-2xl">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                <Icon icon="lucide:map-pin" className="w-4 h-4 text-gray-600" />
              </div>
              <h3 className="text-base font-medium text-gray-900 sm:text-lg">
                Shipping Address
              </h3>
            </div>

            <div className="space-y-4 mb-4">
              <Input
                label="Complete Address"
                placeholder="Street address, building, apartment"
                value={formData.shippingAddress}
                onChange={(e) =>
                  handleInputChange("shippingAddress", e.target.value)
                }
                variant="bordered"
                classNames={{
                  input: "text-gray-700",
                  inputWrapper:
                    "border-gray-200 hover:border-gray-300 group-data-[focus=true]:border-blue-500 transition-colors duration-200 min-h-[48px]",
                  label: "text-sm sm:text-base",
                }}
                required
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Township/District"
                  placeholder="Township"
                  value={formData.township}
                  onChange={(e) =>
                    handleInputChange("township", e.target.value)
                  }
                  variant="bordered"
                  classNames={{
                    input: "text-gray-700",
                    inputWrapper:
                      "border-gray-200 hover:border-gray-300 group-data-[focus=true]:border-blue-500 transition-colors duration-200 min-h-[48px]",
                    label: "text-sm sm:text-base",
                  }}
                />
                <Input
                  label="City"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  variant="bordered"
                  classNames={{
                    input: "text-gray-700",
                    inputWrapper:
                      "border-gray-200 hover:border-gray-300 group-data-[focus=true]:border-blue-500 transition-colors duration-200 min-h-[48px]",
                    label: "text-sm sm:text-base",
                  }}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="State/Province"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  variant="bordered"
                  classNames={{
                    input: "text-gray-700",
                    inputWrapper:
                      "border-gray-200 hover:border-gray-300 group-data-[focus=true]:border-blue-500 transition-colors duration-200 min-h-[48px]",
                    label: "text-sm sm:text-base",
                  }}
                  required
                />
                <Input
                  label="ZIP Code"
                  placeholder="12345"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  variant="bordered"
                  classNames={{
                    input: "text-gray-700",
                    inputWrapper:
                      "border-gray-200 hover:border-gray-300 group-data-[focus=true]:border-blue-500 transition-colors duration-200 min-h-[48px]",
                    label: "text-sm sm:text-base",
                  }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 sm:p-6 sm:rounded-2xl">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                <Icon icon="lucide:truck" className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-base font-medium text-gray-900 sm:text-lg">
                Delivery Method
              </h3>
            </div>

            <div className="space-y-3 mb-4 sm:mb-6">
              {deliveryTypes.map((delivery) => (
                <label
                  key={delivery.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 active:scale-[0.98] ${
                    formData.deliveryType === delivery.value
                      ? "border-gray-500 bg-gray-50"
                      : "border-gray-200"
                  }`}>
                  <input
                    type="radio"
                    name="deliveryType"
                    value={delivery.value}
                    checked={formData.deliveryType === delivery.value}
                    onChange={(e) =>
                      handleInputChange("deliveryType", e.target.value)
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                      formData.deliveryType === delivery.value
                        ? "bg-blue-100"
                        : "bg-gray-100"
                    }`}>
                    <Icon
                      icon={delivery.icon}
                      className={`w-5 h-5 transition-colors duration-200 ${
                        formData.deliveryType === delivery.value
                          ? "text-gray-600"
                          : "text-gray-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm sm:text-base">
                      {delivery.label}
                    </div>
                    <div className="text-xs text-gray-500 sm:text-sm">
                      {delivery.subtitle}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 text-sm sm:text-base">
                      {delivery.price > 0
                        ? `Rp ${delivery.price.toLocaleString("id-ID")}`
                        : "Free"}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <Input
              type="date"
              label="Preferred Delivery Date"
              value={formData.deliveryDate}
              onChange={(e) =>
                handleInputChange("deliveryDate", e.target.value)
              }
              min={getMinDeliveryDate()}
              max={getMaxDeliveryDate()}
              variant="bordered"
              classNames={{
                input: "text-gray-700",
                inputWrapper:
                  "border-gray-200 hover:border-gray-300 group-data-[focus=true]:border-blue-500 transition-colors duration-200 min-h-[48px]",
                label: "text-sm sm:text-base",
              }}
              required
            />
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 sm:p-6 sm:rounded-2xl">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center">
                <Icon
                  icon="lucide:credit-card"
                  className="w-4 h-4 text-purple-600"
                />
              </div>
              <h3 className="text-base font-medium text-gray-900 sm:text-lg">
                Payment Method
              </h3>
            </div>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 active:scale-[0.98] ${
                    formData.paymentType === method.value
                      ? "border-gray-500 bg-gray-50"
                      : "border-gray-200"
                  }`}>
                  <input
                    type="radio"
                    name="paymentType"
                    value={method.value}
                    checked={formData.paymentType === method.value}
                    onChange={(e) =>
                      handleInputChange("paymentType", e.target.value)
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                      formData.paymentType === method.value
                        ? "bg-blue-100"
                        : "bg-gray-100"
                    }`}>
                    <Icon
                      icon={method.icon}
                      className={`w-5 h-5 transition-colors duration-200 ${
                        formData.paymentType === method.value
                          ? "text-gray-600"
                          : "text-gray-500"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 text-sm sm:text-base">
                        <span className="sm:hidden">{method.shortLabel}</span>
                        <span className="hidden sm:inline">{method.label}</span>
                      </span>
                      {method.popular && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 truncate sm:text-sm">
                      {method.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </form>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 sm:p-6 sm:rounded-2xl">
          <h3 className="text-base font-medium text-gray-900 mb-4 sm:text-lg sm:mb-6">
            Order Summary
          </h3>

          <div className="space-y-3 mb-4 sm:space-y-4 sm:mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base">
                Subtotal ({cart.totalItems} items)
              </span>
              <span className="font-medium text-sm sm:text-base">
                Rp {cart.total.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base">
                Delivery Fee
              </span>
              <span className="font-medium text-sm sm:text-base">
                {calculateDeliveryFee() > 0
                  ? `Rp ${calculateDeliveryFee().toLocaleString("id-ID")}`
                  : "Free"}
              </span>
            </div>

            <div className="h-px bg-gray-200"></div>

            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 text-base sm:text-lg">
                Total
              </span>
              <span className="font-bold text-gray-900 text-base sm:text-lg">
                Rp {calculateTotal().toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className=" bg-white border-t border-gray-200 p-4 sm:px-6">
        <Button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200 min-h-[48px] text-base font-medium"
          size="lg"
          isLoading={loading}
          disabled={cart.items.length === 0}>
          {loading
            ? "Processing..."
            : formData.paymentType === "cod"
              ? "Place COD Order"
              : "Proceed to Payment"}
        </Button>

        <p className="text-xs text-gray-500 text-center mt-2 sm:text-sm">
          By placing your order, you agree to our Terms of Service
        </p>
      </div>

      {/* Enhanced Mobile Styles */}
    </div>
  );
};

export default CheckoutForm;
