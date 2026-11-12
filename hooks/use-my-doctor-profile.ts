"use client";

import { useEffect, useState } from "react";
import {
  doctorService,
  type DoctorOwnProfile,
} from "@/services/doctor-service";

export function useMyDoctorProfile() {
  const [result, setResult] = useState<DoctorOwnProfile | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    doctorService
      .myProfile()
      .then((profile) => {
        if (active) setResult(profile);
      })
      .catch((cause: unknown) => {
        if (active) {
          setFailure(
            cause instanceof Error
              ? cause.message
              : "Impossible de charger votre profil médecin.",
          );
        }
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  return {
    profile: result,
    loading: !result && !failure,
    error: failure,
    reload: () => {
      setFailure(null);
      setResult(null);
      setReloadKey((key) => key + 1);
    },
  };
}
