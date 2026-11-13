"use client";

import { useEffect, useState } from "react";
import { appointmentService, type PatientAppointment } from "@/services/appointment-service";
import { PatientReviewForm } from "../../rendez-vous/[id]/patient-review-form";

/** An appointment, rather than a doctor's public profile, is the review authority. */
export function DoctorRatingSection({ doctorId }: { doctorId: string }) {
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    appointmentService.listMine()
      .then((items) => {
        if (!active) return;
        const completed = items
          .filter((appointment) => appointment.doctor.id === doctorId && appointment.status === "completed")
          .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));
        setAppointments(completed);
        setSelectedId((previous) => completed.some((item) => item.id === previous)
          ? previous : (completed[0]?.id ?? ""));
        setError(null);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Impossible de charger vos consultations.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [doctorId, retry]);

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm" aria-label="Noter ce médecin">
      <h2 className="text-lg font-extrabold text-night">Noter ce médecin</h2>
      <p className="mt-1 text-sm text-muted">
        Vous pouvez publier un avis après une consultation terminée avec ce médecin.
        Un seul avis est autorisé par rendez-vous.
      </p>
      {loading ? (
        <p role="status" className="mt-4 text-sm text-muted">Vérification de vos consultations…</p>
      ) : error ? (
        <div className="mt-4 text-sm text-rose-700" role="alert">
          {error}{" "}
          <button type="button" className="font-semibold underline" onClick={() => { setLoading(true); setRetry((n) => n + 1); }}>
            Réessayer
          </button>
        </div>
      ) : appointments.length === 0 ? (
        <p className="mt-4 rounded-xl bg-surface p-4 text-sm text-muted">
          Vous pourrez donner une note ici après votre première consultation terminée avec ce médecin.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {appointments.length > 1 && (
            <label className="block text-sm font-semibold text-ink">
              Consultation à évaluer
              <select className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3"
                value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
                {appointments.map((appointment) => (
                  <option key={appointment.id} value={appointment.id}>
                    {new Date(appointment.scheduledAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </option>
                ))}
              </select>
            </label>
          )}
          {selectedId && <PatientReviewForm key={selectedId} appointmentId={selectedId} />}
        </div>
      )}
    </section>
  );
}
