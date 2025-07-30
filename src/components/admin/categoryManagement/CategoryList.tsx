import React from 'react';
import { Category } from '../../../types';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Pagination } from '@heroui/react';
import { Icon } from '@iconify/react';

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onEdit,
  onDelete,
  loading,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-default-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-default-200 rounded w-1/3"></div>
                <div className="h-3 bg-default-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Ensure categories is an array
  const categoriesArray = Array.isArray(categories) ? categories : [];

  if (categoriesArray.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-default-100 rounded-full flex items-center justify-center">
          <Icon icon="lucide:tag" className="w-8 h-8 text-gray-900" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No categories found</h3>
        <p className="text-default-500">Get started by creating your first category.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table aria-label="Categories table">
        <TableHeader>
          <TableColumn>Category</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Products</TableColumn>
          <TableColumn>Created</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent="No categories found">
          {categoriesArray.map((category) => (
            <TableRow key={category._id}>
              <TableCell>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {category.thumbnailImage ? (
                      <img
                        className="w-full h-full object-cover"
                        src={category.thumbnailImage}
                        alt={category.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon icon="lucide:tag" className="w-6 h-6 text-default-400" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{category.name}</p>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="text-sm text-foreground max-w-xs truncate">
                  {category.description || (
                    <span className="text-default-400 italic">No description</span>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg bg-primary-100 text-primary-700">
                  {category.productsCount || 0} products
                </span>
              </TableCell>
              
              <TableCell>
                <p className="text-sm text-default-500">{formatDate(category.createdAt)}</p>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center justify-center space-x-1">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="default"
                    onClick={() => onEdit(category)}
                    title="Edit category"
                  >
                    <Icon icon="lucide:edit" className="w-4 h-4" />
                  </Button>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onClick={() => onDelete(category._id)}
                    title="Delete category"
                  >
                    <Icon icon="lucide:trash-2" className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center py-4">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={onPageChange}
            showControls
            color="primary"
          />
        </div>
      )}
    </div>
  );
};

export default CategoryList; 