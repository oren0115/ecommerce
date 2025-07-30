import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
} from "@heroui/react";
import { Order } from "@/types";
import {
  formatDate,
  formatCurrency,
  renderStatusChip,
  paymentTypeLabels,
} from "./utils.tsx";

interface OrderDetailModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  order,
  onClose,
}) => {
  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <p className="text-sm text-default-500">Order #{order.orderNumber}</p>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="order-info-card">
                <CardHeader>
                  <h4 className="font-semibold text-foreground">
                    Order Information
                  </h4>
                </CardHeader>
                <CardBody className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-default-500">
                      Order Number:
                    </span>
                    <span className="font-medium">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-default-500">
                      Order Date:
                    </span>
                    <span className="font-medium">
                      {formatDate(order.orderDate.toString())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-default-500">
                      Delivery Date:
                    </span>
                    <span className="font-medium">
                      {formatDate(order.deliveryDate.toString())}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-default-500">
                      Total Price:
                    </span>
                    <span className="font-medium text-primary">
                      {formatCurrency(order.totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-default-500">Status:</span>
                    {renderStatusChip(order.status, "order")}
                  </div>
                </CardBody>
              </Card>

              <Card className="order-info-card">
                <CardHeader>
                  <h4 className="font-semibold text-foreground">
                    Customer Information
                  </h4>
                </CardHeader>
                <CardBody className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-default-500">Name:</span>
                    <span className="font-medium">
                      {order.customerId.fullname}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-default-500">Email:</span>
                    <span className="font-medium">
                      {order.customerId.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-default-500">Phone:</span>
                    <span className="font-medium">
                      {order.customerId.phone || "N/A"}
                    </span>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Shipping Address */}
            <Card className="shipping-address-card">
              <CardHeader>
                <h4 className="font-semibold text-foreground">
                  Shipping Address
                </h4>
              </CardHeader>
              <CardBody>
                <p className="text-sm">
                  {order.shippingAddress}
                  {order.township && `, ${order.township}`}
                  {order.city && `, ${order.city}`}
                  {order.state && `, ${order.state}`}
                  {order.zipCode && ` ${order.zipCode}`}
                </p>
              </CardBody>
            </Card>

            {/* Payment Information */}
            <Card className="payment-info-card">
              <CardHeader>
                <h4 className="font-semibold text-foreground">
                  Payment Information
                </h4>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-default-500">
                      Payment Type:
                    </span>
                    <span className="font-medium">
                      {
                        paymentTypeLabels[
                          order.paymentType as keyof typeof paymentTypeLabels
                        ]
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-default-500">
                      Payment Status:
                    </span>
                    {order.paymentStatus &&
                      renderStatusChip(order.paymentStatus, "payment")}
                  </div>
                  {order.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-sm text-default-500">Paid At:</span>
                      <span className="font-medium">
                        {formatDate(order.paidAt.toString())}
                      </span>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Products */}
            <Card className="products-card">
              <CardHeader>
                <h4 className="font-semibold text-foreground">Products</h4>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {order.products.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          fallbackSrc="https://via.placeholder.com/64x64?text=No+Image"
                        />
                        <div>
                          <div className="font-medium text-foreground">
                            {item.name}
                          </div>
                          <div className="text-sm text-default-500">
                            Qty: {item.quantity}
                          </div>
                          <div className="text-sm text-default-500">
                            Price: {formatCurrency(item.price)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-primary">
                          {formatCurrency(item.totalPrice)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderDetailModal;
