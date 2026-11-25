import { sampleHotels } from '../data/sampleHotels';

const STORAGE_KEY = 'staydesk_hotels_v2_inr';
const LEGACY_USD_STORAGE_KEY = 'staydesk_hotels_v1';
export const USD_TO_INR_RATE = 85;

const sampleById = new Map(sampleHotels.map((hotel) => [hotel.id, hotel]));

function hydrateHotelCoordinates(hotel) {
  if (
    typeof hotel.latitude === 'number' &&
    typeof hotel.longitude === 'number'
  ) {
    return hotel;
  }

  const fallback = sampleById.get(hotel.id);
  if (!fallback) {
    return hotel;
  }

  return {
    ...hotel,
    latitude:
      typeof hotel.latitude === 'number' ? hotel.latitude : fallback.latitude,
    longitude:
      typeof hotel.longitude === 'number'
        ? hotel.longitude
        : fallback.longitude,
  };
}

function migrateLegacyHotelToInr(hotel) {
  const hydrated = hydrateHotelCoordinates(hotel);
  const numericPrice = Number(hydrated.price);
  return {
    ...hydrated,
    price: Number.isFinite(numericPrice)
      ? Math.round(numericPrice * USD_TO_INR_RATE)
      : 0,
  };
}

export function loadHotelsFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(hydrateHotelCoordinates);
      }
    }

    // One-time migration for existing browsers holding pre-INR hotel records.
    const legacyRaw = window.localStorage.getItem(LEGACY_USD_STORAGE_KEY);
    if (legacyRaw !== null) {
      const legacyParsed = JSON.parse(legacyRaw);
      if (Array.isArray(legacyParsed)) {
        const migrated = legacyParsed.map(migrateLegacyHotelToInr);
        saveHotelsToStorage(migrated);
        window.localStorage.removeItem(LEGACY_USD_STORAGE_KEY);
        return migrated;
      }
      window.localStorage.removeItem(LEGACY_USD_STORAGE_KEY);
    }

    saveHotelsToStorage(sampleHotels);
    return sampleHotels;
  } catch {
    return sampleHotels;
  }
}

export function saveHotelsToStorage(hotels) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(hotels));
    return true;
  } catch {
    return false;
  }
}

export function resetHotelsInStorage() {
  try {
    window.localStorage.removeItem(LEGACY_USD_STORAGE_KEY);
  } catch {
    // Ignore storage cleanup errors
  }
  saveHotelsToStorage(sampleHotels);
  return sampleHotels;
}
