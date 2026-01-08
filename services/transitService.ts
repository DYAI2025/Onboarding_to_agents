
import { Transit } from '../types';

const REMOTE_API_BASE = 'https://baziengine-v2.fly.dev';

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const ZODIAC_ELEMENTS: Record<string, string> = {
  "Aries": "Fire", "Leo": "Fire", "Sagittarius": "Fire",
  "Taurus": "Earth", "Virgo": "Earth", "Capricorn": "Earth",
  "Gemini": "Air", "Libra": "Air", "Aquarius": "Air",
  "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water"
};

// --- Local Calculation Logic (Fallback) ---

const getJulianDate = (date: Date) => {
  const time = date.getTime();
  if (isNaN(time)) return 2440587.5; // Default to epoch
  return (time / 86400000) + 2440587.5;
};

const getMoonPosition = (date: Date): { sign: string, degree: number } => {
  const jd = getJulianDate(date);
  const d = jd - 2451545.0;
  const L = 218.316 + 13.176396 * d;
  const M = 134.963 + 13.064993 * d;
  
  const normalize = (deg: number) => {
    deg = deg % 360;
    if (deg < 0) deg += 360;
    return deg;
  };
  const toRad = (deg: number) => deg * (Math.PI / 180);

  let lambda = L + 6.289 * Math.sin(toRad(normalize(M)));
  lambda = normalize(lambda);

  const signIndex = Math.floor(lambda / 30);
  const degree = Math.floor(lambda % 30);
  
  return { 
    sign: ZODIAC_SIGNS[signIndex % 12] || "Aries", 
    degree: isNaN(degree) ? 0 : degree
  };
};

const getSunPosition = (date: Date): { sign: string, degree: number } => {
  const year = date.getFullYear();
  if (isNaN(year)) return { sign: "Aries", degree: 0 };

  const start = new Date(year, 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  let degrees = (dayOfYear - 80) * 0.9856;
  if (degrees < 0) degrees += 360;
  const signIndex = Math.floor(degrees / 30);
  const degree = Math.floor(degrees % 30);
  return { 
    sign: ZODIAC_SIGNS[signIndex % 12] || "Aries", 
    degree: isNaN(degree) ? 0 : degree 
  };
};

const getPlanetPosition = (date: Date, planet: string): { sign: string, degree: number, isRetro: boolean } => {
  const jd = getJulianDate(date);
  const periods: Record<string, number> = {
    'Mercury': 87.97, 'Venus': 224.7, 'Mars': 686.98, 
    'Jupiter': 4332.59, 'Saturn': 10759.22, 'Uranus': 30688.5, 
    'Neptune': 60182, 'Pluto': 90560
  };
  const period = periods[planet] || 365;
  const baseDeg = (jd % period) / period * 360;
  const signIndex = Math.floor(baseDeg / 30);
  const degree = Math.floor(baseDeg % 30);
  return { 
    sign: ZODIAC_SIGNS[signIndex % 12] || "Aries", 
    degree: isNaN(degree) ? 0 : degree, 
    isRetro: Math.sin(jd / 100) < -0.8 
  };
};

const calculateLocalTransits = (date: Date): Transit[] => {
  const sun = getSunPosition(date);
  const moon = getMoonPosition(date);

  return [
    { body: 'Sun', sign: sun.sign, degree: sun.degree, isRetrograde: false, element: ZODIAC_ELEMENTS[sun.sign] || "Fire" },
    { body: 'Moon', sign: moon.sign, degree: moon.degree, isRetrograde: false, element: ZODIAC_ELEMENTS[moon.sign] || "Water" },
    ...['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].map(p => {
      const pos = getPlanetPosition(date, p);
      return { 
        body: p, 
        sign: pos.sign, 
        degree: pos.degree, 
        isRetrograde: pos.isRetro, 
        element: ZODIAC_ELEMENTS[pos.sign] || "Earth" 
      };
    })
  ];
};

// --- Remote API Logic ---

export const fetchTransitsForDate = async (date: Date): Promise<Transit[]> => {
  if (!date || isNaN(date.getTime())) {
    date = new Date();
  }

  // 1. Attempt Remote Fetch
  try {
    console.group(`[TransitService] Remote Sync Test: ${REMOTE_API_BASE}`);
    console.log(`Target Date: ${date.toISOString()}`);
    
    // We try to fetch from a likely endpoint for astrological bodies
    // Adjust endpoint as necessary if API docs become available (e.g., /api/bodies, /api/ephemeris)
    const response = await fetch(`${REMOTE_API_BASE}/api/transits?date=${date.toISOString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        const data = await response.json();
        console.log("Remote Payload Received:", data);
        
        // Basic validation: Check if data is an array and looks like transits
        if (Array.isArray(data) && data.length > 0 && data[0].body && data[0].sign) {
            console.log("✅ Remote data validated. Using external engine.");
            console.groupEnd();
            // Ensure element field exists (if API omits it)
            return data.map((t: any) => ({
                ...t,
                element: t.element || ZODIAC_ELEMENTS[t.sign] || "Fire"
            }));
        } else {
             console.warn("⚠️ Remote data format unrecognized. Reverting to local core.");
        }
    } else {
        console.warn(`⚠️ Remote API returned status: ${response.status} (${response.statusText})`);
    }
    console.groupEnd();

  } catch (error) {
    console.warn("❌ Remote Engine Unreachable. Network or CORS issue.", error);
    console.log("Falling back to internal calculation module.");
    console.groupEnd();
  }

  // 2. Fallback to Local Calculation
  return calculateLocalTransits(date);
};

export const fetchCurrentTransits = async (): Promise<Transit[]> => {
  return fetchTransitsForDate(new Date());
};
