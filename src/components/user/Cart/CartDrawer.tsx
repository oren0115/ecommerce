import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Image,
  Divider,
} from "@heroui/react";
// import { ShoppingBag, X } from 'lucide-react';
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Icon } from "@iconify/react";
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleViewCart = () => {
    onClose();
    if (!isAuthenticated) {
      navigate("/auth/login", { state: { from: "/cart" } });
      return;
    }
    navigate("/cart");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      size="sm"
      hideCloseButton={true}
      classNames={{
        base: "h-full rounded-l-none",
        wrapper: "h-full",
      }}>
      <DrawerContent>
        <DrawerHeader className="flex items-center justify-between border-b border-divider">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">Keranjang</span>
          </div>
          <Button
            isIconOnly
            variant="light"
            onPress={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
            <Icon icon="mdi:close" className="h-5 w-5" />
          </Button>
        </DrawerHeader>

        <DrawerBody className="flex-1 overflow-hidden p-0">
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                {/* <ShoppingBag className="h-6 w-6 text-gray-300" /> */}
                <Icon
                  icon="mdi:shopping-outline"
                  className="h-6 w-6 text-gray-300"
                />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">
                Login untuk melihat keranjang
              </h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Silakan masuk untuk mengakses keranjang belanja Anda
              </p>
              <Button
                color="primary"
                className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                onPress={() => {
                  onClose();
                  navigate("/auth/login", { state: { from: "/cart" } });
                }}>
                Masuk
              </Button>
            </div>
          ) : cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Icon
                  icon="mdi:shopping-outline"
                  className="h-6 w-6 text-gray-300"
                />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">
                Keranjang kosong
              </h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Mulai belanja untuk menambahkan produk ke keranjang
              </p>
              <Button
                color="primary"
                className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                onPress={() => {
                  onClose();
                  navigate("/shop");
                }}>
                Mulai Belanja
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {cart.items.map((item, index) => (
                    <div
                      key={`${item.productId}-${index}`}
                      className="flex gap-4 py-4 border-b border-gray-50 last:border-b-0">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-xl overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                          {item.name}
                        </h4>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {formatPrice(item.discountedPrice)}
                          </p>
                          <span className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <Divider className="mx-4" />
              <div className="flex justify-between items-center p-4">
                <span className="text-sm text-gray-600">
                  Total ({cart.totalItems} items)
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatPrice(cart.total)}
                </span>
              </div>
            </>
          )}
        </DrawerBody>

        {isAuthenticated && cart.items.length > 0 && (
          <DrawerFooter className="border-t border-divider">
            <div className="space-y-2 w-full">
              <Button
                color="primary"
                className="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
                onPress={handleViewCart}>
                Lihat Detail Keranjang
              </Button>
              <Button
                variant="light"
                className="w-full py-3 text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
                onPress={() => {
                  onClose();
                  navigate("/shop");
                }}>
                Lanjut Belanja
              </Button>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
