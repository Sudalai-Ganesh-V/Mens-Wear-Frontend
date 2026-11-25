const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatCurrency(amount) {
  return inrFormatter.format(amount);
}

export function formatCoordinates(lat, lng) {
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return null;
  }

  const latLabel = `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lngLabel = `${Math.abs(lng).toFixed(2)}° ${lng >= 0 ? 'E' : 'W'}`;
  return `${latLabel}, ${lngLabel}`;
}
