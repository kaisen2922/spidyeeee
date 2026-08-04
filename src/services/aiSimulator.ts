import type { 
  HeroState, 
  Mission, 
  TacticalUnit, 
  AIPrediction, 
  MissionType, 
  PriorityLevel, 
  NYCBorough,
  CompassHeading,
  HeatmapPoint
} from '../types/heroTracker';

export interface DistrictLocation {
  name: string;
  borough: NYCBorough;
  coords: [number, number]; // [lat, lng]
  landmark: string;
  buildings: string[];
}

export const NYC_DISTRICTS: DistrictLocation[] = [
  // Manhattan
  { name: 'Midtown Sector 4', borough: 'Manhattan', coords: [40.7580, -73.9855], landmark: 'Times Square Nexus', buildings: ['Empire State Area', 'Chrysler Spire', 'MetLife Tower', 'One Vanderbilt'] },
  { name: "Hell's Kitchen Zone", borough: 'Manhattan', coords: [40.7620, -73.9920], landmark: 'Pier 86 Skyport', buildings: ['Intrepid Roof', 'Skyline Tower', 'Riverview Terrace'] },
  { name: 'Hudson Yards Core', borough: 'Manhattan', coords: [40.7538, -74.0010], landmark: 'The Monolith Citadel', buildings: ['The Vessel Top', '30 Hudson Yards', 'Equinox Tower'] },
  { name: 'Financial District', borough: 'Manhattan', coords: [40.7075, -74.0090], landmark: 'Sub-Zero Vault', buildings: ['One World Trade Spire', '7 World Trade', 'Wall St Vault'] },
  { name: 'Central Park South', borough: 'Manhattan', coords: [40.7660, -73.9770], landmark: 'Veridia Bio-Dome', buildings: ['Plaza Hotel Roof', 'Billionaires Row Spire', 'Essex House'] },
  { name: 'Harlem Heights', borough: 'Manhattan', coords: [40.8115, -73.9465], landmark: '125th St Overpass', buildings: ['Apollo Roof', 'Harlem River Tower', 'St. Nicholas Spire'] },
  
  // Brooklyn
  { name: 'DUMBO Sector', borough: 'Brooklyn', coords: [40.7033, -73.9881], landmark: 'Manhattan Bridge Tower', buildings: ['Clocktower Building', 'Empire Stores Roof', 'Bridge Anchorage'] },
  { name: 'Brooklyn Heights', borough: 'Brooklyn', coords: [40.6960, -73.9970], landmark: 'Promenade Overlook', buildings: ['Hotel St. George', 'Pier 1 Canopy', 'Montague Spire'] },
  { name: 'Williamsburg', borough: 'Brooklyn', coords: [40.7142, -73.9613], landmark: 'Sugar Refinery Crane', buildings: ['Domino Sugar Tower', 'William Vale Roof', 'Wythe Spire'] },
  { name: 'Coney Island', borough: 'Brooklyn', coords: [40.5749, -73.9859], landmark: 'Cyclone Spire', buildings: ['Parachute Jump Top', 'Wonder Wheel Hub', 'Boardwalk Pavilion'] },

  // Queens
  { name: 'Long Island City', borough: 'Queens', coords: [40.7448, -73.9577], landmark: 'Gantry Plaza Spire', buildings: ['Citigroup Building', 'Sven Tower', 'Hunter Point Spire'] },
  { name: 'Astoria Park Zone', borough: 'Queens', coords: [40.7797, -73.9216], landmark: 'Hell Gate Arch', buildings: ['Hell Gate Pier', 'Triborough Tower', 'Astoria Heights Roof'] },
  { name: 'Forest Hills', borough: 'Queens', coords: [40.7181, -73.8448], landmark: 'Metropolitan Viaduct', buildings: ['Forest Hills Stadium Top', '71st Ave Tower', 'Station Plaza'] },

  // Bronx
  { name: 'South Bronx Core', borough: 'Bronx', coords: [40.8160, -73.9240], landmark: 'Grand Concourse Hub', buildings: ['Concourse Plaza', 'Hostos Spire', 'Mott Haven Tower'] },
  { name: 'Yankee Stadium Zone', borough: 'Bronx', coords: [40.8296, -73.9262], landmark: 'Macombs Dam Bridge', buildings: ['Stadium Gate 4', 'Heritage Field Canopy', '161st St Roof'] },

  // Staten Island
  { name: 'St. George Ferry Port', borough: 'Staten Island', coords: [40.6437, -74.0736], landmark: 'Ferry Terminal Crane', buildings: ['St. George Theatre Spire', 'Borough Hall Roof', 'Richmond Terrace'] },
  { name: 'Verrazzano Approach', borough: 'Staten Island', coords: [40.6066, -74.0447], landmark: 'Suspension Tower Alpha', buildings: ['Bridge Cable Anchorage', 'Fort Wadsworth Overlook', 'Narrows Tower'] }
];

