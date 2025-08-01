import { useState, useEffect, useRef } from "react";
import { Category } from "@/types";
import { categoryAPI } from "@/api/api";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface CategoriesSectionProps {
  onViewDetail: (productId: string) => void;
}

function CategoriesSection({ onViewDetail }: CategoriesSectionProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        const categoriesData = (response.data as any).data || [];
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2);
      } else if (window.innerWidth < 768) {
        setItemsPerView(3);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(4);
      } else if (window.innerWidth < 1280) {
        setItemsPerView(5);
      } else {
        setItemsPerView(6);
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const totalSlides = Math.ceil(categories.length / itemsPerView);

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
    if (categories.length > itemsPerView) {
      autoPlayRef.current = setInterval(nextSlide, 4000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [categories.length, itemsPerView]);

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
    if (categories.length > itemsPerView) {
      autoPlayRef.current = setInterval(nextSlide, 4000);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    onViewDetail(`shop?category=${categoryId}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded-lg w-32 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-4 w-28 h-28 bg-gray-200 rounded-2xl animate-pulse"
              style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="w-8 h-8 bg-gray-300 rounded-full mb-2"></div>
              <div className="h-4 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate transform for smooth sliding
  const transformX = -(currentIndex * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Kategori</h2>
        {categories.length > itemsPerView && (
          <div className="flex items-center space-x-2">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onClick={prevSlide}
              disabled={totalSlides <= 1}
              className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
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

      {/* Categories Carousel */}
      {categories.length > 0 ? (
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
                categories.length
              );
              const slideCategories = categories.slice(startIndex, endIndex);

              return (
                <div key={slideIndex} className="flex w-full flex-shrink-0">
                  {slideCategories.map((category, idx) => {
                    const isHovered = hoveredCategory === category._id;
                    const categoryImage =
                      category.thumbnailImage ||
                      "/images/category-images/aksesoris.jpeg";

                    return (
                      <div
                        key={category._id}
                        className={`px-2 ${
                          itemsPerView === 2
                            ? "w-1/2"
                            : itemsPerView === 3
                              ? "w-1/3"
                              : itemsPerView === 4
                                ? "w-1/4"
                                : itemsPerView === 5
                                  ? "w-1/5"
                                  : "w-1/6"
                        }`}>
                        <button
                          onClick={() => handleCategoryClick(category._id)}
                          onMouseEnter={() => setHoveredCategory(category._id)}
                          onMouseLeave={() => setHoveredCategory(null)}
                          className={`
                            group relative flex flex-col items-center justify-center cursor-pointer
                            w-full aspect-square
                            bg-white rounded-lg shadow-sm border border-gray-200
                            transform transition-all duration-300 ease-out
                            hover:shadow-md hover:border-gray-300
                            focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50
                            active:scale-95
                            animate-fade-in-up
                            ${isHovered ? "shadow-md border-gray-300" : ""}
                          `}
                          style={{
                            animationDelay: `${(slideIndex * itemsPerView + idx) * 80}ms`,
                          }}>
                          {/* Category Image */}
                          <div
                            className={`
                            relative w-full h-3/4 flex items-center justify-center
                            rounded-t-lg overflow-hidden
                          `}>
                            <img
                              src={categoryImage}
                              alt={category.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/images/category-images/aksesoris.jpeg";
                              }}
                              loading="lazy"
                            />
                          </div>

                          {/* Category Name */}
                          <div className="w-full h-1/4 flex items-center justify-center p-2">
                            <span
                              className={`
                              text-xs font-medium text-gray-700
                              transition-all duration-300 text-center leading-tight
                              group-hover:text-gray-900
                              ${isHovered ? "text-gray-900" : ""}
                            `}>
                              {category.name}
                            </span>
                          </div>

                          {/* Subtle Border */}
                          <div className="absolute inset-0 rounded-lg border border-gray-200 group-hover:border-gray-300 transition-colors duration-300" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum ada kategori
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            Kategori produk belum tersedia saat ini. Silakan cek kembali nanti.
          </p>
        </div>
      )}

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
    </div>
  );
}

export default CategoriesSection;
