import React, { useEffect, useRef } from 'react';
import { Location } from '../../types';

declare const L: any;

export interface MarkerInfo {
  position: Location;
  popupContent?: string;
  type: 'driver' | 'pickup' | 'dropoff' | 'customer_live';
}

const createIcon = (type: MarkerInfo['type']) => {
    let iconHtml: string;
    let iconSize: [number, number] = [36, 36];
    let className = 'bg-white rounded-full p-1 shadow-lg';

    switch (type) {
        case 'driver':
            iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-navigation text-primary-blue"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`;
            className = 'bg-primary-blue text-white rounded-full p-2 shadow-lg transform -rotate-45';
            iconSize = [40, 40];
            break;
        case 'pickup':
            iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin text-neutral-dark-gray"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
            break;
        case 'dropoff':
             iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flag text-primary-green"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`;
            break;
        case 'customer_live':
            iconHtml = `<div class="relative w-full h-full flex items-center justify-center">
                <div class="absolute inset-0 bg-primary-blue opacity-40 rounded-full animate-ping"></div>
                <div class="relative w-4 h-4 bg-primary-blue border-2 border-white rounded-full shadow-lg"></div>
            </div>`;
            className = '';
            iconSize = [32, 32];
            break;
    }
    
    return L.divIcon({
        html: `<div class="flex items-center justify-center" style="width:${iconSize[0]}px;height:${iconSize[1]}px;">${iconHtml}</div>`,
        className: className,
        iconSize: iconSize,
        iconAnchor: [iconSize[0] / 2, iconSize[1] / 2],
        popupAnchor: [0, -iconSize[1] / 2]
    });
};

const Map: React.FC<MapProps> = ({ center, zoom, markers = [], route }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routeRef = useRef<any>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, { zoomControl: false }).setView([center.lat, center.lng], zoom);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      mapRef.current = map;
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      markers.forEach(markerInfo => {
        const icon = createIcon(markerInfo.type);
        const marker = L.marker([markerInfo.position.lat, markerInfo.position.lng], { icon }).addTo(mapRef.current);
        if (markerInfo.popupContent) {
          marker.bindPopup(markerInfo.popupContent);
        }
        markersRef.current.push(marker);
      });
      
      if (markers.length > 0) {
        const bounds = L.latLngBounds(markers.map(m => [m.position.lat, m.position.lng]));
        mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }
    }
  }, [markers]);
  
  useEffect(() => {
    if(mapRef.current) {
        if(routeRef.current) {
            routeRef.current.remove();
        }
        if(route) {
            const latlngs = [
                [route[0].lat, route[0].lng],
                [route[1].lat, route[1].lng],
            ];
            routeRef.current = L.polyline(latlngs, {color: '#2563EB', weight: 4, opacity: 0.6, dashArray: '10, 10'}).addTo(mapRef.current);
        }
    }
  }, [route]);

  return <div ref={mapContainerRef} className="w-full h-full z-0" />;
};

interface MapProps {
  center: Location;
  zoom: number;
  markers?: MarkerInfo[];
  route?: [Location, Location];
}

export default Map;