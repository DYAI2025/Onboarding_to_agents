
import { BirthData, FusionResult, WesternAnalysis, EasternAnalysis } from '../types';

// --- Western Zodiac Data ---

const ZODIAC_SIGNS = [
  "Capricorn", "Aquarius", "Pisces", "Aries", "Taurus", "Gemini",
  "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius"
];

// Standard Astronomical Zodiac (0° = Aries start)
const ASTRONOMICAL_ZODIAC = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const ZODIAC_ELEMENTS: Record<string, string> = {
  "Aries": "Fire", "Leo": "Fire", "Sagittarius": "Fire",
  "Taurus": "Earth", "Virgo": "Earth", "Capricorn": "Earth",
  "Gemini": "Air", "Libra": "Air", "Aquarius": "Air",
  "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water"
};

// --- Eastern Ba Zi Data (Sexagenary Cycle) ---

// The 10 Heavenly Stems (Gan) - Correlation to Elements
const HEAVENLY_STEMS = [
  { name: "Jia", element: "Wood" },  // 0: Yang Wood
  { name: "Yi", element: "Wood" },   // 1: Yin Wood
  { name: "Bing", element: "Fire" }, // 2: Yang Fire
  { name: "Ding", element: "Fire" }, // 3: Yin Fire
  { name: "Wu", element: "Earth" },  // 4: Yang Earth
  { name: "Ji", element: "Earth" },  // 5: Yin Earth
  { name: "Geng", element: "Metal" },// 6: Yang Metal
  { name: "Xin", element: "Metal" }, // 7: Yin Metal
  { name: "Ren", element: "Water" }, // 8: Yang Water
  { name: "Gui", element: "Water" }  // 9: Yin Water
];

// The 12 Earthly Branches (Zhi) - Correlation to Animals
const EARTHLY_BRANCHES = [
  "Rat",    // 0: Zi (Water)
  "Ox",     // 1: Chou (Earth)
  "Tiger",  // 2: Yin (Wood)
  "Rabbit", // 3: Mao (Wood)
  "Dragon", // 4: Chen (Earth)
  "Snake",  // 5: Si (Fire)
  "Horse",  // 6: Wu (Fire)
  "Goat",   // 7: Wei (Earth)
  "Monkey", // 8: Shen (Metal)
  "Rooster",// 9: You (Metal)
  "Dog",    // 10: Xu (Earth)
  "Pig"     // 11: Hai (Water)
];

// Approximate start days of Solar Terms for each month (Jan - Dec)
const SOLAR_TERM_START_DAYS = [6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7];

// --- Calculation Logic ---

const getWesternSign = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  
  if ((month == 1 && day <= 19) || (month == 12 && day >= 22)) return "Capricorn";
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius";
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Pisces";
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus";
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini";
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer";
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius";
  return "Aries";
};

const calculateBaZi = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth(); 
  const day = date.getDate();

  let baZiYear = year;
  if (month < 1 || (month === 1 && day < 4)) {
    baZiYear -= 1;
  }
  
  const yearStemIndex = (baZiYear - 4) % 10;
  const normalizedYearStem = yearStemIndex < 0 ? yearStemIndex + 10 : yearStemIndex;
  
  const yearBranchIndex = (baZiYear - 4) % 12;
  const normalizedYearBranch = yearBranchIndex < 0 ? yearBranchIndex + 12 : yearBranchIndex;

  const yearElement = HEAVENLY_STEMS[normalizedYearStem].element;
  const yearAnimal = EARTHLY_BRANCHES[normalizedYearBranch];

  const cutoffDay = SOLAR_TERM_START_DAYS[month];
  let monthBranchIndex;
  
  const solarMonthMapping = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0];
  
  if (day >= cutoffDay) {
    monthBranchIndex = solarMonthMapping[month];
  } else {
    const prevMonthIdx = month === 0 ? 11 : month - 1;
    monthBranchIndex = solarMonthMapping[prevMonthIdx];
  }

  const monthAnimal = EARTHLY_BRANCHES[monthBranchIndex];

  const refDate = new Date(Date.UTC(1900, 0, 1));
  const targetDate = new Date(Date.UTC(year, month, day));
  
  const diffTime = targetDate.getTime() - refDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  let dayStemIndex = (4 + diffDays) % 10;
  if (dayStemIndex < 0) dayStemIndex += 10;
  
  let dayBranchIndex = (10 + diffDays) % 12;
  if (dayBranchIndex < 0) dayBranchIndex += 12;

  const dayElement = HEAVENLY_STEMS[dayStemIndex].element;
  const dayStemName = HEAVENLY_STEMS[dayStemIndex].name;
  const dayPolarity = dayStemIndex % 2 === 0 ? 'Yang' : 'Yin';

  return {
    yearAnimal,
    yearElement,
    monthAnimal,
    dayElement,
    dayStemName,
    dayPolarity,
    dayStemIndex
  };
};

