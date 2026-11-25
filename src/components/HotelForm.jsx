import { useRef, useState } from 'react';
import {
  AlertCircle,
  Building2,
  ImagePlus,
  MapPin,
  Trash2,
  Upload,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 960;

function createInitialValues(hotel) {
  return {
    title: hotel?.title ?? '',
    description: hotel?.description ?? '',
    latitude:
      hotel?.latitude !== undefined && hotel?.latitude !== null
        ? String(hotel.latitude)
        : '',
    longitude:
      hotel?.longitude !== undefined && hotel?.longitude !== null
        ? String(hotel.longitude)
        : '',
    price:
      hotel?.price !== undefined && hotel?.price !== null
        ? String(hotel.price)
        : '',
    image: hotel?.image ?? '',
  };
}

function getInputClassName(extraClasses = 'h-11') {
  return `staydesk-field ${extraClasses}`.trim();
}

function readFileAsCompressedDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Unable to read the selected file.'));
    reader.onload = () => {
      const rawDataUrl = reader.result;
      if (typeof rawDataUrl !== 'string') {
        reject(new Error('Invalid image file content.'));
        return;
      }

      if (file.type === 'image/svg+xml') {
        resolve(rawDataUrl);
        return;
      }

      const img = new Image();
      img.onerror = () => resolve(rawDataUrl);
      img.onload = () => {
        try {
          const scale =
            img.width > MAX_IMAGE_WIDTH ? MAX_IMAGE_WIDTH / img.width : 1;
          const targetWidth = Math.max(1, Math.round(img.width * scale));
          const targetHeight = Math.max(1, Math.round(img.height * scale));

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          resolve(compressed.length < rawDataUrl.length ? compressed : rawDataUrl);
        } catch {
          resolve(rawDataUrl);
        }
      };
      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}

export function validateFormValues(values) {
  const errors = {};

  const trimmedTitle = values.title.trim();
  if (!trimmedTitle) {
    errors.title = 'Hotel title is required.';
  } else if (trimmedTitle.length < 2) {
    errors.title = 'Hotel title must be at least 2 characters.';
  }

  const trimmedDescription = values.description.trim();
  if (!trimmedDescription) {
    errors.description = 'Description is required.';
  } else if (trimmedDescription.length < 10) {
    errors.description = 'Description must be at least 10 characters.';
  }

  const latStr = String(values.latitude).trim();
  if (latStr === '') {
    errors.latitude = 'Latitude is required.';
  } else {
    const latNum = Number(latStr);
    if (!Number.isFinite(latNum) || latNum < -90 || latNum > 90) {
      errors.latitude = 'Latitude must be a valid coordinate between -90 and 90.';
    }
  }

  const lngStr = String(values.longitude).trim();
  if (lngStr === '') {
    errors.longitude = 'Longitude is required.';
  } else {
    const lngNum = Number(lngStr);
    if (!Number.isFinite(lngNum) || lngNum < -180 || lngNum > 180) {
      errors.longitude =
        'Longitude must be a valid coordinate between -180 and 180.';
    }
  }

  const priceStr = String(values.price).trim();
  if (priceStr === '') {
    errors.price = 'Price per night (INR) is required.';
  } else {
    const priceNum = Number(priceStr);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      errors.price = 'Price in INR must be a positive number greater than 0.';
    }
  }

  const trimmedImage =
    typeof values.image === 'string' ? values.image.trim() : '';
  if (!trimmedImage) {
    errors.image = 'Please upload a hotel photograph.';
  }

  return errors;
}

