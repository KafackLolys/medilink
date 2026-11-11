import { Suspense } from "react";
import RequestEditForm from "./request-edit-form";

export default function EditPatientRequestPage({
  params,
}: PageProps<"/patient/demandes/[id]/modifier">) {
  return (
    <Suspense fallback={<p role="status" className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center text-muted">Chargement de la demande…</p>}>
      <EditPatientRequestRoute params={params} />
    </Suspense>
  );
}

async function EditPatientRequestRoute({
  params,
}: {
  params: PageProps<"/patient/demandes/[id]/modifier">["params"];
}) {
  const { id } = await params;
  return <RequestEditForm id={id} />;
}
