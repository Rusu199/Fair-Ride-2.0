import { Location } from '../types';

/**
 * Generates a Google Maps directions URL for a given location.
 * @param location - The destination location.
 * @returns A string containing the URL to open Google Maps directions.
 */
export const getGoogleMapsDirectionsUrl = (location: Location): string => {
  return `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
};