export default function HotelForm({
  initialHotel = null,
  mode = 'add',
  onSubmit,
  onCancel,
}) {
  const isEditMode = mode === 'edit' && Boolean(initialHotel);
  const fileInputRef = useRef(null);

  const [values, setValues] = useState(() => createInitialValues(initialHotel));
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [previewLoadFailed, setPreviewLoadFailed] = useState(false);

  const handleFieldChange = (field, value) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);

    if (touched[field]) {
      const nextErrors = validateFormValues(nextValues);
      setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }));
    }
  };

  const handleFieldBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const nextErrors = validateFormValues(values);
    setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }));
  };

  const handleImageFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setImageError('');

    if (!file.type.startsWith('image/')) {
      setImageError('Please upload a valid image file (JPG, PNG, WebP, or GIF).');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setImageError('Image file must be 10 MB or smaller.');
      event.target.value = '';
      return;
    }

    setIsProcessingImage(true);
    try {
      const dataUrl = await readFileAsCompressedDataUrl(file);
      setValues((prev) => ({ ...prev, image: dataUrl }));
      setErrors((prev) => ({ ...prev, image: undefined }));
      setTouched((prev) => ({ ...prev, image: true }));
      setSelectedFileName(file.name);
      setPreviewLoadFailed(false);
    } catch (err) {
      setImageError(
        err instanceof Error ? err.message : 'Failed to process selected image.'
      );
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleRemoveImage = () => {
    const nextValues = { ...values, image: '' };
    setValues(nextValues);
    setTouched((prev) => ({ ...prev, image: true }));
    setErrors((prev) => ({
      ...prev,
      image: validateFormValues(nextValues).image,
    }));
    setSelectedFileName('');
    setImageError('');
    setPreviewLoadFailed(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateFormValues(values);
    setTouched({
      title: true,
      description: true,
      latitude: true,
      longitude: true,
      price: true,
      image: true,
    });
    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length > 0 ||
      imageError ||
      isProcessingImage
    ) {
      return;
    }

    onSubmit({
      ...(isEditMode ? { id: initialHotel.id } : {}),
      title: values.title.trim(),
      description: values.description.trim(),
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      price: Number(values.price),
      image: values.image,
    });
  };

  const numericPrice = Number(values.price);
  const formattedPreviewPrice =
    values.price && Number.isFinite(numericPrice) && numericPrice > 0
      ? formatCurrency(numericPrice)
      : null;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
    >
      <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <label
            htmlFor="hotel-image-upload"
            className="text-sm font-semibold text-slate-900"
          >
            Hotel photograph{' '}
            <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          {values.image && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-red-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Remove</span>
            </button>
          )}
        </div>

        <div
          className={`staydesk-upload-zone relative aspect-[4/3] w-full ${
            values.image && !previewLoadFailed
              ? 'staydesk-upload-zone--has-image'
              : ''
          } ${
            imageError || (touched.image && errors.image)
              ? 'staydesk-upload-zone--error'
              : ''
          }`}
        >
          {values.image && !previewLoadFailed ? (
            <img
              src={values.image}
              alt={
                values.title.trim()
                  ? `Preview photograph of ${values.title.trim()}`
                  : 'Uploaded hotel preview photograph'
              }
              referrerPolicy="no-referrer"
              onError={() => setPreviewLoadFailed(true)}
              className="w-full h-full object-cover block"
            />
          ) : (
            <div className="staydesk-upload-empty">
              <div className="staydesk-upload-icon">
                <ImagePlus className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  No photograph selected
                </p>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[240px] mx-auto">
                  Upload a JPG, PNG, or WebP photo for live preview
                </p>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          id="hotel-image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageFileChange}
          aria-invalid={Boolean(imageError || (touched.image && errors.image))}
          aria-describedby={
            imageError || (touched.image && errors.image)
              ? 'hotel-image-error'
              : undefined
          }
          className="sr-only"
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingImage}
            className="staydesk-upload-btn inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-medium disabled:opacity-50 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Upload className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              {isProcessingImage
                ? 'Processing image...'
                : values.image
                ? 'Replace Image'
                : 'Upload Image'}
            </span>
          </button>

          {selectedFileName && (
            <span className="text-xs text-slate-500 truncate max-w-[200px]">
              {selectedFileName}
            </span>
          )}
        </div>

        {(imageError || (touched.image && errors.image)) && (
          <p
            id="hotel-image-error"
            role="alert"
            className="mt-3 flex items-center gap-1.5 text-xs font-medium text-red-700"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{imageError || errors.image}</span>
          </p>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-500 mb-2">
            Listing preview summary
          </p>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-base font-semibold text-slate-900 truncate">
              {values.title.trim() || 'Untitled Hotel'}
            </p>
            <p className="text-sm font-semibold text-slate-900 tabular-nums whitespace-nowrap shrink-0">
              {formattedPreviewPrice ? `${formattedPreviewPrice} / night` : '—'}
            </p>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 tabular-nums">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span>
              {values.latitude !== '' && values.longitude !== ''
                ? `${values.latitude}, ${values.longitude}`
                : 'Coordinates not entered yet'}
            </span>
          </p>
        </div>
      </div>

      <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 space-y-5">
        <div>
          <label
            htmlFor="hotel-title-input"
            className="staydesk-label text-sm font-medium text-slate-800 mb-1.5"
          >
            Hotel title <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="hotel-title-input"
            name="title"
            type="text"
            required
            value={values.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            onBlur={() => handleFieldBlur('title')}
            placeholder="e.g. The Harborview Terrace"
            aria-invalid={Boolean(touched.title && errors.title)}
            aria-describedby={
              touched.title && errors.title ? 'hotel-title-error' : undefined
            }
            className={getInputClassName()}
          />
          {touched.title && errors.title && (
            <p
              id="hotel-title-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-700"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <label
              htmlFor="hotel-description-input"
              className="staydesk-label text-sm font-medium text-slate-800"
            >
              Description{' '}
              <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <span className="text-xs text-slate-400 tabular-nums">
              {values.description.trim().length} characters
            </span>
          </div>
          <textarea
            id="hotel-description-input"
            name="description"
            rows={4}
            required
            value={values.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            onBlur={() => handleFieldBlur('description')}
            placeholder="Describe the property's architecture, setting, and signature amenities..."
            aria-invalid={Boolean(touched.description && errors.description)}
            aria-describedby={
              touched.description && errors.description
                ? 'hotel-description-error'
                : undefined
            }
            className={getInputClassName('staydesk-textarea resize-y')}
          />
          {touched.description && errors.description && (
            <p
              id="hotel-description-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-700"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.description}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="hotel-latitude-input"
              className="staydesk-label text-sm font-medium text-slate-800 mb-1.5"
            >
              Latitude <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input
              id="hotel-latitude-input"
              name="latitude"
              type="number"
              step="any"
              min="-90"
              max="90"
              required
              value={values.latitude}
              onChange={(e) => handleFieldChange('latitude', e.target.value)}
              onBlur={() => handleFieldBlur('latitude')}
              placeholder="-90 to 90 (e.g. 47.6062)"
              aria-invalid={Boolean(touched.latitude && errors.latitude)}
              aria-describedby={
                touched.latitude && errors.latitude
                  ? 'hotel-latitude-error'
                  : 'hotel-latitude-hint'
              }
              className={getInputClassName('h-11 tabular-nums')}
            />
            {touched.latitude && errors.latitude ? (
              <p
                id="hotel-latitude-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-700"
              >
                <AlertCircle
                  className="w-3.5 h-3.5 shrink-0"
                  aria-hidden="true"
                />
                <span>{errors.latitude}</span>
              </p>
            ) : (
              <p id="hotel-latitude-hint" className="mt-1.5 text-xs text-slate-500">
                Valid range: -90 to 90
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="hotel-longitude-input"
              className="staydesk-label text-sm font-medium text-slate-800 mb-1.5"
            >
              Longitude <span className="text-red-600" aria-hidden="true">*</span>
            </label>
            <input
              id="hotel-longitude-input"
              name="longitude"
              type="number"
              step="any"
              min="-180"
              max="180"
              required
              value={values.longitude}
              onChange={(e) => handleFieldChange('longitude', e.target.value)}
              onBlur={() => handleFieldBlur('longitude')}
              placeholder="-180 to 180 (e.g. -122.3321)"
              aria-invalid={Boolean(touched.longitude && errors.longitude)}
              aria-describedby={
                touched.longitude && errors.longitude
                  ? 'hotel-longitude-error'
                  : 'hotel-longitude-hint'
              }
              className={getInputClassName('h-11 tabular-nums')}
            />
            {touched.longitude && errors.longitude ? (
              <p
                id="hotel-longitude-error"
                role="alert"
                className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-700"
              >
                <AlertCircle
                  className="w-3.5 h-3.5 shrink-0"
                  aria-hidden="true"
                />
                <span>{errors.longitude}</span>
              </p>
            ) : (
              <p id="hotel-longitude-hint" className="mt-1.5 text-xs text-slate-500">
                Valid range: -180 to 180
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="hotel-price-input"
            className="staydesk-label text-sm font-medium text-slate-800 mb-1.5"
          >
            Price per night (INR){' '}
            <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <div className="relative max-w-xs">
            <span
              aria-hidden="true"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none"
            >
              ₹
            </span>
            <input
              id="hotel-price-input"
              name="price"
              type="number"
              inputMode="decimal"
              step="1"
              min="1"
              required
              value={values.price}
              onChange={(e) => handleFieldChange('price', e.target.value)}
              onBlur={() => handleFieldBlur('price')}
              placeholder="15000"
              aria-invalid={Boolean(touched.price && errors.price)}
              aria-describedby={
                touched.price && errors.price ? 'hotel-price-error' : undefined
              }
              className={getInputClassName('h-11 pl-7 pr-3.5 tabular-nums')}
            />
          </div>
          {touched.price && errors.price && (
            <p
              id="hotel-price-error"
              role="alert"
              className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-700"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{errors.price}</span>
            </p>
          )}
        </div>

        <div className="pt-5 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 px-5 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessingImage}
            className="inline-flex items-center justify-center gap-2 h-10 px-5 text-sm font-medium text-white bg-slate-900 hover:bg-emerald-950 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-800"
          >
            <Building2 className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{isEditMode ? 'Save Changes' : 'Add Hotel'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
