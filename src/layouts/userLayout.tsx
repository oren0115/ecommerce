import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/common/header/Navbar";
import { Footer } from "../components/common/fotter/footer";
import { CartProvider } from "../contexts/CartContext";
import { WishlistProvider } from "../contexts/WishlistContext";

const UserLayout: React.FC = () => {
  return (
    <CartProvider>
      <WishlistProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white shadow-sm">
            <Navbar />
          </header>

          {/* Main Content */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
};

export default UserLayout;
