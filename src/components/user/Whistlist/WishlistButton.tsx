import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useWishlist } from "../../../contexts/WishlistContext";

interface WishlistButtonProps {
  onClick?: () => void;
  onOpenDrawer?: () => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  onClick,
  onOpenDrawer,
}) => {
  const navigate = useNavigate();
  const { wishlistCount, isLoading } = useWishlist();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (onOpenDrawer) {
      onOpenDrawer();
    } else {
      navigate("/whislist");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`wishlist-button relative p-2 text-gray-900 cursor-pointer`}
      title="Wishlist">
      <Icon
        icon="lucide:heart"
        width="20"
        height="20"
        className="text-gray-900"
      />

      {/* Wishlist count badge */}
      {!isLoading && wishlistCount > 0 && (
        <span className="wishlist-count-badge absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {wishlistCount > 99 ? "99+" : wishlistCount}
        </span>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          <Icon
            icon="lucide:loader-2"
            width="12"
            height="12"
            className="animate-spin"
          />
        </span>
      )}
    </button>
  );
};

export default WishlistButton;
