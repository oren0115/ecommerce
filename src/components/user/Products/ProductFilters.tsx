import React, { useCallback } from "react";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import { Category } from "../../../types";

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  categories: Category[];
  selectedCategory: string;
  onCategoryFilter: (categoryId: string) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  categories,
  selectedCategory,
  onCategoryFilter,
  sortBy,
  onSortChange,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(e);
  };

  const handleSearchChange = useCallback(
    (value: string) => {
      onSearchChange(value);
    },
    [onSearchChange]
  );

  const handleCategoryChange = useCallback(
    (keys: any) => {
      const selected = Array.from(keys)[0] as string;
      onCategoryFilter(selected || "");
    },
    [onCategoryFilter]
  );

  const handleSortChange = useCallback(
    (keys: any) => {
      const selected = Array.from(keys)[0] as string;
      onSortChange(selected);
    },
    [onSortChange]
  );

  return (
    <div className="border-b border-default-200 pb-4 mb-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3">
        {/* Search Input - Much wider now */}
        <div className="flex-1 min-w-0">
          <Input
            type="text"
            placeholder="Search products by name, category, or description..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
            size="sm"
            variant="bordered"
            classNames={{
              input:
                "text-sm focus:outline-none focus:ring-0 focus:border-transparent",
              inputWrapper:
                "h-10 focus-within:ring-0 focus-within:ring-offset-0 focus-within:border-default-300 focus-within:shadow-none focus-within:outline-none",
            }}
          />
        </div>

        {/* Filters Container */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Category Filter */}
          <Select
            selectedKeys={selectedCategory ? [selectedCategory] : []}
            onSelectionChange={handleCategoryChange}
            placeholder="All Categories"
            size="sm"
            variant="bordered"
            className="min-w-48 sm:min-w-40"
            aria-label="Filter by category"
            classNames={{
              trigger:
                "h-10 focus-within:ring-0 focus-within:ring-offset-0 focus-within:border-default-300 focus-within:shadow-none focus-within:outline-none",
              listbox: "focus:outline-none",
            }}>
            {categories.map((category) => (
              <SelectItem key={category._id}>{category.name}</SelectItem>
            ))}
          </Select>

          {/* Sort */}
          <Select
            selectedKeys={[sortBy]}
            onSelectionChange={handleSortChange}
            size="sm"
            variant="bordered"
            className="min-w-40 sm:min-w-36"
            aria-label="Sort products"
            classNames={{
              trigger:
                "h-10 focus-within:ring-0 focus-within:ring-offset-0 focus-within:border-default-300 focus-within:shadow-none focus-within:outline-none",
              listbox: "focus:outline-none",
            }}>
            <SelectItem key="createdAt.desc">Newest</SelectItem>
            <SelectItem key="price">Price: Low to High</SelectItem>
            <SelectItem key="price.desc">Price: High to Low</SelectItem>
            <SelectItem key="name">Name: A to Z</SelectItem>
            <SelectItem key="name.desc">Name: Z to A</SelectItem>
          </Select>

          {/* Search Button */}
          <Button
            type="submit"
            size="sm"
            variant="solid"
            className="bg-foreground text-background min-w-20 sm:w-auto h-10 focus:ring-0 focus:ring-offset-0 focus:outline-none"
            isDisabled={
              !searchTerm.trim() &&
              !selectedCategory &&
              sortBy === "createdAt.desc"
            }>
            Search
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductFilters;
