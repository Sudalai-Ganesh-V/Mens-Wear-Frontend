import { useState } from 'react';
import { ArrowUpRight, Building2, Pencil, Trash2 } from 'lucide-react';
import { formatCoordinates, formatCurrency } from '../utils/formatters';

export default function HotelCard({ hotel, onViewDetails, onEdit, onDelete }) {
  const [failedImageSrc, setFailedImageSrc] = useState(null);
  const hasImage = Boolean(hotel.image) && failedImageSrc !== hotel.image;

  const formattedPrice = formatCurrency(hotel.price);
  const locationDisplay =
    hotel.location?.trim() || formatCoordinates(hotel.latitude, hotel.longitude);

  const metadataParts = [
    locationDisplay,
    typeof hotel.rooms === 'number' ? `${hotel.rooms} rooms` : null,
    typeof hotel.rating === 'number' ? `${hotel.rating.toFixed(1)} rating` : null,
  ].filter(Boolean);

  return (
    <article className="group bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {hasImage ? (
          <img
            src={hotel.image}
            alt={
              locationDisplay
                ? `${hotel.title} hotel property in ${locationDisplay}`
                : `${hotel.title} hotel property photograph`
            }
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setFailedImageSrc(hotel.image)}
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 p-6 text-center">
            <Building2 className="w-8 h-8 text-slate-400" aria-hidden="true" />
            <span className="text-sm font-medium text-slate-600">
              {hotel.title}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {metadataParts.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {metadataParts.map((part, index) => (
              <span
                key={`${hotel.id}-meta-${index}`}
                className={
                  index === 0
                    ? 'truncate tabular-nums'
                    : 'tabular-nums whitespace-nowrap shrink-0'
                }
              >
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

        <div className="mt-2 flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900 tracking-tight leading-snug">
            {hotel.title}
          </h2>
          <div className="text-right shrink-0 whitespace-nowrap">
            <span className="text-lg font-semibold text-slate-900 tabular-nums">
              {formattedPrice}
            </span>
            <span className="text-xs text-slate-500"> / night</span>
          </div>
        </div>

        <p className="mt-2.5 text-sm leading-relaxed text-slate-600 line-clamp-2 flex-1">
          {hotel.description}
        </p>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(hotel)}
            className="inline-flex items-center gap-1.5 min-h-10 pr-2 text-sm font-medium text-emerald-900 hover:text-emerald-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 rounded-md"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onEdit(hotel)}
              aria-label={`Edit ${hotel.title}`}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-3 text-xs font-medium text-slate-700 hover:text-slate-950 bg-slate-100/80 hover:bg-slate-200/70 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
            >
              <Pencil className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => onDelete(hotel)}
              aria-label={`Delete ${hotel.title}`}
              className="inline-flex items-center justify-center gap-1.5 h-10 px-3 text-xs font-medium text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
