import React, { useState, useEffect } from "react";
import { Category } from "../../../types";
import { Input, Select, SelectItem, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ProductSearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  categories: Category[];
  selectedCategory: string;
  onCategoryFilter: (categoryId: string) => void;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  searchTerm,
  onSearch,
  categories,
  selectedCategory,
  onCategoryFilter,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  const handleClearSearch = () => {
    setLocalSearchTerm("");
    onSearch("");
  };

  const handleCategoryChange = (value: string) => {
    onCategoryFilter(value);
  };

  const selectedCategoryName =
    Array.isArray(categories) &&
    categories.find((c) => c._id === selectedCategory)?.name;

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <Input
              type="text"
              value={localSearchTerm}
              onValueChange={handleSearchChange}
              placeholder="Search products..."
              startContent={
                <Icon icon="ph:magnifying-glass" className="text-default-400" />
              }
              classNames={{
                input: "focus:ring-0 focus:outline-none",
                inputWrapper: "focus:ring-0 focus:outline-none",
              }}
              endContent={
                localSearchTerm ? (
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onClick={handleClearSearch}
                    className="text-default-400">
                    <Icon icon="ph:x" className="w-4 h-4" />
                  </Button>
                ) : null
              }
              className="flex-1"
            />
          </form>
        </div>

        {/* Category Filter */}
        <div className="sm:w-48">
          <Select
            label="Category"
            selectedKeys={selectedCategory ? [selectedCategory] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              handleCategoryChange(selectedKey || "");
            }}
            placeholder="All Categories"
            className="w-full">
            {Array.isArray(categories)
              ? categories.map((category) => (
                  <SelectItem key={category._id}>{category.name}</SelectItem>
                ))
              : null}
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchTerm || selectedCategory) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Filters:</span>

          {searchTerm && (
            <Chip
              variant="flat"
              color="primary"
              onClose={() => onSearch("")}
              className="text-xs">
              "{searchTerm}"
            </Chip>
          )}

          {selectedCategory && selectedCategoryName && (
            <Chip
              variant="flat"
              color="secondary"
              onClose={() => onCategoryFilter("")}
              className="text-xs">
              {selectedCategoryName}
            </Chip>
          )}

          {(searchTerm || selectedCategory) && (
            <Button
              variant="light"
              size="sm"
              onClick={() => {
                onSearch("");
                onCategoryFilter("");
              }}
              className="text-xs">
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
