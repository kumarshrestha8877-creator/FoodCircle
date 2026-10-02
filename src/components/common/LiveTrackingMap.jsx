import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Play,
  Pause,
  RotateCcw,
  Navigation2,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Layers,
  Map as MapIcon,
  Globe,
} from 'lucide-react';

// Realistic route waypoints between Salt Lake Sector V and Park Circus 7-Point, Kolkata
const DEFAULT_ROUTE_COORDS = [
  [22.5804, 88.4378], // Sector V Aroma Kitchen
  [22.5762, 88.4285], // Salt Lake Bypass Road
  [22.5701, 88.4112], // Chingrighata Flyover
  [22.5585, 88.4005], // EM Bypass near Science City
  [22.5492, 88.3880], // Park Circus Connector
  [22.5458, 88.3762], // Bridge No. 4
  [22.5435, 88.3685], // Park Circus 7-Point Customer Destination
];

// Helper to interpolate along route waypoints
function getPointAtProgress(waypoints, progress) {
  if (!waypoints || waypoints.length === 0) return [22.5804, 88.4378];
  if (progress <= 0) return waypoints[0];
  if (progress >= 1) return waypoints[waypoints.length - 1];

  const totalSegments = waypoints.length - 1;
  const targetIndex = progress * totalSegments;
  const index = Math.floor(targetIndex);
  const remainder = targetIndex - index;

  if (index >= totalSegments) return waypoints[totalSegments];

  const p1 = waypoints[index];
  const p2 = waypoints[index + 1];

  const lat = p1[0] + (p2[0] - p1[0]) * remainder;
  const lng = p1[1] + (p2[1] - p1[1]) * remainder;
  return [lat, lng];
}

