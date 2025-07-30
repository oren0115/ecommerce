import React, { useState, useEffect } from "react";
import { BlogStats as BlogStatsType } from "../../../types";
import { blogAPI } from "../../../api/api";

const BlogStats: React.FC = () => {
  const [stats, setStats] = useState<BlogStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.getStats();
      setStats((response.data as any)?.data);
    } catch (err: any) {
      console.error("Error fetching blog stats:", err);
      setError(
        err.response?.data?.message || "Failed to fetch blog statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="animate-pulse space-y-3">
                <div className="h-3 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-2xl text-sm font-medium">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      label: "Total Posts",
      value: stats.overview.totalBlogs,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Published",
      value: stats.overview.publishedBlogs,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Drafts",
      value: stats.overview.draftBlogs,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Total Views",
      value: stats.overview.totalViews.toLocaleString(),
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
            <div
              className={`inline-flex items-center justify-center w-10 h-10 ${stat.bg} rounded-xl mb-4`}>
              <div className={`w-5 h-5 ${stat.color}`}>
                {index === 0 && (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                )}
                {index === 1 && (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                {index === 2 && (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                )}
                {index === 3 && (
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </div>
            </div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Categories and Tags */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-6">
            Top Categories
          </h3>
          {stats.categories.length > 0 ? (
            <div className="space-y-4">
              {stats.categories.slice(0, 5).map((category, index) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 capitalize group-hover:text-blue-600 transition-colors">
                      {category._id || "Uncategorized"}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                    {category.count}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No categories found</p>
          )}
        </div>

        {/* Top Tags */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-6">
            Top Tags
          </h3>
          {stats.tags.length > 0 ? (
            <div className="space-y-4">
              {stats.tags.slice(0, 5).map((tag, index) => (
                <div
                  key={tag._id}
                  className="flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {index + 1}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {tag._id}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                    {tag.count}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No tags found</p>
          )}
        </div>
      </div>

      {/* Average Read Time */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Average Read Time
            </h3>
            <p className="text-xs text-gray-500">Based on content analysis</p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-bold text-gray-900">
                {Math.round(stats.overview.avgReadTime)}
              </span>
              <span className="text-lg font-medium text-gray-500">min</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">per post</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogStats;
