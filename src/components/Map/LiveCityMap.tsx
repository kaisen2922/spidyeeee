import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import { Lock, Unlock, Target, Plus, Minus, Compass, Box, Globe } from 'lucide-react';
import { useHeroStore } from '../../store/useHeroStore';
import { SPIDERMAN_FREQUENT_LOCATIONS, GLOBAL_SPIDER_HEROES } from '../../services/aiSimulator';

export const LiveCityMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const spiderMarkerRef = useRef<maplibregl.Marker | null>(null);
  const targetDestinationMarkerRef = useRef<maplibregl.Marker | null>(null);
  const unitMarkersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const missionMarkersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const frequentMarkersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const globalHeroMarkersRef = useRef<Map<string, maplibregl.Marker>>(new Map());

  const { 
    hero, 
    activeMissions, 
    units, 
    currentMission, 
    is3DMode, 
    toggle3DMode,
    mapFlyToTarget, 
    clearMapFlyToTarget,
    isCameraLockedOnSpiderMan,
    toggleCameraLock,
    centerMapOnHero,
    flyToCoords,
    showGreenSightings,
    showRedIncidents,
    showBlueHotspots,
    isReplayActive,
    replayStepIndex,
    bottomTab,
    heatmapPoints
  } = useHeroStore();

  const displayPos: [number, number] = isReplayActive && hero.historyTrail[replayStepIndex]
    ? hero.historyTrail[replayStepIndex].coords
    : hero.position;

  const displayAltitude = isReplayActive && hero.historyTrail[replayStepIndex]
    ? hero.historyTrail[replayStepIndex].altitude
    : hero.altitude;

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-dark': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors, © CARTO'
          }
        },
        layers: [
          {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'carto-dark',
            minzoom: 0,
            maxzoom: 20
          }
        ]
      },
      center: [displayPos[1], displayPos[0]],
      zoom: 15.5,
      pitch: 50,
      bearing: -17.6,
      attributionControl: false,
      interactive: true,
      dragPan: true,
      scrollZoom: true,
      boxZoom: true,
      dragRotate: true,
      keyboard: true,
      doubleClickZoom: true,
      touchZoomRotate: true,
      touchPitch: true
    });

    mapRef.current = map;

    // Automatically switch to FREE MOVE when user interacts with map
    const handleUserMapInteraction = () => {
      if (useHeroStore.getState().isCameraLockedOnSpiderMan) {
        useHeroStore.getState().setCameraLocked(false);
      }
    };

    map.on('dragstart', handleUserMapInteraction);
    map.on('zoomstart', handleUserMapInteraction);
    map.on('pitchstart', handleUserMapInteraction);
    map.on('rotatestart', handleUserMapInteraction);
    map.on('touchstart', handleUserMapInteraction);
    map.on('wheel', handleUserMapInteraction);

    map.on('load', () => {
      // GeoJSON source for Spider-Man Active Web Route line
      map.addSource('spider-web-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }
      });

      // GeoJSON source for 30-min Historical Trail Breadcrumbs
      map.addSource('spider-history-trail', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // GeoJSON source for Crime & Patrol Heatmap
      map.addSource('spider-heatmap-source', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      });

      // GeoJSON source for AI Path Prediction Dotted Vector
      map.addSource('spider-prediction-path', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        }
      });

      // Prediction Dotted Animated Path Line
      map.addLayer({
        id: 'spider-prediction-line',
        type: 'line',
        source: 'spider-prediction-path',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#38bdf8',
          'line-width': 3,
          'line-dasharray': [2, 4],
          'line-opacity': 0.85
        }
      });

      // Heatmap layer density overlay
      map.addLayer({
        id: 'spider-heatmap-layer',
        type: 'heatmap',
        source: 'spider-heatmap-source',
        maxzoom: 18,
        paint: {
          'heatmap-weight': 1,
          'heatmap-intensity': 1.5,
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 0, 0)',
            0.2, 'rgba(34, 211, 238, 0.4)',
            0.5, 'rgba(251, 191, 36, 0.6)',
            0.8, 'rgba(244, 63, 94, 0.8)'
          ],
          'heatmap-radius': 30,
          'heatmap-opacity': 0
        }
      });

      // Animated Web Route Outer Red/Cyan Glow
      map.addLayer({
        id: 'web-route-glow',
        type: 'line',
        source: 'spider-web-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#f43f5e',
          'line-width': 10,
          'line-opacity': 0.5,
          'line-blur': 6
        }
      });

      // Core Spider Web Polyline
      map.addLayer({
        id: 'web-route-line',
        type: 'line',
        source: 'spider-web-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 4,
          'line-dasharray': [1.5, 1.5]
        }
      });

      // History Trail Web Dots
      map.addLayer({
        id: 'spider-history-dots',
        type: 'circle',
        source: 'spider-history-trail',
        paint: {
          'circle-radius': 4,
          'circle-color': '#e11d48',
          'circle-opacity': 0.7,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#ffffff'
        }
      });

      // GeoJSON source for Global Spider-Verse Cities
      map.addSource('global-spider-cities', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: GLOBAL_SPIDER_HEROES.map(ghero => ({
            type: 'Feature',
            properties: {
              id: ghero.id,
              city: ghero.city,
              heroName: ghero.heroName,
              alias: ghero.alias,
              country: ghero.country,
              stateOrRegion: ghero.stateOrRegion,
              flagEmoji: ghero.flagEmoji,
              earthUniverse: ghero.earthUniverse,
              status: ghero.status,
              powerLevel: ghero.powerLevel,
              description: ghero.description,
              lat: ghero.coords[0],
              lng: ghero.coords[1],
              title: `${ghero.flagEmoji} ${ghero.city}: ${ghero.heroName}`
            },
            geometry: {
              type: 'Point',
              coordinates: [ghero.coords[1], ghero.coords[0]]
            }
          }))
        }
      });

      // Load logo.png image into MapLibre GL for canvas symbol icons
      const logoImg = new Image(40, 40);
      logoImg.crossOrigin = 'anonymous';
      logoImg.onload = () => {
        if (!map.hasImage('spidey-logo-icon')) {
          map.addImage('spidey-logo-icon', logoImg);
        }

        if (!map.getLayer('global-cities-logo-icons')) {
          map.addLayer({
            id: 'global-cities-logo-icons',
            type: 'symbol',
            source: 'global-spider-cities',
            layout: {
              'icon-image': 'spidey-logo-icon',
              'icon-size': 0.55,
              'icon-allow-overlap': false,
              'icon-ignore-placement': false,
              'text-field': ['get', 'title'],
              'text-size': 10,
              'text-offset': [0, 1.8],
              'text-anchor': 'top',
              'text-allow-overlap': false,
              'text-ignore-placement': false,
              'text-optional': true,
              'text-padding': 4
            },
            paint: {
              'text-color': '#38bdf8',
              'text-halo-color': '#090d16',
              'text-halo-width': 3
            }
          });

          // Interactive Click & Hover Listeners for Canvas Symbol Icons
          map.on('mouseenter', 'global-cities-logo-icons', () => { map.getCanvas().style.cursor = 'pointer'; });
          map.on('mouseleave', 'global-cities-logo-icons', () => { map.getCanvas().style.cursor = ''; });
          
          map.on('click', 'global-cities-logo-icons', (e) => {
            if (!e.features || e.features.length === 0) return;
            const feat = e.features[0];
            const props = feat.properties;
            if (!props) return;

            const lat = Number(props.lat);
            const lng = Number(props.lng);

            // Build Spider-Man Status Telemetry Popover
            const popupNode = document.createElement('div');
            popupNode.className = 'p-3 bg-slate-950 text-slate-100 rounded-xl border-2 border-rose-500/90 shadow-2xl font-cyber max-w-xs';
            popupNode.innerHTML = `
              <div class="flex items-center justify-between border-b border-rose-500/40 pb-1 mb-2">
                <span class="text-xs font-bold text-rose-400 uppercase tracking-wide flex items-center space-x-1">
                  <span>${props.flagEmoji}</span>
                  <span>${props.city}, ${props.country}</span>
                </span>
                <span class="text-[10px] text-amber-400 font-mono">${props.earthUniverse}</span>
              </div>
              
              <div class="flex items-center space-x-2.5 mb-2">
                <div class="w-10 h-10 rounded-full border-2 border-rose-500 bg-slate-900 p-0.5 overflow-hidden flex-shrink-0 shadow-[0_0_12px_#f43f5e]">
                  <img src="/logo.png" alt="Spider-Man" class="w-full h-full object-contain drop-shadow" />
                </div>
                <div>
                  <h4 class="font-bold text-sm text-cyan-200 leading-tight">${props.heroName}</h4>
                  <div class="text-[10px] text-slate-400 font-mono">Alias: <span class="text-rose-300 font-bold">${props.alias}</span></div>
                </div>
              </div>

              <p class="text-xs text-slate-300 mb-2 leading-tight">${props.description}</p>
              
              <div class="grid grid-cols-2 gap-1 text-[10px] text-slate-400 mb-2 font-tech bg-slate-900 p-2 rounded-lg border border-slate-800">
                <div>STATUS: <span class="text-emerald-400 font-bold">${props.status}</span></div>
                <div>POWER: <span class="text-amber-400 font-bold">${props.powerLevel}/100</span></div>
                <div>SUIT: <span class="text-cyan-400 font-bold">98% HEALTH</span></div>
                <div>WEB-FLUID: <span class="text-sky-300 font-bold">95% CAPACITY</span></div>
                <div>SPEED: <span class="text-amber-300 font-bold">38 MPH</span></div>
                <div>UNIVERSE: <span class="text-rose-300 font-bold">${props.earthUniverse}</span></div>
              </div>
              
              <button id="canvas-fly-${props.id}" class="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-1.5 px-2 rounded-lg text-xs border border-white flex items-center justify-center space-x-1 cursor-pointer transition-colors shadow-[0_0_12px_#f43f5e]">
                <span>🎯 FLY CAMERA TO ${String(props.heroName).toUpperCase()}</span>
              </button>
            `;

            popupNode.querySelector(`#canvas-fly-${props.id}`)?.addEventListener('click', () => {
              useHeroStore.getState().setCameraLocked(false);
              useHeroStore.getState().flyToCoords([lat, lng], 15.5);
            });

            new maplibregl.Popup({ offset: 16, closeButton: true })
              .setLngLat([lng, lat])
              .setDOMContent(popupNode)
              .addTo(map);
          });
        }
      };
      logoImg.src = '/logo.png';
      setIsMapReady(true);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Toggle Heatmap opacity based on bottomTab
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (map.getLayer('spider-heatmap-layer')) {
      const isHeatmapActive = bottomTab === 'HEATMAP';
      map.setPaintProperty('spider-heatmap-layer', 'heatmap-opacity', isHeatmapActive ? 0.75 : 0);
    }
  }, [bottomTab]);

  // Toggle Pitch for 3D View
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.easeTo({
      pitch: is3DMode ? 55 : 0,
      duration: 800
    });
  }, [is3DMode]);

  // Update Spider-Man Live Marker with Heading Direction Arrow & Telemetry Label
  // Update Spider-Man Live Marker with Heading Direction Arrow & Telemetry Label
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (!spiderMarkerRef.current) {
      const el = document.createElement('div');
      el.className = 'relative flex flex-col items-center justify-center cursor-pointer pointer-events-auto group';
      
      el.innerHTML = `
        <!-- Floating Live Location Header Badge -->
        <div class="mb-1 bg-rose-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-[0_0_20px_#f43f5e] border-2 border-white flex items-center space-x-1.5 whitespace-nowrap animate-bounce font-mono">
          <span class="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>🔴 SPIDER-MAN LIVE (${hero.movementState})</span>
        </div>

        <!-- Outer Pulsing Aura Rings & Direction Arrow -->
        <div class="relative flex items-center justify-center">
          <div class="absolute w-16 h-16 rounded-full border-2 border-rose-500 animate-ping opacity-90"></div>
          <div class="absolute w-20 h-20 rounded-full border border-cyan-400 animate-ping opacity-40"></div>
          
          <!-- Direction Heading Arrow Pointer -->
          <div class="absolute -top-3.5 w-4 h-4 text-amber-400 transition-transform" style="transform: rotate(${hero.heading}deg)">
            <svg viewBox="0 0 24 24" class="w-4 h-4 fill-amber-400 drop-shadow">
              <polygon points="12,2 22,22 12,17 2,22"></polygon>
            </svg>
          </div>

          <!-- Spider-Man Logo Badge -->
          <div class="w-13 h-13 rounded-full border-2 border-white bg-slate-950 p-1 flex items-center justify-center shadow-[0_0_25px_#f43f5e] z-10 overflow-hidden">
            <img src="/logo.png" alt="Spider-Man Logo" class="w-full h-full object-contain drop-shadow" />
          </div>
        </div>

        <!-- Altitude & Speed Sub-label Below Spider-Man -->
        <div class="mt-1 bg-slate-950/95 text-cyan-300 text-[9px] px-2 py-0.5 rounded-md border border-rose-500/60 shadow-2xl font-tech whitespace-nowrap">
          ALT: ${displayAltitude} FT • ${hero.speed} MPH • ${hero.headingDirectionName}
        </div>
      `;

      spiderMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([displayPos[1], displayPos[0]])
        .addTo(map);
    } else {
      spiderMarkerRef.current.setLngLat([displayPos[1], displayPos[0]]);
      const el = spiderMarkerRef.current.getElement();
      const subLabel = el.querySelector('.font-tech');
      if (subLabel) {
        subLabel.textContent = `ALT: ${displayAltitude} FT • ${hero.speed} MPH • ${hero.headingDirectionName}`;
      }
    }

    // Update Web Route Polyline to Target
    if (map.getSource('spider-web-route')) {
      const routePoints: [number, number][] = [];
      if (currentMission) {
        routePoints.push([displayPos[1], displayPos[0]]);
        if (hero.path.length > 0) {
          hero.path.slice(hero.pathIndex).forEach(pt => routePoints.push([pt[1], pt[0]]));
        }
        routePoints.push([currentMission.location[1], currentMission.location[0]]);
      }

      (map.getSource('spider-web-route') as maplibregl.GeoJSONSource).setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routePoints
        }
      });
    }

    // Update Historical Trail Dots
    if (map.getSource('spider-history-trail')) {
      const historyFeatures = hero.historyTrail.map(pt => ({
        type: 'Feature' as const,
        properties: { timestamp: pt.timestamp, altitude: pt.altitude },
        geometry: {
          type: 'Point' as const,
          coordinates: [pt.coords[1], pt.coords[0]]
        }
      }));

      (map.getSource('spider-history-trail') as maplibregl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: historyFeatures
      });
    }

    // Update AI Prediction Path Line String
    if (map.getSource('spider-prediction-path')) {
      const predTarget = useHeroStore.getState().prediction.nextLocation;
      const predPoints: [number, number][] = predTarget ? [
        [displayPos[1], displayPos[0]],
        [predTarget[1], predTarget[0]]
      ] : [];

      (map.getSource('spider-prediction-path') as maplibregl.GeoJSONSource).setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: predPoints
        }
      });
    }

    // Update Heatmap Source
    if (map.getSource('spider-heatmap-source')) {
      const heatmapFeatures = heatmapPoints.map(hp => ({
        type: 'Feature' as const,
        properties: { intensity: hp.intensity },
        geometry: {
          type: 'Point' as const,
          coordinates: [hp.coords[1], hp.coords[0]]
        }
      }));

      (map.getSource('spider-heatmap-source') as maplibregl.GeoJSONSource).setData({
        type: 'FeatureCollection',
        features: heatmapFeatures
      });
    }
  }, [displayPos, displayAltitude, hero.speed, hero.heading, hero.headingDirectionName, hero.movementState, hero.path, hero.historyTrail, currentMission, heatmapPoints]);

  // Update Spider-Man Frequent Location Pointer Markers (Green Sightings & Blue HQs)
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    SPIDERMAN_FREQUENT_LOCATIONS.forEach((loc) => {
      const isHQ = loc.category === 'HEADQUARTERS';
      const isVisible = isHQ ? showBlueHotspots : showGreenSightings;

      if (!frequentMarkersRef.current.has(loc.id)) {
        const el = document.createElement('div');
        el.className = `relative flex flex-col items-center justify-center cursor-pointer pointer-events-auto group z-20 ${
          isVisible ? 'block' : 'hidden'
        }`;

        if (isHQ) {
          // 🔵 Blue Hexagonal Star Badge Pointer (Major HQ Hotspots)
          el.innerHTML = `
            <!-- Location Name Top Label -->
            <div class="mb-1 bg-sky-950/95 text-sky-200 font-bold text-[9px] px-2 py-0.5 rounded-md border border-sky-400/60 shadow-xl flex items-center space-x-1 whitespace-nowrap font-mono group-hover:scale-110 transition-transform">
              <span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></span>
              <span>⭐ ${loc.name}</span>
            </div>

            <!-- Pulsing Blue Pin Icon with Spidey Mask -->
            <div class="relative flex items-center justify-center">
              <div class="absolute w-9 h-9 rounded-full bg-sky-500/40 animate-ping"></div>
              
              <!-- Blue Circular Badge with Spidey Logo -->
              <div class="w-9 h-9 rounded-full border-2 border-slate-950 bg-sky-600 p-0.5 flex items-center justify-center shadow-[0_0_18px_#38bdf8] group-hover:scale-125 transition-transform z-10 overflow-hidden">
                <img src="/logo.png" alt="Spidey HQ Logo" class="w-full h-full object-contain drop-shadow" />
              </div>

              <!-- Downward Pointer Arrow -->
              <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-sky-400 -mt-0.5"></div>
            </div>

            <!-- Frequent Visit Count Sub-label -->
            <div class="mt-0.5 bg-slate-950/90 text-amber-300 text-[8px] px-1.5 py-0.5 rounded border border-sky-500/40 font-tech whitespace-nowrap">
              HQ • ${loc.visitCount} VISITS
            </div>
          `;
        } else {
          // 🟢 Green Circular Spider Badge Pointer (Verified Patrol Sightings / Safehouses)
          el.innerHTML = `
            <!-- Location Name Top Label -->
            <div class="mb-1 bg-emerald-950/95 text-emerald-200 font-bold text-[9px] px-2 py-0.5 rounded-md border border-emerald-500/60 shadow-xl flex items-center space-x-1 whitespace-nowrap font-mono group-hover:scale-110 transition-transform">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>🟢 ${loc.name}</span>
            </div>

            <!-- Pulsing Green Pin Icon with Spidey Logo -->
            <div class="relative flex items-center justify-center">
              <div class="absolute w-8.5 h-8.5 rounded-full bg-emerald-500/40 animate-ping"></div>
              
              <!-- Green Circular Badge with Spidey Logo -->
              <div class="w-8.5 h-8.5 rounded-full border-2 border-slate-950 bg-emerald-500 p-0.5 flex items-center justify-center shadow-[0_0_15px_#10b981] group-hover:scale-125 transition-transform z-10 overflow-hidden">
                <img src="/logo.png" alt="Spidey Sighting Logo" class="w-full h-full object-contain drop-shadow" />
              </div>

              <!-- Downward Pointer Arrow -->
              <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-emerald-400 -mt-0.5"></div>
            </div>

            <!-- Frequent Visit Count Sub-label -->
            <div class="mt-0.5 bg-slate-950/90 text-emerald-300 text-[8px] px-1 py-0.5 rounded border border-emerald-500/40 font-tech whitespace-nowrap">
              SIGHTING • ${loc.visitCount} VISITS
            </div>
          `;
        }

        // Interactive Popup for Spot
        const popupNode = document.createElement('div');
        popupNode.className = `p-3 bg-slate-950 text-slate-100 rounded-xl border-2 ${isHQ ? 'border-sky-500' : 'border-emerald-500'} shadow-2xl font-cyber max-w-xs`;
        popupNode.innerHTML = `
          <div class="flex items-center justify-between border-b ${isHQ ? 'border-sky-500/40' : 'border-emerald-500/40'} pb-1 mb-2">
            <span class="text-xs font-bold ${isHQ ? 'text-sky-300' : 'text-emerald-400'} uppercase tracking-wide">
              ${isHQ ? '⭐ SPIDER-MAN MAJOR HQ' : '🟢 SPIDER SIGHTING LOCATION'}
            </span>
            <span class="text-[10px] text-amber-400 font-mono">${loc.borough}</span>
          </div>
          <h4 class="font-bold text-sm text-cyan-200 mb-1">${loc.name}</h4>
          <p class="text-xs text-slate-300 mb-2">${loc.description}</p>
          <div class="grid grid-cols-2 gap-1 text-[10px] text-slate-400 mb-2 font-tech bg-slate-900 p-1.5 rounded border border-slate-800">
            <div>Category: <span class="text-emerald-400 font-bold">${loc.category}</span></div>
            <div>Visits: <span class="text-amber-400 font-bold">${loc.visitCount} times</span></div>
            <div>District: <span class="text-cyan-300">${loc.district}</span></div>
            <div>Last Rested: <span class="text-rose-300">${loc.lastVisited}</span></div>
          </div>
          <button id="fly-to-${loc.id}" class="w-full ${isHQ ? 'bg-sky-600 hover:bg-sky-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white font-bold py-1.5 px-2 rounded-lg text-xs border border-white flex items-center justify-center space-x-1 cursor-pointer transition-colors shadow">
            <span>🎯 FLY CAMERA TO POINTER</span>
          </button>
        `;

        popupNode.querySelector(`#fly-to-${loc.id}`)?.addEventListener('click', () => {
          flyToCoords(loc.coords, 16.5);
        });

        const popup = new maplibregl.Popup({ offset: 16, closeButton: true })
          .setDOMContent(popupNode);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([loc.coords[1], loc.coords[0]])
          .setPopup(popup)
          .addTo(map);

        frequentMarkersRef.current.set(loc.id, marker);
      } else {
        const marker = frequentMarkersRef.current.get(loc.id);
        if (marker) {
          const el = marker.getElement();
          if (isVisible) el.classList.remove('hidden');
          else el.classList.add('hidden');
        }
      }
    });
  }, [isMapReady, flyToCoords, showGreenSightings, showBlueHotspots]);

  // Update Global Spider-Verse Heroes Locators (Worldwide: Countries, Cities & States)
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;
    const map = mapRef.current;

    GLOBAL_SPIDER_HEROES.forEach((ghero) => {
      let marker = globalHeroMarkersRef.current.get(ghero.id);
      
      if (!marker) {
        const el = document.createElement('div');
        el.className = 'relative flex flex-col items-center justify-center cursor-pointer pointer-events-auto group z-30';

        // Custom Marker Element with Country Flag & City Header
        el.innerHTML = `
          <!-- Flag + City Header Badge -->
          <div class="mb-1 bg-slate-950/95 text-rose-200 font-black text-[9px] px-2 py-0.5 rounded-md border border-rose-500/80 shadow-2xl flex items-center space-x-1.5 whitespace-nowrap font-mono group-hover:scale-110 transition-transform">
            <span class="text-xs">${ghero.flagEmoji}</span>
            <span>${ghero.city}: ${ghero.heroName}</span>
          </div>

          <!-- Pulsing Outer Ring -->
          <div class="relative flex items-center justify-center">
            <div class="absolute w-10 h-10 rounded-full bg-rose-500/40 animate-ping"></div>
            <div class="absolute w-12 h-12 rounded-full border border-cyan-400/40 animate-ping opacity-50"></div>
            
            <!-- Spider-Man Logo Badge using logo.png -->
            <div class="w-9.5 h-9.5 rounded-full border-2 border-amber-400 bg-slate-950 p-0.5 flex items-center justify-center shadow-[0_0_20px_#f43f5e] group-hover:scale-125 transition-transform z-10 overflow-hidden">
              <img src="/logo.png" alt="${ghero.heroName}" class="w-full h-full object-contain drop-shadow" style="width: 100%; height: 100%; display: block;" />
            </div>

            <!-- Downward Pointer Arrow -->
            <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-amber-400 -mt-0.5"></div>
          </div>

          <!-- Earth Universe & Country Tag -->
          <div class="mt-0.5 bg-slate-950/95 text-cyan-300 text-[8px] px-1.5 py-0.5 rounded border border-cyan-500/50 shadow font-tech whitespace-nowrap">
            ${ghero.earthUniverse} • ${ghero.country}
          </div>
        `;

        // Interactive Popup for Global Spider-Hero
        const popupNode = document.createElement('div');
        popupNode.className = 'p-3 bg-slate-950 text-slate-100 rounded-xl border-2 border-rose-500/90 shadow-2xl font-cyber max-w-xs';
        popupNode.innerHTML = `
          <div class="flex items-center justify-between border-b border-rose-500/40 pb-1 mb-2">
            <span class="text-xs font-bold text-rose-400 uppercase tracking-wide flex items-center space-x-1">
              <span>${ghero.flagEmoji}</span>
              <span>${ghero.city}, ${ghero.country}</span>
            </span>
            <span class="text-[10px] text-amber-400 font-mono">${ghero.earthUniverse}</span>
          </div>

          <div class="flex items-center space-x-2.5 mb-2">
            <div class="w-10 h-10 rounded-full border-2 border-rose-500 bg-slate-900 p-0.5 overflow-hidden flex-shrink-0 shadow-[0_0_12px_#f43f5e]">
              <img src="/logo.png" alt="${ghero.heroName}" class="w-full h-full object-contain drop-shadow" />
            </div>
            <div>
              <h4 class="font-bold text-sm text-cyan-200 leading-tight">${ghero.heroName}</h4>
              <div class="text-[10px] text-slate-400 font-mono">Alias: <span class="text-rose-300 font-bold">${ghero.alias}</span></div>
            </div>
          </div>

          <p class="text-xs text-slate-300 mb-2 leading-tight">${ghero.description}</p>
          
          <!-- Real-Time Spider-Man Status Telemetry Grid -->
          <div class="grid grid-cols-2 gap-1 text-[10px] text-slate-400 mb-2 font-tech bg-slate-900 p-2 rounded-lg border border-slate-800">
            <div>STATUS: <span class="text-emerald-400 font-bold">${ghero.status}</span></div>
            <div>POWER: <span class="text-amber-400 font-bold">${ghero.powerLevel}/100</span></div>
            <div>SUIT: <span class="text-cyan-400 font-bold">98% HEALTH</span></div>
            <div>WEB-FLUID: <span class="text-sky-300 font-bold">95% CAPACITY</span></div>
            <div>SPEED: <span class="text-amber-300 font-bold">38 MPH</span></div>
            <div>UNIVERSE: <span class="text-rose-300 font-bold">${ghero.earthUniverse}</span></div>
          </div>
          
          <button id="fly-to-global-${ghero.id}" class="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-1.5 px-2 rounded-lg text-xs border border-white flex items-center justify-center space-x-1 cursor-pointer transition-colors shadow-[0_0_12px_#f43f5e]">
            <span>🎯 FLY CAMERA TO ${ghero.heroName.toUpperCase()}</span>
          </button>
        `;

        popupNode.querySelector(`#fly-to-global-${ghero.id}`)?.addEventListener('click', () => {
          useHeroStore.getState().setCameraLocked(false);
          flyToCoords(ghero.coords, 15.5);
        });

        const popup = new maplibregl.Popup({ offset: 16, closeButton: true })
          .setDOMContent(popupNode);

        marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat([ghero.coords[1], ghero.coords[0]])
          .setPopup(popup)
          .addTo(map);

        globalHeroMarkersRef.current.set(ghero.id, marker);
      }
    });

    // Handle zoom-based DOM marker visibility to avoid map clutter at low zoom
    const updateDOMMarkerVisibility = () => {
      const zoom = map.getZoom();
      globalHeroMarkersRef.current.forEach((marker) => {
        const el = marker.getElement();
        if (zoom < 3.2) {
          el.style.display = 'none';
        } else {
          el.style.display = 'flex';
        }
      });
    };

    updateDOMMarkerVisibility();
    map.on('zoom', updateDOMMarkerVisibility);

    return () => {
      map.off('zoom', updateDOMMarkerVisibility);
    };
  }, [isMapReady, flyToCoords]);

  // Destination Target Point Down Marker ("WHERE HE GOES NEXT")
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (currentMission) {
      if (!targetDestinationMarkerRef.current) {
        const el = document.createElement('div');
        el.className = 'relative flex flex-col items-center justify-center cursor-pointer pointer-events-auto';
        
        el.innerHTML = `
          <!-- Destination Header Badge -->
          <div class="mb-1 bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded border border-amber-900 shadow-2xl flex items-center space-x-1 uppercase tracking-wider font-mono">
            <span class="w-2 h-2 bg-rose-600 rounded-full animate-ping"></span>
            <span>NEXT DESTINATION</span>
          </div>

          <!-- Downward Pointing Target Pin -->
          <div class="relative flex flex-col items-center animate-bounce">
            <div class="w-10 h-10 rounded-full border-2 border-amber-400 bg-rose-950/80 flex items-center justify-center shadow-[0_0_20px_#f59e0b]">
              <svg class="w-6 h-6 stroke-amber-400 fill-none" viewBox="0 0 24 24" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
              </svg>
            </div>
            <div class="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-amber-400 -mt-0.5"></div>
          </div>

          <!-- Mission Title & ETA Badge -->
          <div class="mt-1 bg-slate-950/90 text-amber-300 text-[10px] px-2 py-0.5 rounded border border-amber-500/50 shadow font-cyber max-w-[180px] text-center truncate">
            ${currentMission.title} (ETA: ${currentMission.etaSeconds}s)
          </div>
        `;

        targetDestinationMarkerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat([currentMission.location[1], currentMission.location[0]])
          .addTo(map);
      } else {
        targetDestinationMarkerRef.current.setLngLat([currentMission.location[1], currentMission.location[0]]);
      }
    } else {
      if (targetDestinationMarkerRef.current) {
        targetDestinationMarkerRef.current.remove();
        targetDestinationMarkerRef.current = null;
      }
    }
  }, [currentMission]);

  // Update Tactical Emergency Units Markers
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    units.forEach((unit) => {
      if (!unitMarkersRef.current.has(unit.id)) {
        const el = document.createElement('div');
        el.className = 'w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-lg cursor-pointer transition-transform hover:scale-125 font-bold text-xs';
        
        if (unit.type === 'POLICE') {
          el.className += ' bg-amber-400 text-amber-950';
          el.innerText = 'P';
        } else if (unit.type === 'FIRE') {
          el.className += ' bg-orange-500 text-white';
          el.innerText = 'F';
        } else if (unit.type === 'HELICOPTER') {
          el.className += ' bg-cyan-500 text-slate-950 animate-bounce';
          el.innerText = 'H';
        } else {
          el.className += ' bg-emerald-400 text-emerald-950';
          el.innerText = 'M';
        }

        const popup = new maplibregl.Popup({ offset: 12 }).setHTML(`
          <div style="background:#0f172a; color:#e2e8f0; padding:8px; border-radius:6px; border:1px solid #334155; font-family:sans-serif; font-size:12px;">
            <strong style="color:#38bdf8;">${unit.name}</strong><br/>
            Callsign: ${unit.callsign}<br/>
            Status: ${unit.status}
          </div>
        `);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([unit.position[1], unit.position[0]])
          .setPopup(popup)
          .addTo(map);

        unitMarkersRef.current.set(unit.id, marker);
      } else {
        unitMarkersRef.current.get(unit.id)?.setLngLat([unit.position[1], unit.position[0]]);
      }
    });
  }, [units]);

  // Update Incident Markers across NYC (Red Spidey Sightings / Crime Signals 🔴)
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    const currentMissionIds = new Set(activeMissions.map(m => m.id));
    missionMarkersRef.current.forEach((marker, id) => {
      if (!currentMissionIds.has(id)) {
        marker.remove();
        missionMarkersRef.current.delete(id);
      }
    });

    activeMissions.forEach((mission) => {
      if (!missionMarkersRef.current.has(mission.id)) {
        const el = document.createElement('div');
        el.className = `relative flex flex-col items-center justify-center cursor-pointer group z-10 ${
          showRedIncidents ? 'block' : 'hidden'
        }`;
        
        const isCurrent = currentMission?.id === mission.id;

        // 🔴 Red Circular Spider Badge Pointer (Matching Reference SPIDEY TRACKER)
        el.innerHTML = `
          <!-- Location Label -->
          <div class="mb-1 bg-rose-950/95 text-rose-200 font-bold text-[9px] px-2 py-0.5 rounded-md border border-rose-500/60 shadow-xl flex items-center space-x-1 whitespace-nowrap font-mono group-hover:scale-110 transition-transform">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            <span>🔴 ${mission.title}</span>
          </div>

          <div class="relative flex items-center justify-center">
            <div class="absolute w-9 h-9 rounded-full ${isCurrent ? 'bg-rose-500' : 'bg-rose-600'} animate-ping opacity-80"></div>
            
            <div class="w-8.5 h-8.5 rounded-full border-2 border-slate-950 ${isCurrent ? 'bg-rose-600 border-white ring-2 ring-rose-400' : 'bg-rose-700'} p-0.5 flex items-center justify-center shadow-[0_0_15px_#f43f5e] group-hover:scale-125 transition-transform z-10 overflow-hidden">
              <img src="/logo.png" alt="Spidey Incident Logo" class="w-full h-full object-contain drop-shadow" />
            </div>

            <!-- Downward Pointer Arrow -->
            <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-rose-500 -mt-0.5"></div>
          </div>
        `;

        // PASSIVE OBSERVATION POPUP - NO DISPATCH BUTTONS
        const popupNode = document.createElement('div');
        popupNode.className = 'p-3 bg-slate-950 text-slate-100 rounded-xl border-2 border-rose-500/80 shadow-2xl font-cyber max-w-xs';
        popupNode.innerHTML = `
          <div class="flex items-center justify-between border-b border-rose-500/40 pb-1 mb-2">
            <span class="text-xs font-bold text-rose-400 uppercase tracking-wide">🔴 [${mission.borough}] ${mission.priority} INCIDENT</span>
            <span class="text-[10px] text-amber-400 font-mono">NYPD REPORTED</span>
          </div>
          <h4 class="font-bold text-sm text-cyan-200 mb-1">${mission.title}</h4>
          <p class="text-xs text-slate-300 mb-2">${mission.description}</p>
          <div class="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-tech">
            <span>District: ${mission.district}</span>
            <span>Est. ${mission.distanceKm} km away</span>
          </div>
          <div class="w-full bg-slate-900 p-2 rounded border border-rose-500/30 text-[10px] text-amber-300 italic text-center font-tech">
            ${isCurrent ? '⚡ SPIDER-MAN RESPONDING AUTONOMOUSLY' : '👁️ SPIDER-NET MONITORING INCIDENT'}
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 16, closeButton: true })
          .setDOMContent(popupNode);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([mission.location[1], mission.location[0]])
          .setPopup(popup)
          .addTo(map);

        missionMarkersRef.current.set(mission.id, marker);
      } else {
        const marker = missionMarkersRef.current.get(mission.id);
        if (marker) {
          const el = marker.getElement();
          if (showRedIncidents) el.classList.remove('hidden');
          else el.classList.add('hidden');
        }
      }
    });
  }, [activeMissions, currentMission, showRedIncidents]);

  // Handle map flyTo targets
  useEffect(() => {
    if (!mapRef.current || !mapFlyToTarget) return;
    mapRef.current.flyTo({
      center: [mapFlyToTarget.coords[1], mapFlyToTarget.coords[0]],
      zoom: mapFlyToTarget.zoom || 15.5,
      pitch: mapFlyToTarget.pitch || 50,
      speed: 1.2,
      curve: 1.4,
      essential: true
    });
    if (!isCameraLockedOnSpiderMan) {
      clearMapFlyToTarget();
    }
  }, [mapFlyToTarget, isCameraLockedOnSpiderMan, clearMapFlyToTarget]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full bg-slate-950" />

      {/* SMT_1 / SPIDER TRACK MARK 1 HUD Frame Overlay */}
      <div className="absolute inset-0 pointer-events-none border-[12px] border-slate-950/40 border-t-rose-500/20 border-b-rose-500/20 flex flex-col justify-between p-4">
        
        {/* Top Header Bar inside Map Overlay */}
        <div className="flex items-center justify-between w-full">
          {/* Left HUD Title - Hidden on small mobile to prevent overlap */}
          <div className="hidden md:flex items-center space-x-3 bg-slate-950/80 p-2 rounded-xl border border-rose-500/40 w-fit backdrop-blur">
            <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping" />
            <div className="flex flex-col font-pixel text-[9px] text-rose-300 tracking-widest">
              <span className="text-amber-400 font-bold">SMT_1</span>
              <span>SPIDER TRACK MARK 1</span>
            </div>
          </div>

          {/* Top Floating Map Controls (Free Move, Re-center, Zoom, Tilt, North) */}
          <div className="flex items-center space-x-1 sm:space-x-2 pointer-events-auto bg-slate-950/90 p-1 sm:p-1.5 rounded-xl border border-rose-500/50 shadow-2xl backdrop-blur-md ml-auto">
            {/* Mode Toggle Button */}
            <button
              onClick={toggleCameraLock}
              className={`flex items-center space-x-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg font-bold text-[10px] sm:text-xs transition-all cursor-pointer border ${
                isCameraLockedOnSpiderMan
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 hover:bg-rose-900 shadow-[0_0_12px_#f43f5e]'
                  : 'bg-emerald-950/80 border-emerald-500 text-emerald-300 hover:bg-emerald-900 shadow-[0_0_12px_#10b981]'
              }`}
              title={isCameraLockedOnSpiderMan ? 'Click to enable FREE MOVE mode' : 'Click to LOCK CAMERA onto Spider-Man'}
            >
              {isCameraLockedOnSpiderMan ? (
                <>
                  <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400 animate-pulse" />
                  <span>LOCKED</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
                  <span className="flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                    <span className="hidden xs:inline">FREE MOVE</span>
                    <span className="xs:hidden">FREE</span>
                  </span>
                </>
              )}
            </button>

            <div className="w-px h-3.5 sm:h-4 bg-slate-800" />

            {/* Re-center button */}
            <button
              onClick={centerMapOnHero}
              className="p-1 sm:px-2.5 sm:py-1.5 bg-slate-900 hover:bg-rose-950 text-slate-200 hover:text-white rounded-lg border border-slate-700 hover:border-rose-500 transition-all cursor-pointer text-[10px] sm:text-xs font-bold flex items-center space-x-1"
              title="Re-center view on Spider-Man's location"
            >
              <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
              <span className="hidden sm:inline">RE-CENTER</span>
            </button>

            {/* World Map View Button */}
            <button
              onClick={() => {
                useHeroStore.getState().setCameraLocked(false);
                mapRef.current?.flyTo({
                  center: [20, 20],
                  zoom: 2.2,
                  pitch: 0,
                  bearing: 0,
                  duration: 2000
                });
              }}
              className="p-1 sm:px-2.5 sm:py-1.5 bg-rose-950/90 hover:bg-rose-900 text-rose-300 hover:text-white rounded-lg border border-rose-500/80 transition-all cursor-pointer text-[10px] sm:text-xs font-bold flex items-center space-x-1 shadow-[0_0_12px_#f43f5e]"
              title="Fly to Global World Map View (See All Worldwide Spider-Heroes)"
            >
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-400 animate-pulse" />
              <span className="hidden sm:inline">WORLD VIEW</span>
            </button>

            {/* Zoom In */}
            <button
              onClick={() => mapRef.current?.zoomIn()}
              className="p-1 sm:p-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded-lg border border-slate-700 transition-all cursor-pointer"
              title="Zoom In (+)"
            >
              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>

            {/* Zoom Out */}
            <button
              onClick={() => mapRef.current?.zoomOut()}
              className="p-1 sm:p-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded-lg border border-slate-700 transition-all cursor-pointer"
              title="Zoom Out (-)"
            >
              <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>

            {/* Reset North & Pitch */}
            <button
              onClick={() => mapRef.current?.resetNorthPitch()}
              className="p-1 sm:p-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg border border-slate-700 transition-all cursor-pointer"
              title="Reset North & Pitch"
            >
              <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>

            {/* 3D / 2D perspective pitch toggle */}
            <button
              onClick={toggle3DMode}
              className={`px-1.5 py-1 sm:px-2 sm:py-1.5 rounded-lg border text-[10px] sm:text-xs font-mono font-bold transition-all cursor-pointer ${
                is3DMode 
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300' 
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Toggle 3D Tilt View"
            >
              <Box className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline mr-0.5 sm:mr-1" />
              <span>{is3DMode ? '3D' : '2D'}</span>
            </button>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-rose-500/20 rounded-full flex items-center justify-center animate-reticle opacity-40">
          <div className="w-24 h-24 border border-rose-400/30 rounded-full" />
          <div className="absolute w-px h-full bg-rose-500/20" />
          <div className="absolute h-px w-full bg-rose-500/20" />
        </div>

        <div className="flex items-center justify-between text-[10px] font-tech text-rose-300/90 bg-slate-950/80 px-3 py-1 rounded border border-rose-500/30 w-fit backdrop-blur">
          <span>LAT: {displayPos[0].toFixed(5)}</span>
          <span className="mx-2">|</span>
          <span>LNG: {displayPos[1].toFixed(5)}</span>
          <span className="mx-2">|</span>
          <span>ALT: {displayAltitude} FT</span>
        </div>
      </div>
    </div>
  );
};
