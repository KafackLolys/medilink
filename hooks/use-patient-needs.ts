"use client";

import { useCallback, useEffect, useState } from "react";
import {
  needService,
  type CreateNeedRequest,
  type NeedStatus,
  type PatientNeed,
} from "@/services/need-service";

export function usePatientNeeds(loadOnMount = true) {
  const [needs, setNeeds] = useState<PatientNeed[]>([]);
  const [loading, setLoading] = useState(loadOnMount);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (!loadOnMount && reloadKey === 0) return;
    let active = true;
    needService
      .list()
      .then((result) => {
        if (active) setNeeds(result);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Impossible de charger vos demandes.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [loadOnMount, reloadKey]);

  const create = useCallback(
    async (data: CreateNeedRequest, files: File[]) => {
      setCreating(true);
      setError(null);
      try {
        const need = await needService.create(data, files);
        setNeeds((current) => [need, ...current]);
        return need;
      } finally {
        setCreating(false);
      }
    },
    [],
  );

  const close = useCallback(async (id: string) => {
    await needService.close(id);
    setNeeds((current) =>
      current.map((need) =>
        need.id === id ? { ...need, status: "closed" as NeedStatus } : need,
      ),
    );
    setError(null);
  }, []);

  const remove = useCallback(async (id: string) => {
    await needService.remove(id);
    setNeeds((current) => current.filter((need) => need.id !== id));
    setError(null);
  }, []);

  return {
    needs,
    loading,
    creating,
    error,
    setError,
    reload,
    create,
    close,
    remove,
  };
}
