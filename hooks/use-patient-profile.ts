"use client";

import { useCallback, useEffect, useState } from "react";
import {
  authService,
  type PatientProfileResponse,
} from "@/services/auth-service";

export function usePatientProfile() {
  const [profile, setProfile] = useState<PatientProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    let active = true;

    authService.getPatientProfile()
      .then((result) => {
        if (active) setProfile(result);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Impossible de charger votre profil.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  return { profile, loading, error, reload };
}
