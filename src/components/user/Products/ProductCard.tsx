import React from "react";
import { Image, Card, CardBody, Chip } from "@heroui/react";
import { Product } from "../../../types";
import ProductRating from "./ProductRating";
import AddToCartButton from "../Cart/AddToCartButton";
import AddToWishlistButton from "../Whistlist/AddToWishlistButton";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetail?: (productId: string) => void;
  onAddToWishlist?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetail }) => {
  const handleViewDetail = () => {
    if (onViewDetail) {
      onViewDetail(product._id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const formatSalesCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K+`;
    }
    return `${count}+`;
  };

  return (
    <Card className="group cursor-pointer product-card hover:shadow-lg transition-shadow duration-300">
      <CardBody className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            removeWrapper
            src={
              product.images?.[0]?.url ||
              "https://via.placeholder.com/300x300?text=No+Image"
            }
            alt={product.name}
            className="w-full h-full object-cover"
            fallbackSrc="https://via.placeholder.com/300x300?text=No+Image"
          />

          {/* Discount Badge */}
          {product.discountPercent > 0 && (
            <Chip
              size="sm"
              variant="solid"
              color="danger"
              className="absolute top-2 left-2 z-10 text-white bg-gray-900">
              -{product.discountPercent}%
            </Chip>
          )}

          {/* Wishlist Button */}
          <div className="absolute top-2 right-2 z-20">
            <AddToWishlistButton
              product={product}
              variant="ghost"
              size="sm"
              showText={false}
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90 rounded-full p-1"
            />
          </div>

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background bg-opacity-80 flex items-center justify-center z-30">
              <span className="text-foreground font-medium">Sold Out</span>
            </div>
          )}

          {/* Quick Add to Cart - appears on hover */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
            <div onClick={(e) => e.stopPropagation()}>
              <AddToCartButton
                product={product}
                variant="default"
                size="sm"
                className="w-full rounded-none shadow-lg bg-foreground text-background"
              />
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div
          className="space-y-2 p-3 cursor-pointer"
          onClick={handleViewDetail}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleViewDetail();
            }
          }}
          tabIndex={0}
          role="button">
          {/* Product Name */}
          <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* Rating and Sales */}
          <div className="flex items-center justify-between text-xs text-default-500">
            <ProductRating
              rating={product.rating}
              reviewCount={product.ratingCount}
              showReviewCount={false}
              size="sm"
            />
            <span>{formatSalesCount(product.salesCount)} sold</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-2">
            <span className="text-sm font-medium text-foreground">
              {formatPrice(product.discountedPrice)}
            </span>
            {product.discountPercent > 0 && (
              <span className="text-xs text-default-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProductCard;
