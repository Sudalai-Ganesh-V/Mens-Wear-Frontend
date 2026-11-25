import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { MapPinOff } from 'lucide-react';

const hotelMarkerIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIcon2xUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function isValidCoordinates(latitude, longitude) {
  if (
    latitude === null ||
    latitude === undefined ||
    latitude === '' ||
    typeof latitude === 'boolean' ||
    longitude === null ||
    longitude === undefined ||
    longitude === '' ||
    typeof longitude === 'boolean'
  ) {
    return false;
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return false;
  }

  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };
    const timer = window.setTimeout(handleResize, 120);
    window.addEventListener('resize', handleResize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  return null;
}

export default function HotelMap({
  latitude,
  longitude,
  hotelTitle,
  hotelLocation = '',
  onEditCoordinates,
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const valid = isValidCoordinates(latitude, longitude);

  if (!valid) {
    return (
      <div
        role="status"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-6 py-12 text-center"
      >
        <div className="w-11 h-11 mx-auto rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center justify-center">
          <MapPinOff className="w-5 h-5" aria-hidden="true" />
        </div>
        <h3 className="mt-3.5 text-base font-semibold text-slate-900">
          Interactive map unavailable
        </h3>
        <p className="mt-1.5 max-w-md mx-auto text-sm text-slate-600">
          Valid geographic coordinates are required to display this property on
          the map (latitude between -90 and 90, longitude between -180 and 180).
        </p>
        {onEditCoordinates && (
          <div className="mt-5">
            <button
              type="button"
              onClick={onEditCoordinates}
              className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800"
            >
              Update Coordinates
            </button>
          </div>
        )}
      </div>
    );
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  return (
    <div className="relative z-0 isolate w-full h-72 sm:h-80 lg:h-96 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
      {isClient ? (
        <MapContainer
          key={`${lat}-${lng}`}
          center={[lat, lng]}
          zoom={14}
          scrollWheelZoom={false}
          className="w-full h-full z-0"
        >
          <MapResizeHandler />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} icon={hotelMarkerIcon}>
            <Popup>
              <div className="text-slate-900">
                <p className="font-semibold text-sm leading-snug">
                  {hotelTitle}
                </p>
                {hotelLocation && (
                  <p className="text-xs text-slate-600 mt-0.5">
                    {hotelLocation}
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-1 tabular-nums">
                  {lat.toFixed(4)}, {lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-sm text-slate-500">
          Loading interactive map...
        </div>
      )}
    </div>
  );
}
