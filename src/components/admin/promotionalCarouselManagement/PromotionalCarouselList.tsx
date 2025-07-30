import React from "react";
import { PromotionalSlide } from "../../../types";
import { Icon } from "@iconify/react";

interface PromotionalCarouselListProps {
  slides: PromotionalSlide[];
  loading: boolean;
  onEdit: (slide: PromotionalSlide) => void;
  onDelete: (slideId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PromotionalCarouselList: React.FC<PromotionalCarouselListProps> = ({
  slides,
  loading,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No promotional slides found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        {slides.map((slide) => (
          <div
            key={slide._id}
            className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
            {/* Image */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={slide.image.url}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{slide.title}</h3>
              <p className="text-sm text-gray-600">{slide.subtitle}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    slide.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                  {slide.status}
                </span>
                <span className="text-xs text-gray-500">
                  Order: {slide.order}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(slide)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Icon icon="ph:edit-duotone" className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(slide._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Icon icon="ph:trash-duotone" className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => onPageChange(index + 1)}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionalCarouselList;
