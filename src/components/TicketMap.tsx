import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_TOKEN } from '../services/mapboxConfig';
import type { Ticket } from '../types/tickets';

interface TicketMapProps {
  tickets: Ticket[];
}

// token seguro
mapboxgl.accessToken = MAPBOX_TOKEN;

export const TicketMap: React.FC<TicketMapProps> = ({ tickets }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-90.3801, 14.0833],
      zoom: 12
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    markers.current.forEach(m => m.remove());
    markers.current = [];

    tickets.forEach(t => {
      if (typeof t.lat === 'number' && typeof t.lng === 'number') {
        const marker = new mapboxgl.Marker({ color: '#3b82f6' })
          .setLngLat([t.lng, t.lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<strong>${t.empresa}</strong><br/>${t.sucursal}`
            )
          )
          .addTo(map.current!);

        markers.current.push(marker);
      }
    });
  }, [tickets]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[580px] rounded-xl overflow-hidden border border-slate-700 shadow-2xl"
    />
  );
};

export default TicketMap;