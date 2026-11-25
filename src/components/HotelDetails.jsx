import { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Pencil,
  Trash2,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import HotelMap, { isValidCoordinates } from './HotelMap';

export default function HotelDetails({ hotel, onBack, onEdit, onDelete }) {
  const [failedImageSrc, setFailedImageSrc] = useState(null);
  const hasImage = Boolean(hotel.image) && failedImageSrc !== hotel.image;

  const formattedPrice = formatCurrency(hotel.price);
  const hasValidCoords = isValidCoordinates(hotel.latitude, hotel.longitude);
  const formattedLat = hasValidCoords
    ? Number(hotel.latitude).toFixed(4)
    : 'Not available';
  const formattedLng = hasValidCoords
    ? Number(hotel.longitude).toFixed(4)
    : 'Not available';

  const metadataParts = [
    hotel.location?.trim() || null,
    typeof hotel.rooms === 'number' ? `${hotel.rooms} rooms` : null,
    typeof hotel.rating === 'number' ? `${hotel.rating.toFixed(1)} rating` : null,
  ].filter(Boolean);

  const imageAlt = hotel.location?.trim()
    ? `Full property view of ${hotel.title} in ${hotel.location.trim()}`
    : `Full property view of ${hotel.title}`;

  return (
    <article className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 h-10 pr-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 rounded-md"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Back to Hotels</span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(hotel)}
            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
          >
            <Pencil className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Edit Hotel</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(hotel)}
            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 text-sm font-medium text-red-700 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            <Trash2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="relative aspect-[16/9] max-h-[500px] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/90">
        {hasImage ? (
          <img
            src={hotel.image}
            alt={imageAlt}
            referrerPolicy="no-referrer"
            onError={() => setFailedImageSrc(hotel.image)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2.5 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 p-8 text-center">
            <Building2 className="w-10 h-10 text-slate-400" aria-hidden="true" />
            <span className="text-base font-medium text-slate-600">
              {hotel.title}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          {metadataParts.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              {metadataParts.map((part, index) => (
                <span key={`detail-meta-${index}`} className="tabular-nums">
                  {index > 0 && (
                    <span aria-hidden="true" className="mr-2 text-slate-300">
                      ·
                    </span>
                  )}
                  {part}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-display text-3xl sm:text-4xl font-medium tracking-tight text-slate-900 text-balance">
            {hotel.title}
          </h1>

          <div className="pt-2">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              About this property
            </h2>
            <p className="text-base leading-relaxed text-slate-700 whitespace-pre-line">
              {hotel.description}
            </p>
          </div>
        </div>

        <aside
          aria-label="Property pricing and coordinates"
          className="lg:col-span-5 bg-white border border-slate-200/90 rounded-xl p-6"
        >
          <div className="pb-5 border-b border-slate-100 flex items-baseline justify-between gap-4">
            <span className="text-sm font-medium text-slate-600">
              Nightly rate
            </span>
            <div className="text-right">
              <span className="text-3xl font-semibold text-slate-900 tabular-nums">
                {formattedPrice}
              </span>
              <span className="text-sm text-slate-500"> / night</span>
            </div>
          </div>

          <dl className="divide-y divide-slate-100 text-sm">
            {hotel.location?.trim() && (
              <div className="py-3.5 flex items-center justify-between gap-4">
                <dt className="text-slate-500">Location</dt>
                <dd className="font-medium text-slate-900 text-right">
                  {hotel.location}
                </dd>
              </div>
            )}

            <div className="py-3.5 flex items-center justify-between gap-4">
              <dt className="text-slate-500">Latitude</dt>
              <dd className="font-medium text-slate-900 tabular-nums">
                {formattedLat}
              </dd>
            </div>

            <div className="py-3.5 flex items-center justify-between gap-4">
              <dt className="text-slate-500">Longitude</dt>
              <dd className="font-medium text-slate-900 tabular-nums">
                {formattedLng}
              </dd>
            </div>

            {typeof hotel.rooms === 'number' && (
              <div className="py-3.5 flex items-center justify-between gap-4">
                <dt className="text-slate-500">Guest rooms</dt>
                <dd className="font-medium text-slate-900 tabular-nums">
                  {hotel.rooms}
                </dd>
              </div>
            )}

            {typeof hotel.rating === 'number' && (
              <div className="py-3.5 flex items-center justify-between gap-4">
                <dt className="text-slate-500">Guest rating</dt>
                <dd className="font-medium text-slate-900 tabular-nums">
                  {hotel.rating.toFixed(1)} / 5.0
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onEdit(hotel)}
              className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium text-white bg-slate-900 hover:bg-emerald-950 rounded-lg transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-800"
            >
              <Pencil className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Edit Property</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
            >
              Back to Hotels
            </button>
          </div>
        </aside>
      </div>

      <section aria-labelledby="hotel-location-heading" className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
          <h2
            id="hotel-location-heading"
            className="text-xl font-semibold text-slate-900 tracking-tight"
          >
            Location &amp; Map
          </h2>
          {hasValidCoords && (
            <p className="inline-flex items-center gap-1.5 text-sm text-slate-500 tabular-nums">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span>
                {formattedLat}, {formattedLng}
              </span>
            </p>
          )}
        </div>

        <HotelMap
          latitude={hotel.latitude}
          longitude={hotel.longitude}
          hotelTitle={hotel.title}
          hotelLocation={hotel.location}
          onEditCoordinates={() => onEdit(hotel)}
        />
      </section>
    </article>
  );
}
