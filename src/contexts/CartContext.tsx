import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { CartItem, Product } from "../types";
import { cartAPI } from "../api/api";
import { useAuth } from "./AuthContext";

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState };

interface CartContextType {
  cart: CartState;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === product._id
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.productId === product._id
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, product.stock),
              }
            : item
        );

        const totalItems = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const subtotal = updatedItems.reduce(
          (sum, item) => sum + item.discountedPrice * item.quantity,
          0
        );

        return {
          ...state,
          items: updatedItems,
          totalItems,
          subtotal,
          total: subtotal,
        };
      } else {
        const newItem: CartItem = {
          productId: product._id,
          name: product.name,
          price: product.price,
          discountedPrice: product.discountedPrice,
          discountPercent: product.discountPercent,
          quantity: Math.min(quantity, product.stock),
          imageUrl: product.images?.[0]?.url || "",
          stock: product.stock,
        };

        const updatedItems = [...state.items, newItem];
        const totalItems = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const subtotal = updatedItems.reduce(
          (sum, item) => sum + item.discountedPrice * item.quantity,
          0
        );

        return {
          ...state,
          items: updatedItems,
          totalItems,
          subtotal,
          total: subtotal,
        };
      }
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.productId !== action.payload.productId
      );
      const totalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const subtotal = updatedItems.reduce(
        (sum, item) => sum + item.discountedPrice * item.quantity,
        0
      );

      return {
        ...state,
        items: updatedItems,
        totalItems,
        subtotal,
        total: subtotal,
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      const updatedItems = state.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(Math.max(1, quantity), item.stock) }
          : item
      );

      const totalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const subtotal = updatedItems.reduce(
        (sum, item) => sum + item.discountedPrice * item.quantity,
        0
      );

      return {
        ...state,
        items: updatedItems,
        totalItems,
        subtotal,
        total: subtotal,
      };
    }

    case "CLEAR_CART":
      return {
        items: [],
        totalItems: 0,
        subtotal: 0,
        total: 0,
      };

    case "LOAD_CART":
      return action.payload;

    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  total: 0,
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const [isLoading, setIsLoading] = React.useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart from database or localStorage
  const loadCart = async () => {
    if (isAuthenticated) {
      try {
        setIsLoading(true);
        const response = await cartAPI.getCart();

        if ((response.data as any)?.success) {
          const cartData = (response.data as any)?.data;

          // Transform cart items to ensure productId is always a string
          const transformedItems = (cartData.items || []).map((item: any) => ({
            ...item,
            productId:
              typeof item.productId === "object"
                ? item.productId._id
                : item.productId,
          }));

          const formattedCart = {
            items: transformedItems,
            totalItems: cartData.totalItems || 0,
            subtotal: cartData.subtotal || 0,
            total: cartData.total || 0,
          };

          dispatch({
            type: "LOAD_CART",
            payload: formattedCart,
          });
        }
      } catch (error) {
        console.error("Error loading cart from database:", error);
        // Fallback to localStorage if database fails
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            dispatch({ type: "LOAD_CART", payload: parsedCart });
          } catch (error) {
            console.error("Error loading cart from localStorage:", error);
          }
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Load from localStorage for non-authenticated users
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: "LOAD_CART", payload: parsedCart });
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
        }
      }
    }
  };

  // Load cart on mount and when authentication status changes
  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  // Save cart to database or localStorage
  const saveCart = async (cartData: CartState) => {
    if (isAuthenticated) {
      try {
        // For authenticated users, save to database
        // The cart will be updated through individual API calls
        // This is just for initial sync
        await cartAPI.getCart();
      } catch (error) {
        console.error("Error syncing cart to database:", error);
      }
    }

    // Always save to localStorage as backup
    localStorage.setItem("cart", JSON.stringify(cartData));
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCart(cart);
  }, [cart, isAuthenticated]);

  const addToCart = async (product: Product, quantity: number) => {
    if (isAuthenticated) {
      try {
        await cartAPI.addToCart({
          productId: product._id,
          quantity,
          name: product.name,
          price: product.price,
          discountedPrice: product.discountedPrice,
          discountPercent: product.discountPercent,
          images: product.images || [],
          stock: product.stock,
        });
        // Reload cart from database
        await loadCart();
      } catch (error) {
        console.error("Error adding to cart:", error);
        // Fallback to local state
        dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
      }
    } else {
      // For non-authenticated users, use local state
      dispatch({ type: "ADD_ITEM", payload: { product, quantity } });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (isAuthenticated) {
      try {
        await cartAPI.removeFromCart(productId);
        // Reload cart from database
        await loadCart();
      } catch (error) {
        console.error("Error removing from cart:", error);
        // Fallback to local state
        dispatch({ type: "REMOVE_ITEM", payload: { productId } });
      }
    } else {
      // For non-authenticated users, use local state
      dispatch({ type: "REMOVE_ITEM", payload: { productId } });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (isAuthenticated) {
      try {
        await cartAPI.updateCartItem(productId, quantity);
        // Reload cart from database
        await loadCart();
      } catch (error) {
        console.error("Error updating cart item:", error);
        // Fallback to local state
        dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
      }
    } else {
      // For non-authenticated users, use local state
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartAPI.clearCart();
        // Reload cart from database
        await loadCart();
      } catch (error) {
        console.error("Error clearing cart:", error);
        // Fallback to local state
        dispatch({ type: "CLEAR_CART" });
      }
    } else {
      // For non-authenticated users, use local state
      dispatch({ type: "CLEAR_CART" });
    }
  };

  const getItemQuantity = (productId: string): number => {
    const item = cart.items.find((item) => item.productId === productId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isLoading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
