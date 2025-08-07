import React from "react";
import { Button, Chip, Image } from "@heroui/react";
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
    <div className="relative bg-white">
      {/* Mobile Layout */}
      <div className="flex gap-3 p-4 border-b border-gray-200 last:border-b-0 sm:gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.name}
            className="w-16 h-16 object-cover rounded-lg sm:w-20 sm:h-20"
            radius="lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          {/* Top Row: Title and Remove Button */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2 sm:text-base">
                {item.name}
              </h3>
            </div>

            {/* Remove Button - Top Right on Mobile */}
            <Button
              isIconOnly
              color="danger"
              variant="light"
              size="sm"
              onPress={handleRemove}
              className="min-w-8 h-8 -mt-1 -mr-1 sm:hidden"
              aria-label="Remove item">
              <TrashIcon size={16} />
            </Button>
          </div>

          {/* Price Row */}
          <div className="flex items-center gap-2 mb-3">
            <p className="text-base font-semibold text-gray-900 sm:text-lg">
              Rp{" "}
              {(item.discountedPrice * item.quantity).toLocaleString("id-ID")}
            </p>
            {item.discountPercent > 0 && (
              <Chip
                color="success"
                variant="flat"
                size="sm"
                className="text-xs">
                -{item.discountPercent}%
              </Chip>
            )}
          </div>

          {/* Original Price if Discounted */}
          {item.discountPercent > 0 && (
            <div className="mb-3">
              <span className="text-sm text-gray-500 line-through">
                Rp {(item.price * item.quantity).toLocaleString("id-ID")}
              </span>
            </div>
          )}

          {/* Bottom Row: Quantity Controls and Desktop Remove Button */}
          <div className="flex items-center justify-between">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Qty:</span>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => handleQuantityChange(item.quantity - 1)}
                  isDisabled={item.quantity <= 1}
                  className="min-w-10 h-10 rounded-none hover:bg-gray-100 active:scale-95 transition-all duration-150"
                  aria-label="Decrease quantity">
                  <MinusIcon size={14} />
                </Button>

                <div className="flex items-center justify-center min-w-12 h-10 px-2 bg-white border-x border-gray-200">
                  <span className="text-sm font-medium text-gray-900">
                    {item.quantity}
                  </span>
                </div>

                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => handleQuantityChange(item.quantity + 1)}
                  isDisabled={item.quantity >= item.stock}
                  className="min-w-10 h-10 rounded-none hover:bg-gray-100 active:scale-95 transition-all duration-150"
                  aria-label="Increase quantity">
                  <PlusIcon size={14} />
                </Button>
              </div>
            </div>

            {/* Stock Info - Mobile Only */}
            {item.stock <= 10 && (
              <div className="text-xs text-orange-600 sm:hidden">
                {item.stock} left
              </div>
            )}

            {/* Desktop Remove Button */}
            <Button
              color="danger"
              variant="bordered"
              size="sm"
              onPress={handleRemove}
              startContent={<TrashIcon size={14} />}
              className="hidden sm:flex min-h-10">
              Remove
            </Button>
          </div>

          {/* Stock Warning - Desktop */}
          {item.stock <= 10 && (
            <div className="hidden sm:block mt-2">
              <span className="text-xs text-orange-600">
                Only {item.stock} items left in stock
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Loading State Overlay */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Touch feedback improvements */
        @media (max-width: 640px) {
          .active\\:scale-95:active {
            transform: scale(0.95);
          }

          /* Ensure proper touch targets */
          button {
            min-height: 44px;
            min-width: 44px;
          }

          /* Better tap highlighting */
          * {
            -webkit-tap-highlight-color: rgba(59, 130, 246, 0.1);
          }

          /* Smooth transitions for better UX */
          .transition-all {
            transition-duration: 150ms;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Better visual feedback for quantity controls */
          .hover\\:bg-gray-100:hover,
          .hover\\:bg-gray-100:active {
            background-color: rgb(243 244 246);
          }
        }

        /* Improved quantity selector styling */
        .quantity-selector {
          background: rgb(249 250 251);
          border: 1px solid rgb(229 231 235);
        }

        .quantity-input {
          background: white;
          border-left: 1px solid rgb(229 231 235);
          border-right: 1px solid rgb(229 231 235);
        }

        /* Price styling improvements */
        .price-primary {
          font-weight: 600;
          color: rgb(17 24 39);
        }

        .price-original {
          color: rgb(107 114 128);
          text-decoration: line-through;
          font-size: 0.875rem;
        }

        /* Discount chip styling */
        .discount-chip {
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.125rem 0.5rem;
        }

        /* Remove button hover effects */
        .remove-button:hover {
          border-color: rgb(220 38 38);
          color: rgb(220 38 38);
        }

        /* Stock warning styling */
        .stock-warning {
          color: rgb(217 119 6);
          font-size: 0.75rem;
          font-weight: 500;
        }

        /* Responsive adjustments */
        @media (min-width: 640px) {
          .cart-item-container {
            padding: 1.5rem;
          }

          .product-image {
            width: 5rem;
            height: 5rem;
          }
        }

        /* Animation for item updates */
        @keyframes quantityUpdate {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .quantity-updated {
          animation: quantityUpdate 0.2s ease-out;
        }

        /* Loading state */
        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(1px);
        }

        /* Improve accessibility */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Focus styles for better accessibility */
        button:focus-visible {
          outline: 2px solid rgb(59 130 246);
          outline-offset: 2px;
        }

        /* Swipe gesture hint (optional) */
        .swipe-hint {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(239, 68, 68, 0.1) 50%,
            transparent 100%
          );
        }
      `}</style>
    </div>
  );
};

export default CartItem;
