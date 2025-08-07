import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/types";
import { IconSvgProps } from "@/types";

const CartIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
  <svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path
      d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
  <svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path
      d="M20 6L9 17L4 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  selectedSize?: string;
  quantity?: number;
  disabled?: boolean;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  className = "",
  variant = "default",
  size = "md",
  // selectedSize,
  quantity,
  disabled,
}) => {
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentQuantity = getItemQuantity(product._id);
  const isInCart = currentQuantity > 0;

  const getButtonProps = () => {
    const sizeMap = {
      sm: "sm" as const,
      md: "md" as const,
      lg: "lg" as const,
    };

    return {
      size: sizeMap[size],
    };
  };

  const handleAddToCart = async () => {
    if (product.stock === 0 || disabled) return;

    if (!isAuthenticated) {
      // Redirect to login page with return URL
      navigate("/auth/login", { state: { from: window.location.pathname } });
      return;
    }

    setIsAdding(true);

    // Simulate a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    addToCart(product, quantity || 1);
    setIsAdding(false);
    setShowSuccess(true);

    // Hide success message after 2 seconds
    setTimeout(() => setShowSuccess(false), 2000);
  };

  if (product.stock === 0) {
    return (
      <Button
        disabled
        className={`opacity-50 cursor-not-allowed bg-gray-400 text-gray-600 ${className}`}
        {...getButtonProps()}>
        Out of Stock
      </Button>
    );
  }

  if (showSuccess) {
    return (
      <Button
        disabled
        className={`bg-gray-600 text-white ${className}`}
        startContent={<CheckIcon className="h-4 w-4" />}
        {...getButtonProps()}>
        Added to Cart
      </Button>
    );
  }

  if (isInCart) {
    return (
      <Button
        onPress={handleAddToCart}
        isLoading={isAdding}
        className={`bg-gray-800 text-white hover:bg-gray-900 ${className}`}
        startContent={<CartIcon className="h-4 w-4" />}
        {...getButtonProps()}>
        {isAdding ? "Adding..." : `Add More (${currentQuantity})`}
      </Button>
    );
  }

  // Default button styling based on variant
  const getDefaultButtonClass = () => {
    switch (variant) {
      case "outline":
        return "border border-black text-black hover:bg-gray-50";
      case "ghost":
        return "text-black hover:bg-gray-50";
      default:
        return "bg-black text-white hover:bg-gray-800";
    }
  };

  return (
    <Button
      onPress={handleAddToCart}
      isLoading={isAdding}
      className={`${getDefaultButtonClass()} ${className}`}
      startContent={<CartIcon className="h-4 w-4" />}
      {...getButtonProps()}>
      {isAdding
        ? "Adding..."
        : isAuthenticated
          ? "Add to Cart"
          : "Login to Add"}
    </Button>
  );
};

export default AddToCartButton;