export function getCompassHeading(angle: number): CompassHeading {
  const normalized = (angle % 360 + 360) % 360;
  if (normalized >= 337.5 || normalized < 22.5) return 'North';
  if (normalized >= 22.5 && normalized < 67.5) return 'North-East';
  if (normalized >= 67.5 && normalized < 112.5) return 'East';
  if (normalized >= 112.5 && normalized < 157.5) return 'South-East';
  if (normalized >= 157.5 && normalized < 202.5) return 'South';
  if (normalized >= 202.5 && normalized < 247.5) return 'South-West';
  if (normalized >= 247.5 && normalized < 292.5) return 'West';
  return 'North-West';
}

export function formatPatrolDuration(minutes: number): string {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m`;
}

export const INITIAL_SPIDERMAN: HeroState = {
  name: 'SPIDER-MAN',
  alias: 'Peter Parker / Web-Slinger',
  status: 'PATROLLING',
  movementState: 'SWINGING',
  health: 98,
  hearts: 4,
  webFluid: 95,
  speed: 34,
  altitude: 126,
  heading: 45,
  headingDirectionName: 'North-East',
  district: 'Midtown Sector 4',
  borough: 'Manhattan',
  currentBuilding: 'Empire State Area',
  lastRooftop: 'Chrysler Spire Top',
  patrolDurationMinutes: 134, // 02h 14m
  distanceTodayMiles: 27.3,
  incidentsObservedCount: 14,
  incidentsRespondedCount: 11,
  buildingsCrossedCount: 412,
  avgSpeed: 38,
  maxAltitude: 230,
  lastSeen: 'Now',
  currentObjective: 'SWINGING BETWEEN ROOFTOPS IN MIDTOWN',
  threatLevel: 'CODE RED',
  suitVersion: 'CLASSIC SUIT',
  position: [40.7580, -73.9855],
  path: [],
  pathIndex: 0,
  historyTrail: [
    { coords: [40.7580, -73.9855], altitude: 126, timestamp: '23:55:00', buildingName: 'Empire State Area' },
    { coords: [40.7590, -73.9860], altitude: 175, timestamp: '23:55:15', buildingName: 'Chrysler Spire' },
    { coords: [40.7600, -73.9870], altitude: 90, timestamp: '23:55:30', buildingName: 'MetLife Tower' }
  ]
};

export const INITIAL_CITY_UNITS: TacticalUnit[] = [
  { id: 'police-1', name: 'NYPD Sky Patrol 01', callsign: 'ALPHA-9', type: 'POLICE', position: [40.7560, -73.9890], status: 'PATROLLING' },
  { id: 'police-2', name: 'NYPD Interceptor', callsign: 'BRAVO-4', type: 'POLICE', position: [40.7430, -73.9910], status: 'PATROLLING' },
  { id: 'fire-1', name: 'FDNY Ladder Engine 12', callsign: 'RESCUE-1', type: 'FIRE', position: [40.7640, -73.9800], status: 'PATROLLING' },
  { id: 'ambulance-1', name: 'NYC Med-Evac Unit 04', callsign: 'LIFE-GUARD', type: 'AMBULANCE', position: [40.7500, -73.9750], status: 'PATROLLING' },
  { id: 'heli-1', name: 'Daily Bugle News Chopper', callsign: 'BUGLE-1', type: 'HELICOPTER', position: [40.7540, -73.9780], status: 'PATROLLING' },
];

export const INITIAL_HEATMAP_POINTS: HeatmapPoint[] = NYC_DISTRICTS.map(d => ({
  coords: d.coords,
  intensity: Math.floor(40 + Math.random() * 55),
  district: d.name
}));

export const SPIDER_INCIDENT_TYPES: { type: MissionType; title: string; priority: PriorityLevel; reward: number; scanner: string; icon: string }[] = [
  { type: 'ROBBERY', title: 'Bank Robbery Reported', priority: 'HIGH', reward: 450, scanner: '10-31 Robbery in progress', icon: 'robbery' },
  { type: 'FIRE', title: 'Structure Fire Detected', priority: 'HIGH', reward: 500, scanner: '10-70 Structure fire reported', icon: 'fire' },
  { type: 'EXPLOSION', title: 'Power Substation Explosion', priority: 'CRITICAL', reward: 850, scanner: '10-53 Explosion in sector', icon: 'explosion' },
  { type: 'HOSTAGE', title: 'High-Rise Hostage Situation', priority: 'CRITICAL', reward: 950, scanner: '10-99 Hostage situation active', icon: 'hostage' },
  { type: 'VEHICLE_CHASE', title: 'High-Speed Vehicle Chase', priority: 'MEDIUM', reward: 350, scanner: '10-80 Vehicle pursuit ongoing', icon: 'chase' },
  { type: 'RESCUE', title: 'Construction Crane Collapse', priority: 'HIGH', reward: 600, scanner: '10-60 Technical rescue required', icon: 'rescue' },
  { type: 'BUILDING_COLLAPSE', title: 'Scaffolding Structural Collapse', priority: 'CRITICAL', reward: 1100, scanner: '10-60 Structural failure', icon: 'bridge' },
  { type: 'SUSPICIOUS_ACTIVITY', title: 'Subway Tunnel Intrusion', priority: 'LOW', reward: 250, scanner: '10-62 Suspicious trespasser', icon: 'power' },
  { type: 'DRONE_ATTACK', title: 'Rogue Drone Fleet Incursion', priority: 'CRITICAL', reward: 1300, scanner: '10-90 Aerial drone hazard', icon: 'meteor' }
];

export function getDistanceKm(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371;
  const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
  const dLng = (coord2[1] - coord1[1]) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

export function getHeadingAngle(start: [number, number], end: [number, number]): number {
  const startLat = start[0] * Math.PI / 180;
  const startLng = start[1] * Math.PI / 180;
  const endLat = end[0] * Math.PI / 180;
  const endLng = end[1] * Math.PI / 180;

  const dLng = endLng - startLng;
  const y = Math.sin(dLng) * Math.cos(endLat);
  const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
  let brng = Math.atan2(y, x) * 180 / Math.PI;
  return Math.round((brng + 360) % 360);
}

export function generateSpiderWebWaypoints(start: [number, number], end: [number, number], steps = 18): [number, number][] {
  const waypoints: [number, number][] = [start];
  const midLat = start[0] + (end[0] - start[0]) * 0.5 + (Math.random() - 0.5) * 0.003;
  const midLng = start[1] + (end[1] - start[1]) * 0.5 + (Math.random() - 0.5) * 0.003;
  const midPoint: [number, number] = [midLat, midLng];

  const keyPoints = [start, midPoint, end];

  for (let k = 0; k < keyPoints.length - 1; k++) {
    const pA = keyPoints[k];
    const pB = keyPoints[k + 1];
    const segSteps = Math.max(4, Math.floor(steps / 2));

    for (let i = 1; i <= segSteps; i++) {
      const ratio = i / segSteps;
      const lat = pA[0] + (pB[0] - pA[0]) * ratio;
      const lng = pA[1] + (pB[1] - pA[1]) * ratio;
      waypoints.push([lat, lng]);
    }
  }

  return waypoints;
}

export function generateRandomNYCIncident(heroPos: [number, number]): Mission {
  const template = SPIDER_INCIDENT_TYPES[Math.floor(Math.random() * SPIDER_INCIDENT_TYPES.length)];
  const district = NYC_DISTRICTS[Math.floor(Math.random() * NYC_DISTRICTS.length)];
  
  const offsetLat = (Math.random() - 0.5) * 0.006;
  const offsetLng = (Math.random() - 0.5) * 0.006;
  const location: [number, number] = [district.coords[0] + offsetLat, district.coords[1] + offsetLng];
  
  const distance = getDistanceKm(heroPos, location);
  const etaSeconds = Math.max(10, Math.round((distance / 0.06)));
  const civiliansAtRisk = Math.floor(4 + Math.random() * 45);

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  return {
    id: `NYPD-${Math.floor(1000 + Math.random() * 9000)}`,
    title: `${template.title} near ${district.landmark}`,
    type: template.type,
    priority: template.priority,
    description: `NYPD Radio Scanner [${template.scanner}]: Reported near ${district.landmark} in ${district.name}, ${district.borough}.`,
    location,
    district: district.name,
    borough: district.borough,
    distanceKm: distance,
    etaSeconds,
    rewardXP: template.reward,
    civiliansAtRisk,
    scannerCode: template.scanner,
    status: 'REPORTED',
    timestamp: timeStr,
    iconType: template.icon,
  };
}

export function computeAIPrediction(heroPos: [number, number], mission?: Mission): AIPrediction {
  if (!mission) {
    const nextDistrict = NYC_DISTRICTS[Math.floor(Math.random() * NYC_DISTRICTS.length)];
    return {
      nextDestinationName: `${nextDistrict.landmark} (${nextDistrict.borough})`,
      nextLocation: nextDistrict.coords,
      etaFormatted: '00:12s',
      successProbability: 99,
      recommendedRoute: `ROOFTOP VECTOR via ${nextDistrict.borough.toUpperCase()}`,
      riskLevel: 'LOW',
      threatAnalysis: 'Perimeter clear. Spider-Man patrol path active.',
      coveragePercent: 94.6
    };
  }

  const dist = getDistanceKm(heroPos, mission.location);
  const etaSec = Math.round(dist * 18);
  const successProb = Math.min(99, Math.max(84, 99 - Math.round(dist * 2.5)));
  
  let risk: 'LOW' | 'MODERATE' | 'SEVERE' | 'EXTREME' = 'MODERATE';
  if (mission.priority === 'CRITICAL') risk = 'EXTREME';
  else if (mission.priority === 'HIGH') risk = 'SEVERE';

  return {
    nextDestinationName: `${mission.district} (${mission.borough})`,
    nextLocation: mission.location,
    etaFormatted: `00:${etaSec < 10 ? '0' + etaSec : etaSec}s`,
    successProbability: successProb,
    recommendedRoute: `WEB-SWING ROUTE via ${mission.borough.toUpperCase()}`,
    riskLevel: risk,
    threatAnalysis: `Spider-Sense algorithm estimates ${successProb}% response probability.`,
    coveragePercent: 96.2
  };
}

export interface FrequentLocation {
  id: string;
  name: string;
  category: 'HEADQUARTERS' | 'SAFEHOUSE' | 'RESEARCH_LAB' | 'ROOFTOP_PERCH' | 'OBSERVATION';
  coords: [number, number]; // [lat, lng]
  borough: NYCBorough;
  district: string;
  visitCount: number;
  lastVisited: string;
  description: string;
}

export const SPIDERMAN_FREQUENT_LOCATIONS: FrequentLocation[] = [
  {
    id: 'freq-1',
    name: 'Peter Parker Apartment & Home Base',
    category: 'HEADQUARTERS',
    coords: [40.7181, -73.8448],
    borough: 'Queens',
    district: 'Forest Hills',
    visitCount: 342,
    lastVisited: '15m ago',
    description: "Peter Parker's home base and Aunt May's residence in Forest Hills, Queens."
  },
  {
    id: 'freq-2',
    name: 'Daily Bugle Headquarters',
    category: 'HEADQUARTERS',
    coords: [40.7510, -73.9770],
    borough: 'Manhattan',
    district: 'Midtown East',
    visitCount: 295,
    lastVisited: '8m ago',
    description: "Daily Bugle office tower. Frequent photo drop-off point and roof vantage."
  },
  {
    id: 'freq-3',
    name: 'F.E.A.S.T. Shelter & Safehouse',
    category: 'SAFEHOUSE',
    coords: [40.7150, -73.9970],
    borough: 'Manhattan',
    district: 'Chinatown',
    visitCount: 210,
    lastVisited: '35m ago',
    description: 'F.E.A.S.T. community center safehouse & medical supply hub.'
  },
  {
    id: 'freq-4',
    name: 'Empire State Building Observatory Perch',
    category: 'OBSERVATION',
    coords: [40.7484, -73.9857],
    borough: 'Manhattan',
    district: 'Midtown',
    visitCount: 450,
    lastVisited: '3m ago',
    description: 'Highest observation outlook in Midtown NYC. Preferred web-swing launch tower.'
  },
  {
    id: 'freq-5',
    name: 'Chrysler Building Spire Gargoyle',
    category: 'ROOFTOP_PERCH',
    coords: [40.7516, -73.9755],
    borough: 'Manhattan',
    district: 'Midtown East',
    visitCount: 390,
    lastVisited: '12m ago',
    description: 'Iconic eagle gargoyle perch overlooking Grand Central Terminal and East River.'
  },
  {
    id: 'freq-6',
    name: 'Oscorp Tower Tech Alchemy Lab',
    category: 'RESEARCH_LAB',
    coords: [40.7610, -73.9790],
    borough: 'Manhattan',
    district: 'Midtown West',
    visitCount: 178,
    lastVisited: '50m ago',
    description: 'Oscorp research spire. High frequency of suit tech diagnostics & recon.'
  },
  {
    id: 'freq-7',
    name: 'Brooklyn Bridge Anchorage Tower',
    category: 'ROOFTOP_PERCH',
    coords: [40.7061, -73.9969],
    borough: 'Brooklyn',
    district: 'DUMBO',
    visitCount: 260,
    lastVisited: '22m ago',
    description: 'Suspension cable tower connecting Manhattan and Brooklyn patrol sectors.'
  },
  {
    id: 'freq-8',
    name: 'Columbia University Science Lab',
    category: 'RESEARCH_LAB',
    coords: [40.8075, -73.9626],
    borough: 'Manhattan',
    district: 'Morningside Heights',
    visitCount: 145,
    lastVisited: '1h ago',
    description: 'Bio-tech laboratory & web-fluid synthesis research station.'
  },
  {
    id: 'freq-9',
    name: 'Sanctum Sanctorum Outpost',
    category: 'SAFEHOUSE',
    coords: [40.7310, -74.0000],
    borough: 'Manhattan',
    district: 'Greenwich Village',
    visitCount: 112,
    lastVisited: '2h ago',
    description: 'Bleecker Street mystic sanctuary & interdimensional defense point.'
  },
  {
    id: 'freq-10',
    name: 'Gantry Plaza Waterfront Pier',
    category: 'ROOFTOP_PERCH',
    coords: [40.7448, -73.9577],
    borough: 'Queens',
    district: 'Long Island City',
    visitCount: 198,
    lastVisited: '28m ago',
    description: 'Queens waterfront crane lookout facing Midtown Manhattan skyline.'
  }
];

export interface GlobalSpiderHero {
  id: string;
  heroName: string;
  alias: string;
  earthUniverse: string;
  city: string;
  stateOrRegion: string;
  country: string;
  coords: [number, number]; // [lat, lng]
  status: 'ACTIVE_PATROL' | 'GUARDIAN' | 'RECON' | 'MULTI_VERSE_SYNC';
  powerLevel: number;
  flagEmoji: string;
  description: string;
}

export const GLOBAL_SPIDER_HEROES: GlobalSpiderHero[] = [
  // NORTH AMERICA
  {
    id: 'hero-nyc',
    heroName: 'Spider-Man',
    alias: 'Peter Parker',
    earthUniverse: 'Earth-616',
    city: 'New York City',
    stateOrRegion: 'New York',
    country: 'USA',
    coords: [40.7580, -73.9855],
    status: 'ACTIVE_PATROL',
    powerLevel: 98,
    flagEmoji: '🇺🇸',
    description: 'The Original Web-Slinger patrolling Midtown Manhattan & NYC.'
  },
  {
    id: 'hero-brooklyn',
    heroName: 'Spider-Man (Miles Morales)',
    alias: 'Miles Morales',
    earthUniverse: 'Earth-1610',
    city: 'Brooklyn',
    stateOrRegion: 'New York',
    country: 'USA',
    coords: [40.6782, -73.9442],
    status: 'GUARDIAN',
    powerLevel: 97,
    flagEmoji: '🇺🇸',
    description: 'Brooklyn guardian with Bio-electric Venom Strike & camo.'
  },
  {
    id: 'hero-gwen',
    heroName: 'Spider-Gwen',
    alias: 'Gwen Stacy',
    earthUniverse: 'Earth-65',
    city: 'Queens',
    stateOrRegion: 'New York',
    country: 'USA',
    coords: [40.7282, -73.7948],
    status: 'ACTIVE_PATROL',
    powerLevel: 95,
    flagEmoji: '🇺🇸',
    description: 'Ghost-Spider dimension hopper patrolling Queens.'
  },
  {
    id: 'hero-la',
    heroName: 'Scarlet Spider',
    alias: 'Ben Reilly',
    earthUniverse: 'Earth-616',
    city: 'Los Angeles',
    stateOrRegion: 'California',
    country: 'USA',
    coords: [34.0522, -118.2437],
    status: 'ACTIVE_PATROL',
    powerLevel: 96,
    flagEmoji: '🇺🇸',
    description: 'West Coast hooded clone Spider hero patrolling LA.'
  },
  {
    id: 'hero-sf',
    heroName: 'Lethal Protector (Venom)',
    alias: 'Eddie Brock',
    earthUniverse: 'Earth-616',
    city: 'San Francisco',
    stateOrRegion: 'California',
    country: 'USA',
    coords: [37.7749, -122.4194],
    status: 'GUARDIAN',
    powerLevel: 99,
    flagEmoji: '🇺🇸',
    description: 'Golden Gate anti-hero web defender.'
  },
  {
    id: 'hero-chicago',
    heroName: 'Spider-Bot Command',
    alias: 'Fleet AI',
    earthUniverse: 'Earth-616',
    city: 'Chicago',
    stateOrRegion: 'Illinois',
    country: 'USA',
    coords: [41.8781, -87.6298],
    status: 'MULTI_VERSE_SYNC',
    powerLevel: 92,
    flagEmoji: '🇺🇸',
    description: 'Midwest Spider-Bot AI relay tower over Chicago.'
  },
  {
    id: 'hero-toronto',
    heroName: 'Spider-Punk',
    alias: 'Hobie Brown',
    earthUniverse: 'Earth-138',
    city: 'Toronto',
    stateOrRegion: 'Ontario',
    country: 'Canada',
    coords: [43.6532, -79.3832],
    status: 'ACTIVE_PATROL',
    powerLevel: 98,
    flagEmoji: '🇨🇦',
    description: 'Guitar-shredding anarchist Spider-Punk over CN Tower.'
  },
  {
    id: 'hero-vancouver',
    heroName: 'Spider-Cat',
    alias: 'Feline Hero',
    earthUniverse: 'Earth-999',
    city: 'Vancouver',
    stateOrRegion: 'British Columbia',
    country: 'Canada',
    coords: [49.2827, -123.1207],
    status: 'RECON',
    powerLevel: 89,
    flagEmoji: '🇨🇦',
    description: 'Pacific Northwest feline Spider guardian.'
  },
  {
    id: 'hero-cdmx',
    heroName: 'Arácnido Jr.',
    alias: 'Luchador Hero',
    earthUniverse: 'Earth-15349',
    city: 'Mexico City',
    stateOrRegion: 'CDMX',
    country: 'Mexico',
    coords: [19.4326, -99.1332],
    status: 'GUARDIAN',
    powerLevel: 94,
    flagEmoji: '🇲🇽',
    description: 'Masked wrestler hero protecting Central Mexico.'
  },

  // SOUTH AMERICA
  {
    id: 'hero-rio',
    heroName: 'Spider-Boy',
    alias: 'Bailey Briggs',
    earthUniverse: 'Earth-616',
    city: 'Rio de Janeiro',
    stateOrRegion: 'Rio State',
    country: 'Brazil',
    coords: [-22.9068, -43.1729],
    status: 'ACTIVE_PATROL',
    powerLevel: 91,
    flagEmoji: '🇧🇷',
    description: 'Agile young web-slinger patrolling Sugarloaf Mountain.'
  },
  {
    id: 'hero-sp',
    heroName: 'Paulista Spider',
    alias: 'Paulo Parker',
    earthUniverse: 'Earth-616',
    city: 'São Paulo',
    stateOrRegion: 'São Paulo State',
    country: 'Brazil',
    coords: [-23.5505, -46.6333],
    status: 'GUARDIAN',
    powerLevel: 95,
    flagEmoji: '🇧🇷',
    description: 'Paulista Avenue skyscraper swinger.'
  },
  {
    id: 'hero-ba',
    heroName: 'Spider-Byte',
    alias: 'Margo Kess',
    earthUniverse: 'Earth-22191',
    city: 'Buenos Aires',
    stateOrRegion: 'Federal District',
    country: 'Argentina',
    coords: [-34.6037, -58.3816],
    status: 'MULTI_VERSE_SYNC',
    powerLevel: 96,
    flagEmoji: '🇦🇷',
    description: 'Cyber-virtual Spider avatar in Buenos Aires.'
  },
  {
    id: 'hero-bogota',
    heroName: 'Emerald Web',
    alias: 'Carlos Parker',
    earthUniverse: 'Earth-616',
    city: 'Bogotá',
    stateOrRegion: 'Cundinamarca',
    country: 'Colombia',
    coords: [4.7110, -74.0721],
    status: 'RECON',
    powerLevel: 93,
    flagEmoji: '🇨🇴',
    description: 'Monserrate peak web guardian.'
  },
  {
    id: 'hero-lima',
    heroName: 'Inca Spider',
    alias: 'Inti Parker',
    earthUniverse: 'Earth-616',
    city: 'Lima',
    stateOrRegion: 'Lima Province',
    country: 'Peru',
    coords: [-12.0464, -77.0428],
    status: 'GUARDIAN',
    powerLevel: 92,
    flagEmoji: '🇵🇪',
    description: 'Pacific coastline Andean web guardian.'
  },

  // EUROPE
  {
    id: 'hero-london',
    heroName: 'Spider-UK',
    alias: 'Billy Braddock',
    earthUniverse: 'Earth-833',
    city: 'London',
    stateOrRegion: 'Greater London',
    country: 'United Kingdom',
    coords: [51.5074, -0.1278],
    status: 'MULTI_VERSE_SYNC',
    powerLevel: 97,
    flagEmoji: '🇬🇧',
    description: 'Captain Britain Corps veteran & Spider-Army tactical lead.'
  },
  {
    id: 'hero-edinburgh',
    heroName: 'Spider-Knight',
    alias: 'Sir Peter Parker',
    earthUniverse: 'Earth-311',
    city: 'Edinburgh',
    stateOrRegion: 'Scotland',
    country: 'United Kingdom',
    coords: [55.9533, -3.1883],
    status: 'GUARDIAN',
    powerLevel: 93,
    flagEmoji: '🇬🇧',
    description: 'Medieval armored Spider-Knight protecting Scotland.'
  },
  {
    id: 'hero-paris',
    heroName: 'Lady Spider',
    alias: 'May Reilly',
    earthUniverse: 'Earth-803',
    city: 'Paris',
    stateOrRegion: 'Île-de-France',
    country: 'France',
    coords: [48.8566, 2.3522],
    status: 'RECON',
    powerLevel: 92,
    flagEmoji: '🇫🇷',
    description: 'Steampunk inventor with mechanical brass legs over Eiffel Spire.'
  },
  {
    id: 'hero-berlin',
    heroName: 'Spider-Man Noir',
    alias: 'Peter Parker Noir',
    earthUniverse: 'Earth-90214',
    city: 'Berlin',
    stateOrRegion: 'Berlin Capital',
    country: 'Germany',
    coords: [52.5200, 13.4050],
    status: 'ACTIVE_PATROL',
    powerLevel: 95,
    flagEmoji: '🇩🇪',
    description: 'Monochrome trenchcoat detective patrolling Berlin rooftops.'
  },
  {
    id: 'hero-rome',
    heroName: 'Spider-Gladiator',
    alias: 'Petrus Parker',
    earthUniverse: 'Earth-712',
    city: 'Rome',
    stateOrRegion: 'Lazio',
    country: 'Italy',
    coords: [41.9028, 12.4964],
    status: 'GUARDIAN',
    powerLevel: 94,
    flagEmoji: '🇮🇹',
    description: 'Colosseum guardian & Roman web-slinger.'
  },
  {
    id: 'hero-madrid',
    heroName: 'Arácnido Jr.',
    alias: 'Junior',
    earthUniverse: 'Earth-15349',
    city: 'Madrid',
    stateOrRegion: 'Madrid Region',
    country: 'Spain',
    coords: [40.4168, -3.7038],
    status: 'ACTIVE_PATROL',
    powerLevel: 93,
    flagEmoji: '🇪🇸',
    description: 'High-flying hero protecting Iberian Peninsula.'
  },
  {
    id: 'hero-amsterdam',
    heroName: 'Canal Spider',
    alias: 'Jan Parker',
    earthUniverse: 'Earth-616',
    city: 'Amsterdam',
    stateOrRegion: 'North Holland',
    country: 'Netherlands',
    coords: [52.3676, 4.9041],
    status: 'RECON',
    powerLevel: 93,
    flagEmoji: '🇳🇱',
    description: 'Acrobatic canal bridge swinger.'
  },
  {
    id: 'hero-athens',
    heroName: 'Olympus Spider',
    alias: 'Nikos Parker',
    earthUniverse: 'Earth-616',
    city: 'Athens',
    stateOrRegion: 'Attica',
    country: 'Greece',
    coords: [37.9838, 23.7275],
    status: 'GUARDIAN',
    powerLevel: 93,
    flagEmoji: '🇬🇷',
    description: 'Acropolis spire web guardian.'
  },
  {
    id: 'hero-moscow',
    heroName: 'Red Square Spider',
    alias: 'Dmitri Parker',
    earthUniverse: 'Earth-616',
    city: 'Moscow',
    stateOrRegion: 'Central Federal',
    country: 'Russia',
    coords: [55.7558, 37.6173],
    status: 'ACTIVE_PATROL',
    powerLevel: 95,
    flagEmoji: '🇷🇺',
    description: 'Kremlin spire web guardian.'
  },

  // ASIA & OCEANIA
  {
    id: 'hero-mumbai',
    heroName: 'Spider-Man India',
    alias: 'Pavitr Prabhakar',
    earthUniverse: 'Earth-50101',
    city: 'Mumbai',
    stateOrRegion: 'Maharashtra',
    country: 'India',
    coords: [19.0760, 72.8777],
    status: 'GUARDIAN',
    powerLevel: 96,
    flagEmoji: '🇮🇳',
    description: 'Mystic web-slinger defending Mumbattan.'
  },
  {
    id: 'hero-delhi',
    heroName: 'Cyber Spider-Man',
    alias: 'Karan Sharma',
    earthUniverse: 'Earth-50101B',
    city: 'New Delhi',
    stateOrRegion: 'Delhi NCR',
    country: 'India',
    coords: [28.6139, 77.2090],
    status: 'RECON',
    powerLevel: 94,
    flagEmoji: '🇮🇳',
    description: 'Veda Tech Avatar guarding Delhi NCR.'
  },
  {
    id: 'hero-tokyo',
    heroName: 'Supaidāman',
    alias: 'Takuya Yamashiro',
    earthUniverse: 'Earth-51412',
    city: 'Tokyo',
    stateOrRegion: 'Kanto',
    country: 'Japan',
    coords: [35.6762, 139.6503],
    status: 'GUARDIAN',
    powerLevel: 100,
    flagEmoji: '🇯🇵',
    description: 'Emissary from Hell pilot of giant mech Leopardon.'
  },
  {
    id: 'hero-kyoto',
    heroName: 'SP//dr',
    alias: 'Peni Parker & SP//dr Mech',
    earthUniverse: 'Earth-14512',
    city: 'Kyoto',
    stateOrRegion: 'Kansai',
    country: 'Japan',
    coords: [35.0116, 135.7681],
    status: 'ACTIVE_PATROL',
    powerLevel: 96,
    flagEmoji: '🇯🇵',
    description: 'Psychically bonded spider-pilot operating SP//dr armor.'
  },
  {
    id: 'hero-shanghai',
    heroName: 'Web-Weaver',
    alias: 'Cooper Coen',
    earthUniverse: 'Earth-714',
    city: 'Shanghai',
    stateOrRegion: 'Shanghai',
    country: 'China',
    coords: [31.2304, 121.4737],
    status: 'ACTIVE_PATROL',
    powerLevel: 95,
    flagEmoji: '🇨🇳',
    description: 'Fashion designer & silk web-weaver.'
  },
  {
    id: 'hero-beijing',
    heroName: 'Forbidden City Spider',
    alias: 'Wei Parker',
    earthUniverse: 'Earth-714B',
    city: 'Beijing',
    stateOrRegion: 'Beijing',
    country: 'China',
    coords: [39.9042, 116.4074],
    status: 'GUARDIAN',
    powerLevel: 96,
    flagEmoji: '🇨🇳',
    description: 'Great Wall & Imperial Palace guardian.'
  },
  {
    id: 'hero-seoul',
    heroName: 'Silk',
    alias: 'Cindy Moon',
    earthUniverse: 'Earth-616',
    city: 'Seoul',
    stateOrRegion: 'Gyeonggi',
    country: 'South Korea',
    coords: [37.5665, 126.9780],
    status: 'GUARDIAN',
    powerLevel: 97,
    flagEmoji: '🇰🇷',
    description: 'Organic fingertip silk spinner in Seoul.'
  },
  {
    id: 'hero-singapore',
    heroName: 'Merlion Spider',
    alias: 'Leon Parker',
    earthUniverse: 'Earth-616',
    city: 'Singapore',
    stateOrRegion: 'Central Region',
    country: 'Singapore',
    coords: [1.3521, 103.8198],
    status: 'GUARDIAN',
    powerLevel: 96,
    flagEmoji: '🇸🇬',
    description: 'Marina Bay Sands spire swinger.'
  },
  {
    id: 'hero-sydney',
    heroName: 'Spider-Man Down-Under',
    alias: 'Pete Parker (Aussie)',
    earthUniverse: 'Earth-30847',
    city: 'Sydney',
    stateOrRegion: 'New South Wales',
    country: 'Australia',
    coords: [-33.8688, 151.2093],
    status: 'ACTIVE_PATROL',
    powerLevel: 93,
    flagEmoji: '🇦🇺',
    description: 'Sydney Opera House & Harbor bridge web swinger.'
  },
  {
    id: 'hero-auckland',
    heroName: 'Kiwi Spider',
    alias: 'Liam Parker',
    earthUniverse: 'Earth-30847B',
    city: 'Auckland',
    stateOrRegion: 'Auckland Region',
    country: 'New Zealand',
    coords: [-36.8485, 174.7633],
    status: 'RECON',
    powerLevel: 92,
    flagEmoji: '🇳🇿',
    description: 'Sky Tower web-slinger patrolling New Zealand.'
  },

  // AFRICA & MIDDLE EAST
  {
    id: 'hero-cairo',
    heroName: 'Sun-Spider',
    alias: 'Charlotte Sibley',
    earthUniverse: 'Earth-20023',
    city: 'Cairo',
    stateOrRegion: 'Cairo Governorate',
    country: 'Egypt',
    coords: [30.0444, 31.2357],
    status: 'RECON',
    powerLevel: 93,
    flagEmoji: '🇪🇬',
    description: 'Crutch-mounted web-shooters over Pyramids.'
  },
  {
    id: 'hero-joburg',
    heroName: 'Savannah Spider',
    alias: 'Kwame Parker',
    earthUniverse: 'Earth-11580',
    city: 'Johannesburg',
    stateOrRegion: 'Gauteng',
    country: 'South Africa',
    coords: [-26.2041, 28.0473],
    status: 'GUARDIAN',
    powerLevel: 94,
    flagEmoji: '🇿🇦',
    description: 'Urban defender in Johannesburg.'
  },
  {
    id: 'hero-lagos',
    heroName: 'Lagos Web-Slinger',
    alias: 'Tunde Parker',
    earthUniverse: 'Earth-11580D',
    city: 'Lagos',
    stateOrRegion: 'Lagos State',
    country: 'Nigeria',
    coords: [6.5244, 3.3792],
    status: 'ACTIVE_PATROL',
    powerLevel: 95,
    flagEmoji: '🇳🇬',
    description: 'Third Mainland Bridge web swinger.'
  },
  {
    id: 'hero-dubai',
    heroName: 'Cyber Spider Dubai',
    alias: 'Zayd Al-Rashid',
    earthUniverse: 'Earth-908',
    city: 'Dubai',
    stateOrRegion: 'Dubai Emirate',
    country: 'United Arab Emirates',
    coords: [25.2048, 55.2708],
    status: 'GUARDIAN',
    powerLevel: 97,
    flagEmoji: '🇦🇪',
    description: 'Burj Khalifa spire web-swinger.'
  }
];
