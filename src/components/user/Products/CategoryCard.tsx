import React from "react";
import { Link } from "react-router-dom";
import { Category } from "@/types";
// import { slugify } from '@/utils/slugify';

interface CategoryCardProps {
  category: Category;
  className?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  className = "",
}) => {
  const shopCategoryUrl = `/shop?category=${category._id}`;

  return (
    <Link to={shopCategoryUrl} className={`block group ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        {category.thumbnailImage && (
          <div className="aspect-square overflow-hidden">
            <img
              src={category.thumbnailImage}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {category.description}
            </p>
          )}
          {category.productsCount && (
            <p className="text-xs text-gray-500 mt-2">
              {category.productsCount} products
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
