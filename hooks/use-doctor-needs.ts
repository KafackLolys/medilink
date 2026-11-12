"use client";

import { useCallback, useEffect, useState } from "react";
import {
  needService,
  type DoctorNeedFilters,
  type PaginatedDoctorNeeds,
} from "@/services/need-service";

const PAGE_SIZE = 10;

export function useDoctorNeeds() {
  const [result, setResult] = useState<PaginatedDoctorNeeds>({
    items: [],
    specialties: [],
    page: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<{
    filters: DoctorNeedFilters;
    page: number;
    refreshKey: number;
  }>({ filters: {}, page: 1, refreshKey: 0 });

  const load = useCallback((filters: DoctorNeedFilters, page: number) => {
    setLoading(true);
    setError(null);
    setRequest((current) => ({
      filters,
      page,
      refreshKey: current.refreshKey + 1,
    }));
  }, []);

  useEffect(() => {
    let active = true;
    needService
      .listForDoctor(request.filters, request.page, PAGE_SIZE)
      .then((response) => {
        if (active) setResult(response);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Impossible de charger les demandes des patients.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [request]);

  return { ...result, loading, error, load };
}
