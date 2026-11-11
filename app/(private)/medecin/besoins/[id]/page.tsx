import { Suspense } from "react";
import { doctorCard } from "../../../components/doctor-ui";
import { DOCTOR_NEEDS } from "@/lib/doctor-portal-data";
import DoctorNeedDetailPage from "./detail-client";

export function generateStaticParams() {
  return DOCTOR_NEEDS.map(({ id }) => ({ id }));
}

export default async function Page({ params }: PageProps<"/medecin/besoins/[id]">) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className={`${doctorCard} mx-auto max-w-4xl p-8 text-center text-muted`}>Chargement du besoin…</div>}>
      <DoctorNeedDetailPage id={id} />
    </Suspense>
  );
}
