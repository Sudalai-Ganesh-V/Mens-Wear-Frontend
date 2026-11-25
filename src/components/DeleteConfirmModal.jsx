import { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ hotel, onCancel, onConfirm }) {
  useEffect(() => {
    if (!hotel) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotel, onCancel]);

  if (!hotel) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/45 backdrop-blur-[2px]"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-red-700 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="delete-modal-title"
                className="text-base font-semibold text-slate-900"
              >
                Delete property?
              </h2>
              {hotel.location && (
                <p className="text-xs text-slate-500 mt-0.5">{hotel.location}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close confirmation dialog"
            className="w-8 h-8 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Are you sure you want to remove{' '}
          <strong className="font-semibold text-slate-900">{hotel.title}</strong>{' '}
          from your catalog? This change will be saved to your browser&apos;s local
          storage.
        </p>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 px-4 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(hotel)}
            className="h-10 px-4 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-600"
          >
            Delete Hotel
          </button>
        </div>
      </div>
    </div>
  );
}
