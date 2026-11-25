import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  pageSizeOptions = [3, 6, 9, 12],
  onPageChange,
  onItemsPerPageChange,
}) {
  if (totalItems === 0) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = [1];

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      aria-label="Hotel catalog pagination"
      className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-slate-600">
        <span className="tabular-nums">
          Showing{' '}
          <strong className="font-semibold text-slate-900">
            {startItem}–{endItem}
          </strong>{' '}
          of <strong className="font-semibold text-slate-900">{totalItems}</strong>{' '}
          {totalItems === 1 ? 'hotel' : 'hotels'}
        </span>

        <span aria-hidden="true" className="hidden sm:inline text-slate-300">
          ·
        </span>

        <label className="inline-flex items-center gap-2 text-sm text-slate-600">
          <span className="whitespace-nowrap">Per page</span>
          <select
            aria-label="Hotels per page"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="staydesk-field staydesk-select w-auto min-w-[4.5rem] h-10 pl-3 pr-8 tabular-nums"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="inline-flex items-center justify-center gap-1 h-10 px-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 disabled:opacity-45 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((entry, idx) =>
            entry === 'ellipsis' ? (
              <span
                key={`ellipsis-${idx}`}
                aria-hidden="true"
                className="w-8 text-center text-sm text-slate-400 select-none"
              >
                …
              </span>
            ) : (
              <button
                key={entry}
                type="button"
                onClick={() => onPageChange(entry)}
                aria-current={entry === currentPage ? 'page' : undefined}
                aria-label={`Page ${entry}`}
                className={`min-w-10 h-10 px-2.5 text-sm font-medium tabular-nums rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 ${
                  entry === currentPage
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {entry}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="inline-flex items-center justify-center gap-1 h-10 px-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 disabled:opacity-45 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
