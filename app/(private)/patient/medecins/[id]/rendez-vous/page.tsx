import { DOCTORS } from "@/lib/doctors";
import { notFound } from "next/navigation";
import AppointmentBookingForm from "./appointment-booking-form";

export function generateStaticParams() {
  return DOCTORS.map(({ id }) => ({ id }));
}

export default async function BookAppointmentPage({ params }: PageProps<"/patient/medecins/[id]/rendez-vous">) {
  const { id } = await params;
  const doctor = DOCTORS.find((item) => item.id === id);
  if (!doctor) notFound();

  return <AppointmentBookingForm doctor={doctor} />;
}
