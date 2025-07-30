import React, { memo } from "react";
import { Skeleton, Card, CardBody } from "@heroui/react";
import { Product } from "../../../types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onAddToCart?: (product: Product) => void;
  onViewDetail?: (productId: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = memo(
  ({ products, loading = false, onAddToCart, onViewDetail }) => {
    if (loading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(12)].map((_, i) => (
            <Card key={i} className="w-full">
              <CardBody className="p-4">
                <Skeleton className="w-full h-48 rounded-lg mb-4" />
                <div className="space-y-3">
                  <Skeleton className="w-3/4 rounded-lg">
                    <div className="h-4 bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-1/2 rounded-lg">
                    <div className="h-4 bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-2/3 rounded-lg">
                    <div className="h-4 bg-default-200"></div>
                  </Skeleton>
                  <Skeleton className="w-full rounded-lg">
                    <div className="h-10 bg-default-200"></div>
                  </Skeleton>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <Card className="w-full">
          <CardBody className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-default-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-default-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-default-500">
              Try adjusting your search or filter criteria.
            </p>
          </CardBody>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={onAddToCart}
            onViewDetail={onViewDetail}
          />
        ))}
      </div>
    );
  }
);

ProductGrid.displayName = "ProductGrid";

export default ProductGrid;
