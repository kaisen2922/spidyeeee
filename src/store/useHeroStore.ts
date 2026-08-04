import { create } from 'zustand';
import confetti from 'canvas-confetti';
import type { 
  HeroState, 
  Mission, 
  TacticalUnit, 
  AIPrediction, 
  ActivityLogEntry, 
  ChatMessage, 
  SidebarTab, 
  ActiveView,
  SuitVersion,
  TrailPoint,
  BottomTab,
  HistoryRange,
  HeatmapPoint
} from '../types/heroTracker';
import { 
  INITIAL_SPIDERMAN, 
  INITIAL_CITY_UNITS, 
  INITIAL_HEATMAP_POINTS,
  NYC_DISTRICTS,
  generateRandomNYCIncident, 
  generateSpiderWebWaypoints, 
  computeAIPrediction, 
  getDistanceKm, 
  getHeadingAngle,
  getCompassHeading 
} from '../services/aiSimulator';
import { soundEngine } from '../services/soundEngine';

interface HeroStoreState {
  hero: HeroState;
  activeMissions: Mission[];
  currentMission: Mission | null;
  completedMissions: Mission[];
  units: TacticalUnit[];
  prediction: AIPrediction;
  activityLogs: ActivityLogEntry[];
  chatMessages: ChatMessage[];
  heatmapPoints: HeatmapPoint[];
  
  // Viewer UI Controls
  selectedTab: SidebarTab;
  activeView: ActiveView;
  bottomTab: BottomTab;
  historyRange: HistoryRange;
  is3DMode: boolean;
  isTerrainMode: boolean;
  isAssistantOpen: boolean;
  isArchiveOpen: boolean;
  isSoundMuted: boolean;
  searchQuery: string;
  mapboxToken: string;
  timerCounter: number;

  // Tracker Specific Features
  isCameraLockedOnSpiderMan: boolean;
  isRightDrawerOpen: boolean;
  isLiveTrackingOpen: boolean;
  showGreenSightings: boolean;
  showRedIncidents: boolean;
  showBlueHotspots: boolean;
  isReplayActive: boolean;
  replayStepIndex: number;
  policeScannerChatter: string;

  // Map camera trigger
  mapFlyToTarget: { coords: [number, number]; zoom?: number; pitch?: number } | null;

  // Actions (Strictly viewer / passive observation)
  tickSimulation: () => void;
  selectSuitPreset: (suit: SuitVersion) => void;
  setBottomTab: (tab: BottomTab) => void;
  setHistoryRange: (range: HistoryRange) => void;
  toggle3DMode: () => void;
  toggleTerrainMode: () => void;
  toggleCameraLock: () => void;
  setCameraLocked: (locked: boolean) => void;
  clearMapFlyToTarget: () => void;
  toggleRightDrawer: () => void;
  setIsRightDrawerOpen: (open: boolean) => void;
  toggleLiveTracking: () => void;
  setIsLiveTrackingOpen: (open: boolean) => void;
  toggleGreenSightings: () => void;
  toggleRedIncidents: () => void;
  toggleBlueHotspots: () => void;
  toggleReplayMode: () => void;
  setReplayStepIndex: (index: number) => void;
  setSelectedTab: (tab: SidebarTab) => void;
  setActiveView: (view: ActiveView) => void;
  setIsAssistantOpen: (open: boolean) => void;
  setIsArchiveOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setMapboxToken: (token: string) => void;
  sendChatMessage: (userText: string) => void;
  centerMapOnHero: () => void;
  flyToCoords: (coords: [number, number], zoom?: number) => void;
}

const initialMissions: Mission[] = [
  generateRandomNYCIncident(INITIAL_SPIDERMAN.position),
  generateRandomNYCIncident(INITIAL_SPIDERMAN.position),
];

const initialLogs: ActivityLogEntry[] = [
  { id: '1', time: '23:55:02', message: "Spider-Man entered Hell's Kitchen.", category: 'MOVEMENT', type: 'info', borough: 'Manhattan' },
  { id: '2', time: '23:55:14', message: 'Swinging toward Midtown Manhattan.', category: 'MOVEMENT', type: 'info', borough: 'Manhattan' },
  { id: '3', time: '23:55:40', message: 'Detected stopping on Chrysler Spire rooftop.', category: 'ROOFTOP', type: 'info', borough: 'Manhattan' },
  { id: '4', time: '23:56:03', message: 'Nearby high-rise fire reported.', category: 'INCIDENT', type: 'warning', borough: 'Manhattan' },
  { id: '5', time: '23:56:18', message: 'Spider-Man changed direction toward Times Square.', category: 'MOVEMENT', type: 'alert', borough: 'Manhattan' },
];

