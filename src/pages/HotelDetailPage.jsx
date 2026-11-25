import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';
import { deleteHotel, setNotification } from '../redux/hotelSlice';
import { formatCurrency } from '../utils/formatters';
import Navbar from '../components/Navbar';
import HotelDetails from '../components/HotelDetails';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export function buildHotelMetaDescription(hotel) {
  if (!hotel) {
    return 'The requested hotel property could not be found in your StayDesk portfolio.';
  }

  const priceText = Number.isFinite(Number(hotel.price))
    ? `${formatCurrency(Math.round(Number(hotel.price)))}/night`
    : '';
  const prefix = [hotel.title, hotel.location, priceText]
    .filter(Boolean)
    .join(' · ');
  const cleanDescription = (hotel.description || '').replace(/\s+/g, ' ').trim();
  const combined = cleanDescription
    ? `${prefix} — ${cleanDescription}`
    : prefix;

  if (combined.length <= 160) {
    return combined;
  }

  return `${combined.slice(0, 157).trimEnd()}...`;
}

export default function HotelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hotel = useSelector((state) =>
    id ? state.hotels.hotels.find((item) => item.id === id) || null : null
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  const handleConfirmDelete = (targetHotel) => {
    dispatch(deleteHotel(targetHotel.id));
    dispatch(
      setNotification({
        message: `Deleted ${targetHotel.title} from your catalog.`,
        tone: 'success',
      })
    );
    setShowDeleteModal(false);
    navigate('/');
  };

  const pageTitle = hotel
    ? `${hotel.title} · StayDesk Hotel Management`
    : 'Hotel Not Found · StayDesk Hotel Management';

  const metaDescription = buildHotelMetaDescription(hotel);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {hotel ? (
          <HotelDetails
            hotel={hotel}
            onBack={() => navigate('/')}
            onEdit={(selected) => navigate(`/hotels/${selected.id}/edit`)}
            onDelete={() => setShowDeleteModal(true)}
          />
        ) : (
          <section className="bg-white border border-slate-200 rounded-xl px-6 py-16 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
              <Building2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="mt-4 font-display text-2xl sm:text-3xl font-medium text-slate-900">
              Hotel not found
            </h1>
            <p className="mt-2 max-w-md mx-auto text-sm text-slate-600">
              We couldn&apos;t find a hotel matching ID{' '}
              <span className="font-medium text-slate-800">{id || 'unknown'}</span>.
              It may have been removed or the link may be invalid.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium text-white bg-slate-900 hover:bg-emerald-950 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-800"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Back to Hotels</span>
              </Link>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} StayDesk Hotel Management</span>
          <span>Data stored locally in your browser</span>
        </div>
      </footer>

      <DeleteConfirmModal
        hotel={showDeleteModal ? hotel : null}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
