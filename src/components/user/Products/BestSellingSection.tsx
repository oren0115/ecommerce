import React, { useState, useEffect } from "react";
import { Button, Skeleton } from "@heroui/react";
import { Icon } from "@iconify/react";
import { productAPI } from "@/api/api";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
// import "../../../styles/BestSelling.css";

interface BestSellingSectionProps {
  onAddToCart?: (product: Product) => void;
  onViewDetail?: (productId: string) => void;
}

const BestSellingSection: React.FC<BestSellingSectionProps> = ({
  onAddToCart,
  onViewDetail,
}) => {
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const response = await productAPI.getAll({
          limit: 8,
          order_by: "sales",
        });

        if ((response.data as any).success) {
          const products = (response.data as any).data.items || [];
          setBestSellingProducts(products);

          // Calculate total sales from products that actually have sales
          const total = products
            .filter((product: Product) => (product.salesCount || 0) > 0)
            .reduce(
              (sum: number, product: Product) =>
                sum + (product.salesCount || 0),
              0
            );
          setTotalSales(total);
        }
      } catch (error) {
        console.error("Error fetching best selling products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellingProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 bg-white">
        <div className="text-center mb-16">
          <Skeleton className="h-8 rounded-full w-64 mx-auto mb-4" />
          <Skeleton className="w-12 h-px mx-auto mb-8" />
          <Skeleton className="h-4 rounded-full w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i}>
              <Skeleton className="aspect-square mb-4 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 rounded w-3/4" />
                <Skeleton className="h-3 rounded w-1/2" />
                <Skeleton className="h-4 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!bestSellingProducts || bestSellingProducts.length === 0) {
    return null;
  }

  return (
    <section className="best-selling-section bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-20">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-8 h-px bg-yellow-500 mr-4"></div>
            <Icon icon="mdi:star" className="w-6 h-6 text-yellow-500" />
            <div className="w-8 h-px bg-yellow-500 ml-4"></div>
          </div>
          <h2 className="text-5xl font-light text-gray-900 mb-6 leading-tight">
            Best Selling Items
          </h2>
          <div className="w-16 h-px bg-gray-300 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed mb-8">
            Discover our most popular and highly-rated products that customers
            love. These best-selling items are carefully selected based on sales
            performance and customer satisfaction.
          </p>

          {/* Sales Statistics - only show if there are sales */}
          {totalSales > 0 && (
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-center">
              <div className="flex items-center space-x-2">
                <Icon
                  icon="mdi:shopping-bag"
                  className="w-5 h-5 text-green-500"
                />
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {totalSales.toLocaleString()}
                  </span>{" "}
                  Total Sales
                </span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Icon icon="mdi:star" className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-900">4.8</span>{" "}
                  Average Rating
                </span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Icon icon="mdi:users" className="w-5 h-5 text-blue-500" />
                <span className="text-gray-600">
                  <span className="font-semibold text-gray-900">10K+</span>{" "}
                  Happy Customers
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {totalSales > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {bestSellingProducts
              .filter((product) => (product.salesCount || 0) > 0)
              .map((product) => (
                <div key={product._id} className="group">
                  <div className="relative">
                    <ProductCard
                      product={product}
                      onAddToCart={onAddToCart}
                      onViewDetail={onViewDetail}
                    />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          /* No Sales Message */
          <div className="text-center py-16 mb-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <Icon
                  icon="heroicons:shopping-bag"
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Belum Ada Produk Terjual
                </h3>
                <p className="text-gray-600 mb-6">
                  Saat ini belum ada produk yang terjual. Best selling items
                  akan muncul setelah produk mulai terjual.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* View All Button - only show when there are sales */}
        {totalSales > 0 && (
          <div className="text-center">
            <Button
              variant="bordered"
              size="lg"
              className="border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-300 px-10 py-4 text-lg font-medium group"
              onClick={() => onViewDetail && onViewDetail("shop")}>
              <span className="group-hover:mr-2 transition-all duration-300">
                View All Products
              </span>
              <Icon
                icon="mdi:arrow-right"
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
              />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellingSection;
