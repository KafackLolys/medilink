import { Suspense } from "react";
import AppointmentBookingForm from "./appointment-booking-form";

export default function BookAppointmentPage({
  params,
}: PageProps<"/patient/medecins/[id]/rendez-vous">) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center text-muted">Chargement du médecin…</div>}>
      <AppointmentBookingRoute params={params} />
    </Suspense>
  );
}

async function AppointmentBookingRoute({
  params,
}: {
  params: PageProps<"/patient/medecins/[id]/rendez-vous">["params"];
}) {
  const { id } = await params;
  return <AppointmentBookingForm doctorId={id} />;
}
