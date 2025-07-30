import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Blog } from "../../../types";
import { blogAPI } from "../../../api/api";

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: currentPage.toString(),
        limit: "9",
      };

      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;

      const response = await blogAPI.getPublished(params);

      const blogsData = (response.data as any)?.data?.items || [];
      const totalCount = (response.data as any)?.data?.pagination?.total || 0;

      setBlogs(Array.isArray(blogsData) ? blogsData : []);
      setTotalPages(Math.ceil(totalCount / 9));
    } catch (err: any) {
      console.error("Error fetching blogs:", err);
      setError(err.response?.data?.message || "Failed to fetch blog posts");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Clean Search */}
        <div className="mb-16">
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-900 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Minimal Category Pills */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handleCategoryFilter("")}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                selectedCategory === ""
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}>
              All
            </button>
            {["fashion", "lifestyle", "trends", "tips", "news"].map(
              (category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all capitalize ${
                    selectedCategory === category
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}>
                  {category}
                </button>
              )
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Articles Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="space-y-12 mb-16">
            {blogs.map((blog, index) => (
              <article key={blog._id} className="group">
                <Link to={`/blog/${blog.slug}`} className="block">
                  <div
                    className={`${index === 0 ? "pb-12 mb-12 border-b border-gray-100" : ""}`}>
                    {/* Featured Image */}
                    {blog.featuredImage && (
                      <div className="mb-6 overflow-hidden rounded-lg">
                        <img
                          src={blog.featuredImage.url}
                          alt={blog.title}
                          className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                            index === 0 ? "h-80" : "h-64"
                          }`}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="space-y-4">
                      {/* Meta */}
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <time>
                          {formatDate(blog.publishedAt || blog.createdAt)}
                        </time>
                        <span>•</span>
                        <span>{blog.readTime} min read</span>
                        {blog.category && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{blog.category}</span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h2
                        className={`font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2 ${
                          index === 0 ? "text-2xl leading-tight" : "text-xl"
                        }`}>
                        {blog.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-600 leading-relaxed line-clamp-3">
                        {blog.excerpt || blog.content.substring(0, 200)}...
                      </p>

                      {/* Author */}
                      <div className="flex items-center pt-2">
                        {blog.author.avatar && (
                          <img
                            src={blog.author.avatar}
                            alt={blog.author.fullname}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {blog.author.fullname}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Minimal Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-8 border-t border-gray-100">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page =
                  Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                      page === currentPage
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}>
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              Next
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
