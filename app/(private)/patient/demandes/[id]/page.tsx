import { Suspense } from "react";
import PatientRequestDetail from "./request-detail";

export default function PatientRequestDetailPage({
  params,
}: PageProps<"/patient/demandes/[id]">) {
  return (
    <Suspense fallback={<p role="status" className="rounded-3xl bg-white p-8 text-center text-muted">Chargement de la demande…</p>}>
      <PatientRequestDetailRoute params={params} />
    </Suspense>
  );
}

async function PatientRequestDetailRoute({
  params,
}: {
  params: PageProps<"/patient/demandes/[id]">["params"];
}) {
  const { id } = await params;
  return <PatientRequestDetail id={id} />;
}
