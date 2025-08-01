import { Product } from "@/types";
import { Skeleton } from "@heroui/react";
import ProductCarousel from "@/components/user/Products/ProductCarousel";

interface LatestProductsSectionProps {
  latestProducts: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
  onViewDetail: (productId: string) => void;
}

function LatestProductsSection({
  latestProducts,
  loading,
  onAddToCart,
  onViewDetail,
}: LatestProductsSectionProps) {
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 bg-gray-50/30">
        <div className="text-center">
          <Skeleton className="h-8 rounded-full w-48 mx-auto mb-4" />
          <Skeleton className="w-12 h-px mx-auto mb-12" />
          <div className="flex items-center justify-center">
            <Skeleton className="w-6 h-6 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/30 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            Latest Products
          </h2>
        </div>
        <ProductCarousel
          products={latestProducts}
          title=""
          autoPlay={true}
          autoPlayInterval={4000}
          onAddToCart={onAddToCart}
          onViewDetail={onViewDetail}
        />
      </div>
    </div>
  );
}

export default LatestProductsSection;
