export interface PinValue {
  latitude: number;
  longitude: number;
  // Only present when the pin came from device GPS and wasn't moved by hand.
  locationAccuracy?: number;
}

export const SHOP_LOCATION = {
  latitude: 21.14633052520146,
  longitude: 79.11247498029483,
};

export const DELIVERY_RADIUS_KM = 40;

export function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

export function isInsideDeliveryArea(latitude: number, longitude: number) {
  return (
    distanceKm(
      SHOP_LOCATION.latitude,
      SHOP_LOCATION.longitude,
      latitude,
      longitude
    ) <= DELIVERY_RADIUS_KM
  );
}

// Change these two lines when you start delivering to other cities.
export const DELIVERY_CITY = "Nagpur";
export const DELIVERY_STATE = "Maharashtra";