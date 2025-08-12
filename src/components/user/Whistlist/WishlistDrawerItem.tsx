import React, { useState } from "react";
import { Button, Image } from "@heroui/react";
import { WishlistItem as WishlistItemType, Product } from "../../../types";
import { Icon } from "@iconify/react";

interface WishlistDrawerItemProps {
  wishlistItem: WishlistItemType;
  onRemove: (wishlistId: string) => void;
  onAddToCart: (product: Product) => Promise<void>;
}

const WishlistDrawerItem: React.FC<WishlistDrawerItemProps> = ({
  wishlistItem,
  onRemove,
  onAddToCart,
}) => {
  const product = wishlistItem.productId as Product;

  const handleRemove = () => {
    onRemove(wishlistItem._id);
  };

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (isAddingToCart) return; // Prevent multiple clicks

    try {
      setIsAddingToCart(true);
      await onAddToCart(product);
      // Success feedback could be added here
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Error feedback could be added here
    } finally {
      setIsAddingToCart(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  return (
    <div className="group relative flex gap-3 p-3 hover:bg-gray-50/50 transition-all duration-200 border-b border-gray-100 last:border-b-0">
      {/* Product Image */}
      <div className="relative flex-shrink-0">
        <Image
          src={
            product.images?.[0]?.url ||
            "https://via.placeholder.com/64x64?text=No+Image"
          }
          alt={product.name}
          className="w-16 h-16 object-cover rounded-xl shadow-sm"
          radius="lg"
          fallbackSrc="https://via.placeholder.com/64x64?text=No+Image"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900 leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-base font-semibold text-gray-900">
              {formatPrice(product.discountedPrice)}
            </span>
            {product.discountPercent > 0 && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Stock Status - Minimalist */}
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-400" : "bg-red-400"}`}
            />
            <span
              className={`text-xs font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {product.stock > 0 ? `${product.stock} tersedia` : "Stok habis"}
            </span>
          </div>
        </div>

        {/* Actions - Minimalist buttons */}
        <div className="flex items-center justify-between pt-1">
          <Button
            color="primary"
            variant="flat"
            size="sm"
            onPress={() => handleAddToCart()}
            isDisabled={product.stock === 0 || isAddingToCart}
            isLoading={isAddingToCart}
            className="h-8 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 border-0 font-medium transition-colors"
            startContent={
              !isAddingToCart && (
                <Icon icon="mdi:plus" className="h-3.5 w-3.5" />
              )
            }>
            {isAddingToCart ? "Menambahkan..." : "Keranjang"}
          </Button>

          <Button
            color="danger"
            variant="light"
            size="sm"
            onPress={handleRemove}
            className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors min-w-0"
            isIconOnly>
            <Icon icon="mdi:trash-can" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishlistDrawerItem;
