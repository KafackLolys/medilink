"use client";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

export type GeoMapPoint = { id: string; title: string; latitude: number; longitude: number; href: string };
export function GeoMap({ points, emptyMessage }: { points: GeoMapPoint[]; emptyMessage: string }) {
  const node = useRef<HTMLDivElement>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const markersKey = JSON.stringify(points.filter(p => Number.isFinite(p.latitude) && Number.isFinite(p.longitude) && Math.abs(p.latitude) <= 90 && Math.abs(p.longitude) <= 180));
  const valid: GeoMapPoint[] = JSON.parse(markersKey);
  useEffect(() => {
    const located: GeoMapPoint[] = JSON.parse(markersKey);
    if (!node.current || located.length === 0) return;
    let cancelled = false;
    let map: import("leaflet").Map | null = null;
    void import("leaflet").then(L => {
      if (cancelled || !node.current) return;
      map = L.map(node.current).setView([located[0].latitude, located[0].longitude], 12);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);
      const bounds = L.latLngBounds([]);
      for (const point of located) {
        const pos: [number, number] = [point.latitude, point.longitude];
        bounds.extend(pos);
        const anchor = document.createElement("a");
        anchor.href = point.href;
        anchor.textContent = point.title;
        anchor.className = "font-semibold text-primary underline";
        L.circleMarker(pos, { radius: 9, color: "#1d4ed8", fillOpacity: 0.8 })
          .bindPopup(anchor).addTo(map);
      }
      if (located.length > 1) map.fitBounds(bounds.pad(0.25));
    }).catch(() => { if (!cancelled) setFailure("Carte indisponible. Utilisez la liste."); });
    return () => { cancelled = true; map?.remove(); };
  // Stable serialized point signature avoids unnecessary reinitializations.
  }, [markersKey]);
  if (valid.length === 0) return <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-muted">{emptyMessage}</div>;
  return <section aria-label="Carte des zones publiques" className="space-y-2">
    {failure && <p role="alert" className="text-sm text-rose-700">{failure}</p>}
    <div ref={node} className="h-[420px] w-full overflow-hidden rounded-3xl" />
    <p className="text-xs text-muted">Localisations approximatives des quartiers, jamais les adresses privées des patients. Fond de carte OpenStreetMap.</p>
  </section>;
}
