import React from "react";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";

const Pagination = ({
  totalItems,
  itemsPerPage,
  onPageChange,
  currentPage,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const displayText = `Showing ${currentPage} out of ${totalPages} results`;
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 4) {
      // If total pages are 4 or less, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include the first page
      pageNumbers.push(1);

      if (currentPage === 1 || currentPage === 2) {
        // Show the first, second, and third pages along with the last page
        pageNumbers.push(2);
        pageNumbers.push(3);
      } else if (currentPage === totalPages || currentPage === totalPages - 1) {
        // Show the last three pages and the first page
        pageNumbers.push(totalPages - 2);
        pageNumbers.push(totalPages - 1);
      } else {
        // Show the current page and one page before and after it
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
      }

      // Always include the last page
      if (!pageNumbers.includes(totalPages)) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-between items-center mt-3 px-3 ">
      <div className="text-sm text-gray-600">
        <p className="text-base">{displayText}</p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          className="flex items-center gap-2 text-orange px-4 py-2 rounded-l-md"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <GoArrowLeft /> Previous
        </button>

        {generatePageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-4 py-2">
              ...
            </span>
          ) : (
            <button
              key={index}
              className={`px-3 py-1.5 text-sm rounded-md ${
                currentPage === page
                  ? " bg-gradient-to-b from-[#3D03FA] to-[#A71CD2] px-3 py-1 font-medium "
                  : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          )
        )}

        <button
          className="flex items-center gap-2 text-orange pl-4 py-2 rounded-r-md"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next <GoArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
