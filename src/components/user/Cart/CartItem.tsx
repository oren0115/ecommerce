import React from "react";
import { Button, Input, Chip, Image } from "@heroui/react";
import { useCart } from "@/contexts/CartContext";
import { CartItem as CartItemType } from "@/types";
import { IconSvgProps } from "@/types";

const TrashIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
  <svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path
      d="M3 6H5H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MinusIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
  <svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path
      d="M5 12H19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlusIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
  <svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path
      d="M12 5V19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 12H19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= item.stock) {
      updateQuantity(item.productId, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
  };

  return (
    <div className="flex gap-4 p-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-shrink-0">
        <Image
          src={item.imageUrl}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-lg"
          radius="lg"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {item.name}
            </h3>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              Rp {(item.discountedPrice * item.quantity).toLocaleString()}
            </p>
            {item.discountPercent > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500 line-through">
                  Rp {item.price.toLocaleString()}
                </span>
                <Chip color="success" variant="flat" size="sm">
                  -{item.discountPercent}% off
                </Chip>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Qty:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => handleQuantityChange(item.quantity - 1)}
                isDisabled={item.quantity <= 1}
                className="min-w-8 h-8">
                <MinusIcon className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                value={item.quantity.toString()}
                onChange={(e) =>
                  handleQuantityChange(parseInt(e.target.value) || 1)
                }
                min={1}
                max={item.stock}
                className="w-16 text-center border-0"
                classNames={{
                  input: "text-center text-sm",
                  inputWrapper: "border-0 shadow-none",
                }}
              />
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => handleQuantityChange(item.quantity + 1)}
                isDisabled={item.quantity >= item.stock}
                className="min-w-8 h-8">
                <PlusIcon className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Button
            color="danger"
            variant="bordered"
            size="sm"
            onPress={handleRemove}
            startContent={<TrashIcon className="h-4 w-4" />}>
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
