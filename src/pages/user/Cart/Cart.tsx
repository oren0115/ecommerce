import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import CartItem from '../../../components/user/Cart/CartItem';
import CheckoutForm from '../../../components/user/Cart/CheckoutForm';
import QRISPayment from '../../../components/user/Cart/QRISPayment';
import { IconSvgProps } from '../../../types';

const ShoppingCartIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => (
  <svg
    width={size || width}
    height={size || height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [qrisPayment, setQrisPayment] = useState<{
    show: boolean;
    orderId: string;
    amount: number;
  }>({
    show: false,
    orderId: '',
    amount: 0
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckoutSuccess = (data: any) => {
    if (data.type === 'qris' && data.qrCode) {
      // Show QRIS payment modal
      setQrisPayment({
        show: true,
        orderId: data.orderId,
        amount: data.amount || cart.total
      });
    } else {
      // Navigate to orders page for other payment types
      navigate('/orders');
    }
  };

  const handleQRISSuccess = () => {
    setQrisPayment({ show: false, orderId: '', amount: 0 });
    navigate('/orders');
  };

  const handleQRISClose = () => {
    setQrisPayment({ show: false, orderId: '', amount: 0 });
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingCartIcon className="mx-auto h-24 w-24 text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <a
              href="/shop"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors duration-200"
            >
              Start Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="mt-2 text-gray-600">
            {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {cart.items.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="p-6">
                  <CartItem item={item} />
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary & Checkout */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({cart.totalItems} items)</span>
                <span className="font-medium">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(cart.total)}</span>
                </div>
              </div>
            </div>

            <CheckoutForm 
              onSuccess={handleCheckoutSuccess}
              onError={(error) => {
                console.error('Checkout error:', error);
                alert('Failed to place order: ' + error);
              }}
            />
          </div>
        </div>
      </div>

      {/* QRIS Payment Modal */}
      {qrisPayment.show && (
        <QRISPayment
          orderId={qrisPayment.orderId}
          amount={qrisPayment.amount}
          onClose={handleQRISClose}
          onSuccess={handleQRISSuccess}
        />
      )}
    </div>
  );
};

export default Cart; 