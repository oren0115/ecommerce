import React from "react";
import { Button } from "@heroui/react";

const HeroSection: React.FC = () => {
  return (
    <div className="bg-gray-200">
      <div className="container mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Side - Image */}
          <div className="relative">
            <div className="aspect-[3/4] bg-amber-50 overflow-hidden">
              <img
                src="/images/home/hero-section.jpg"
                alt="Classic Winter Collection Models"
                className="w-400 h-400 object-cover "
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-10">
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
                className="bg-black text-white hover:bg-gray-800 px-10 py-4 text-sm lg:text-lg font-medium tracking-wide"
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
