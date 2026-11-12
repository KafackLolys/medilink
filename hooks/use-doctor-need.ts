"use client";

import { useEffect, useState } from "react";
import {
  needService,
  type DoctorNeedDetail,
} from "@/services/need-service";

export function useDoctorNeed(id: string) {
  const [need, setNeed] = useState<DoctorNeedDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    needService
      .doctorDetail(id)
      .then((result) => {
        if (active) setNeed(result);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Impossible de charger cette demande.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  return { need, loading, error, setError };
}
