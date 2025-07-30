import React from "react";
import { Button, Chip } from "@heroui/react";

interface ProductRatingProps {
  rating: number;
  reviewCount: number;
  showReviewCount?: boolean;
  showRatingNumber?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "compact" | "detailed";
  interactive?: boolean;
  onRatingClick?: (rating: number) => void;
  className?: string;
}

const ProductRating: React.FC<ProductRatingProps> = ({
  rating,
  reviewCount,
  showReviewCount = true,
  showRatingNumber = true,
  size = "md",
  variant = "default",
  interactive = false,
  onRatingClick,
  className = "",
}) => {
  const clampedRating = Math.max(0, Math.min(5, rating));

  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-7 h-7",
  };

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const spacingClasses = {
    xs: "space-x-1",
    sm: "space-x-1",
    md: "space-x-2",
    lg: "space-x-2",
    xl: "space-x-3",
  };

  const formatReviewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-success";
    if (rating >= 4.0) return "text-warning";
    if (rating >= 3.0) return "text-warning";
    return "text-danger";
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const isFull = i <= clampedRating;
      const isPartial = i > clampedRating && i - 1 < clampedRating;
      const partialWidth = isPartial ? `${(clampedRating % 1) * 100}%` : "0%";

      if (interactive) {
        stars.push(
          <Button
            key={i}
            isIconOnly
            variant="light"
            size="sm"
            onClick={() => onRatingClick?.(i)}
            className="p-0 min-w-0 h-auto hover:scale-110 transition-transform">
            <svg
              className={`${sizeClasses[size]} text-warning`}
              fill="currentColor"
              viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </Button>
        );
      } else {
        stars.push(
          <div key={i} className="relative">
            {/* Background star (empty) */}
            <svg
              className={`${sizeClasses[size]} text-default-200 transition-colors`}
              fill="currentColor"
              viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>

            {/* Foreground star (filled) */}
            {(isFull || isPartial) && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: isFull ? "100%" : partialWidth }}>
                <svg
                  className={`${sizeClasses[size]} text-warning transition-colors`}
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>
        );
      }
    }

    return stars;
  };

  const renderCompactVariant = () => (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <svg
        className={`${sizeClasses[size]} text-warning`}
        fill="currentColor"
        viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <span className={`${textSizeClasses[size]} font-medium text-foreground`}>
        {clampedRating.toFixed(1)}
      </span>
      {showReviewCount && (
        <span className={`${textSizeClasses[size]} text-default-500`}>
          ({formatReviewCount(reviewCount)})
        </span>
      )}
    </div>
  );

  const renderDetailedVariant = () => (
    <div className={`${className}`}>
      <div className={`flex items-center ${spacingClasses[size]} mb-1`}>
        <div className="flex items-center gap-0.5">{renderStars()}</div>
        {showRatingNumber && (
          <span
            className={`${textSizeClasses[size]} font-semibold ${getRatingColor(clampedRating)}`}>
            {clampedRating.toFixed(1)}
          </span>
        )}
      </div>
      {showReviewCount && (
        <div className="flex items-center gap-1">
          <span className={`${textSizeClasses[size]} text-default-600`}>
            Based on {formatReviewCount(reviewCount)} reviews
          </span>
          {clampedRating >= 4.5 && (
            <Chip size="sm" variant="flat" color="success" className="text-xs">
              Excellent
            </Chip>
          )}
        </div>
      )}
    </div>
  );

  const renderDefaultVariant = () => (
    <div className={`flex items-center ${spacingClasses[size]} ${className}`}>
      <div className="flex items-center gap-0.5">{renderStars()}</div>
      {showRatingNumber && (
        <span
          className={`${textSizeClasses[size]} font-medium text-foreground`}>
          {clampedRating.toFixed(1)}
        </span>
      )}
      {showReviewCount && (
        <span className={`${textSizeClasses[size]} text-default-500`}>
          ({formatReviewCount(reviewCount)} reviews)
        </span>
      )}
    </div>
  );

  switch (variant) {
    case "compact":
      return renderCompactVariant();
    case "detailed":
      return renderDetailedVariant();
    default:
      return renderDefaultVariant();
  }
};

export default ProductRating;
