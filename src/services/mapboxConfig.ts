import mapboxgl from 'mapbox-gl';

// Token SOLO desde .env
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;

// Inicializador seguro del mapa
export const initMap = (
  container: HTMLElement,
  style: string,
  center: [number, number],
  zoom: number
) => {
  mapboxgl.accessToken = MAPBOX_TOKEN;

  return new mapboxgl.Map({
    container,
    style,
    center,
    zoom
  });
};