import { House } from "lucide-react";
import type { DoctorListing } from "@/lib/doctors";

export function DoctorsMap({ doctors, selectedId, onSelect }: { doctors: DoctorListing[]; selectedId: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[#EAF1F8] shadow-[0_8px_30px_-16px_rgba(30,41,59,.16)] lg:aspect-auto lg:min-h-[520px]">
      <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
        <path d="M-10 230 C80 200 140 250 230 215 S350 170 410 190 V310 H-10Z" fill="#CFE3F3" />
        <g fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round">
          <path d="M0 120 H400" /><path d="M210 0 V300" /><path d="M0 40 C120 60 200 20 400 70" /><path d="M60 0 C80 100 40 200 90 300" /><path d="M300 0 C280 120 340 200 320 300" />
        </g>
        <g fill="#D7E9DF"><rect x="250" y="130" width="70" height="55" rx="14" /><rect x="40" y="130" width="60" height="45" rx="14" /><rect x="120" y="20" width="60" height="40" rx="14" /></g>
        <g fill="none" stroke="#2563EB" strokeOpacity=".25" strokeDasharray="5 6" strokeWidth="1.5"><circle cx="224" cy="132" r="60" /><circle cx="224" cy="132" r="115" /></g>
      </svg>
      <span className="absolute left-[56%] top-[44%] -translate-x-1/2 -translate-y-1/2" style={{ left: "56%", top: "44%" }}>
        <span className="grid size-11 place-items-center rounded-full bg-night text-white ring-4 ring-white" title="Votre domicile"><House className="size-5" aria-label="Votre domicile" /></span>
      </span>
      {doctors.map((d) => {
        const on = d.id === selectedId;
        return (
          <button key={d.id} onClick={() => onSelect(d.id)} aria-label={`${d.name}, ${d.specialty}, à ${d.distanceKm} km`} aria-pressed={on}
            style={{ left: `${d.pin.x}%`, top: `${d.pin.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-2 text-sm font-bold shadow-lg ring-4 ring-white transition focus-visible:outline-none focus-visible:ring-primary/40 ${on ? "z-10 scale-110 bg-primary text-white" : "bg-white text-primary hover:scale-105"}`}>
            {d.initials}
          </button>
        );
      })}
      <p className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-muted backdrop-blur">Carte illustrative · à brancher sur Leaflet ou Google Maps</p>
    </div>
  );
}