export default function LiveTrackingMap({
  order,
  onProgressUpdate,
  onDeliveryReached,
  interactive = true,
  height = '420px',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const polylineRef = useRef(null);
  const routePointsRef = useRef(DEFAULT_ROUTE_COORDS);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(order?.trackingProgress || 0.4);
  const [gpsMode, setGpsMode] = useState('demo'); // 'demo' or 'live'
  const [liveGpsCoords, setLiveGpsCoords] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('Idle');
  const [mapLayerType, setMapLayerType] = useState('google'); // 'google', 'satellite', 'osm'
  const [showEmbeddedGoogleMap, setShowEmbeddedGoogleMap] = useState(false);

  const isDelivered = order?.statusCode === 9 || currentProgress >= 0.98;

  // Build route points based on order pickup and destination
  useEffect(() => {
    if (order?.pickupCoords && order?.destinationCoords) {
      const start = [order.pickupCoords.lat, order.pickupCoords.lng];
      const end = [order.destinationCoords.lat, order.destinationCoords.lng];
      // Generate midpoint bends along Kolkata traffic arterial routes
      const mid1 = [start[0] * 0.7 + end[0] * 0.3 + 0.005, start[1] * 0.7 + end[1] * 0.3 - 0.008];
      const mid2 = [start[0] * 0.4 + end[0] * 0.6 - 0.003, start[1] * 0.4 + end[1] * 0.6 + 0.005];
      routePointsRef.current = [start, mid1, mid2, end];
    } else {
      routePointsRef.current = DEFAULT_ROUTE_COORDS;
    }
  }, [order?.pickupCoords, order?.destinationCoords]);

  // Tile layer URLs: Zero watermark, high-definition Google Maps & OpenStreetMap
  const getTileLayerUrl = (type) => {
    if (type === 'google') {
      // Google Maps Roadmap tile server (clean, crisp, no API key watermark)
      return 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
    }
    if (type === 'satellite') {
      // Google Maps Satellite / Hybrid with roads
      return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    }
    // Standard OpenStreetMap
    return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix default marker icon assets in Leaflet
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const waypoints = routePointsRef.current;
    const initialPos = getPointAtProgress(waypoints, currentProgress);

    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      attributionControl: false,
    }).setView(initialPos, 13);

    // Initial Google Maps Roadmap tile layer (ZERO watermark)
    const initialTile = L.tileLayer(getTileLayerUrl('google'), {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);
    tileLayerRef.current = initialTile;

    // 1. Pickup Marker (Store/Restaurant)
    const pickupIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div class="flex items-center justify-center w-10 h-10 bg-emerald-600 text-white rounded-full shadow-lg border-2 border-white transform hover:scale-110 transition-transform">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    L.marker(waypoints[0], { icon: pickupIcon })
      .addTo(map)
      .bindPopup(`<b>Pickup Location:</b><br/>${order?.pickupLocation || 'Food Provider'}`);

    // 2. Destination Marker (Customer Home)
    const destIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `
        <div class="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg border-2 border-white transform hover:scale-110 transition-transform">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    L.marker(waypoints[waypoints.length - 1], { icon: destIcon })
      .addTo(map)
      .bindPopup(`<b>Customer Destination:</b><br/>${order?.destination || 'Customer Address'}`);

    // 3. Route Polyline
    const polyline = L.polyline(waypoints, {
      color: '#059669',
      weight: 5,
      opacity: 0.9,
      dashArray: '8, 8',
    }).addTo(map);
    polylineRef.current = polyline;

    // 4. Moving Volunteer/Rider Marker with Radar Beacon
    const riderIcon = L.divIcon({
      className: 'custom-rider-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-12 h-12 bg-emerald-500 rounded-full opacity-40 pulsing-radar"></div>
          <div class="relative z-10 flex items-center justify-center w-11 h-11 bg-emerald-700 text-white rounded-full shadow-2xl border-2 border-white">
            <svg class="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div class="absolute -bottom-6 bg-slate-900 text-white font-semibold text-[10px] px-2 py-0.5 rounded-full shadow whitespace-nowrap">
            ${order?.volunteerName ? order.volunteerName.split(' ')[0] : 'Rider'} ⚡
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const riderMarker = L.marker(initialPos, { icon: riderIcon, zIndexOffset: 1000 }).addTo(map);
    riderMarkerRef.current = riderMarker;

    // Fit bounds to show route nicely
    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Update map layer when user switches to Google Maps / Satellite / OSM
  const switchMapLayer = (type) => {
    setMapLayerType(type);
    if (!mapInstanceRef.current) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newLayer = L.tileLayer(getTileLayerUrl(type), {
      maxZoom: 20,
      subdomains: type === 'osm' ? ['a', 'b', 'c'] : ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  };

  // Sync rider position whenever currentProgress updates
  useEffect(() => {
    if (!riderMarkerRef.current || !mapInstanceRef.current) return;
    const waypoints = routePointsRef.current;
    const pos = getPointAtProgress(waypoints, currentProgress);
    riderMarkerRef.current.setLatLng(pos);

    if (onProgressUpdate) {
      onProgressUpdate(currentProgress, { lat: pos[0], lng: pos[1] });
    }

    if (currentProgress >= 0.98 && onDeliveryReached) {
      onDeliveryReached();
    }
  }, [currentProgress]);

  // Smooth automatic demo movement loop
  useEffect(() => {
    let interval = null;
    if (isPlaying && gpsMode === 'demo') {
      interval = setInterval(() => {
        setCurrentProgress((prev) => {
          if (prev >= 1.0) {
            setIsPlaying(false);
            if (onDeliveryReached) onDeliveryReached();
            return 1.0;
          }
          return Math.min(1.0, prev + 0.025);
        });
      }, 600);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, gpsMode]);

  // Real browser geolocation tracking toggle
  const enableRealGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setGpsStatus('Requesting browser GPS permission...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLiveGpsCoords({ lat: latitude, lng: longitude });
        setGpsMode('live');
        setGpsStatus(`Connected to GPS: ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`);

        if (riderMarkerRef.current && mapInstanceRef.current) {
          riderMarkerRef.current.setLatLng([latitude, longitude]);
          mapInstanceRef.current.panTo([latitude, longitude]);
        }
      },
      (error) => {
        setGpsStatus(`GPS error: ${error.message}. Kept on Demo Tracking.`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const resetRoute = () => {
    setCurrentProgress(0);
    setIsPlaying(false);
    setGpsMode('demo');
    if (riderMarkerRef.current && mapInstanceRef.current) {
      const waypoints = routePointsRef.current;
      riderMarkerRef.current.setLatLng(waypoints[0]);
      mapInstanceRef.current.setView(waypoints[0], 14);
    }
  };

  // Open Direct Turn-by-Turn Navigation in Google Maps
  const openInGoogleMaps = () => {
    const pickupLat = order?.pickupCoords?.lat || 22.5804;
    const pickupLng = order?.pickupCoords?.lng || 88.4378;
    const destLat = order?.destinationCoords?.lat || 22.5435;
    const destLng = order?.destinationCoords?.lng || 88.3685;

    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${pickupLat},${pickupLng}&destination=${destLat},${destLng}&travelmode=driving`;
    window.open(gmapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-md">
      {/* Map Viewport or Embedded Google Map View */}
      {!showEmbeddedGoogleMap ? (
        <div ref={mapContainerRef} style={{ height }} className="w-full" />
      ) : (
        <div style={{ height }} className="w-full bg-slate-100 relative">
          <iframe
            title="Google Maps Live Route"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${order?.pickupCoords?.lat || 22.5804},${order?.pickupCoords?.lng || 88.4378}&z=14&output=embed`}
          />
        </div>
      )}

      {/* Floating Status & Google Maps Header */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/80 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-slate-800">
            {isDelivered
              ? 'Food Delivered Successfully ✓'
              : currentProgress >= 0.8
              ? 'Arriving at Destination'
              : 'Food in Transit'}
          </span>
          <span className="hidden sm:inline-block text-slate-400">•</span>
          <span className="text-slate-600 hidden sm:inline-block">
            Rider: <strong className="text-slate-800">{order?.volunteerName || 'Rahul Sharma'}</strong>
          </span>
        </div>

        {/* Map Layer Switcher & Google Maps Access Action */}
        <div className="flex items-center gap-1.5">
          {/* Map Layer Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold">
            <button
              onClick={() => switchMapLayer('google')}
              className={`px-2 py-0.5 rounded-md transition ${
                mapLayerType === 'google'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Google Maps Roadmap (Clean, No Watermark)"
            >
              Google Maps
            </button>
            <button
              onClick={() => switchMapLayer('satellite')}
              className={`px-2 py-0.5 rounded-md transition ${
                mapLayerType === 'satellite'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Google Satellite Hybrid"
            >
              Satellite
            </button>
            <button
              onClick={() => switchMapLayer('osm')}
              className={`px-2 py-0.5 rounded-md transition ${
                mapLayerType === 'osm'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="OpenStreetMap"
            >
              OSM
            </button>
          </div>

          {/* External Google Maps Button */}
          <button
            onClick={openInGoogleMaps}
            className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold shadow-xs transition"
            title="Open Turn-by-Turn Navigation in Google Maps App"
          >
            <span>Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Live Rider Telemetry & Navigation Controls */}
      {interactive && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Telemetry Progress & Play/Pause */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <button
              onClick={() => {
                setGpsMode('demo');
                setIsPlaying(!isPlaying);
              }}
              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition flex items-center gap-1 px-2.5 font-medium cursor-pointer"
              title={isPlaying ? 'Pause Movement' : 'Play Live Rider Telemetry'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Live Movement'}</span>
            </button>

            <button
              onClick={resetRoute}
              className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition"
              title="Reset Rider to Pickup"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="flex-1 flex items-center gap-2 px-1">
              <span className="text-[11px] text-slate-500 font-medium">Pickup</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={currentProgress}
                onChange={(e) => {
                  setGpsMode('demo');
                  setIsPlaying(false);
                  const val = parseFloat(e.target.value);
                  setCurrentProgress(val);
                  if (val >= 0.98 && onDeliveryReached) {
                    onDeliveryReached();
                  }
                }}
                className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <span className="text-[11px] text-slate-500 font-medium">Customer</span>
            </div>
            <span className="font-mono text-emerald-700 font-bold text-xs min-w-[36px] text-right">
              {Math.round(currentProgress * 100)}%
            </span>
          </div>

          {/* Quick Handover / Deliver Action Button */}
          <div className="flex items-center gap-2">
            {!isDelivered ? (
              <button
                onClick={() => {
                  setCurrentProgress(1.0);
                  if (onDeliveryReached) onDeliveryReached();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-sm transition animate-pulse"
                title="Complete Delivery Handover immediately"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Delivered ✓</span>
              </button>
            ) : (
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Delivered Successfully ✓
              </span>
            )}

            <button
              onClick={enableRealGps}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-medium transition"
              title="Switch to Real Browser Geolocation"
            >
              <Navigation2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Use Real GPS</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
