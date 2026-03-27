import { useState, useCallback } from 'react';

// Custom hook for pagination logic
const usePagination = (initialPage = 1) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback((totalPages) => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, []);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    goToPage,
    nextPage,
    prevPage,
    resetPage,
  };
};

export default usePagination;
