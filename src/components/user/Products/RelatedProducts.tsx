import React, { useState, useEffect } from "react";
import { Card, CardBody, Skeleton } from "@heroui/react";
import { Product } from "../../../types";
import { productAPI } from "../../../api/api";
import ProductCard from "./ProductCard";
// import "../../../styles/RelatedProducts.css";

interface RelatedProductsProps {
  productId: string;
  categoryId: string;
  currentProductName: string;
  limit?: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  productId,
  categoryId,
  limit = 4,
}) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productAPI.getRelated(productId, limit);
        setRelatedProducts((response.data as any).data);
      } catch (err: any) {
        console.error("Error fetching related products:", err);
        setError("Failed to load related products");
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, categoryId, limit]);

  const handleViewDetail = (productId: string) => {
    window.location.href = `/shop/product/${productId}`;
  };

  if (loading) {
    return (
      <div className="related-products">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Related Products
        </h2>
        <div className="related-products-grid grid grid-cols-4 gap-8 mb-16">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="w-full">
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
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || relatedProducts.length === 0) {
    return null; // Don't show anything if there's an error or no related products
  }

  // Check if all related products are from the same category as the current product
  const getRelatedProductsTitle = () => {
    if (relatedProducts.length === 0) return "Related Products";

    // Get the first product's categories
    const firstProductCategories = relatedProducts[0]?.categoryIds || [];
    const allSameCategory = relatedProducts.every((product) =>
      product.categoryIds.some((cat) =>
        firstProductCategories.some((firstCat) => firstCat._id === cat._id)
      )
    );

    if (allSameCategory && firstProductCategories.length > 0) {
      return `More ${firstProductCategories[0].name}`;
    }

    return "Related Products";
  };

  return (
    <div className="related-products">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {getRelatedProductsTitle()}
      </h2>
      <div className="related-products-grid grid grid-cols-4 gap-8 mb-16">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onViewDetail={handleViewDetail}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
