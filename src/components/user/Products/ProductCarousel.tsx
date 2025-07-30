import React, { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Product } from "../../../types";
import ProductCard from "./ProductCard";

interface ProductCarouselProps {
  products: Product[];
  title?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onAddToCart?: (product: Product) => void;
  onViewDetail?: (productId: string) => void;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  title = "Produk Terbaru",
  autoPlay = true,
  autoPlayInterval = 3000,
  onAddToCart,
  onViewDetail,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);
  const totalSlides = Math.ceil(products.length / itemsPerView);

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
    if (autoPlay && products.length > itemsPerView) {
      autoPlayRef.current = setInterval(nextSlide, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, currentIndex, products.length, itemsPerView]);

  // Reset transition state after animation
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 600); // Match animation duration
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
    if (autoPlay && products.length > itemsPerView) {
      autoPlayRef.current = setInterval(nextSlide, autoPlayInterval);
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-8">{title}</h2>
        <div className="text-center text-gray-500">
          Tidak ada produk terbaru saat ini.
        </div>
      </div>
    );
  }

  // Calculate transform for smooth sliding
  const transformX = -(currentIndex * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
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
      </div>

      {/* Carousel Container */}
      <div
        className="relative overflow-hidden"
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
              products.length
            );
            const slideProducts = products.slice(startIndex, endIndex);

            return (
              <div key={slideIndex} className="flex w-full flex-shrink-0">
                {slideProducts.map((product) => (
                  <div
                    key={product._id}
                    className={`px-2 ${
                      itemsPerView === 1
                        ? "w-full"
                        : itemsPerView === 2
                          ? "w-1/2"
                          : "w-1/4"
                    }`}>
                    <ProductCard
                      product={product}
                      onAddToCart={onAddToCart}
                      onViewDetail={onViewDetail}
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
        <div className="flex justify-center mt-6 space-x-2">
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

      {/* View All Button */}
      <div className="text-center mt-6">
        <Button
          variant="bordered"
          className="border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 px-10 py-4 text-sm font-medium group"
          onClick={() => onViewDetail && onViewDetail("shop")}>
          <span className="group-hover:mr-2 transition-all duration-300">
            View All Products
          </span>
        </Button>
      </div>
    </div>
  );
};

export default ProductCarousel;
