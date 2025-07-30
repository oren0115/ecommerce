import { useState, useEffect } from "react";
import { productAPI } from "@/api/api";
import { Product } from "@/types";
import { addCacheBustingToProducts } from "../../../utils";
import BestSellingSection from "@/components/user/Home/BestSellingSection";
import { BlogSection } from "@/components/user/Blog";
import {
  HeroSection,
  CategoriesSection,
  LatestProductsSection,
  PromotionalCarousel,
} from "@/components/user/Home";
// import "@/styles/Home.css";

function Home() {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await productAPI.getAll({ limit: 12 });
        if ((response.data as any).success) {
          const products = (response.data as any).data.items || [];

          // Add cache busting to product images
          const productsWithCacheBusting = addCacheBustingToProducts(products);

          setLatestProducts(productsWithCacheBusting);
        } else {
          console.error("API response not successful:", response.data);
        }
      } catch (error: any) {
        console.error("Error fetching latest products:", error);
        console.error("Error details:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  // Listen for product update events
  useEffect(() => {
    const handleProductUpdate = () => {
      // Reload the page to get fresh data
      window.location.reload();
    };

    // Listen for custom events
    window.addEventListener(
      "productUpdated",
      handleProductUpdate as EventListener
    );

    // Listen for service worker messages
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === "PRODUCT_UPDATED") {
        window.location.reload();
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
  }, []);

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
  };

  const handleViewDetail = (productId: string) => {
    if (productId === "shop") {
      window.location.href = "/shop";
    } else if (productId.startsWith("category/")) {
      window.location.href = `/${productId}`;
    } else if (productId.startsWith("shop?category=")) {
      window.location.href = `/${productId}`;
    } else {
      window.location.href = `/shop/product/${productId}`;
    }
  };

  const handlePromotionalClick = () => {
    // Navigate to shop or specific category based on slide
    window.location.href = "/shop";
  };

  return (
    <div className="min-h-screen">
      {/* Promotional Carousel */}
      <section>
        <PromotionalCarousel onSlideClick={handlePromotionalClick} />
      </section>

      {/* Categories Section */}
      <CategoriesSection onViewDetail={handleViewDetail} />

      {/* Hero Section */}
      <HeroSection />

      {/* Latest Products Carousel */}
      <LatestProductsSection
        latestProducts={latestProducts}
        loading={loading}
        onAddToCart={handleAddToCart}
        onViewDetail={handleViewDetail}
      />

      {/* Best Selling Section */}
      <BestSellingSection
        onAddToCart={handleAddToCart}
        onViewDetail={handleViewDetail}
      />

      {/* Blog Section */}
      <BlogSection
        title="Read Our Blog"
        subtitle="Discover the latest fashion trends, styling tips, and industry insights from our expert team"
        limit={3}
      />
    </div>
  );
}

export default Home;
