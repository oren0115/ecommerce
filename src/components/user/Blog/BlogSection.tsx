import React, { useState, useEffect } from "react";
import { Image, Skeleton, Button } from "@heroui/react";
import { Blog } from "@/types";
import { blogAPI } from "@/api/api";
// import "@/styles/BlogSection.css";

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

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogAPI.getPublished({ limit });
        if ((response.data as any)?.success) {
          const blogsData = (response.data as any)?.data.items || [];
          setBlogs(Array.isArray(blogsData) ? blogsData : []);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [limit]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
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

  if (blogs.length === 0) {
    return null;
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
            className="blog-article group bg-gray-100"
            onClick={() => (window.location.href = `/blog/${blog.slug}`)}>
            {/* Image Container */}
            <div className="blog-image-container mb-6 aspect-[4/3]">
              <Image
                removeWrapper
                alt={blog.title}
                src={blog.featuredImage?.url || ""}
                className="w-full h-full object-cover"
              />
              {/* <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500 ease-out"></div> */}

              {/* Floating overlay effect */}
              {/* <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 group-hover:ring-black/10 transition-all duration-500 ease-out"></div> */}
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
                {blog.title}
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
