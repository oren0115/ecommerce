import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Blog } from "../../../types";
import { blogAPI } from "../../../api/api";

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.getBySlug(slug!);
      setBlog(response.data as any);
    } catch (err: any) {
      console.error("Error fetching blog:", err);
      setError(err.response?.data?.message || "Failed to fetch blog post");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
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
              Article not found
            </h3>
            <p className="text-gray-500 mb-8">
              {error || "The article you are looking for does not exist."}
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            All articles
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Article Header */}
        <header className="mb-12">
          {/* Meta Information */}
          <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
            <time>{formatDate(blog.publishedAt || blog.createdAt)}</time>
            <span>•</span>
            <span>{blog.readTime || 5} min read</span>
            {blog.category && (
              <>
                <span>•</span>
                <span className="capitalize">{blog.category}</span>
              </>
            )}
            <span>•</span>
            <span>{(blog.viewCount || 0).toLocaleString()} views</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 leading-tight">
            {blog.title || "Untitled Article"}
          </h1>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-xl text-gray-600 leading-relaxed mb-8 font-light">
              {blog.excerpt}
            </p>
          )}

          {/* Author */}
          {blog.author && (
            <div className="flex items-center">
              {blog.author.avatar && (
                <img
                  src={blog.author.avatar}
                  alt={blog.author.fullname}
                  className="w-12 h-12 rounded-full mr-4"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {blog.author.fullname}
                </p>
                {blog.author.email && (
                  <p className="text-sm text-gray-500">{blog.author.email}</p>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Featured Image */}
        {blog.featuredImage && (
          <div className="mb-12">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={blog.featuredImage.url}
                alt={blog.title}
                className="w-full h-80 md:h-96 object-cover"
              />
            </div>
          </div>
        )}

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Article Content */}
        {blog.content && (
          <div className="prose prose-lg prose-gray max-w-none">
            <div
              className="text-gray-700 leading-relaxed space-y-6"
              style={{
                fontSize: "18px",
                lineHeight: "1.8",
              }}
              dangerouslySetInnerHTML={{
                __html: blog.content
                  .replace(/\n\n/g, "</p><p>")
                  .replace(/\n/g, "<br />")
                  .replace(/^(.*)$/, "<p>$1</p>"),
              }}
            />
          </div>
        )}

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <Link
              to="/blog"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              All articles
            </Link>

            {/* Share buttons could go here */}
            <div className="flex items-center space-x-2 text-gray-400">
              <button className="p-2 hover:text-gray-600 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
              <button className="p-2 hover:text-gray-600 transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default BlogDetail;
