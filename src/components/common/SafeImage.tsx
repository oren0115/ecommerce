import React, { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: (error: string) => void;
  [key: string]: any; // Allow other props to be passed through
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = "",
  fallbackSrc = "https://via.placeholder.com/300x300?text=No+Image",
  onError,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      onError?.(`Failed to load image: ${src}`);
    }
  };

  // Validate if the src is a valid data URL or regular URL
  const isValidSrc = (src: string): boolean => {
    if (!src) return false;

    // Check if it's a valid data URL
    if (src.startsWith("data:image/")) {
      return true;
    }

    // Check if it's a valid URL
    try {
      new URL(src);
      return true;
    } catch {
      return false;
    }
  };

  // If the src is invalid, use fallback immediately
  if (!isValidSrc(src)) {
    console.warn(`Invalid image source: ${src}`);
    return <img src={fallbackSrc} alt={alt} className={className} {...props} />;
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default SafeImage;
