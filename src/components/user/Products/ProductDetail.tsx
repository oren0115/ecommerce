import React, { useState } from "react";
import { Button, Image, Select, SelectItem } from "@heroui/react";
import { Product, Size } from "../../../types";
import ProductReviews from "./ProductReviews";
import RelatedProducts from "./RelatedProducts";
import AddToWishlistButton from "../Whistlist/AddToWishlistButton";
import AddToCartButton from "../Cart/AddToCartButton";

interface ProductDetailProps {
  product: Product;
  sizes?: Size[];
  onAddToCart?: (product: Product, quantity: number, sizeId?: string) => void;
  onAddToWishlist?: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  sizes = [],
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  // const nextImage = () => {
  //   setSelectedImage((prev) => (prev + 1) % images.length);
  // };

  // const prevImage = () => {
  //   setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  // };

  // Use only actual product images
  const images = product.images?.map((img) => img.url) || [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image - Carousel on small screens, static on large screens */}
          <div className="relative">
            <div className="w-full aspect-square bg-white rounded-lg overflow-hidden">
              <Image
                src={images[selectedImage] || ""}
                alt={product.name}
                className="w-full h-full object-cover"
                classNames={{
                  wrapper: "w-full h-full",
                  img: "w-full h-full object-cover",
                }}
                fallbackSrc="https://via.placeholder.com/400x400?text=No+Image"
              />
            </div>

            {/* Image Counter - Always show on small screens */}
            <div className="lg:hidden absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {selectedImage + 1} / {Math.max(images.length, 1)}
            </div>
          </div>

          {/* Thumbnail Images - Hidden on small screens, shown on large screens */}
          {images.length > 1 && (
            <div className="hidden lg:flex space-x-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <Button
                  key={index}
                  isIconOnly
                  variant="bordered"
                  size="sm"
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 p-0 ${
                    selectedImage === index
                      ? "border-foreground"
                      : "border-default-200"
                  }`}>
                  <Image
                    src={
                      image || "https://via.placeholder.com/80x80?text=No+Image"
                    }
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                    classNames={{
                      wrapper: "w-full h-full",
                      img: "w-full h-full object-cover",
                    }}
                    fallbackSrc="https://via.placeholder.com/80x80?text=No+Image"
                  />
                </Button>
              ))}
            </div>
          )}

          {/* Mobile Image Dots - Always show on small screens for better UX */}
          <div className="lg:hidden flex justify-center space-x-2">
            {Array.from({ length: Math.max(images.length, 1) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  disabled={images.length <= 1}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    selectedImage === index
                      ? "bg-foreground"
                      : images.length > 1
                        ? "bg-default-300 hover:bg-default-400"
                        : "bg-gray-300 cursor-not-allowed"
                  }`}
                />
              )
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Product Name */}
          <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-default-500">Rating:</span>
              <span className="text-sm font-medium text-foreground">
                {product.rating ? product.rating.toFixed(1) : "0.0"} (
                {product.ratingCount || 0} reviews)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-default-500">Sold:</span>
              <span className="text-sm font-medium text-foreground">
                {product.salesCount || 0} items
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl font-bold text-foreground">
                {formatPrice(product.discountedPrice)}
              </span>
              {product.discountPercent > 0 && (
                <>
                  <span className="text-lg text-default-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm font-medium text-success bg-success-50 px-2 py-1 rounded">
                    -{product.discountPercent}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Size
              </label>
              <Select
                selectedKeys={selectedSize ? [selectedSize] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string;
                  setSelectedSize(selected || "");
                }}
                placeholder="Select size"
                variant="bordered"
                className="w-full">
                {sizes.map((size) => (
                  <SelectItem key={size._id}>{size.name}</SelectItem>
                ))}
              </Select>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <Button
                isIconOnly
                variant="bordered"
                size="sm"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}>
                -
              </Button>
              <span className="w-12 text-center text-foreground">
                {quantity}
              </span>
              <Button
                isIconOnly
                variant="bordered"
                size="sm"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}>
                +
              </Button>
              <span className="text-sm text-default-500">
                {product.stock} available
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <AddToCartButton
              product={product}
              className="w-full"
              variant="default"
              size="lg"
              selectedSize={selectedSize}
            />
            <AddToWishlistButton
              product={product}
              className="w-full"
              variant="outline"
              size="lg"
              showText={true}
            />
          </div>

          {/* Product Description */}
          <div className="border-t border-default-200 pt-6">
            <div className="text-sm text-default-600 leading-relaxed">
              <p className="mb-4">{product.description}</p>
              {product.detail && <p>{product.detail}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 pt-8 border-t border-default-200">
        <ProductReviews productId={product._id} />
      </div>

      {/* Related Products Section */}
      <RelatedProducts
        productId={product._id}
        categoryId={product.categoryIds[0]?._id || ""}
        currentProductName={product.name}
        limit={4}
      />
    </div>
  );
};

export default ProductDetail;