const calculateAscendantSim = (sign: string, hour: number) => {
  const signIndex = ZODIAC_SIGNS.indexOf(sign);
  const offset = Math.floor((hour - 6) / 2); 
  const ascIndex = (signIndex + offset + 12) % 12;
  return ZODIAC_SIGNS[ascIndex];
};

const calculateMoonSign = (date: Date): string => {
  const jd = (date.getTime() / 86400000) + 2440587.5;
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
  return ASTRONOMICAL_ZODIAC[signIndex % 12];
};

// --- Synthesis Logic (Enhanced) ---

const synthesizeIdentity = (western: WesternAnalysis, eastern: EasternAnalysis) => {
  const { element: westernElement, sunSign, moonSign, ascendant } = western;
  const { yearAnimal: animal, yearElement: easternElement, dayElement: dayMaster } = eastern;

  let synthesisTitle = "The Resonant Traveler";
  let synthesisDescription = "Balancing the energies of motion and stillness.";
  let artisticDirective = "Focus on balanced intersections of curve and line.";

  // 1. Element Interaction Logic (Combining Western Element and Day Master)
  if (dayMaster === westernElement) {
     synthesisTitle = `The Pure ${dayMaster} Sovereign`;
     synthesisDescription = `Your core essence (${dayMaster}) is perfectly aligned with your astrological temperament. You possess an undiluted, focused power that resonates through every level of your being.`;
     artisticDirective = "Emphasize perfect symmetry and monochromatic elegance to reflect undiluted purity.";
  } else if (westernElement === "Fire" && dayMaster === "Wood") {
     synthesisTitle = "The Burning Visionary";
     synthesisDescription = "Wood feeds Fire. Your inner nature fuels your outward expression, creating a personality of tireless creativity and magnetic leadership.";
     artisticDirective = "Incorporate leaf-like organic motifs that transition into stylized, sharp flame geometry.";
  } else if (westernElement === "Water" && dayMaster === "Metal") {
     synthesisTitle = "The Fluid Alchemist";
     synthesisDescription = "Metal generates Water. Your disciplined mind and structured thoughts give rise to profound intuition and emotional depth.";
     artisticDirective = "Use sharp, metallic polished edges that contain or give birth to flowing, organic water-like curves.";
  } else if (westernElement === "Earth" && dayMaster === "Fire") {
     synthesisTitle = "The Volcanic Architect";
     synthesisDescription = "Fire creates Earth. Your inner passion is the foundation upon which you build your reality—solid, vibrant, and enduring.";
     artisticDirective = "Dense, heavy geometric bases with radiant, glowing interior lines suggesting subterranean energy.";
  } else if (westernElement === "Air" && dayMaster === "Water") {
     synthesisTitle = "The Mist Navigator";
     synthesisDescription = "Air moves Water. You are adaptable and elusive, finding your way through life's complexities with intellectual grace and emotional wisdom.";
     artisticDirective = "Whispy, ethereal strokes and concentric circles representing ripples in the sky.";
  } else if (dayMaster === "Earth") {
     synthesisTitle = "The Grounded Guardian";
     synthesisDescription = `Anchored by an Earth Day Master, you remain a stable force. Your ${westernElement} energy provides the drive, but your core remains unshakeable.`;
     artisticDirective = "Strong verticality and square-based abstractions with subtle elemental highlights.";
  }

  // 2. Animal-Specific Flair (Chinese Zodiac Year Animal)
  let animalVibe = "";
  switch(animal) {
    case 'Dragon': animalVibe = "mythical scales, winding serpent-like power, celestial orbs, and imperial authority"; break;
    case 'Tiger': animalVibe = "bold stripes, predatory grace, hidden explosive strength in the linework"; break;
    case 'Rat': animalVibe = "intricate small-scale detail, clever geometry, hidden nodes of resourcefulness"; break;
    case 'Snake': animalVibe = "sleek infinity loops, transformative skin patterns, winding wisdom"; break;
    case 'Horse': animalVibe = "galloping motion lines, wind-swept mane geometry, unbridled spirit"; break;
    case 'Rabbit': animalVibe = "soft lunar curves, alert stillness, hidden agility in the negative space"; break;
    case 'Rooster': animalVibe = "radiant crest patterns, morning-sun geometry, precision and punctuality"; break;
    case 'Monkey': animalVibe = "dynamic playful shapes, versatile joints, clever intersections"; break;
    case 'Goat': animalVibe = "peaceful cloud-like textures, spiral horn geometry, artistic harmony"; break;
    case 'Ox': animalVibe = "heavy steady strokes, mountain-like mass, patient power"; break;
    case 'Dog': animalVibe = "protective border structures, loyal center-points, grounded integrity"; break;
    case 'Pig': animalVibe = "plentiful rounded forms, abundance motifs, gentle inclusive circles"; break;
    default: animalVibe = `the essential spirit of the ${animal}`;
  }

  // 3. Sun/Ascendant Nuance
  const celestialFocus = `Reflecting the core light of ${sunSign} and the rising mask of ${ascendant}.`;

  const prompt = `
    Design Language: Fine-line, minimal, elegant, high-end identity mark, geometric calm composition, central emblem, ample negative space, precise line weight, vector-like clarity.
    
    Astrological Profile:
    - Western Sun: ${sunSign}
    - Western Ascendant: ${ascendant}
    - Chinese Year: ${easternElement} ${animal}
    - Day Master: ${dayMaster}
    - Interaction Theme: ${synthesisTitle}

    Visual Subject: An abstract fusion of a ${animal} and the sacred geometry of the ${westernElement} element.
    Artistic Directive: ${artisticDirective} Incorporate elements of ${animalVibe}.
    
    Composition: A central celestial structure. 
    - Element of ${westernElement}: ${
      westernElement === 'Fire' ? 'Radiating sparks, sharp upward vertices, glowing embers.' : 
      westernElement === 'Water' ? 'Soft overlapping waves, teardrop geometry, fluid sine-waves.' : 
      westernElement === 'Earth' ? 'Layered strata, crystalline blocks, solid foundations.' : 
      'Thin sweeping arcs, atmospheric transparency, parallel wind-lines.'
    }
    
    Specific Details: 
    - Include a specific golden node on an outer orbit representing the ${sunSign} sun placement.
    - The overall mark should reflect the ${synthesisTitle} theme.
    - Avoid literal or cartoonish depictions; aim for a high-end luxury brand emblem or watch-face detail.
    - Color Palette: ${
      westernElement === 'Fire' ? 'Warm Gold, Ochre, and Charcoal' : 
      westernElement === 'Water' ? 'Deep Indigo, Silver, and Pearl' : 
      westernElement === 'Earth' ? 'Copper, Moss Green, and Sand' : 
      'Champagne, Slate Blue, and White'
    }.
    
    Vibe: No text. No 3D perspective. Icon-ready. ${celestialFocus}
  `.trim();

  return { synthesisTitle, synthesisDescription, prompt };
};

