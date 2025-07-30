import React, { useState } from "react";
import { Icon } from "@iconify/react";

interface PromotionalCarouselSearchProps {
  onSearch: (term: string) => void;
  onStatusFilter: (status: string) => void;
  selectedStatus: string;
  onQuickAction: (action: string) => void;
}

const PromotionalCarouselSearch: React.FC<PromotionalCarouselSearchProps> = ({
  onSearch,
  onStatusFilter,
  selectedStatus,
  onQuickAction,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <form onSubmit={handleSearch} className="relative">
            <Icon
              icon="ph:search-duotone"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search slides by title, subtitle, or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Icon icon="ph:filter-duotone" className="text-gray-400 w-5 h-5" />
          <select
            value={selectedStatus}
            onChange={(e) => onStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onQuickAction("all")}
          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors">
          All Slides
        </button>
        <button
          onClick={() => onQuickAction("active")}
          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors">
          Active Only
        </button>
        <button
          onClick={() => onQuickAction("inactive")}
          className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors">
          Inactive Only
        </button>
      </div>
    </div>
  );
};

export default PromotionalCarouselSearch;
