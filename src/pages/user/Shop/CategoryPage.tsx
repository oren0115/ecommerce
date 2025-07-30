import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product, Category } from "../../../types";
import { productAPI, categoryAPI } from "../../../api/api";
import { addCacheBustingToProducts } from "../../../utils/index";
import ProductGrid from "../../../components/user/Products/ProductGrid";
import ProductFilters from "../../../components/user/Products/ProductFilters";
import Pagination from "../../../components/user/Products/Pagination";
import Breadcrumb from "../../../components/common/Breadcrumb";
import { slugify } from "../../../utils/slugify";

function CategoryPage() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState<string>("createdAt.desc");

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Debug log untuk melihat parameter yang dikirim
      const apiParams = {
        page: currentPage,
        limit: 12,
        order_by: sortBy,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { category: selectedCategory }),
      };

      // Fetch categories and products in parallel for better performance
      const [categoriesResponse, productsResponse] = await Promise.allSettled([
        categoryAPI.getAll(),
        productAPI.getAll(apiParams),
      ]);

      // Handle categories response
      if (categoriesResponse.status === "fulfilled") {
        const categoriesData =
          (categoriesResponse.value.data as any)?.data || [];
        const categoriesArray = Array.isArray(categoriesData)
          ? categoriesData
          : [];
        setCategories(categoriesArray);

        // Find the category by slug
        const category = categoriesArray.find(
          (cat) => slugify(cat.name) === slug?.toLowerCase()
        );
        if (category) {
          setCurrentCategory(category);
          setSelectedCategory(category._id);
        } else {
          setError("Category not found");
        }
      } else {
        console.error("Failed to fetch categories:", categoriesResponse.reason);
      }

      // Handle products response
      if (productsResponse.status === "fulfilled") {
        const productsData =
          (productsResponse.value.data as any)?.data?.items || [];
        const totalCount =
          (productsResponse.value.data as any)?.data?.pagination?.total || 0;

        // Add cache busting to product images
        const productsWithCacheBusting =
          addCacheBustingToProducts(productsData);

        setProducts(productsWithCacheBusting);
        setTotalProducts(totalCount);

        const calculatedTotalPages = Math.ceil(totalCount / 12);

        setTotalPages(calculatedTotalPages);
      } else {
        console.error("Failed to fetch products:", productsResponse.reason);
        setError("Failed to fetch products. Please try again.");
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory, sortBy, slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen for product update events
  useEffect(() => {
    const handleProductUpdate = () => {
      fetchData();
    };

    // Listen for custom events
    window.addEventListener(
      "productUpdated",
      handleProductUpdate as EventListener
    );

    // Listen for service worker messages
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data?.type === "PRODUCT_UPDATED") {
        console.log(
          "Product update detected via service worker in category page, refreshing..."
        );
        fetchData();
      }
    };

    navigator.serviceWorker?.addEventListener(
      "message",
      handleServiceWorkerMessage
    );

    return () => {
      window.removeEventListener(
        "productUpdated",
        handleProductUpdate as EventListener
      );
      navigator.serviceWorker?.removeEventListener(
        "message",
        handleServiceWorkerMessage
      );
    };
  }, [fetchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? "" : categoryId);
    setCurrentPage(1);
  };

  const handleSortChange = (sortBy: string) => {
    setSortBy(sortBy);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddToCart = (product: Product) => {
    // TODO: Implement add to cart functionality
    // You can add toast notification here
    alert(`Added ${product.name} to cart!`);
  };

  const handleViewDetail = (productId: string) => {
    // Navigate to product detail page
    navigate(`/shop/product/${productId}`);
  };

  // Generate breadcrumb items
  const getBreadcrumbItems = () => {
    const items: Array<{ label: string; href?: string; isActive?: boolean }> = [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop" },
    ];

    if (currentCategory) {
      // Add category as active item (no href since we're already on category page)
      items.push({
        label: currentCategory.name,
        isActive: true,
      });
    }

    return items;
  };

  // Show error if category not found
  if (error && error === "Category not found") {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: "Category Not Found", isActive: true },
            ]}
            className="mb-8"
          />

          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Category not found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              The category you are looking for does not exist.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/shop")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Back to Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb items={getBreadcrumbItems()} className="mb-8" />

        {/* Category Header */}
        {currentCategory && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4">
                {currentCategory.thumbnailImage && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <img
                      src={currentCategory.thumbnailImage}
                      alt={currentCategory.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentCategory.name}
                  </h1>
                  <p className="text-gray-600">
                    {currentCategory.description ||
                      `Discover amazing ${currentCategory.name.toLowerCase()} products`}
                  </p>
                  {currentCategory.productsCount && (
                    <p className="text-sm text-gray-500 mt-1">
                      {currentCategory.productsCount} products available
                    </p>
                  )}
                  <div className="mt-4">
                    <button
                      onClick={() =>
                        navigate(`/shop?category=${currentCategory._id}`)
                      }
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium underline">
                      View all in Shop →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearch}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryFilter={handleCategoryFilter}
          sortBy={sortBy}
          onSortChange={handleSortChange}
        />

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {products.length} of {totalProducts} products
            {currentCategory && ` in ${currentCategory.name}`}
          </p>
        </div>

        {/* Error Message */}
        {error && error !== "Category not found" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchData}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
              Try again
            </button>
          </div>
        )}

        {/* Products Grid */}
        <ProductGrid
          products={products}
          loading={loading}
          onAddToCart={handleAddToCart}
          onViewDetail={handleViewDetail}
        />

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
