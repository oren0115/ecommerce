import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { wishlistAPI } from "../api/api";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
  wishlistCount: number;
  isLoading: boolean;
  refreshWishlistCount: () => Promise<void>;
  updateWishlistCount: (increment: number) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({
  children,
}) => {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchWishlistCount = async () => {
    if (!isAuthenticated) {
      setWishlistCount(0);
      return;
    }

    try {
      setIsLoading(true);
      const response = await wishlistAPI.getAll({ limit: 1 });
      if ((response.data as any)?.success) {
        // Get total count from pagination or calculate from items
        const totalItems =
          (response.data as any)?.data?.pagination?.totalItems ||
          (response.data as any)?.data?.wishlistItems?.length ||
          0;
        setWishlistCount(totalItems);
      }
    } catch (error: any) {
      console.error("Error fetching wishlist count:", error);
      // Don't show error for 401 (unauthorized) - user just needs to login
      if (error.response?.status !== 401) {
        console.error("Wishlist count fetch failed:", error.message);
      }
      setWishlistCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWishlistCount = async () => {
    await fetchWishlistCount();
  };

  const updateWishlistCount = (increment: number) => {
    setWishlistCount((prev) => Math.max(0, prev + increment));
  };

  // Fetch wishlist count on mount and when authentication status changes
  useEffect(() => {
    fetchWishlistCount();
  }, [isAuthenticated]);

  const value: WishlistContextType = {
    wishlistCount,
    isLoading,
    refreshWishlistCount,
    updateWishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
