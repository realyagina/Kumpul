import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { EventItem } from '../types';
import { Language, formatCurrency, isToday } from '../translations';
import { CATEGORY_COLORS } from '../data/seedData';
import { Crosshair, ZoomIn, ZoomOut } from 'lucide-react';

interface MapProps {
  events: EventItem[];
  selectedEvent: EventItem | null;
  onSelectEvent: (event: EventItem) => void;
  language: Language;
  activeRegion: 'all' | 'canggu' | 'ubud';
  // Pin picker mode for creating events
  isPickerMode?: boolean;
  pickerCoords?: { lat: number; lng: number } | null;
  onCoordsPicked?: (coords: { lat: number; lng: number }) => void;
  className?: string;
}

const REGION_COORDS = {
  all: { center: [-8.565, 115.195] as [number, number], zoom: 11 },
  canggu: { center: [-8.6548, 115.1325] as [number, number], zoom: 14 },
  ubud: { center: [-8.5088, 115.2570] as [number, number], zoom: 14 },
};

export const Map: React.FC<MapProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
  language,
  activeRegion,
  isPickerMode = false,
  pickerCoords = null,
  onCoordsPicked,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initial = REGION_COORDS[activeRegion];
    const map = L.map(mapContainerRef.current, {
      center: initial.center,
      zoom: initial.zoom,
      zoomControl: false,
      attributionControl: true,
    });

    // Friendly, clean OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;

    // Invalidate size after container settles
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Handle Region Navigation
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const target = REGION_COORDS[activeRegion];
    map.flyTo(target.center, target.zoom, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [activeRegion]);

  // 3. Handle Map Click for Picker Mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      if (isPickerMode && onCoordsPicked) {
        onCoordsPicked({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    };

    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [isPickerMode, onCoordsPicked]);

  // 4. Update Picker Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (isPickerMode && pickerCoords) {
      if (!pickerMarkerRef.current) {
        const pickerIcon = L.divIcon({
          className: 'custom-picker-pin',
          html: `
            <div style="transform: translate(-50%, -100%);">
              <div style="background-color: #FF8A3D; color: white; border-radius: 9999px; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 15px -3px rgba(255, 138, 61, 0.4); border: 3px solid white; font-weight: bold; font-size: 18px;">
                📍
              </div>
              <div style="width: 2px; height: 10px; background: #FF8A3D; margin: 0 auto;"></div>
            </div>
          `,
          iconSize: [38, 48],
          iconAnchor: [19, 48],
        });

        pickerMarkerRef.current = L.marker([pickerCoords.lat, pickerCoords.lng], {
          icon: pickerIcon,
          draggable: true,
        }).addTo(map);

        pickerMarkerRef.current.on('dragend', (ev) => {
          const latlng = ev.target.getLatLng();
          if (onCoordsPicked) {
            onCoordsPicked({ lat: latlng.lat, lng: latlng.lng });
          }
        });
      } else {
        pickerMarkerRef.current.setLatLng([pickerCoords.lat, pickerCoords.lng]);
      }
    } else if (pickerMarkerRef.current) {
      pickerMarkerRef.current.remove();
      pickerMarkerRef.current = null;
    }
  }, [isPickerMode, pickerCoords, onCoordsPicked]);

  // 5. Update Event Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers that no longer exist
    const currentEventIds = new Set(events.map((e) => e.id));
    Object.keys(markersRef.current).forEach((id) => {
      if (!currentEventIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Add / Update markers
    events.forEach((event) => {
      const isSelected = selectedEvent?.id === event.id;
      const categoryConfig = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other;
      const happeningToday = isToday(event.date);
      const priceText = formatCurrency(event.price, language);

      const htmlContent = `
        <div class="kumpul-map-marker ${isSelected ? 'is-active' : ''}" style="transform: translate(-50%, -100%); position: relative;">
          ${
            happeningToday
              ? `<div style="position: absolute; top: -5px; right: -5px; width: 14px; height: 14px; background-color: #FF8A3D; border: 2px solid white; border-radius: 9999px; z-index: 10; animation: pulse-subtle 2s infinite;"></div>`
              : ''
          }
          <div style="display: flex; flex-direction: column; align-items: center;">
            <!-- Price pill top -->
            <div style="background-color: ${isSelected ? '#1F2937' : 'white'}; color: ${isSelected ? 'white' : '#1F2937'}; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid ${isSelected ? '#1F2937' : '#E5E7EB'}; margin-bottom: 2px; white-space: nowrap; font-family: 'Plus Jakarta Sans', sans-serif;">
              ${priceText}
            </div>
            
            <!-- Pin Head -->
            <div style="width: 38px; height: 38px; background-color: ${categoryConfig.pinBg}; border-radius: 9999px; border: 3px solid white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; font-size: 16px; color: white; transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'}; transition: transform 0.2s;">
              ${categoryConfig.emoji}
            </div>

            <!-- Pin Stem Point -->
            <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid ${categoryConfig.pinBg}; margin-top: -1px;"></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker-wrap',
        html: htmlContent,
        iconSize: [60, 60],
        iconAnchor: [30, 60],
      });

      if (markersRef.current[event.id]) {
        markersRef.current[event.id].setIcon(customIcon);
        markersRef.current[event.id].setLatLng([event.lat, event.lng]);
      } else {
        const marker = L.marker([event.lat, event.lng], { icon: customIcon }).addTo(map);

        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          onSelectEvent(event);
        });

        markersRef.current[event.id] = marker;
      }

      // Bring active marker to front
      if (isSelected && markersRef.current[event.id]) {
        markersRef.current[event.id].setZIndexOffset(1000);
      } else if (markersRef.current[event.id]) {
        markersRef.current[event.id].setZIndexOffset(0);
      }
    });
  }, [events, selectedEvent, language, onSelectEvent]);

  // 6. Center on selected event when changed
  useEffect(() => {
    if (!selectedEvent || !mapInstanceRef.current) return;
    mapInstanceRef.current.panTo([selectedEvent.lat, selectedEvent.lng], {
      animate: true,
      duration: 0.8,
    });
  }, [selectedEvent]);

  // Zoom controls helper
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleCenterAll = () => {
    const target = REGION_COORDS[activeRegion];
    mapInstanceRef.current?.flyTo(target.center, target.zoom);
  };

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Map Controls */}
      <div className="absolute right-3.5 bottom-6 z-20 flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden flex flex-col">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2.5 text-gray-700 hover:text-[#0F9D8A] hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2.5 text-gray-700 hover:text-[#0F9D8A] hover:bg-gray-50 active:bg-gray-100 transition-colors"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleCenterAll}
          className="p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/80 text-gray-700 hover:text-[#0F9D8A] hover:bg-gray-50 active:bg-gray-100 transition-colors"
          title="Re-center Area"
          aria-label="Re-center map"
        >
          <Crosshair className="w-5 h-5" />
        </button>
      </div>

      {/* Coordinate Picker Helper Banner */}
      {isPickerMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-[#FF8A3D] text-xs font-bold text-gray-800 flex items-center gap-2 animate-bounce">
          <span className="text-base">📍</span>
          <span>Klik di mana saja pada peta untuk menentukan titik kumpul</span>
        </div>
      )}
    </div>
  );
};
