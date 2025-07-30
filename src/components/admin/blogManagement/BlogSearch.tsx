import React, { useState } from 'react';

interface BlogSearchProps {
  searchTerm: string;
  selectedStatus: string;
  selectedCategory: string;
  onSearch: (term: string) => void;
  onStatusFilter: (status: string) => void;
  onCategoryFilter: (category: string) => void;
  onQuickAction: (action: string) => void;
}

const BlogSearch: React.FC<BlogSearchProps> = ({
  searchTerm,
  selectedStatus,
  selectedCategory,
  onSearch,
  onStatusFilter,
  onCategoryFilter,
  onQuickAction,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  const handleClearFilters = () => {
    setLocalSearchTerm('');
    onSearch('');
    onStatusFilter('');
    onCategoryFilter('');
  };

  const quickActions = [
    { key: 'all', label: 'All Posts', variant: 'default' },
    { key: 'published', label: 'Published', variant: 'success' },
    { key: 'drafts', label: 'Drafts', variant: 'warning' },
  ];

  const getQuickActionStyles = (variant: string, isActive: boolean = false) => {
    const baseStyles = 'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105';
    
    if (isActive) {
      switch (variant) {
        case 'success':
          return `${baseStyles} bg-green-600 text-white shadow-lg shadow-green-600/25`;
        case 'warning':
          return `${baseStyles} bg-amber-600 text-white shadow-lg shadow-amber-600/25`;
        default:
          return `${baseStyles} bg-blue-600 text-white shadow-lg shadow-blue-600/25`;
      }
    }

    switch (variant) {
      case 'success':
        return `${baseStyles} bg-green-50 text-green-700 border border-green-200 hover:bg-green-100`;
      case 'warning':
        return `${baseStyles} bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100`;
      default:
        return `${baseStyles} bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100`;
    }
  };

  const activeFiltersCount = [searchTerm, selectedStatus, selectedCategory].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              placeholder="Search blog posts..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200"
            />
            {localSearchTerm && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearchTerm('');
                  onSearch('');
                }}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="space-y-6">
          {/* Quick Actions */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.key}
                  onClick={() => onQuickAction(action.key)}
                  className={getQuickActionStyles(action.variant)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Filters</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center space-x-1 text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Clear All ({activeFiltersCount})</span>
                </button>
              )}
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => onStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => onCategoryFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <option value="">All Categories</option>
                  <option value="fashion">Fashion</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="trends">Trends</option>
                  <option value="tips">Tips</option>
                  <option value="news">News</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedStatus || selectedCategory) && (
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center flex-wrap gap-2">
                <span className="text-xs font-medium text-gray-500">Active:</span>
                {searchTerm && (
                  <div className="inline-flex items-center space-x-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    <span>"{searchTerm}"</span>
                    <button
                      onClick={() => {
                        setLocalSearchTerm('');
                        onSearch('');
                      }}
                      className="hover:text-blue-900"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                {selectedStatus && (
                  <div className="inline-flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    <span>{selectedStatus}</span>
                    <button
                      onClick={() => onStatusFilter('')}
                      className="hover:text-green-900"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                {selectedCategory && (
                  <div className="inline-flex items-center space-x-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                    <span>{selectedCategory}</span>
                    <button
                      onClick={() => onCategoryFilter('')}
                      className="hover:text-purple-900"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogSearch;