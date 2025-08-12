import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";
import { promotionalCarouselAPI } from "@/api/api";
import { PromotionalSlide } from "@/types";

interface PromotionalCarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onSlideClick?: (slide: PromotionalSlide) => void;
}

const PromotionalCarousel: React.FC<PromotionalCarouselProps> = ({
  autoPlay = true,
  autoPlayInterval = 3000,
  onSlideClick,
}) => {
  const [slides, setSlides] = useState<PromotionalSlide[]>([]);
  const [, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedRef = useRef(false);

  // Fetch promotional slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const response = await promotionalCarouselAPI.getActive();
        if ((response.data as any).success) {
          setSlides((response.data as any).data || []);
        }
      } catch (error) {
        console.error("Error fetching promotional slides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Sample slides if none provided
  const defaultSlides: PromotionalSlide[] = [
    {
      _id: "1",
      title: "Summer Collection",
      subtitle: "Up to 70% Off",
      description:
        "Discover our exclusive summer collection with incredible deals on fashion, electronics, and more.",
      date: "Valid until July 31, 2025",
      image: {
        url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      },
      buttonText: "Shop Now",
      backgroundColor:
        "linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)",
      textColor: "#ffffff",
      status: "active",
      order: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "2",
      title: "Tech Innovation",
      subtitle: "New Arrivals",
      description:
        "Experience the latest in technology with our cutting-edge gadgets and smart devices.",
      date: "Limited Time Offer",
      image: {
        url: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=600&fit=crop",
      },
      buttonText: "Explore",
      backgroundColor:
        "linear-gradient(135deg, rgba(240, 147, 251, 0.8) 0%, rgba(245, 87, 108, 0.8) 100%)",
      textColor: "#ffffff",
      status: "active",
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "3",
      title: "Wellness Journey",
      subtitle: "Health & Beauty",
      description:
        "Transform your lifestyle with premium wellness products and beauty essentials.",
      date: "Special Launch Price",
      image: {
        url: "https://images.unsplash.com/photo-1506629905825-b19c356cc39d?w=800&h=600&fit=crop",
      },
      buttonText: "Get Started",
      backgroundColor:
        "linear-gradient(135deg, rgba(79, 172, 254, 0.8) 0%, rgba(0, 242, 254, 0.8) 100%)",
      textColor: "#ffffff",
      status: "active",
      order: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const activeSlides = slides.length > 0 ? slides : defaultSlides;

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) =>
        prevIndex === activeSlides.length - 1 ? 0 : prevIndex + 1
      );
      setTimeout(() => setIsTransitioning(false), 300);
    }
  };

  const goToSlide = (index: number) => {
    if (!isTransitioning && index !== currentIndex) {
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 300);
      // Reset progress when manually changing slides
      setProgress(0);
    }
  };

  // Clear all intervals
  const clearAllIntervals = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  // Start auto-play
  const startAutoPlay = () => {
    if (!autoPlay || activeSlides.length <= 1 || isPausedRef.current) return;

    clearAllIntervals();

    // Reset progress
    setProgress(0);

    // Progress update interval (every 50ms for smooth progress bar)
    const progressStep = (50 / autoPlayInterval) * 100;
    let currentProgress = 0;

    progressIntervalRef.current = setInterval(() => {
      currentProgress += progressStep;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        currentProgress = 0;
        setProgress(0);
      }
    }, 50);

    // Main slide change interval
    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        nextSlide();
      }
    }, autoPlayInterval);
  };

  // Effect for auto-play
  useEffect(() => {
    startAutoPlay();

    return () => {
      clearAllIntervals();
    };
  }, [autoPlay, autoPlayInterval, activeSlides.length]);

  // Reset progress when slide changes
  useEffect(() => {
    setProgress(0);
    if (autoPlay && !isPausedRef.current) {
      // Restart the auto-play cycle when slide changes
      const timer = setTimeout(() => {
        startAutoPlay();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  const handleMouseEnter = () => {
    isPausedRef.current = true;
    clearAllIntervals();
    setProgress(0);
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
    if (autoPlay) {
      startAutoPlay();
    }
  };

  if (!activeSlides || activeSlides.length === 0) {
    return (
      <div className="flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 mx-auto flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>
          <p className="text-gray-500">Tidak ada promosi saat ini</p>
        </div>
      </div>
    );
  }

  const currentSlide = activeSlides[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden group h-96"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {/* Background Image with smooth transition */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-out ${
          isTransitioning ? "scale-105 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{
          backgroundImage: `url(${currentSlide.image.url})`,
        }}
      />

      {/* Additional dark overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-transparent" />

      {/* Main Content */}
      <div className="relative h-full flex items-center">
        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12 z-10 max-w-2xl">
          <div
            className={`transform transition-all duration-500 ${isTransitioning ? "translate-x-4 opacity-0" : "translate-x-0 opacity-100"}`}>
            {/* Subtitle - Minimalist */}
            <div className="mb-3">
              <p
                className="text-sm font-medium opacity-90"
                style={{ color: currentSlide.textColor }}>
                {currentSlide.subtitle}
              </p>
            </div>

            {/* Title - Clean with text shadow for better readability */}
            <h2
              className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
              style={{
                color: currentSlide.textColor,
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}>
              {currentSlide.title}
            </h2>

            {/* Description with text shadow */}
            <p
              className="text-lg md:text-xl mb-6 opacity-95 leading-relaxed max-w-md"
              style={{
                color: currentSlide.textColor,
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}>
              {currentSlide.description}
            </p>

            {/* Date */}
            {currentSlide.date && (
              <p
                className="text-sm mb-6 opacity-85"
                style={{
                  color: currentSlide.textColor,
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}>
                {currentSlide.date}
              </p>
            )}

            {/* CTA Button - Enhanced visibility */}
            <div className="flex items-center gap-4 flex-wrap">
              <Button
                color="default"
                variant="solid"
                className="
              bg-white text-gray-900 shadow-lg transform hover:scale-105 hover:bg-gray-100 hover:shadow-xl
                text-sm px-3 py-1.5
                sm:text-base sm:px-4 sm:py-2
                md:text-lg md:px-6 md:py-3
                "
                onClick={() => onSlideClick && onSlideClick(currentSlide)}
                endContent={
                  <Icon icon="mdi:arrow-right" className="w-4 h-4" />
                }>
                {currentSlide.buttonText}
              </Button>

              <p
                className="text-xs opacity-70"
                style={{
                  color: currentSlide.textColor,
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}>
                *S&K Berlaku
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls - Enhanced visibility */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        {/* Progress Dots with backdrop */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-sm">
          {activeSlides.map((_, index: number) => (
            <div key={index} className="relative">
              <button
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-500 cursor-pointer ${
                  index === currentIndex
                    ? "bg-white w-8 h-2"
                    : "bg-white/50 hover:bg-white/70 w-2 h-2"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionalCarousel;
