"use client";

import { useCallback, useEffect, useState } from "react";
import {
  needService,
  type PatientNeedDetail,
  type UpdateNeedRequest,
} from "@/services/need-service";

export function usePatientNeed(id: string) {
  const [need, setNeed] = useState<PatientNeedDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    let active = true;
    needService
      .detail(id)
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
  }, [id, reloadKey]);

  const update = useCallback(
    async (data: UpdateNeedRequest) => {
      setUpdating(true);
      setError(null);
      try {
        const updatedNeed = await needService.update(id, data);
        setNeed(updatedNeed);
        return updatedNeed;
      } catch (cause) {
        const message =
          cause instanceof Error
            ? cause.message
            : "Impossible de modifier cette demande.";
        setError(message);
        throw cause;
      } finally {
        setUpdating(false);
      }
    },
    [id],
  );

  return { need, loading, updating, error, setError, reload, update };
}
