import React, { useState, useEffect } from "react";
import { Image, Skeleton, Button } from "@heroui/react";
import { Blog } from "@/types";
import { blogAPI } from "@/api/api";
import "@/styles/BlogSection.css";

interface BlogSectionProps {
  title?: string;
  subtitle?: string;
  limit?: number;
}

const BlogSection: React.FC<BlogSectionProps> = ({
  title = "Latest Blog Posts",
  subtitle = "Discover our latest articles and fashion insights",
  limit = 3,
}) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await blogAPI.getPublished({ limit });

        // Debug response
        // console.log("Blog API Response:", response);

        if ((response.data as any)?.success) {
          const blogsData =
            (response.data as any)?.data?.items ||
            (response.data as any)?.data ||
            [];
          // console.log("Blogs Data:", blogsData);

          // Ensure blogsData is an array and has valid items
          if (Array.isArray(blogsData)) {
            const validBlogs = blogsData.filter(
              (blog: any) => blog && blog.title && blog.title.trim() !== ""
            );
            setBlogs(validBlogs);
          } else {
            // console.warn("Blogs data is not an array:", blogsData);
            setBlogs([]);
          }
        } else {
          // console.warn("API response indicates failure:", response.data);
          setBlogs([]);
        }
      } catch (error) {
        // console.error("Error fetching blogs:", error);
        setError("Failed to load blog posts");
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [limit]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "No date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      // console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "No content available";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  if (loading) {
    return (
      <section className="container mx-auto px-6 py-10 bg-gray-200">
        <div className="text-center mb-16">
          <Skeleton className="h-6 rounded-lg w-32 mx-auto mb-3" />
          <Skeleton className="h-4 rounded-lg w-48 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Skeleton className="h-56 rounded-2xl mb-6" />
              <Skeleton className="h-3 rounded w-3/4 mb-3" />
              <Skeleton className="h-5 rounded w-full mb-2" />
              <Skeleton className="h-5 rounded w-2/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Show error state instead of returning null
  if (error) {
    return (
      <section className="container mx-auto px-6 py-10 bg-gray-200">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Blog Posts
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button
            variant="bordered"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-gray-600 border-gray-200 hover:bg-gray-50">
            Try Again
          </Button>
        </div>
      </section>
    );
  }

  // Show empty state instead of returning null
  if (blogs.length === 0) {
    return (
      <section className="container mx-auto px-6 py-10 bg-gray-200">
        <div className="text-center">
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
            No Blog Posts Available
          </h3>
          <p className="text-gray-500">Check back later for new articles</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-6 py-10 bg-gray-200">
      {/* Minimal Header */}
      <header className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-3 tracking-tight">
          {title}
        </h2>
        <p className="text-gray-500 text-base max-w-lg mx-auto font-light">
          {subtitle}
        </p>
      </header>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-16 ">
        {blogs.map((blog) => (
          <article
            key={blog._id}
            className="blog-article group bg-gray-100 cursor-pointer"
            onClick={() => (window.location.href = `/blog/${blog.slug}`)}>
            {/* Image Container */}
            <div className="blog-image-container mb-6 aspect-[4/3]">
              <Image
                removeWrapper
                alt={blog.title || "Blog post"}
                src={blog.featuredImage?.url || ""}
                className="w-full h-full object-cover"
                fallbackSrc="https://via.placeholder.com/400x300?text=No+Image"
              />
            </div>

            {/* Content with subtle lift effect */}
            <div className="blog-content space-y-4 px-2">
              {/* Meta with enhanced animation */}
              <div className="blog-meta flex items-center gap-3 text-xs text-gray-400 uppercase tracking-wider">
                <time>{formatDate(blog.publishedAt || blog.createdAt)}</time>
                <span className="blog-meta-dot w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{blog.readTime || 5} min</span>
              </div>

              {/* Title with smooth color transition */}
              <h3 className="blog-title text-lg md:text-xl font-medium text-gray-900 leading-tight line-clamp-2">
                {blog.title || "Untitled Article"}
              </h3>

              {/* Excerpt with fade effect */}
              <p className="blog-excerpt text-gray-600 text-sm leading-relaxed line-clamp-2 font-light">
                {blog.excerpt || truncateText(blog.content, 100)}
              </p>

              {/* Tags with individual hover effects */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex gap-2">
                  {blog.tags.slice(0, 2).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="blog-tag text-xs text-gray-400 px-3 py-1 bg-gray-50 rounded-full"
                      style={{
                        transitionDelay: `${tagIndex * 50}ms`,
                      }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Enhanced Read More with smoother animation */}
              <div className="pt-2">
                <span className="blog-read-more inline-flex items-center text-sm text-gray-400 gap-1">
                  <span>Read article</span>
                  <svg
                    className="blog-read-more-icon w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </div>
            </div>

            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none bg-gradient-to-t from-white/5 to-transparent"></div>
          </article>
        ))}
      </div>

      {/* Minimal CTA */}
      <div className="text-center px-2">
        <Button
          variant="bordered"
          size="md"
          className="text-gray-600 border-gray-200 hover:bg-gray-50"
          onClick={() => (window.location.href = "/blog")}>
          Explore all articles
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Button>
      </div>
    </section>
  );
};

export default BlogSection;
