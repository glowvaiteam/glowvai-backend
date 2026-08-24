/**
 * Location & Geocoding Service for GlowVAI V2
 * 
 * Interacts with Expo Location to:
 * 1. Request real device permissions upon explicit user action
 * 2. Get high-accuracy GPS coordinates with timeout handling
 * 3. Reverse geocode location to detect Country, City, and Pincode
 */

import * as Location from 'expo-location';
import { getCountryByIso, CountryCodeItem } from '../data/countryCodes';

export interface UserLocationResult {
  latitude: number;
  longitude: number;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  countryCode?: string | null;
  postalCode?: string | null;
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
 * Requests real device location permission from OS
 */
export const requestDeviceLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === Location.PermissionStatus.GRANTED;
  } catch (err) {
    console.warn('[LocationService] Permission request error:', err);
    return false;
  }
};

/**
 * Fetches current device GPS coordinates with timeout handling
 */
export const getDeviceCurrentLocation = async (
  timeoutMs: number = 8000
): Promise<UserLocationResult | null> => {
  try {
    const isGranted = await requestDeviceLocationPermission();
    if (!isGranted) {
      return null;
    }

    // Check if location services are enabled on device
    const isServicesEnabled = await Location.hasServicesEnabledAsync();
    if (!isServicesEnabled) {
      console.warn('[LocationService] Device location services are turned off');
      return null;
    }

    // Get position with timeout safeguard
    const positionPromise = Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Location request timed out')), timeoutMs)
    );

    const position = await Promise.race([positionPromise, timeoutPromise]);
    const { latitude, longitude } = position.coords;

    // Reverse geocode to get country & city
    const reverseGeocoded = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (reverseGeocoded.length > 0) {
      const addr = reverseGeocoded[0]!;
      const isoCode = addr.isoCountryCode || 'IN';
      const detectedCountryItem = getCountryByIso(isoCode);

      return {
        latitude,
        longitude,
        city: addr.city || addr.subregion,
        state: addr.region,
        country: addr.country,
        countryCode: isoCode,
        postalCode: addr.postalCode,
        detectedCountryItem,
      };
    }

    return {
      latitude,
      longitude,
      detectedCountryItem: getCountryByIso('IN'),
    };
  } catch (err: any) {
    console.warn('[LocationService] Failed to get device location:', err?.message);
    return null;
  }
};
