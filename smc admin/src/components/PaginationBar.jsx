import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationBar = ({
  Length,
  currentPage,
  totalPages,
  totalItems, // Add this prop
  paginate,
  hasNextPage,
  setItemsPerPage,
  setCurrentPage,
  itemsPerPage,
}) => {
  const firstIndex = (currentPage - 1) * itemsPerPage + 1;
  const lastIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-end space-x-4   text-gray-100  py-2 rounded-md">
      <div className="flex items-center space-x-2">
        <span className="text-xs font-normal">Items per page</span>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="  border-2 border-gray-100 rounded px-2 py-1 text-sm outline-none"
        >
          <option value="8" className="bg-darkest-blue text-white">
            8
          </option>
          <option value="12" className="bg-darkest-blue text-white">
            12
          </option>
          <option value="16" className="bg-darkest-blue text-white">
            16
          </option>
          <option value="20" className="bg-darkest-blue text-white">
            20
          </option>
        </select>
      </div>
      <span className="text-sm">
        {firstIndex} to {lastIndex} of {totalItems}
      </span>

      <div className="flex items-center ">
        <button
          className=" hover:bg-gray-700 rounded disabled:opacity-50"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={30} />
        </button>
        <button
          className=" hover:bg-gray-700 rounded disabled:opacity-50"
          onClick={() => paginate(currentPage + 1)}
          disabled={!hasNextPage}
        >
          <ChevronRight size={30} />
        </button>
      </div>
    </div>
  );
};

export default PaginationBar;
