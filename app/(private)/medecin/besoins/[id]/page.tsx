import { Suspense } from "react";
import { doctorCard } from "../../../components/doctor-ui";
import DoctorNeedDetailPage from "./detail-client";

export default function Page({
  params,
}: PageProps<"/medecin/besoins/[id]">) {
  return (
    <Suspense fallback={<div className={`${doctorCard} mx-auto max-w-4xl p-8 text-center text-muted`}>Chargement du besoin…</div>}>
      <DoctorNeedDetailRoute params={params} />
    </Suspense>
  );
}

async function DoctorNeedDetailRoute({
  params,
}: {
  params: PageProps<"/medecin/besoins/[id]">["params"];
}) {
  const { id } = await params;
  return <DoctorNeedDetailPage id={id} />;
}
