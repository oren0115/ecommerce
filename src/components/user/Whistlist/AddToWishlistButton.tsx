import React, { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/react";
import { Product } from "../../../types";
import { wishlistAPI } from "../../../api/api";
import { useWishlist } from "../../../contexts/WishlistContext";
import { useAuth } from "../../../contexts/AuthContext";

interface AddToWishlistButtonProps {
  product: Product;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  showText?: boolean;
}

const HeartIcon = ({ size = 24, width, height, ...props }: any) => (
  <svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FilledHeartIcon = ({ size = 24, width, height, ...props }: any) => (
  <svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const AddToWishlistButton: React.FC<AddToWishlistButtonProps> = ({
  product,
  className = "",
  size = "sm",
  variant = "default",
  showText = true,
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { updateWishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }

    // Only check wishlist status if user is authenticated
    if (isAuthenticated) {
      // Add debounce to prevent rapid API calls
      checkTimeoutRef.current = setTimeout(() => {
        checkWishlistStatus();
      }, 300);
    } else {
      // Reset state for unauthenticated users
      setIsInWishlist(false);
      setWishlistId(null);
      setIsChecking(false);
    }

    // Cleanup timeout on unmount or dependency change
    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [product._id, isAuthenticated]);

  const checkWishlistStatus = async () => {
    if (!isAuthenticated) {
      setIsInWishlist(false);
      setWishlistId(null);
      setIsChecking(false);
      return;
    }

    try {
      setIsChecking(true);
      const response = await wishlistAPI.checkWishlistStatus(product._id);
      const isInWishlist =
        (response.data as any).success &&
        (response.data as any).data.isInWishlist;
      setIsInWishlist(isInWishlist);
      if (isInWishlist && (response.data as any).data.wishlistItem) {
        setWishlistId((response.data as any).data.wishlistItem._id);
      } else {
        setWishlistId(null);
      }
    } catch (error: any) {
      console.error("Error checking wishlist status:", error);
      // Don't show error for 401 (unauthorized) - user just needs to login
      if (error.response?.status !== 401 && error.code !== "ECONNABORTED") {
        console.error("Wishlist check failed:", error.message);
      }
      setIsInWishlist(false);
      setWishlistId(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (isLoading || isChecking) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
      return;
    }

    try {
      setIsLoading(true);

      if (isInWishlist && wishlistId) {
        // Remove from wishlist
        const response = await wishlistAPI.removeFromWishlist(wishlistId);
        if ((response.data as any).success) {
          setIsInWishlist(false);
          setWishlistId(null);
          updateWishlistCount(-1); // Decrease count
        }
      } else {
        // Add to wishlist
        const response = await wishlistAPI.addToWishlist({
          productId: product._id,
        });
        if ((response.data as any).success) {
          setIsInWishlist(true);
          updateWishlistCount(1); // Increase count
          // Refresh the wishlist status to get the new wishlist ID
          await checkWishlistStatus();
        }
      }
    } catch (error: any) {
      console.error("Error toggling wishlist:", error);
      if (error.response?.status === 401) {
        // Redirect to login if token expired
        window.location.href = "/auth/login";
      }
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

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

  const getDefaultButtonClass = () => {
    if (isInWishlist) {
      switch (variant) {
        case "outline":
          return "border border-red-500 text-red-500 hover:bg-red-50";
        case "ghost":
          return "text-red-500 hover:bg-red-50";
        default:
          return "bg-red-500 text-white hover:bg-red-600";
      }
    } else {
      switch (variant) {
        case "outline":
          return "border border-gray-300 text-gray-700 hover:bg-gray-50";
        case "ghost":
          return "text-gray-700 hover:bg-gray-100";
        default:
          return "bg-gray-100 text-gray-700 hover:bg-gray-200";
      }
    }
  };

  const getButtonText = () => {
    if (isLoading) return "Loading...";
    if (isChecking) return "Checking...";
    if (!isAuthenticated) return "Login to Wishlist";
    if (isInWishlist) return "Remove from Wishlist";
    return "Add to Wishlist";
  };

  return (
    <Button
      onPress={handleToggleWishlist}
      isLoading={isLoading || isChecking}
      className={`add-to-wishlist-button ${getDefaultButtonClass()} ${className}`}
      startContent={
        isInWishlist ? (
          <FilledHeartIcon className="h-4 w-4" />
        ) : (
          <HeartIcon className="h-4 w-4" />
        )
      }
      {...getButtonProps()}>
      {showText && getButtonText()}
    </Button>
  );
};

export default AddToWishlistButton;
