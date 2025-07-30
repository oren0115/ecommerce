import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Spinner,
  Divider,
} from "@heroui/react";
import { WishlistItem as WishlistItemType } from "../../../types";
import { wishlistAPI } from "../../../api/api";
import { useWishlist } from "../../../contexts/WishlistContext";
import { useCart } from "../../../contexts/CartContext";
import WishlistDrawerItem from "./WishlistDrawerItem";
import { Icon } from "@iconify/react";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { updateWishlistCount } = useWishlist();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<WishlistItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchWishlist();
    }
  }, [isOpen]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await wishlistAPI.getAll({ limit: 50 }); // Get more items for drawer

      if ((response.data as any).success) {
        setWishlistItems((response.data as any).data.wishlistItems || []);
      } else {
        setError((response.data as any).message || "Failed to fetch wishlist");
      }
    } catch (err: any) {
      console.error("Error fetching wishlist:", err);
      setError(err.response?.data?.message || "Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (wishlistId: string) => {
    try {
      const response = await wishlistAPI.removeFromWishlist(wishlistId);

      if ((response.data as any).success) {
        // Remove item from local state
        setWishlistItems((prev) =>
          prev.filter((item) => item._id !== wishlistId)
        );
        updateWishlistCount(-1); // Update global count
      } else {
        setError(
          (response.data as any).message ||
            "Failed to remove item from wishlist"
        );
      }
    } catch (err: any) {
      console.error("Error removing from wishlist:", err);
      setError(
        err.response?.data?.message || "Failed to remove item from wishlist"
      );
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const totalValue = wishlistItems.reduce((sum, item) => {
    const product = item.productId as any;
    return sum + (product.discountedPrice || product.price || 0);
  }, 0);

  const handleAddAllToCart = async () => {
    // Add all items to cart
    wishlistItems.forEach((item) => handleAddToCart(item.productId));

    // Remove all items from wishlist
    for (const item of wishlistItems) {
      await handleRemoveFromWishlist(item._id);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton={true}
      placement="right"
      size="sm"
      classNames={{
        base: "h-full rounded-l-none",
        wrapper: "h-full",
      }}>
      <DrawerContent>
        <DrawerHeader className="flex items-center justify-between border-b border-divider">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">Wishlist</span>
          </div>
          <Button
            isIconOnly
            variant="light"
            onPress={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <Icon icon="mdi:close" className="h-5 w-5" />
          </Button>
        </DrawerHeader>

        <DrawerBody className="flex-1 overflow-hidden p-0">
          {loading ? (
            // Loading State
            <div className="flex flex-col items-center justify-center h-full">
              <Spinner size="lg" />
              <p className="text-default-500 mt-4">Loading wishlist...</p>
            </div>
          ) : error ? (
            // Error State
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="text-danger mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <p className="text-default-500 mb-4">{error}</p>
              <Button
                color="primary"
                variant="flat"
                onPress={fetchWishlist}
                className="bg-gray-900 text-white">
                Try Again
              </Button>
            </div>
          ) : wishlistItems.length === 0 ? (
            // Empty Wishlist
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Icon
                icon="mdi:heart"
                className="h-16 w-16 text-default-300 mb-4"
              />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-default-500 mb-6 max-w-sm">
                Start adding products to your wishlist to save them for later.
              </p>
              <Button
                color="primary"
                className="bg-gray-900 text-white"
                onPress={() => {
                  onClose();
                  navigate("/shop");
                }}>
                Browse Products
              </Button>
            </div>
          ) : (
            <>
              {/* Wishlist Items */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {wishlistItems.map((item) => (
                    <WishlistDrawerItem
                      key={item._id}
                      wishlistItem={item}
                      onRemove={handleRemoveFromWishlist}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>

              {/* Summary */}
              <Divider className="mx-4" />
              <div className="flex justify-between items-center p-4">
                <span className="text-default-600">Total Value</span>
                <span className="font-semibold text-foreground">
                  {formatPrice(totalValue)}
                </span>
              </div>
            </>
          )}
        </DrawerBody>

        {wishlistItems.length > 0 && (
          <DrawerFooter className="border-t border-divider">
            <Button
              color="primary"
              startContent={
                <Icon icon="mdi:shopping-cart" className="h-4 w-4" />
              }
              onPress={handleAddAllToCart}
              className="w-full bg-gray-900 text-white">
              Add All to Cart
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default WishlistDrawer;
