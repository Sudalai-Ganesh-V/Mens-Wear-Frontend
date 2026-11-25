import { AlertCircle, RotateCcw, Search, X } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function SearchBar({
  searchQuery,
  minPrice,
  maxPrice,
  sortBy,
  hasActiveFilters,
  isPriceRangeInvalid,
  onSearchChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortChange,
  onResetFilters,
}) {
  const handlePriceInput = (rawValue, handler) => {
    if (rawValue === '') {
      handler('');
      return;
    }
    const numeric = Number(rawValue);
    if (!Number.isNaN(numeric) && numeric >= 0) {
      handler(rawValue);
    }
  };

  const priceInputClass = 'staydesk-field h-10 pl-7 pr-3 tabular-nums';

  return (
    <section
      aria-label="Search and filter hotels"
      className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-end">
        <div className="md:col-span-5">
          <label
            htmlFor="hotel-search-input"
            className="staydesk-label text-xs font-medium text-slate-600 mb-1.5"
          >
            Search by hotel title
          </label>
          <div className="relative">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="hotel-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search hotels, e.g. Alpenhaus or Harbor..."
              className="staydesk-field h-10 pl-10 pr-9"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search query"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="min-price-input"
            className="staydesk-label text-xs font-medium text-slate-600 mb-1.5"
          >
            Min price (INR)
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none"
            >
              ₹
            </span>
            <input
              id="min-price-input"
              type="number"
              inputMode="numeric"
              min="0"
              step="500"
              value={minPrice}
              onChange={(e) => handlePriceInput(e.target.value, onMinPriceChange)}
              placeholder="0"
              aria-invalid={isPriceRangeInvalid}
              className={priceInputClass}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="max-price-input"
            className="staydesk-label text-xs font-medium text-slate-600 mb-1.5"
          >
            Max price (INR)
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none"
            >
              ₹
            </span>
            <input
              id="max-price-input"
              type="number"
              inputMode="numeric"
              min="0"
              step="500"
              value={maxPrice}
              onChange={(e) => handlePriceInput(e.target.value, onMaxPriceChange)}
              placeholder="Any"
              aria-invalid={isPriceRangeInvalid}
              className={priceInputClass}
            />
          </div>
        </div>

        <div className={hasActiveFilters ? 'md:col-span-2' : 'md:col-span-3'}>
          <label
            htmlFor="hotel-sort-select"
            className="staydesk-label text-xs font-medium text-slate-600 mb-1.5"
          >
            Sort order
          </label>
          <select
            id="hotel-sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="staydesk-field staydesk-select h-10 pl-3"
          >
            <option value="default">Featured Order</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="title-asc">Title: A to Z</option>
          </select>
        </div>

        {hasActiveFilters && (
          <div className="md:col-span-1 flex justify-end">
            <button
              type="button"
              onClick={onResetFilters}
              title="Reset search and filters"
              className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 h-10 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>

      {isPriceRangeInvalid && (
        <p
          role="alert"
          className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-700"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>
            Minimum price ({formatCurrency(Number(minPrice))}) cannot exceed
            maximum price ({formatCurrency(Number(maxPrice))}).
          </span>
        </p>
      )}
    </section>
  );
}
