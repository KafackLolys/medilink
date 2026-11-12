import { Suspense } from "react";
import DoctorProfileClient from "./doctor-profile-client";

export default function DoctorProfilePage({
  params,
}: PageProps<"/patient/medecins/[id]">) {
  return (
    <Suspense fallback={<div className="rounded-3xl bg-white p-8 text-center text-muted">Chargement du profil…</div>}>
      <DoctorProfileRoute params={params} />
    </Suspense>
  );
}

async function DoctorProfileRoute({
  params,
}: {
  params: PageProps<"/patient/medecins/[id]">["params"];
}) {
  const { id } = await params;
  return <DoctorProfileClient id={id} />;
}
