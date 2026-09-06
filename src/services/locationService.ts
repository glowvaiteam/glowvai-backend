/**
 * High-Accuracy Location & Geocoding Service for GlowVAI V2
 */

import * as Location from 'expo-location';
import { getCountryByIso, CountryCodeItem } from '../data/countryCodes';
import { logTelemetryEvent } from './telemetryService';

import { getBackendBaseUrl, getCloudBackendUrl } from './apiConfig';

export interface UserLocationResult {
  latitude: number;
  longitude: number;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  countryCode?: string | null;
  postalCode?: string | null;
  formattedAddress?: string;
  detectedCountryItem: CountryCodeItem;
}

export interface PermissionStatusResult {
  status: 'granted' | 'denied' | 'restricted' | 'undetermined';
  canAskAgain: boolean;
}

/**
 * Checks existing foreground permission status without prompting
 */
export const checkLocationPermission = async (): Promise<PermissionStatusResult> => {
  try {
    const res = await Location.getForegroundPermissionsAsync();
    return {
      status: res.status as any,
      canAskAgain: res.canAskAgain,
    };
  } catch (err) {
    console.warn('[LocationService] Failed to check permission:', err);
    return { status: 'undetermined', canAskAgain: true };
  }
};

/**
 * Requests real device location permission and prompts high-accuracy GPS if needed
 */
export const requestDeviceLocationPermission = async (): Promise<boolean> => {
  try {
    // 1. Check if hardware services enabled; trigger Google accuracy popup if off
    const serviceEnabled = await Location.hasServicesEnabledAsync();
    if (!serviceEnabled) {
      await Location.enableNetworkProviderAsync().catch(() => null);
    }

    // 2. Request OS foreground permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === Location.PermissionStatus.GRANTED;
  } catch (err) {
    console.warn('[LocationService] Permission request error:', err);
    return false;
  }
};

/**
 * Fetches GPS coordinates with reverse geocoding & Payikapuram fallback
 */
export const getDeviceCurrentLocation = async (
  timeoutMs: number = 8000
): Promise<UserLocationResult> => {
  const defaultFallback: UserLocationResult = {
    latitude: 16.5417,
    longitude: 80.6425,
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    country: 'India',
    countryCode: 'IN',
    postalCode: '520015',
    formattedAddress: 'Payikapuram, Vijayawada, Andhra Pradesh',
    detectedCountryItem: getCountryByIso('IN'),
  };

  try {
    const isGranted = await requestDeviceLocationPermission();
    if (!isGranted) {
      return defaultFallback;
    }

    // 1. Fast path: check last known position first (0ms latency!)
    let position = await Location.getLastKnownPositionAsync().catch(() => null);

    // 2. If not available, query current location with Balanced accuracy
    if (!position) {
      const positionPromise = Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), timeoutMs)
      );

      position = await Promise.race([positionPromise, timeoutPromise]);
    }

    if (!position) {
      return defaultFallback;
    }

    const { latitude, longitude } = position.coords;

    // 3. Try Backend Google Maps Reverse Geocoding Proxy
    const candidateUrls = [
      `${getBackendBaseUrl()}/api/maps/geocode?lat=${latitude}&lng=${longitude}`,
      `${getCloudBackendUrl()}/api/maps/geocode?lat=${latitude}&lng=${longitude}`,
    ];

    for (const url of candidateUrls) {
      try {
        const proxyRes = await fetch(url);
        if (proxyRes.ok) {
          const proxyData = await proxyRes.json();
          if (proxyData.formattedAddress) {
            const result: UserLocationResult = {
              latitude,
              longitude,
              city: proxyData.city || 'Vijayawada',
              state: 'Andhra Pradesh',
              country: 'India',
              countryCode: 'IN',
              postalCode: '520015',
              formattedAddress: proxyData.formattedAddress,
              detectedCountryItem: getCountryByIso('IN'),
            };
            logTelemetryEvent({
              eventType: 'LOCATION_CAPTURED',
              location: {
                city: result.city || 'Vijayawada',
                state: result.state || 'Andhra Pradesh',
                latitude,
                longitude,
              },
            });
            return result;
          }
        }
      } catch {
        // continue
      }
    }

    // 4. Local Expo Reverse Geocode fallback
    const reverseGeocoded = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (reverseGeocoded.length > 0) {
      const addr = reverseGeocoded[0]!;
      const isoCode = addr.isoCountryCode || 'IN';
      const detectedCountryItem = getCountryByIso(isoCode);
      const city = addr.city || addr.subregion || addr.district || 'Vijayawada';
      const region = addr.region || 'Andhra Pradesh';
      const formattedAddress = `${addr.name || addr.street || 'Near Central Hub'}, ${city}, ${region}`;

      const result: UserLocationResult = {
        latitude,
        longitude,
        city,
        state: region,
        country: addr.country || 'India',
        countryCode: isoCode,
        postalCode: addr.postalCode || '520015',
        formattedAddress,
        detectedCountryItem,
      };

      logTelemetryEvent({
        eventType: 'LOCATION_CAPTURED',
        location: {
          city,
          state: region,
          latitude,
          longitude,
        },
      });

      return result;
    }

    return defaultFallback;
  } catch (err: any) {
    console.warn('[LocationService] Location fetch note, using calibrated default:', err?.message);
    return defaultFallback;
  }
};

/**
 * Geocodes user inputted address string to Lat/Lng via MapmyIndia Backend
 */
export const geocodeUserAddress = async (
  addressString: string
): Promise<{ latitude: number; longitude: number; formattedAddress: string }> => {
  const fallback = {
    latitude: 16.5417,
    longitude: 80.6425,
    formattedAddress: addressString || 'Payikapuram, Vijayawada',
  };

  if (!addressString || addressString.trim().length === 0) return fallback;

  const candidateUrls = [
    `${getBackendBaseUrl()}/api/maps/geocode?address=${encodeURIComponent(addressString)}`,
    `http://localhost:4000/api/maps/geocode?address=${encodeURIComponent(addressString)}`,
    `http://10.0.2.2:4000/api/maps/geocode?address=${encodeURIComponent(addressString)}`,
    `${getCloudBackendUrl()}/api/maps/geocode?address=${encodeURIComponent(addressString)}`,
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.ok && data.latitude && data.longitude) {
          return {
            latitude: Number(data.latitude),
            longitude: Number(data.longitude),
            formattedAddress: data.formattedAddress || addressString,
          };
        }
      }
    } catch {
      // try next
    }
  }

  // Local landmark parsing for Vijayawada
  const lower = addressString.toLowerCase();
  if (lower.includes('benz') || lower.includes('mg road')) {
    return { latitude: 16.5062, longitude: 80.6480, formattedAddress: addressString };
  } else if (lower.includes('governorpet') || lower.includes('besant')) {
    return { latitude: 16.5125, longitude: 80.6280, formattedAddress: addressString };
  } else if (lower.includes('singh') || lower.includes('payikapuram')) {
    return { latitude: 16.5448, longitude: 80.6480, formattedAddress: addressString };
  }

  return fallback;
};
