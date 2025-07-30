import React from "react";
import { Button } from "@heroui/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Calculate the range of pages to show
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    // Add pages in the middle range
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Always show page 1
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    // Add the middle range
    rangeWithDots.push(...range);

    // Always show the last page
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = (page: number) => {
    console.log(
      "Pagination: Changing to page",
      page,
      "from current page",
      currentPage
    );
    onPageChange(page);
  };

  const visiblePages = getVisiblePages();
  console.log(
    "Pagination: Current page:",
    currentPage,
    "Total pages:",
    totalPages,
    "Visible pages:",
    visiblePages
  );

  return (
    <div className="mt-8 flex justify-center">
      <nav className="flex items-center space-x-2">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="bordered"
          size="sm"
          className="bg-gray-900 text-white">
          Previous
        </Button>

        {visiblePages.map((page, index) => (
          <React.Fragment key={`page-${page}-${index}`}>
            {page === "..." ? (
              <span className="px-3 py-2 text-sm text-default-500">...</span>
            ) : (
              <Button
                onClick={() => handlePageChange(page as number)}
                variant={currentPage === page ? "solid" : "bordered"}
                size="sm"
                className={
                  currentPage === page
                    ? "bg-gray-900 text-white"
                    : "text-default-500"
                }>
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="bordered"
          size="sm"
          className="bg-gray-900 text-white">
          Next
        </Button>
      </nav>
    </div>
  );
};

export default Pagination;