// --- Main Analysis Functions ---

const calculateLocalAnalysis = (dateObj: Date): { western: WesternAnalysis, eastern: EasternAnalysis } => {
  const hour = dateObj.getHours();
  
  const sunSign = getWesternSign(dateObj);
  const ascendant = calculateAscendantSim(sunSign, hour);
  const moonSign = calculateMoonSign(dateObj);
  const westernElement = ZODIAC_ELEMENTS[sunSign] || "Air";
  
  const baZi = calculateBaZi(dateObj);

  return {
    western: {
      sunSign,
      moonSign,
      ascendant,
      element: westernElement
    },
    eastern: {
      yearAnimal: baZi.yearAnimal,
      yearElement: baZi.yearElement,
      monthAnimal: baZi.monthAnimal,
      dayElement: baZi.dayElement,
      dayStem: baZi.dayStemName,
      dayPolarity: baZi.dayPolarity
    }
  };
};

export const runFusionAnalysis = async (data: BirthData): Promise<FusionResult> => {
  const dateObj = new Date(data.date + 'T' + data.time);
  
  let western: WesternAnalysis;
  let eastern: EasternAnalysis;

  try {
    const local = calculateLocalAnalysis(dateObj);
    western = local.western;
    eastern = local.eastern;
  } catch (e) {
    throw new Error("Local calculation failed");
  }

  const { synthesisTitle, synthesisDescription, prompt } = synthesizeIdentity(western, eastern);

  return {
    synthesisTitle,
    synthesisDescription,
    elementMatrix: `${western.element} (Sun) / ${eastern.dayElement} (Day Master)`,
    western,
    eastern,
    prompt
  };
};
