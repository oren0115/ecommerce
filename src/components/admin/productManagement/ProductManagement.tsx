import React, { useState, useEffect } from "react";
import { Product, Category, CreateProductData } from "../../../types";
import { productAPI, categoryAPI, healthCheck } from "../../../api/api";
import { Card, CardBody, Button, Spinner, Alert } from "@heroui/react";
import { Icon } from "@iconify/react";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import ProductSearch from "./ProductSearch";
import ProductStats from "./ProductStats";

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, selectedCategory]);

  // Add a separate effect to refresh data when needed
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchData();
    }
  }, [refreshTrigger]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories
      const categoriesResponse = await categoryAPI.getAll();
      const categoriesData = (categoriesResponse.data as any)?.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      // Fetch products with filters
      const params: any = {
        page: currentPage.toString(),
        limit: "10",
      };

      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;

      const productsResponse = await productAPI.getAll(params);

      // Handle the correct response structure from backend
      const productsData = (productsResponse.data as any)?.data?.items || [];
      const totalCount =
        (productsResponse.data as any)?.data?.pagination?.total || 0;

      // Ensure we have an array of products
      setProducts(Array.isArray(productsData) ? productsData : []);
      setTotalProducts(totalCount);
      setTotalPages(Math.ceil(totalCount / 10));
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await productAPI.delete(productId);
      setRefreshTrigger((prev) => prev + 1); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  const handleFormSubmit = async (productData: CreateProductData) => {
    const maxRetries = 3;
    let retryCount = 0;

    const attemptSave = async (): Promise<void> => {
      try {
        // Check backend health first
        try {
          await healthCheck();
        } catch (healthError) {
          console.error("Backend health check failed:", healthError);
          throw new Error(
            "Backend server is not responding. Please check if the server is running."
          );
        }

        if (editingProduct) {
          await productAPI.update(editingProduct._id, productData as any);

          // Broadcast product update event to user pages
          window.dispatchEvent(
            new CustomEvent("productUpdated", {
              detail: { productId: editingProduct._id },
            })
          );

          // Also broadcast to all tabs/windows
          if (navigator.serviceWorker) {
            navigator.serviceWorker.ready.then((registration) => {
              registration.active?.postMessage({
                type: "PRODUCT_UPDATED",
                productId: editingProduct._id,
              });
            });
          }
        } else {
          await productAPI.create(productData as any);
        }

        setShowForm(false);
        setEditingProduct(null);

        // Trigger refresh after successful save
        setRefreshTrigger((prev) => prev + 1);
      } catch (err: any) {
        console.error(`Attempt ${retryCount + 1} failed:`, err);
        console.error("Error response:", err.response?.data);
        console.error("Error status:", err.response?.status);

        if (err.response?.status === 503 && retryCount < maxRetries - 1) {
          retryCount++;

          await new Promise((resolve) => setTimeout(resolve, 2000));
          return attemptSave();
        }

        if (err.response?.status === 503) {
          setError(
            "Backend server is temporarily unavailable. Please check if the server is running and try again."
          );
        } else if (err.message?.includes("Backend server is not responding")) {
          setError(err.message);
        } else {
          setError(err.response?.data?.message || "Failed to save product");
        }

        throw err; // Re-throw to stop retries
      }
    };

    try {
      await attemptSave();
    } catch (error) {
      // Error is already handled in attemptSave
      console.error("All retry attempts failed");
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "lowStock":
        setSelectedCategory("");
        setSearchTerm("");
        // You could add additional filtering logic here
        break;
      case "outOfStock":
        setSelectedCategory("");
        setSearchTerm("");
        // You could add additional filtering logic here
        break;
      case "discounted":
        setSelectedCategory("");
        setSearchTerm("");
        // You could add additional filtering logic here
        break;
      default:
        break;
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="mb-10">
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">
              Products
            </h1>
            <p className="text-slate-500 text-sm">
              Manage your product catalog
            </p>
          </div>
          <div className="flex items-center justify-center min-h-96">
            <Spinner size="lg" color="primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                Products
              </h1>
              <p className="text-slate-500 text-sm">
                Manage your product catalog
              </p>
            </div>
            <Button
              color="primary"
              onClick={handleAddProduct}
              className="bg-gray-900 text-white hover:bg-gray-900"
              startContent={<Icon icon="ph:plus" className="w-4 h-4" />}>
              Add Product
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert
            variant="flat"
            color="danger"
            className="mb-6"
            onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Product Statistics */}
        <div className="mb-8">
          <ProductStats
            products={products}
            totalProducts={totalProducts}
            onQuickAction={handleQuickAction}
          />
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <ProductSearch
            searchTerm={searchTerm}
            onSearch={handleSearch}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryFilter={handleCategoryFilter}
          />
        </div>

        {/* Product Form Modal */}
        {showForm && (
          <ProductForm
            product={editingProduct}
            categories={categories}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
        {/* Product List */}
        <Card className="border-slate-200">
          <CardBody className="p-0">
            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
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

export default ProductManagement;
