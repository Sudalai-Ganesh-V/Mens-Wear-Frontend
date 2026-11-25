import { useState } from 'react';
import { LogOut, Plus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../redux/authSlice';
import { getActivePriceTier, selectPriceTier } from '../redux/hotelSlice';
import LogoutConfirmModal from './LogoutConfirmModal';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const { minPrice, maxPrice } = useSelector((state) => state.hotels);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isListingPage = location.pathname === '/';
  const isAllPropertiesActive =
    isListingPage && getActivePriceTier(minPrice, maxPrice) === 'all';

  const handleSelectAllProperties = () => {
    dispatch(selectPriceTier('all'));
    if (!isListingPage) {
      navigate('/');
    }
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    dispatch(logout());
    navigate('/login', { replace: true, state: { loggedOut: true } });
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 sm:gap-7 min-w-0">
            <Link
              to="/"
              onClick={() => dispatch(selectPriceTier('all'))}
              className="font-display text-xl font-semibold tracking-tight text-slate-900 hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 rounded-sm"
            >
              StayDesk
            </Link>

            <span
              aria-hidden="true"
              className="hidden sm:block h-4 w-px bg-slate-200 shrink-0"
            />

            <nav aria-label="Primary navigation" className="hidden sm:flex items-center">
              <button
                type="button"
                onClick={handleSelectAllProperties}
                className={`relative py-2 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 rounded-sm ${
                  isAllPropertiesActive
                    ? 'text-slate-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Properties
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-px h-0.5 transition-opacity duration-150 ${
                    isAllPropertiesActive
                      ? 'bg-emerald-900 opacity-100'
                      : 'bg-slate-300 opacity-0'
                  }`}
                />
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/hotels/new')}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-4 text-sm font-medium text-white bg-slate-900 hover:bg-emerald-950 active:scale-[0.99] rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-800"
            >
              <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Add Property</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              aria-label="Sign out of StayDesk"
              className="inline-flex items-center justify-center gap-1.5 h-10 px-3 text-sm font-medium text-slate-600 hover:text-slate-950 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
            >
              <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        userEmail={user?.email}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}
