import React from "react";
import { Button } from "@heroui/react";

const HeroSection: React.FC = () => {
  return (
    <div className="bg-gray-200 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Side - Image */}
          <div className="relative">
            <div className="aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-lg shadow-lg">
              <img
                src="/images/home/hero-section.jpg"
                alt="Classic Winter Collection Models"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6 lg:space-y-10">
            <div>
              <h1 className="text-3xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight tracking-wide">
                OUR BEST
                <br />
                COLLECTION
              </h1>
            </div>

            <div>
              <p className="text-sm lg:text-lg text-gray-500 leading-relaxed max-w-lg">
                Discover our best collection featuring elegant designs, premium
                materials, and sophisticated styles. From cozy outerwear to
                refined accessories, each piece is crafted with attention to
                detail and contemporary fashion trends. Shop now and get 10% off
                on your first purchase!
              </p>
            </div>

            <div>
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800 px-8 lg:px-10 py-3 lg:py-4 text-sm lg:text-lg font-medium tracking-wide"
                onClick={() => (window.location.href = "/shop")}>
                SHOP COLLECTION
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
