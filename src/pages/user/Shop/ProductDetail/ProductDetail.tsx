import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Image } from "@heroui/react";
import { Product, Size } from "../../../../types";
import { productAPI, sizeAPI } from "../../../../api/api";
import { addCacheBustingToProduct } from "../../../../utils/index";
import ProductReviews from "../../../../components/user/Products/ProductReviews";
import RelatedProducts from "../../../../components/user/Products/RelatedProducts";
import AddToWishlistButton from "../../../../components/user/Whistlist/AddToWishlistButton";
import AddToCartButton from "../../../../components/user/Cart/AddToCartButton";
// import { useCart } from "../../../../contexts/CartContext";
import Breadcrumb, {
  BreadcrumbItemData,
} from "../../../../components/common/Breadcrumb";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Available size options
  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "XXXXL"];

  // const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetchProductData();
    }
  }, [id, refreshKey]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError(null);

      const productResponse = await productAPI.getById(id!);
      const productData = (productResponse.data as any)?.data;

      const productWithCacheBusting = addCacheBustingToProduct(productData);
      setProduct(productWithCacheBusting);

      try {
        const sizesResponse = await sizeAPI.getAll();
        const sizesData = (sizesResponse.data as any)?.data || [];
        setSizes(Array.isArray(sizesData) ? sizesData : []);
      } catch (sizeError) {
        console.warn("No sizes available for this product:", sizeError);
        // Set default sizes if API fails
        setSizes([]);
      }
    } catch (err: any) {
      console.error("Error fetching product:", err);
      setError(
        err.response?.data?.message || "Failed to fetch product details"
      );
    } finally {
      setLoading(false);
    }
  };

  const forceRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (id) {
        forceRefresh();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const handleProductUpdate = (event: CustomEvent) => {
      if (event.detail?.productId === id) {
        forceRefresh();
      }
    };

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (
        event.data?.type === "PRODUCT_UPDATED" &&
        event.data?.productId === id
      ) {
        forceRefresh();
      }
    };

    window.addEventListener(
      "productUpdated",
      handleProductUpdate as EventListener
    );

    navigator.serviceWorker?.addEventListener(
      "message",
      handleServiceWorkerMessage
    );

    return () => {
      window.removeEventListener(
        "productUpdated",
        handleProductUpdate as EventListener
      );
      navigator.serviceWorker?.removeEventListener(
        "message",
        handleServiceWorkerMessage
      );
    };
  }, [id]);

  // Check if a size is available
  const isSizeAvailable = (sizeName: string): boolean => {
    // If no sizes data from API, assume all standard sizes are available
    if (!sizes || sizes.length === 0) {
      return true;
    }
    // Check if size exists in the sizes array from API
    return sizes.some(
      (size) =>
        size.name.toLowerCase() === sizeName.toLowerCase() ||
        size.name === sizeName
    );
  };

  // Get size stock (if available in your Size type)
  const getSizeStock = (sizeName: string): number | null => {
    if (!sizes || sizes.length === 0) {
      return null;
    }
    const sizeObj = sizes.find(
      (size) =>
        size.name.toLowerCase() === sizeName.toLowerCase() ||
        size.name === sizeName
    );
    return sizeObj?.stock || null;
  };

  const getBreadcrumbItems = (): BreadcrumbItemData[] => {
    const items: BreadcrumbItemData[] = [
      {
        label: "Home",
        href: "/",
      },
    ];

    if (product) {
      items.push({
        label: "Shop",
        href: "/shop",
      });

      if (product.categoryIds && product.categoryIds.length > 0) {
        const firstCategory = product.categoryIds[0];
        items.push({
          label: firstCategory.name,
          href: `/shop?category=${firstCategory._id}`,
        });
      }

      items.push({
        label: product.name,
        isActive: true,
      });
    }

    return items;
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleSizeSelect = (size: string) => {
    if (isSizeAvailable(size)) {
      setSelectedSize(size);
    }
  };

  // Use only actual product images
  const images = product?.images?.map((img) => img.url) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse mb-8">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: "Product Not Found", isActive: true },
            ]}
            className="mb-8"
          />
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Product not found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {error || "The product you are looking for does not exist."}
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/shop")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Back to Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={getBreadcrumbItems()} className="mb-8" />
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
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

                {/* Image Counter - Mobile */}
                <div className="lg:hidden absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {selectedImage + 1} / {Math.max(images.length, 1)}
                </div>
              </div>

              {/* Thumbnail Images - Desktop */}
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
                          image ||
                          "https://via.placeholder.com/80x80?text=No+Image"
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

              {/* Mobile Image Dots */}
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
              <h1 className="text-3xl font-bold text-foreground">
                {product.name}
              </h1>

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
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(product.discountedPrice)}
                  </span>
                  {product.discountPercent > 0 && (
                    <>
                      <span className="text-lg text-default-400 line-through">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(product.price)}
                      </span>
                      <span className="text-sm font-medium text-success bg-success-50 px-2 py-1 rounded">
                        -{product.discountPercent}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Pilih Ukuran:
                  </label>
                  {selectedSize && (
                    <span className="text-xs text-success-600 bg-success-50 px-2 py-1 rounded">
                      Dipilih: {selectedSize}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
                  {availableSizes.map((size) => {
                    const isAvailable = isSizeAvailable(size);
                    const isSelected = selectedSize === size;
                    const sizeStock = getSizeStock(size);

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeSelect(size)}
                        disabled={!isAvailable}
                        className={`
                          relative px-4 py-3 rounded-lg border text-sm font-medium 
                          transition-all duration-200 min-w-[60px]
                          ${
                            isSelected
                              ? "bg-foreground text-background border-foreground shadow-md"
                              : isAvailable
                                ? "bg-white border-default-300 text-foreground hover:border-foreground hover:bg-default-50"
                                : "bg-default-100 border-default-200 text-default-400 cursor-not-allowed"
                          }
                          ${!isAvailable ? "opacity-60" : ""}
                        `}
                        title={
                          !isAvailable
                            ? "Ukuran tidak tersedia"
                            : sizeStock
                              ? `Stok: ${sizeStock}`
                              : undefined
                        }>
                        {size}
                        {!isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-default-400 rotate-45"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {!selectedSize && (
                  <p className="text-xs text-warning-600 mt-2">
                    * Silakan pilih ukuran sebelum menambahkan ke keranjang
                  </p>
                )}

                {/* Size Guide Link */}
                <button
                  type="button"
                  className="text-xs text-primary hover:text-primary-600 underline"
                  onClick={() => {
                    // Add size guide modal or navigation logic here
                    console.log("Open size guide");
                  }}>
                  Panduan Ukuran
                </button>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Jumlah
                </label>
                <div className="flex items-center space-x-3">
                  <Button
                    isIconOnly
                    variant="bordered"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10">
                    -
                  </Button>
                  <div className="flex items-center justify-center w-16 h-10 border border-default-300 rounded-lg">
                    <span className="text-foreground font-medium">
                      {quantity}
                    </span>
                  </div>
                  <Button
                    isIconOnly
                    variant="bordered"
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10">
                    +
                  </Button>
                  <span className="text-sm text-default-500">
                    {product.stock} tersedia
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <AddToCartButton
                  product={product}
                  selectedSize={selectedSize}
                  quantity={quantity}
                  className="w-full"
                  variant="default"
                  size="lg"
                  disabled={!selectedSize}
                />
                <AddToWishlistButton
                  product={product}
                  className="w-full"
                  variant="outline"
                  size="lg"
                  showText={true}
                />
              </div>

              {/* Stock Alert */}
              {product.stock < 5 && product.stock > 0 && (
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-3">
                  <p className="text-sm text-warning-700">
                    ⚠️ Stok terbatas! Hanya tersisa {product.stock} item
                  </p>
                </div>
              )}

              {/* Product Description */}
              <div className="border-t border-default-200 pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Deskripsi Produk
                </h3>
                <div className="text-sm text-default-600 leading-relaxed space-y-2">
                  <p>{product.description}</p>
                  {product.detail && (
                    <p className="text-xs text-default-500">{product.detail}</p>
                  )}
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
      </div>
    </div>
  );
};

export default ProductDetail;
