import type { DoctorDirectoryItem } from "@/services/doctor-service";

const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const shortDays = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];

export type BookableWindow = {
  date: string;
  label: string;
  startTime: string;
  endTime: string;
};

function minutes(time: string): number {
  if (!/^\d{2}:\d{2}$/.test(time)) return Number.NaN;
  const [hour, minute] = time.split(":").map(Number);
  return hour < 24 && minute < 60 ? hour * 60 + minute : Number.NaN;
}
function time(minutesFromMidnight: number): string {
  return `${String(Math.floor(minutesFromMidnight / 60)).padStart(2, "0")}:${String(minutesFromMidnight % 60).padStart(2, "0")}`;
}
function dateKey(day: Date): string {
  return `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
}

/** Earliest plausible slot within 30 days, excluding inactive weekdays and blocked dates.
 * Existing appointments are not in the directory response: final confirmation is server-side.
 */
export function nextBookableWindow(doctor: DoctorDirectoryItem, now = new Date()): BookableWindow | null {
  if (!doctor.modes?.length || !doctor.availability?.length) return null;
  const blocked = new Set(doctor.blockedDates ?? []);
  const duration = doctor.appointmentDurationMinutes ?? 30;
  if (!Number.isFinite(duration) || duration <= 0) return null;
  for (let offset = 0; offset < 30; offset += 1) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const date = dateKey(day);
    if (blocked.has(date)) continue;
    const weekday = weekdays[day.getDay()];
    const candidates = doctor.availability.filter((slot) => slot.isAvailable && slot.weekday === weekday)
      .map((slot) => ({ from: minutes(slot.startTime), to: minutes(slot.endTime) }))
      .filter((slot) => Number.isFinite(slot.from) && Number.isFinite(slot.to) && slot.to > slot.from)
      .sort((a, b) => a.from - b.from);
    for (const slot of candidates) {
      // 15 minute increments, with exact slot start if it is not on a quarter-hour.
      let first = slot.from;
      if (offset === 0) {
        const nowMinutes = now.getHours() * 60 + now.getMinutes() + (now.getSeconds() > 0 ? 1 : 0);
        if (first < nowMinutes) first = slot.from + Math.ceil((nowMinutes - slot.from) / 15) * 15;
      }
      if (first + duration <= slot.to) {
        const label = `${shortDays[day.getDay()]} ${day.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`;
        return { date, label, startTime: time(first), endTime: time(first + duration) };
      }
    }
  }
  return null;
}
