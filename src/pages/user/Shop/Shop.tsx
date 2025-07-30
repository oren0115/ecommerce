import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Product, Category } from "../../../types";
import { productAPI, categoryAPI } from "../../../api/api";
import { addCacheBustingToProducts } from "../../../utils/index";
import ProductGrid from "../../../components/user/Products/ProductGrid";
import ProductFilters from "../../../components/user/Products/ProductFilters";
import Pagination from "../../../components/user/Products/Pagination";
import Breadcrumb from "../../../components/common/Breadcrumb";

function Shop() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
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

        // If we have a slug, find the corresponding category
        if (slug) {
          const category = categoriesArray.find(
            (cat) =>
              cat.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
          );
          if (category) {
            setCurrentCategory(category);
            setSelectedCategory(category._id);
          }
        }

        // Check for category parameter in URL query string
        const categoryParam = searchParams.get("category");
        if (categoryParam && !slug) {
          const category = categoriesArray.find(
            (cat) => cat._id === categoryParam
          );
          if (category) {
            setCurrentCategory(category);
            setSelectedCategory(category._id);
          }
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
        // const paginationData = (productsResponse.value.data as any)?.data
        //   ?.pagination;

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
  }, [currentPage, searchTerm, selectedCategory, sortBy, slug, searchParams]);

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
      { label: "Shop", isActive: true },
    ];

    // Add category if selected or if we're on a category page
    if (selectedCategory || currentCategory) {
      const category =
        currentCategory ||
        categories.find((cat) => cat._id === selectedCategory);
      if (category) {
        items[1] = { label: "Shop", href: "/shop" };
        items.push({
          label: category.name,
          href: `/shop?category=${category._id}`,
          isActive: true,
        });
      }
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb items={getBreadcrumbItems()} className="mb-8" />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentCategory ? currentCategory.name : "Shop"}
          </h1>
          <p className="text-gray-600">
            {currentCategory
              ? currentCategory.description ||
                `Discover amazing ${currentCategory.name.toLowerCase()} products`
              : "Discover our amazing products"}
          </p>
        </div>

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
          </p>
        </div>

        {/* Error Message */}
        {error && (
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

export default Shop;
