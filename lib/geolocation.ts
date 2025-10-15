import { NextRequest } from 'next/server';
import { getAreaCodesForState, DEFAULT_AREA_CODES } from './area-codes';

export interface GeolocationResult {
  stateCode?: string;
  city?: string;
  country?: string;
  areaCodes: string[];
}

/**
 * Extract IP address from Next.js request
 * Handles various proxy headers that might contain the real client IP
 */
function getClientIp(req: NextRequest): string | null {
  // Try various headers in order of preference
  const headers = [
    'x-forwarded-for',
    'x-real-ip',
    'cf-connecting-ip', // Cloudflare
    'x-client-ip',
  ];

  for (const header of headers) {
    const value = req.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs, take the first one
      return value.split(',')[0].trim();
    }
  }

  return null;
}

/**
 * Get geolocation from Vercel's built-in geo headers
 * These are automatically provided by Vercel Edge Network
 */
function getVercelGeoData(req: NextRequest): GeolocationResult | null {
  const country = req.headers.get('x-vercel-ip-country');
  const countryRegion = req.headers.get('x-vercel-ip-country-region');
  const city = req.headers.get('x-vercel-ip-city');

  // Only process US locations
  if (country !== 'US' || !countryRegion) {
    return null;
  }

  const areaCodes = getAreaCodesForState(countryRegion);

  if (areaCodes.length > 0) {
    console.log(`[Geolocation] Vercel headers: ${city || 'unknown city'}, ${countryRegion}, ${country}`);
    return {
      stateCode: countryRegion,
      city: city || undefined,
      country,
      areaCodes,
    };
  }

  return null;
}

/**
 * Get geolocation from ipapi.co (free tier: 1,000 requests/day)
 * Used as fallback when Vercel headers are not available
 */
async function getIpApiGeoData(ip: string): Promise<GeolocationResult | null> {
  try {
    console.log(`[Geolocation] Querying ipapi.co for IP: ${ip}`);

    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        'User-Agent': 'BuzEntry/1.0',
      },
    });

    if (!response.ok) {
      console.warn(`[Geolocation] ipapi.co returned ${response.status}`);
      return null;
    }

    const data = await response.json();

    // Only process US locations
    if (data.country_code !== 'US' || !data.region_code) {
      console.log(`[Geolocation] Non-US location: ${data.country_code}`);
      return null;
    }

    const areaCodes = getAreaCodesForState(data.region_code);

    if (areaCodes.length > 0) {
      console.log(`[Geolocation] ipapi.co: ${data.city}, ${data.region_code}, ${data.country_code}`);
      return {
        stateCode: data.region_code,
        city: data.city,
        country: data.country_code,
        areaCodes,
      };
    }

    return null;
  } catch (error) {
    console.error('[Geolocation] Error querying ipapi.co:', error);
    return null;
  }
}

/**
 * Get preferred area codes based on user's location
 * Uses multiple strategies with graceful fallbacks:
 * 1. Vercel geo headers (instant, free)
 * 2. IP geolocation API (fallback, 1000/day limit)
 * 3. Default Houston/Dallas area codes (ultimate fallback)
 */
export async function getPreferredAreaCodes(req: NextRequest): Promise<string[]> {
  try {
    // Strategy 1: Try Vercel geo headers first (fastest, most reliable)
    const vercelGeo = getVercelGeoData(req);
    if (vercelGeo && vercelGeo.areaCodes.length > 0) {
      console.log(`[Geolocation] Using Vercel geo data: ${vercelGeo.stateCode} (${vercelGeo.areaCodes.length} area codes)`);
      return vercelGeo.areaCodes;
    }

    // Strategy 2: Try IP geolocation API
    const clientIp = getClientIp(req);
    if (clientIp) {
      const ipGeo = await getIpApiGeoData(clientIp);
      if (ipGeo && ipGeo.areaCodes.length > 0) {
        console.log(`[Geolocation] Using IP API data: ${ipGeo.stateCode} (${ipGeo.areaCodes.length} area codes)`);
        return ipGeo.areaCodes;
      }
    }

    // Strategy 3: Fall back to default area codes
    console.log(`[Geolocation] No location data available, using default area codes`);
    return DEFAULT_AREA_CODES;
  } catch (error) {
    console.error('[Geolocation] Error in getPreferredAreaCodes:', error);
    return DEFAULT_AREA_CODES;
  }
}

/**
 * Get detailed geolocation information for logging/analytics
 */
export async function getGeolocation(req: NextRequest): Promise<GeolocationResult> {
  try {
    // Try Vercel headers first
    const vercelGeo = getVercelGeoData(req);
    if (vercelGeo) {
      return vercelGeo;
    }

    // Try IP geolocation API
    const clientIp = getClientIp(req);
    if (clientIp) {
      const ipGeo = await getIpApiGeoData(clientIp);
      if (ipGeo) {
        return ipGeo;
      }
    }

    // Return default
    return {
      areaCodes: DEFAULT_AREA_CODES,
    };
  } catch (error) {
    console.error('[Geolocation] Error in getGeolocation:', error);
    return {
      areaCodes: DEFAULT_AREA_CODES,
    };
  }
}