const initialChat: ChatMessage[] = [
  { id: 'c1', sender: 'SPIDER_NET_AI', text: 'Welcome to SPIDER-NET Live Tracker. Watching Spider-Man live across New York City. Zero manual control required.', timestamp: '23:55' }
];

export const useHeroStore = create<HeroStoreState>((set, get) => ({
  hero: INITIAL_SPIDERMAN,
  activeMissions: initialMissions,
  currentMission: initialMissions[0] || null,
  completedMissions: [],
  units: INITIAL_CITY_UNITS,
  prediction: computeAIPrediction(INITIAL_SPIDERMAN.position, initialMissions[0]),
  activityLogs: initialLogs,
  chatMessages: initialChat,
  heatmapPoints: INITIAL_HEATMAP_POINTS,

  selectedTab: 'O',
  activeView: 'TACTICAL',
  bottomTab: 'FEED',
  historyRange: '10m',
  is3DMode: true,
  isTerrainMode: false,
  isAssistantOpen: false,
  isArchiveOpen: false,
  isSoundMuted: false,
  searchQuery: '',
  mapboxToken: '',
  timerCounter: 0,

  isCameraLockedOnSpiderMan: false,
  isRightDrawerOpen: false,
  isLiveTrackingOpen: false,
  showGreenSightings: true,
  showRedIncidents: true,
  showBlueHotspots: true,
  isReplayActive: false,
  replayStepIndex: 0,
  policeScannerChatter: 'NYPD SCANNER: 10-4 All Sectors Patrol Clear',

  mapFlyToTarget: null,

  // Main simulation heartbeat loop (invoked every 1.2 seconds)
  tickSimulation: () => {
    const { 
      hero, 
      currentMission, 
      activeMissions, 
      completedMissions, 
      activityLogs, 
      timerCounter, 
      isReplayActive,
      heatmapPoints,
      units 
    } = get();

    if (isReplayActive) return; // Freeze live sim during replay mode

    const newTimerCounter = (timerCounter + 1) % 100;

    let updatedHero = { ...hero };
    let updatedCurrentMission = currentMission;
    let updatedActiveMissions = [...activeMissions];
    let updatedCompleted = [...completedMissions];
    let updatedLogs = [...activityLogs];
    let scannerText = get().policeScannerChatter;

    // 1. Spider-Man Autonomous AI Decision Loop (Self-directed navigation)
    if (!updatedCurrentMission && updatedActiveMissions.length > 0) {
      // Evaluate priority mission
      const targetMission = updatedActiveMissions[0];
      targetMission.status = 'SPIDERMAN_RESPONDING';
      updatedCurrentMission = targetMission;

      const pathWaypoints = generateSpiderWebWaypoints(updatedHero.position, targetMission.location);
      updatedHero.path = pathWaypoints;
      updatedHero.pathIndex = 0;
      updatedHero.status = 'RESPONDING';
      updatedHero.movementState = 'SWINGING';
      updatedHero.currentObjective = `RESPONDING TO: ${targetMission.title}`;

      soundEngine.playSpiderSenseAlert();
      soundEngine.playWebSwoosh();

      scannerText = `NYPD SCANNER: [${targetMission.scannerCode}] reported in ${targetMission.borough}`;

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      updatedLogs.unshift({
        id: `log-${Date.now()}`,
        time: timeStr,
        message: `Spider-Man detected incident in ${targetMission.district}. Accelerating response.`,
        category: 'INCIDENT',
        type: 'alert',
        borough: targetMission.borough
      });

      updatedHero.incidentsObservedCount += 1;
    } 
    // Fallback: Autonomous Patrol between NYC Districts
    else if (updatedHero.path.length === 0 || updatedHero.pathIndex >= updatedHero.path.length) {
      const nextDistrict = NYC_DISTRICTS[Math.floor(Math.random() * NYC_DISTRICTS.length)];
      const pathWaypoints = generateSpiderWebWaypoints(updatedHero.position, nextDistrict.coords);
      
      updatedHero.path = pathWaypoints;
      updatedHero.pathIndex = 0;
      
      const isRest = Math.random() < 0.2;
      if (isRest) {
        updatedHero.status = 'RESTING_ROOFTOP';
        updatedHero.movementState = 'RESTING';
        updatedHero.currentObjective = `PERCHED ON ROOFTOP AT ${nextDistrict.landmark}`;
        updatedHero.speed = 0;
        updatedHero.altitude = Math.floor(130 + Math.random() * 90);
        updatedHero.lastRooftop = nextDistrict.landmark;

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        updatedLogs.unshift({
          id: `log-${Date.now()}`,
          time: timeStr,
          message: `Spider-Man perched on rooftop lookout at ${nextDistrict.landmark}.`,
          category: 'ROOFTOP',
          type: 'info',
          borough: nextDistrict.borough
        });
      } else {
        updatedHero.status = 'PATROLLING';
        updatedHero.movementState = 'SWINGING';
        updatedHero.currentObjective = `SWINGING PATROL TOWARD ${nextDistrict.name.toUpperCase()}`;
        updatedHero.speed = Math.floor(36 + Math.random() * 22);

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        updatedLogs.unshift({
          id: `log-${Date.now()}`,
          time: timeStr,
          message: `Spider-Man entered ${nextDistrict.name} (${nextDistrict.borough}).`,
          category: 'MOVEMENT',
          type: 'info',
          borough: nextDistrict.borough
        });
      }
    }

    // 2. Continuous position & flight step update
    if (updatedHero.path.length > 0 && updatedHero.pathIndex < updatedHero.path.length) {
      const nextPos = updatedHero.path[updatedHero.pathIndex];
      const heading = getHeadingAngle(updatedHero.position, nextPos);
      const headingDir = getCompassHeading(heading);
      
      // Realistic Altitude Oscillation (65ft to 240ft)
      const altPhase = (updatedHero.pathIndex / Math.max(1, updatedHero.path.length)) * Math.PI * 4;
      const calcAlt = Math.floor(125 + Math.sin(altPhase) * 85);

      const mState = (calcAlt > 165) ? 'SWINGING' : (calcAlt < 85) ? 'LANDING' : 'ROOFTOP_RUN';

      // Pick building name based on nearest district landmark
      const nearestDistrict = NYC_DISTRICTS.find(d => getDistanceKm(nextPos, d.coords) < 1.5) || NYC_DISTRICTS[0];
      const buildingName = nearestDistrict.buildings[Math.floor(Math.random() * nearestDistrict.buildings.length)];

      updatedHero.heading = heading;
      updatedHero.headingDirectionName = headingDir;
      updatedHero.position = nextPos;
      updatedHero.altitude = calcAlt;
      if (updatedHero.movementState !== 'RESTING') {
        updatedHero.movementState = mState;
      }
      updatedHero.pathIndex = updatedHero.pathIndex + 1;
      
      if (updatedCurrentMission) {
        updatedHero.status = 'IN COMBAT';
        updatedHero.speed = Math.floor(52 + Math.random() * 24);
      } else {
        updatedHero.speed = Math.floor(32 + Math.random() * 20);
      }

      updatedHero.currentBuilding = buildingName;
      updatedHero.district = nearestDistrict.name;
      updatedHero.borough = nearestDistrict.borough;
      updatedHero.distanceTodayMiles = parseFloat((updatedHero.distanceTodayMiles + 0.08).toFixed(1));
      updatedHero.buildingsCrossedCount += 1;
      updatedHero.webFluid = Math.max(20, parseFloat((updatedHero.webFluid - 0.12).toFixed(1)));
      if (calcAlt > updatedHero.maxAltitude) updatedHero.maxAltitude = calcAlt;

      // Add to history trail (limit to 200 points)
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      const newPoint: TrailPoint = {
        coords: nextPos,
        altitude: calcAlt,
        timestamp: timeStr,
        buildingName
      };
      updatedHero.historyTrail = [newPoint, ...updatedHero.historyTrail.slice(0, 199)];

      if (updatedHero.pathIndex % 5 === 0) {
        soundEngine.playWebSwoosh();
        // Log movement step
        updatedLogs.unshift({
          id: `log-${Date.now()}`,
          time: timeStr,
          message: `Swinging past ${buildingName} (${nearestDistrict.name}).`,
          category: 'PATROL',
          type: 'info',
          borough: nearestDistrict.borough
        });
      }

      // Update incident ETA
      if (updatedCurrentMission) {
        const remainingKm = getDistanceKm(updatedHero.position, updatedCurrentMission.location);
        updatedCurrentMission.distanceKm = remainingKm;
        updatedCurrentMission.etaSeconds = Math.max(0, Math.round(remainingKm * 18));
      }

      // Arrival at incident destination
      if (updatedHero.pathIndex >= updatedHero.path.length && updatedCurrentMission) {
        const finishedMission = { ...updatedCurrentMission, status: 'RESOLVED' as const };
        updatedCompleted.unshift(finishedMission);
        updatedActiveMissions = updatedActiveMissions.filter(m => m.id !== finishedMission.id);

        soundEngine.playMissionComplete();
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        updatedLogs.unshift({
          id: `log-${Date.now()}`,
          time: timeStr,
          message: `Suspects restrained at ${finishedMission.district}. Resuming NYC patrol.`,
          category: 'INCIDENT',
          type: 'success',
          borough: finishedMission.borough
        });

        updatedHero.incidentsRespondedCount += 1;
        scannerText = `NYPD SCANNER: Incident ${finishedMission.id} Resolved. Area clear.`;
        updatedCurrentMission = null;
        updatedHero.status = 'RETURNING TO PATROL';
        updatedHero.movementState = 'ROOFTOP_RUN';
        updatedHero.currentObjective = 'PATROLLING NYC SKYLINE';
        updatedHero.path = [];
        updatedHero.pathIndex = 0;
      }
    }

    // 3. Move Tactical Units around NYC dynamically
    const updatedUnits = units.map(u => {
      const dLat = (Math.random() - 0.5) * 0.0006;
      const dLng = (Math.random() - 0.5) * 0.0006;
      return {
        ...u,
        position: [u.position[0] + dLat, u.position[1] + dLng] as [number, number]
      };
    });

    // 4. Increment patrol duration & spawn new incidents periodically
    updatedHero.patrolDurationMinutes += 0.02;

    if (Math.random() < 0.22 && updatedActiveMissions.length < 6) {
      const newIncident = generateRandomNYCIncident(updatedHero.position);
      updatedActiveMissions.push(newIncident);

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      updatedLogs.unshift({
        id: `log-${Date.now()}`,
        time: timeStr,
        message: `NYPD Scanner reported ${newIncident.title} in ${newIncident.borough}.`,
        category: 'INCIDENT',
        type: 'warning',
        borough: newIncident.borough
      });

      scannerText = `NYPD SCANNER: [${newIncident.scannerCode}] active in ${newIncident.district}`;
    }

    // Keep activity logs bounded to last 60 entries
    updatedLogs = updatedLogs.slice(0, 60);

    // Compute updated AI Prediction
    const newPrediction = computeAIPrediction(updatedHero.position, updatedCurrentMission || updatedActiveMissions[0]);

    // Camera follow auto-update if locked
    let flyTarget = get().mapFlyToTarget;
    if (get().isCameraLockedOnSpiderMan) {
      flyTarget = { coords: updatedHero.position, zoom: 15.5 };
    }

    set({
      hero: updatedHero,
      currentMission: updatedCurrentMission,
      activeMissions: updatedActiveMissions,
      completedMissions: updatedCompleted,
      activityLogs: updatedLogs,
      units: updatedUnits,
      prediction: newPrediction,
      timerCounter: newTimerCounter,
      policeScannerChatter: scannerText,
      mapFlyToTarget: flyTarget
    });
  },

  selectSuitPreset: (suitVersion: SuitVersion) => {
    const { hero } = get();
    soundEngine.playButtonClick();
    set({ hero: { ...hero, suitVersion } });
  },

  setBottomTab: (bottomTab: BottomTab) => {
    soundEngine.playButtonClick();
    set({ bottomTab });
  },

  setHistoryRange: (historyRange: HistoryRange) => {
    soundEngine.playButtonClick();
    set({ historyRange });
  },

  toggle3DMode: () => {
    soundEngine.playButtonClick();
    set(state => ({ is3DMode: !state.is3DMode }));
  },

  toggleTerrainMode: () => {
    soundEngine.playButtonClick();
    set(state => ({ isTerrainMode: !state.isTerrainMode }));
  },

  toggleSound: () => {
    const muted = soundEngine.toggleMute();
    if (!muted) soundEngine.playButtonClick();
    set({ isSoundMuted: muted });
  },

  toggleCameraLock: () => {
    soundEngine.playButtonClick();
    set(state => {
      const nextLocked = !state.isCameraLockedOnSpiderMan;
      return {
        isCameraLockedOnSpiderMan: nextLocked,
        mapFlyToTarget: nextLocked ? { coords: state.hero.position, zoom: 15.5, pitch: 50 } : null
      };
    });
  },

  setCameraLocked: (locked: boolean) => {
    set({ isCameraLockedOnSpiderMan: locked });
  },

  clearMapFlyToTarget: () => {
    set({ mapFlyToTarget: null });
  },

  toggleRightDrawer: () => {
    soundEngine.playButtonClick();
    set(state => ({ isRightDrawerOpen: !state.isRightDrawerOpen }));
  },

  setIsRightDrawerOpen: (open: boolean) => {
    set({ isRightDrawerOpen: open });
  },

  toggleLiveTracking: () => {
    soundEngine.playButtonClick();
    set(state => ({ isLiveTrackingOpen: !state.isLiveTrackingOpen }));
  },

  setIsLiveTrackingOpen: (open: boolean) => {
    set({ isLiveTrackingOpen: open });
  },

  toggleGreenSightings: () => {
    soundEngine.playButtonClick();
    set(state => ({ showGreenSightings: !state.showGreenSightings }));
  },

  toggleRedIncidents: () => {
    soundEngine.playButtonClick();
    set(state => ({ showRedIncidents: !state.showRedIncidents }));
  },

  toggleBlueHotspots: () => {
    soundEngine.playButtonClick();
    set(state => ({ showBlueHotspots: !state.showBlueHotspots }));
  },

  toggleReplayMode: () => {
    soundEngine.playButtonClick();
    set(state => ({ isReplayActive: !state.isReplayActive, replayStepIndex: 0 }));
  },

  setReplayStepIndex: (replayStepIndex: number) => {
    set({ replayStepIndex });
  },

  setSelectedTab: (tab: SidebarTab) => {
    soundEngine.playButtonClick();
    set({ selectedTab: tab });
  },

  setActiveView: (view: ActiveView) => {
    soundEngine.playButtonClick();
    set({ activeView: view });
  },

  setIsAssistantOpen: (open: boolean) => {
    soundEngine.playButtonClick();
    set({ isAssistantOpen: open });
  },

  setIsArchiveOpen: (open: boolean) => {
    soundEngine.playButtonClick();
    set({ isArchiveOpen: open });
  },

  setSearchQuery: (searchQuery: string) => {
    set({ searchQuery });
  },

  setMapboxToken: (mapboxToken: string) => {
    set({ mapboxToken });
  },

  centerMapOnHero: () => {
    const { hero } = get();
    soundEngine.playButtonClick();
    set({
      isCameraLockedOnSpiderMan: true,
      mapFlyToTarget: { coords: hero.position, zoom: 16, pitch: 55 }
    });
  },

  flyToCoords: (coords: [number, number], zoom = 15) => {
    soundEngine.playButtonClick();
    set({
      isCameraLockedOnSpiderMan: false,
      mapFlyToTarget: { coords, zoom, pitch: 45 }
    });
  },

  sendChatMessage: (userText: string) => {
    const { chatMessages, hero, currentMission, activeMissions } = get();
    soundEngine.playButtonClick();

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'USER',
      text: userText,
      timestamp: timeStr
    };

    let replyText = "SPIDER-NET AI is monitoring Spider-Man live across New York City. Observing signal frequencies.";
    const lower = userText.toLowerCase();

    if (lower.includes('where is') || lower.includes('location') || lower.includes('position')) {
      replyText = `Spider-Man is currently at [${hero.position[0].toFixed(4)}, ${hero.position[1].toFixed(4)}] in ${hero.district} (${hero.borough}), near ${hero.currentBuilding}. Speed: ${hero.speed} MPH, Altitude: ${hero.altitude} FT.`;
    } else if (lower.includes('altitude') || lower.includes('building') || lower.includes('rooftop')) {
      replyText = `Spider-Man altitude is ${hero.altitude} FT above street level over ${hero.currentBuilding}. Last rooftop rested: ${hero.lastRooftop}.`;
    } else if (lower.includes('activity') || lower.includes('status')) {
      replyText = `Current Status: ${hero.status}. Activity: ${hero.currentObjective}. Heading: ${hero.headingDirectionName} (${hero.heading}°).`;
    } else if (lower.includes('stats') || lower.includes('distance') || lower.includes('duration')) {
      replyText = `Distance today: ${hero.distanceTodayMiles} miles. Patrol duration: ${Math.floor(hero.patrolDurationMinutes / 60)}h ${Math.floor(hero.patrolDurationMinutes % 60)}m. Buildings crossed: ${hero.buildingsCrossedCount}. Incidents observed: ${hero.incidentsObservedCount}.`;
    } else if (lower.includes('current mission') || lower.includes('incident') || lower.includes('crime')) {
      if (currentMission) {
        replyText = `Active incident observed: "${currentMission.title}" in ${currentMission.borough}. Distance: ${currentMission.distanceKm} km. Spider-Man ETA: ${currentMission.etaSeconds}s.`;
      } else {
        replyText = `Spider-Man is currently on active rooftop patrol. ${activeMissions.length} active incident(s) detected across NYC.`;
      }
    }

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'SPIDER_NET_AI',
      text: replyText,
      timestamp: timeStr
    };

    set({
      chatMessages: [...chatMessages, userMsg, aiMsg]
    });

    setTimeout(() => {
      soundEngine.playAIVoiceBeep();
    }, 400);
  }
}));
