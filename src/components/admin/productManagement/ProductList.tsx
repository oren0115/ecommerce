import React from "react";
import { Product } from "../../../types";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Pagination,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onEdit,
  onDelete,
  loading,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  const productsArray = Array.isArray(products) ? products : [];

  if (productsArray.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Icon icon="ph:package-duotone" className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-500">
          Get started by creating your first product.
        </p>
      </div>
    );
  }

  const getStockStatus = (stock: number) => {
    if (stock > 10) return { color: "success" as const, label: "In Stock" };
    if (stock > 0) return { color: "warning" as const, label: "Low Stock" };
    return { color: "danger" as const, label: "Out of Stock" };
  };

  const renderCell = (product: Product, columnKey: React.Key) => {
    switch (columnKey) {
      case "product":
        return (
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                className="w-full h-full object-cover"
                src={
                  product.images?.[0]?.url ||
                  "https://via.placeholder.com/48x48?text=No+Image"
                }
                alt={product.name}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://via.placeholder.com/48x48?text=No+Image";
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 truncate">
                {product.name}
              </p>
              <p className="text-sm text-gray-500 truncate max-w-xs">
                {product.description}
              </p>
            </div>
          </div>
        );
      case "category":
        return (
          <div className="flex flex-wrap gap-1">
            {product.categoryIds.slice(0, 2).map((category) => (
              <Chip key={category._id} size="sm" variant="flat" color="default">
                {category.name}
              </Chip>
            ))}
            {product.categoryIds.length > 2 && (
              <Chip size="sm" variant="flat" color="default">
                +{product.categoryIds.length - 2}
              </Chip>
            )}
          </div>
        );
      case "price":
        return (
          <div className="space-y-1">
            <p
              className={`font-medium ${product.discountPercent > 0 ? "text-gray-400 line-through text-sm" : "text-gray-900"}`}>
              {formatPrice(product.price)}
            </p>
            {product.discountPercent > 0 && (
              <p className="text-emerald-600 font-medium">
                {formatPrice(product.discountedPrice)}
              </p>
            )}
          </div>
        );
      case "stock":
        const stockStatus = getStockStatus(product.stock);
        return (
          <div className="space-y-1">
            <Chip size="sm" variant="flat" color={stockStatus.color}>
              {stockStatus.label}
            </Chip>
            <p className="text-xs text-gray-500">{product.stock} units</p>
          </div>
        );
      case "discount":
        return product.discountPercent > 0 ? (
          <Chip size="sm" variant="flat" color="success">
            -{product.discountPercent}%
          </Chip>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        );
      case "created":
        return (
          <p className="text-sm text-gray-500">
            {formatDate(product.createdAt)}
          </p>
        );
      case "actions":
        return (
          <div className="flex items-center justify-end space-x-1">
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onClick={() => onEdit(product)}
              className="text-gray-400 hover:text-blue-600">
              <Icon icon="ph:pencil-duotone" className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              color="danger"
              onClick={() => onDelete(product._id)}
              className="text-gray-400 hover:text-red-600">
              <Icon icon="ph:trash-duotone" className="w-4 h-4" />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Table aria-label="Products table">
        <TableHeader>
          <TableColumn key="product">Product</TableColumn>
          <TableColumn key="category">Category</TableColumn>
          <TableColumn key="price">Price</TableColumn>
          <TableColumn key="stock">Stock</TableColumn>
          <TableColumn key="discount">Discount</TableColumn>
          <TableColumn key="created">Created</TableColumn>
          <TableColumn key="actions" align="end">
            Actions
          </TableColumn>
        </TableHeader>
        <TableBody items={productsArray}>
          {(product) => (
            <TableRow key={product._id}>
              {(columnKey) => (
                <TableCell>{renderCell(product, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>

          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={onPageChange}
            showControls
            showShadow
            color="primary"
          />
        </div>
      )}
    </div>
  );
};

export default ProductList;
