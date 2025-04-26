import React from "react";

function Pagination({ activePage, totalPages, setActivePage }) {
  const handlePageChange = (page) => {
    setActivePage(page);

    // ✅ Safe Scroll to Top
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 0);
  };

  return (
    <div className="flex justify-center">
      <div className="flex my-5">
        <button
          onClick={() => handlePageChange(1)}
          disabled={activePage === 1}
          className="bg-slate-800 p-3 mr-3 rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go to First Page"
        >
          First page
        </button>
      </div>
      <div className="flex my-5">
        <button
          onClick={() => handlePageChange(activePage - 1)}
          disabled={activePage === 1}
          className="bg-slate-800 p-3 rounded-l-lg inline-flex hover:bg-slate-700 transition-all"
        >
          Prev
        </button>
        <div className="flex items-center mx-4 text-lg">{activePage}</div>
        <button
          onClick={() => handlePageChange(activePage + 1)}
          disabled={activePage === totalPages}
          className="bg-slate-800 p-3 rounded-r-lg inline-flex hover:bg-slate-700 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
