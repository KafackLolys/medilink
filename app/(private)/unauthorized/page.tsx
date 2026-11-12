"use client";

import { doctorCard, DoctorPageHeading } from "../components/doctor-ui";
import { useRouter } from "next/navigation";
import { authStore } from "@/store/auth-store";
import { useEffect } from "react";

export default function UnauthorizedPage() {
  const router = useRouter();
  const session = authStore.getState().session;

  useEffect(() => {
    if (session) {
      const home = {
        patient: "/patient",
        doctor: "/medecin",
        admin: "/admin",
      }[session.user.role as "patient" | "doctor" | "admin"];
      router.replace(home);
    }
  }, [session, router]);

  return (
    <div className="space-y-5">
      <DoctorPageHeading
        title="Accès non autorisé"
        description="Vous n'avez pas les droits pour accéder à cette page."
      />
      <div className={`${doctorCard} p-10 text-center`}>
        <p className="text-sm text-muted">
          Vous êtes connecté en tant que{" "}
          <span className="font-semibold">{session?.user.role ?? "inconnu"}</span>.
          Vous allez être redirigé vers votre espace personnel.
        </p>
      </div>
    </div>
  );
}
