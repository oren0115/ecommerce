import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product, Size } from "../../../../types";
import { productAPI, sizeAPI } from "../../../../api/api";
import { addCacheBustingToProduct } from "../../../../utils/index";
import { ProductDetail as ProductDetailComponent } from "../../../../components/user/Products";
import { useCart } from "../../../../contexts/CartContext";
import Breadcrumb, {
  BreadcrumbItemData,
} from "../../../../components/common/Breadcrumb";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key for cache busting

  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetchProductData();
    }
  }, [id, refreshKey]); // Add refreshKey to dependencies

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch product details with cache busting
      const productResponse = await productAPI.getById(id!);
      const productData = (productResponse.data as any)?.data;

      // Add cache busting to product images
      const productWithCacheBusting = addCacheBustingToProduct(productData);
      setProduct(productWithCacheBusting);

      // Fetch sizes (optional - for products that have sizes)
      try {
        const sizesResponse = await sizeAPI.getAll();
        const sizesData = (sizesResponse.data as any)?.data || [];
        setSizes(Array.isArray(sizesData) ? sizesData : []);
      } catch (sizeError) {
        console.log("No sizes available for this product");
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

  // Add function to force refresh
  const forceRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Add periodic refresh for product data (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (id) {
        forceRefresh();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [id]);

  // Listen for product update events
  useEffect(() => {
    const handleProductUpdate = (event: CustomEvent) => {
      if (event.detail?.productId === id) {
        console.log("Product update detected, refreshing...");
        forceRefresh();
      }
    };

    // Listen for custom events
    window.addEventListener(
      "productUpdated",
      handleProductUpdate as EventListener
    );

    // Listen for service worker messages
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (
        event.data?.type === "PRODUCT_UPDATED" &&
        event.data?.productId === id
      ) {
        console.log(
          "Product update detected via service worker, refreshing..."
        );
        forceRefresh();
      }
    };

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
  }, [id, forceRefresh]);

  const handleAddToCart = (product: Product, quantity: number) => {
    addToCart(product, quantity);
  };

  // Generate breadcrumb items
  const getBreadcrumbItems = (): BreadcrumbItemData[] => {
    const items: BreadcrumbItemData[] = [
      {
        label: "Home",
        href: "/",
      },
    ];

    if (product) {
      // Add Shop link
      items.push({
        label: "Shop",
        href: "/shop",
      });

      // Add category if available
      if (product.categoryIds && product.categoryIds.length > 0) {
        const firstCategory = product.categoryIds[0];
        items.push({
          label: firstCategory.name,
          href: `/shop?category=${firstCategory._id}`,
        });
      }

      // Add current product (active)
      items.push({
        label: product.name,
        isActive: true,
      });
    }

    return items;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading breadcrumb */}
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
          {/* Error breadcrumb */}
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
        {/* Breadcrumb */}
        <Breadcrumb items={getBreadcrumbItems()} className="mb-8" />

        {/* Product Detail Component */}
        <ProductDetailComponent
          product={product}
          sizes={sizes}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
