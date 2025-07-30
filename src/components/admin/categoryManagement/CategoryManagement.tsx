import React, { useState, useEffect } from "react";
import { Category } from "../../../types";
import { categoryAPI } from "../../../api/api";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import CategoryList from "./CategoryList";
import CategoryForm from "./CategoryForm";
import CategorySearch from "./CategorySearch";
import CategoryStats from "./CategoryStats";

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);

  // Fetch categories on component mount
  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories with filters
      const params: any = {
        page: currentPage,
        limit: 10,
      };

      if (searchTerm) params.search = searchTerm;

      const categoriesResponse = await categoryAPI.getAll(params);
      const categoriesData = (categoriesResponse.data as any)?.data || [];

      // Ensure we have an array of categories
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setTotalCategories(categoriesData.length);
      setTotalPages(Math.ceil(categoriesData.length / 10));
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await categoryAPI.delete(categoryId);
      fetchData(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete category");
    }
  };

  const handleFormSubmit = async (categoryData: {
    name: string;
    description?: string;
    thumbnailImage?: string;
    thumbnailImagePublicId?: string;
  }) => {
    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory._id, categoryData);
      } else {
        await categoryAPI.create(categoryData);
      }
      setShowForm(false);
      setEditingCategory(null);
      fetchData(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save category");
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "emptyCategories":
        setSearchTerm("");
        // You could add additional filtering logic here
        break;
      default:
        break;
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="min-h-screen bg-default-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="mb-10">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Categories
            </h1>
            <p className="text-default-500 text-sm">
              Organize your products with categories
            </p>
          </div>
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-default-200 border-t-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-default-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Categories
              </h1>
              <p className="text-default-500 text-sm">
                Organize your products with categories and subcategories
              </p>
            </div>
            <Button
              onClick={handleAddCategory}
              color="primary"
              className="bg-gray-900 text-white"
              startContent={<Icon icon="lucide:plus" className="w-4 h-4" />}>
              Add Category
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 bg-danger-50 border-danger-200">
            <CardBody className="text-danger-600 text-sm">{error}</CardBody>
          </Card>
        )}

        {/* Category Statistics */}
        <div className="mb-8">
          <CategoryStats
            categories={categories}
            totalCategories={totalCategories}
            onQuickAction={handleQuickAction}
          />
        </div>

        {/* Search */}
        <div className="mb-8">
          <CategorySearch searchTerm={searchTerm} onSearch={handleSearch} />
        </div>

        {/* Category Form Modal */}
        {showForm && (
          <CategoryForm
            category={editingCategory}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}

        {/* Category List */}
        <Card>
          <CardBody className="p-0">
            <CategoryList
              categories={categories}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
              loading={loading}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CategoryManagement;
