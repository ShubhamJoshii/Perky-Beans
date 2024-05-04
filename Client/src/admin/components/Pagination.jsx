import {useState, useEffect} from "react";

const Pagination = ({currentPage, totalPages, onPageChange}) => {
  const [pageNumber, setPageNumber] = useState(currentPage);

  useEffect(() => {
    setPageNumber(currentPage);
  }, [currentPage]);

  const handlePrevClick = () => {
    if (pageNumber > 1) {
      const newPageNumber = pageNumber - 1;
      setPageNumber(newPageNumber);
      onPageChange(newPageNumber);
    }
  };

  const handleNextClick = () => {
    if (pageNumber < totalPages) {
      const newPageNumber = pageNumber + 1;
      setPageNumber(newPageNumber);
      onPageChange(newPageNumber);
    }
  };

  return (
    <div className="table-pagination">
      <button onClick={handlePrevClick} disabled={pageNumber === 1}>
        Prev
      </button>
      <span>
        {pageNumber} of {totalPages}
      </span>
      <button onClick={handleNextClick} disabled={pageNumber === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;

// Pagination.propTypes = {
//   currentPage: PropTypes.number.isRequired,
//   totalPages: PropTypes.number.isRequired,
//   onPageChange: PropTypes.func.isRequired,
// };
