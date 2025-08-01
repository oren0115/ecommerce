import React, { useState, useEffect } from "react";
import { Blog, CreateBlogData } from "../../../types";
import { blogAPI } from "../../../api/api";
import BlogList from "./BlogList";
import BlogForm from "./BlogForm";
import BlogSearch from "./BlogSearch";
import BlogStats from "./BlogStats";

const BlogManagement: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch blogs on component mount
  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, selectedStatus, selectedCategory]);

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

      // Fetch blogs with filters
      const params: any = {
        page: currentPage.toString(),
        limit: "10",
      };

      if (searchTerm) params.search = searchTerm;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedCategory) params.category = selectedCategory;

      const response = await blogAPI.getAll(params);

      // Handle the correct response structure from backend
      const blogsData = (response.data as any)?.data?.items || [];
      const totalCount = (response.data as any)?.data?.pagination?.total || 0;

      // Ensure we have an array of blogs
      setBlogs(Array.isArray(blogsData) ? blogsData : []);
      setTotalPages(Math.ceil(totalCount / 10));
    } catch (err: any) {
      console.error("Error fetching blogs:", err);
      setError(err.response?.data?.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlog = () => {
    setEditingBlog(null);
    setShowForm(true);
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      await blogAPI.delete(blogId);
      setRefreshTrigger((prev) => prev + 1); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete blog");
    }
  };

  const handleFormSubmit = async (blogData: CreateBlogData) => {
    try {
      if (editingBlog) {
        await blogAPI.update(editingBlog._id, blogData as any);
      } else {
        await blogAPI.create(blogData as any);
      }

      setShowForm(false);
      setEditingBlog(null);

      // Trigger refresh after successful save
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      console.error("Error saving blog:", err);
      setError(err.response?.data?.message || "Failed to save blog");
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "drafts":
        setSelectedStatus("draft");
        setSelectedCategory("");
        setSearchTerm("");
        break;
      case "published":
        setSelectedStatus("published");
        setSelectedCategory("");
        setSearchTerm("");
        break;
      case "all":
        setSelectedStatus("");
        setSelectedCategory("");
        setSearchTerm("");
        break;
      default:
        break;
    }
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="p-4">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Blog Management
          </h1>
          <p className="text-gray-600 text-sm">Manage your blog content</p>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Blog Management
            </h1>
            <p className="text-gray-600 text-sm">Manage your blog content</p>
          </div>
          <button
            onClick={handleAddBlog}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Blog Post
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <BlogStats />

      {/* Search and Filters */}
      <BlogSearch
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        selectedCategory={selectedCategory}
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        onCategoryFilter={handleCategoryFilter}
        onQuickAction={handleQuickAction}
      />

      {/* Blog List */}
      <BlogList
        blogs={blogs}
        loading={loading}
        onEdit={handleEditBlog}
        onDelete={handleDeleteBlog}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Blog Form Modal */}
      {showForm && (
        <BlogForm
          blog={editingBlog}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default BlogManagement;
