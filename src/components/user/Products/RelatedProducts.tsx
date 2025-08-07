import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, Skeleton, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Product } from "../../../types";
import { productAPI } from "../../../api/api";
import ProductCard from "./ProductCard";
// import "../../../styles/RelatedProducts.css";

interface RelatedProductsProps {
  productId: string;
  categoryId: string;
  currentProductName: string;
  limit?: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  productId,
  categoryId,
  limit = 4,
}) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1); // Mobile: 1 item
      } else if (window.innerWidth < 768) {
        setItemsPerView(2); // Small (sm): 2 items
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3); // Tablet: 3 items
      } else {
        setItemsPerView(4); // Desktop: 4 items
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productAPI.getRelated(productId, limit);
        setRelatedProducts((response.data as any).data);
      } catch (err: any) {
        console.error("Error fetching related products:", err);
        setError("Failed to load related products");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, categoryId, limit]);

  const handleViewDetail = (productId: string) => {
    window.location.href = `/shop/product/${productId}`;
  };

  const totalSlides = Math.ceil(relatedProducts.length / itemsPerView);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (relatedProducts.length > itemsPerView) {
      autoPlayRef.current = setInterval(nextSlide, 5000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [relatedProducts.length, itemsPerView]);

  // Reset transition state after animation
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (relatedProducts.length > itemsPerView) {
      autoPlayRef.current = setInterval(nextSlide, 5000);
    }
  };

  if (loading) {
    return (
      <div className="related-products">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Related Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="w-full">
              <CardBody className="p-4">
                <Skeleton className="w-full h-48 rounded-lg mb-4" />
                <div className="space-y-3">
                  <Skeleton className="w-3/4 rounded-lg">
                    <div className="h-4 bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-1/2 rounded-lg">
                    <div className="h-4 bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-2/3 rounded-lg">
                    <div className="h-4 bg-default-200"></div>
                  </Skeleton>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || relatedProducts.length === 0) {
    return null; // Don't show anything if there's an error or no related products
  }

  // Check if all related products are from the same category as the current product
  const getRelatedProductsTitle = () => {
    if (relatedProducts.length === 0) return "Related Products";

    // Get the first product's categories
    const firstProductCategories = relatedProducts[0]?.categoryIds || [];
    const allSameCategory = relatedProducts.every((product) =>
      product.categoryIds.some((cat) =>
        firstProductCategories.some((firstCat) => firstCat._id === cat._id)
      )
    );

    if (allSameCategory && firstProductCategories.length > 0) {
      return `More ${firstProductCategories[0].name}`;
    }

    return "Related Products";
  };

  // Calculate transform for smooth sliding
  const transformX = -(currentIndex * 100);

  return (
    <div className="related-products mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground ">
          {getRelatedProductsTitle()}
        </h3>
        {totalSlides > 1 && (
          <div className="flex items-center space-x-2">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onClick={prevSlide}
              disabled={totalSlides <= 1}
              className="hover:bg-gray-100 transition-colors duration-200">
              <Icon icon="heroicons:chevron-left" className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onClick={nextSlide}
              disabled={totalSlides <= 1}
              className="hover:bg-gray-100 transition-colors duration-200">
              <Icon icon="heroicons:chevron-right" className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Carousel Container */}
      <div
        className="relative overflow-hidden mb-8"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <div
          className={`flex transition-transform duration-600 ease-in-out ${
            isTransitioning ? "transform-gpu" : ""
          }`}
          style={{ transform: `translateX(${transformX}%)` }}>
          {Array.from({ length: totalSlides }, (_, slideIndex) => {
            const startIndex = slideIndex * itemsPerView;
            const endIndex = Math.min(
              startIndex + itemsPerView,
              relatedProducts.length
            );
            const slideProducts = relatedProducts.slice(startIndex, endIndex);

            return (
              <div key={slideIndex} className="flex w-full flex-shrink-0">
                {slideProducts.map((product) => (
                  <div
                    key={product._id}
                    className={`px-1 sm:px-2 ${
                      itemsPerView === 1
                        ? "w-full"
                        : itemsPerView === 2
                          ? "w-1/2"
                          : itemsPerView === 3
                            ? "w-1/3"
                            : "w-1/4"
                    }`}>
                    <ProductCard
                      product={product}
                      onViewDetail={handleViewDetail}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots Indicator */}
      {totalSlides > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalSlides }, (_, index) => (
            <Button
              key={index}
              isIconOnly
              size="sm"
              variant="light"
              className={`w-2 h-2 rounded-full p-0 min-w-0 transition-colors duration-200 ${
                index === currentIndex
                  ? "bg-black"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
