import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Building2, CheckCircle2, Info, RotateCcw, X } from 'lucide-react';
import {
  clearNotification,
  deleteHotel,
  getActivePriceTier,
  resetFilters,
  restoreSampleHotels,
  selectPriceTier,
  setCurrentPage,
  setItemsPerPage,
  setMaxPrice,
  setMinPrice,
  setNotification,
  setSearchQuery,
  setSortBy,
} from '../redux/hotelSlice';
import { sampleHotels } from '../data/sampleHotels';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import Pagination from '../components/Pagination';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const mobileTiers = [
  { id: 'all', label: 'All' },
  { id: 'under-20000', label: '<₹20,000' },
  { id: 'mid-range', label: '₹20,000–₹35,000' },
  { id: 'luxury', label: '₹35,000+' },
];

export default function HotelListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    hotels,
    searchQuery,
    minPrice,
    maxPrice,
    sortBy,
    currentPage,
    itemsPerPage,
    notification,
  } = useSelector((state) => state.hotels);

  const [hotelToDelete, setHotelToDelete] = useState(null);

  useEffect(() => {
    if (!notification) return;
    const timer = window.setTimeout(() => {
      dispatch(clearNotification());
    }, 4200);
    return () => window.clearTimeout(timer);
  }, [notification, dispatch]);

  const parsedMin = minPrice.trim() !== '' ? Number(minPrice) : null;
  const parsedMax = maxPrice.trim() !== '' ? Number(maxPrice) : null;
  const isPriceRangeInvalid =
    parsedMin !== null && parsedMax !== null && parsedMin > parsedMax;

  const query = searchQuery.trim().toLowerCase();
  const matchedHotels = isPriceRangeInvalid
    ? []
    : hotels.filter((hotel) => {
        if (query && !hotel.title.toLowerCase().includes(query)) {
          return false;
        }
        if (
          parsedMin !== null &&
          !Number.isNaN(parsedMin) &&
          hotel.price < parsedMin
        ) {
          return false;
        }
        if (
          parsedMax !== null &&
          !Number.isNaN(parsedMax) &&
          hotel.price > parsedMax
        ) {
          return false;
        }
        return true;
      });

  const filteredHotels =
    sortBy === 'price-asc'
      ? [...matchedHotels].sort((a, b) => a.price - b.price)
      : sortBy === 'price-desc'
      ? [...matchedHotels].sort((a, b) => b.price - a.price)
      : sortBy === 'title-asc'
      ? [...matchedHotels].sort((a, b) => a.title.localeCompare(b.title))
      : matchedHotels;

  const totalPages = Math.max(1, Math.ceil(filteredHotels.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      dispatch(setCurrentPage(totalPages));
    }
  }, [currentPage, totalPages, dispatch]);

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedHotels = filteredHotels.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const hasActiveFilters =
    query !== '' ||
    minPrice.trim() !== '' ||
    maxPrice.trim() !== '' ||
    sortBy !== 'default';

  const activeTier = getActivePriceTier(minPrice, maxPrice);

  const handleConfirmDelete = (hotel) => {
    dispatch(deleteHotel(hotel.id));
    setHotelToDelete(null);
    dispatch(
      setNotification({
        message: `Deleted ${hotel.title} from your catalog.`,
        tone: 'success',
      })
    );
  };

  const handleRestoreSamples = () => {
    dispatch(restoreSampleHotels());
    dispatch(
      setNotification({
        message: `Restored ${sampleHotels.length} sample hotels.`,
        tone: 'success',
      })
    );
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dynamicTitle = searchQuery.trim()
    ? `Search "${searchQuery.trim()}" · StayDesk Hotel Management`
    : 'StayDesk — Hotel Management & Property Portfolio';

  const dynamicDescription = hasActiveFilters
    ? `Viewing ${filteredHotels.length} matching properties on StayDesk Hotel Management.`
    : `Manage ${hotels.length} boutique hotels on StayDesk with instant title search, nightly price filters, interactive location maps, and configurable pagination.`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Helmet>
        <title>{dynamicTitle}</title>
        <meta name="description" content={dynamicDescription} />
      </Helmet>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
          <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-slate-900 text-balance">
            Hotel List
          </h1>

          {hotels.length < sampleHotels.length && (
            <button
              type="button"
              onClick={handleRestoreSamples}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-3.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100/80 hover:border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
            >
              <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Restore Sample Hotels</span>
            </button>
          )}
        </div>

        <SearchBar
          searchQuery={searchQuery}
          minPrice={minPrice}
          maxPrice={maxPrice}
          sortBy={sortBy}
          hasActiveFilters={hasActiveFilters}
          isPriceRangeInvalid={isPriceRangeInvalid}
          onSearchChange={(value) => dispatch(setSearchQuery(value))}
          onMinPriceChange={(value) => dispatch(setMinPrice(value))}
          onMaxPriceChange={(value) => dispatch(setMaxPrice(value))}
          onSortChange={(value) => dispatch(setSortBy(value))}
          onResetFilters={() => dispatch(resetFilters())}
        />

        <div className="mt-6 mb-4 flex items-center justify-between gap-4 text-sm text-slate-600">
          <p className="tabular-nums">
            {hasActiveFilters ? (
              <>
                Found{' '}
                <strong className="font-semibold text-slate-900">
                  {filteredHotels.length}
                </strong>{' '}
                matching {filteredHotels.length === 1 ? 'hotel' : 'hotels'}
              </>
            ) : (
              <>
                Showing all{' '}
                <strong className="font-semibold text-slate-900">
                  {filteredHotels.length}
                </strong>{' '}
                listed {filteredHotels.length === 1 ? 'hotel' : 'hotels'}
              </>
            )}
          </p>

          <div className="flex md:hidden items-center gap-1.5 overflow-x-auto">
            {mobileTiers.map((tier) => {
              const selected = activeTier === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => dispatch(selectPriceTier(tier.id))}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selected
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {tier.label}
                </button>
              );
            })}
          </div>
        </div>

        {paginatedHotels.length > 0 ? (
          <section
            aria-label="Hotel listings"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginatedHotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                onViewDetails={(selected) => navigate(`/hotels/${selected.id}`)}
                onEdit={(selected) => navigate(`/hotels/${selected.id}/edit`)}
                onDelete={(selected) => setHotelToDelete(selected)}
              />
            ))}
          </section>
        ) : (
          <section className="mt-4 bg-white border border-slate-200 rounded-xl px-6 py-16 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
              <Building2 className="w-6 h-6" aria-hidden="true" />
            </div>
            {hotels.length === 0 ? (
              <>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  No hotels in your catalog
                </h2>
                <p className="mt-1.5 max-w-md mx-auto text-sm text-slate-600">
                  All properties have been removed from local storage. Add a new
                  hotel or restore the sample hotel collection.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/hotels/new')}
                    className="inline-flex items-center justify-center h-10 px-5 text-sm font-medium text-white bg-slate-900 hover:bg-emerald-950 rounded-lg transition-colors cursor-pointer"
                  >
                    Add Property
                  </button>
                  <button
                    type="button"
                    onClick={handleRestoreSamples}
                    className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    <span>Restore Sample Hotels</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  No matching hotels found
                </h2>
                <p className="mt-1.5 max-w-md mx-auto text-sm text-slate-600">
                  Try adjusting your hotel title search or widening your minimum
                  and maximum nightly price range.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => dispatch(resetFilters())}
                    className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium text-white bg-slate-900 hover:bg-emerald-950 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-800"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    <span>Clear All Filters</span>
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          totalItems={filteredHotels.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={(size) => dispatch(setItemsPerPage(size))}
        />
      </main>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} StayDesk Hotel Management</span>
          <span>Data stored locally in your browser</span>
        </div>
      </footer>

      <DeleteConfirmModal
        hotel={hotelToDelete}
        onCancel={() => setHotelToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 max-w-sm bg-slate-900 text-white rounded-xl px-4 py-3 shadow-lg flex items-center gap-3"
        >
          {notification.tone === 'success' ? (
            <CheckCircle2
              className="w-4 h-4 text-emerald-400 shrink-0"
              aria-hidden="true"
            />
          ) : (
            <Info
              className="w-4 h-4 text-slate-300 shrink-0"
              aria-hidden="true"
            />
          )}
          <p className="text-sm leading-snug text-slate-100">
            {notification.message}
          </p>
          <button
            type="button"
            onClick={() => dispatch(clearNotification())}
            aria-label="Dismiss notification"
            className="ml-auto w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-white rounded-md shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
