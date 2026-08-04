export type HeroStatus = 
  | 'PATROLLING' 
  | 'INVESTIGATING' 
  | 'RESPONDING'
  | 'IN COMBAT' 
  | 'RESCUING' 
  | 'RESTING_ROOFTOP' 
  | 'RETURNING TO PATROL';

export type SidebarTab = 'O' | 'S' | 'T';

export type ActiveView = 'TACTICAL' | 'PREDICTION' | 'REPLAY' | 'HERO_SUIT';

export type SuitVersion = 
  | 'CLASSIC SUIT' 
  | 'IRON SPIDER' 
  | 'STEALTH NOIR' 
  | 'VELOCITY SUIT';

export type MovementState = 
  | 'SWINGING' 
  | 'ROOFTOP_RUN' 
  | 'FREEFALL' 
  | 'LANDING' 
  | 'COMBAT' 
  | 'RESTING';

export type ThreatLevel = 'CODE GREEN' | 'CODE YELLOW' | 'CODE ORANGE' | 'CODE RED' | 'CRITICAL ALPHA';

export type NYCBorough = 'Manhattan' | 'Brooklyn' | 'Queens' | 'Bronx' | 'Staten Island';

export type CompassHeading = 
  | 'North' 
  | 'North-East' 
  | 'East' 
  | 'South-East' 
  | 'South' 
  | 'South-West' 
  | 'West' 
  | 'North-West';

export interface TrailPoint {
  coords: [number, number]; // [lat, lng]
  altitude: number; // feet
  timestamp: string;
  buildingName?: string;
}

export interface HeroState {
  name: string;
  alias: string;
  status: HeroStatus;
  movementState: MovementState;
  health: number; // 0 - 100
  hearts: number; // 1 - 5
  webFluid: number; // 0 - 100%
  speed: number; // mph
  altitude: number; // feet
  heading: number; // 0 - 360 deg
  headingDirectionName: CompassHeading;
  district: string;
  borough: NYCBorough;
  currentBuilding: string;
  lastRooftop: string;
  patrolDurationMinutes: number;
  distanceTodayMiles: number;
  incidentsObservedCount: number;
  incidentsRespondedCount: number;
  buildingsCrossedCount: number;
  avgSpeed: number;
  maxAltitude: number;
  lastSeen: string;
  currentObjective: string;
  threatLevel: ThreatLevel;
  suitVersion: SuitVersion;
  position: [number, number]; // [lat, lng]
  path: [number, number][];
  pathIndex: number;
  historyTrail: TrailPoint[];
}

export type MissionType = 
  | 'ROBBERY' 
  | 'FIRE' 
  | 'EXPLOSION' 
  | 'HOSTAGE' 
  | 'VEHICLE_CHASE' 
  | 'RESCUE' 
  | 'BUILDING_COLLAPSE' 
  | 'SUSPICIOUS_ACTIVITY' 
  | 'DRONE_ATTACK';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Mission {
  id: string;
  title: string;
  type: MissionType;
  priority: PriorityLevel;
  description: string;
  location: [number, number]; // [lat, lng]
  district: string;
  borough: NYCBorough;
  distanceKm: number;
  etaSeconds: number;
  rewardXP: number;
  civiliansAtRisk: number;
  scannerCode: string;
  status: 'REPORTED' | 'SPIDERMAN_INVESTIGATING' | 'SPIDERMAN_RESPONDING' | 'SPIDERMAN_ARRIVED' | 'RESOLVED' | 'IGNORED';
  timestamp: string;
  iconType: string;
}

export type UnitType = 'POLICE' | 'FIRE' | 'AMBULANCE' | 'HELICOPTER';

export interface TacticalUnit {
  id: string;
  name: string;
  callsign: string;
  type: UnitType;
  position: [number, number]; // [lat, lng]
  status: 'PATROLLING' | 'DISPATCHED' | 'SUPPORTING';
}

export interface AIPrediction {
  nextDestinationName: string;
  nextLocation: [number, number];
  etaFormatted: string;
  successProbability: number;
  recommendedRoute: string;
  riskLevel: 'LOW' | 'MODERATE' | 'SEVERE' | 'EXTREME';
  threatAnalysis: string;
  coveragePercent: number;
}

export interface ActivityLogEntry {
  id: string;
  time: string;
  message: string;
  category: 'MOVEMENT' | 'INCIDENT' | 'ROOFTOP' | 'COMBAT' | 'PATROL';
  type: 'info' | 'warning' | 'success' | 'alert';
  borough?: NYCBorough;
}

export interface HeatmapPoint {
  coords: [number, number];
  intensity: number;
  district: string;
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'SPIDER_NET_AI';
  text: string;
  timestamp: string;
}

export type BottomTab = 
  | 'FEED' 
  | 'HISTORY' 
  | 'TIMELINE' 
  | 'INCIDENTS' 
  | 'HEATMAP' 
  | 'STATS' 
  | 'REPLAY' 
  | 'SPIDER_NET' 
  | 'SCANNER' 
  | 'SETTINGS';

export type HistoryRange = '10m' | '1h' | 'Today' | 'Yesterday';
