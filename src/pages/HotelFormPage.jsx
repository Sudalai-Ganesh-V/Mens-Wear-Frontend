import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2 } from 'lucide-react';
import { addHotel, setNotification, updateHotel } from '../redux/hotelSlice';
import Navbar from '../components/Navbar';
import HotelForm from '../components/HotelForm';

export default function HotelFormPage({ mode = 'add' }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hotelToEdit = useSelector((state) =>
    mode === 'edit' && id
      ? state.hotels.hotels.find((item) => item.id === id) || null
      : null
  );

  const isEditMode = mode === 'edit';

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [mode, id]);

  const handleFormSubmit = (hotelPayload) => {
    if (isEditMode && hotelToEdit) {
      dispatch(updateHotel({ ...hotelPayload, id: hotelToEdit.id }));
      dispatch(
        setNotification({
          message: `Updated ${hotelPayload.title} successfully.`,
          tone: 'success',
        })
      );
    } else {
      dispatch(addHotel(hotelPayload));
      dispatch(
        setNotification({
          message: `Added ${hotelPayload.title} to your hotel catalog.`,
          tone: 'success',
        })
      );
    }
    navigate('/');
  };

  const pageTitle = isEditMode
    ? hotelToEdit
      ? `Edit ${hotelToEdit.title} · StayDesk Hotel Management`
      : 'Hotel Not Found · StayDesk Hotel Management'
    : 'Add New Hotel · StayDesk Hotel Management';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={
            isEditMode
              ? 'Update hotel listing information, coordinates, nightly price, and photography on StayDesk.'
              : 'Add a new hotel property with photo preview, coordinates, and nightly rate to your StayDesk portfolio.'
          }
        />
      </Helmet>

      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 rounded"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Back to Hotel Portfolio</span>
          </Link>
        </div>

        {isEditMode && !hotelToEdit ? (
          <section className="bg-white border border-slate-200 rounded-xl px-6 py-16 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
              <Building2 className="w-6 h-6" aria-hidden="true" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-medium text-slate-900">
              Hotel not found
            </h1>
            <p className="mt-1.5 max-w-md mx-auto text-sm text-slate-600">
              The hotel you tried to edit may have been removed from your local
              catalog.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center justify-center h-10 px-5 text-sm font-medium text-white bg-slate-900 hover:bg-emerald-950 rounded-lg transition-colors"
              >
                Return to Portfolio
              </Link>
            </div>
          </section>
        ) : (
          <>
            <div className="pb-6">
              <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-slate-900 text-balance">
                {isEditMode ? `Edit ${hotelToEdit.title}` : 'Add New Hotel'}
              </h1>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl">
                {isEditMode
                  ? 'Modify property details, coordinates, nightly rate, or photography. Changes are saved immediately to your browser.'
                  : 'Enter the property title, description, geographic coordinates, nightly rate, and a hotel photograph.'}
              </p>
            </div>

            <HotelForm
              key={isEditMode ? hotelToEdit.id : 'new'}
              initialHotel={hotelToEdit}
              mode={isEditMode ? 'edit' : 'add'}
              onSubmit={handleFormSubmit}
              onCancel={() => navigate('/')}
            />
          </>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} StayDesk Hotel Management</span>
          <span>Data stored locally in your browser</span>
        </div>
      </footer>
    </div>
  );
}
