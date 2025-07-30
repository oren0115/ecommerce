import React, { useState, useEffect } from "react";
import { Size, ProductSizeData } from "../../../types";
import { sizeAPI } from "../../../api/api";
import { Card, CardBody, Input, Checkbox, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface ProductSizeSelectorProps {
  productSizes: ProductSizeData[];
  onChange: (sizes: ProductSizeData[]) => void;
  disabled?: boolean;
}

const ProductSizeSelector: React.FC<ProductSizeSelectorProps> = ({
  productSizes,
  onChange,
  disabled = false,
}) => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSizes();
  }, []);

  const fetchSizes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sizeAPI.getAll();
      const sizesData = (response.data as any)?.data || [];
      setSizes(
        Array.isArray(sizesData)
          ? sizesData.filter((size) => size.isActive)
          : []
      );
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch sizes");
    } finally {
      setLoading(false);
    }
  };

  const handleSizeToggle = (sizeId: string) => {
    const existingIndex = productSizes.findIndex((ps) => ps.sizeId === sizeId);

    if (existingIndex >= 0) {
      // Remove size
      const newSizes = productSizes.filter((ps) => ps.sizeId !== sizeId);
      onChange(newSizes);
    } else {
      // Add size with 0 stock
      const newSizes = [...productSizes, { sizeId, stock: 0 }];
      onChange(newSizes);
    }
  };

  const handleStockChange = (sizeId: string, stock: number) => {
    const newSizes = productSizes.map((ps) =>
      ps.sizeId === sizeId ? { ...ps, stock } : ps
    );
    onChange(newSizes);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-32 mb-3"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardBody className="p-4">
          <div className="flex items-center gap-2 text-red-600">
            <Icon icon="ph:warning-duotone" className="w-4 h-4" />
            <span className="text-sm">Error loading sizes: {error}</span>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-1">
          Sizes & Stock
        </label>
        <p className="text-xs text-slate-500">
          Select available sizes and set stock quantities
        </p>
      </div>

      {/* Size List */}
      <div className="space-y-2">
        {sizes.map((size) => {
          const isSelected = productSizes.some((ps) => ps.sizeId === size._id);
          const stockValue =
            productSizes.find((ps) => ps.sizeId === size._id)?.stock || 0;

          return (
            <Card key={size._id} className="border-gray-100">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      isSelected={isSelected}
                      onValueChange={() => handleSizeToggle(size._id)}
                      isDisabled={disabled}
                    />
                    <div>
                      <span className="font-medium text-slate-900">
                        {size.name}
                      </span>
                      <p className="text-xs text-slate-500">{size.code}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="0"
                        value={stockValue.toString()}
                        onValueChange={(value) =>
                          handleStockChange(size._id, parseInt(value) || 0)
                        }
                        className="w-20"
                        size="sm"
                        isDisabled={disabled}
                        min={0}
                      />
                      <Chip size="sm" variant="flat" color="default">
                        units
                      </Chip>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      {productSizes.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon
                  icon="ph:info-duotone"
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium text-blue-800">
                  {productSizes.length} size
                  {productSizes.length !== 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="text-sm text-blue-600">
                Total stock:{" "}
                {productSizes.reduce((sum, ps) => sum + ps.stock, 0)} units
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default ProductSizeSelector;
