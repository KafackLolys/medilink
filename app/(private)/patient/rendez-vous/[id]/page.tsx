import { Suspense } from "react";
import AppointmentDetailClient from "./appointment-detail-client";

export default function AppointmentDetailPage({
  params,
}: PageProps<"/patient/rendez-vous/[id]">) {
  return (
    <Suspense fallback={<div className="rounded-3xl bg-white p-8 text-center text-muted">Chargement du rendez-vous…</div>}>
      <AppointmentDetailRoute params={params} />
    </Suspense>
  );
}

async function AppointmentDetailRoute({
  params,
}: {
  params: PageProps<"/patient/rendez-vous/[id]">["params"];
}) {
  const { id } = await params;
  return <AppointmentDetailClient id={id} />;
}
