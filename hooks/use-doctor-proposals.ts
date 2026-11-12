"use client";

import { useCallback, useEffect, useState } from "react";
import {
  needService,
  type PaginatedDoctorProposals,
  type ProposalStatus,
} from "@/services/need-service";

const PAGE_SIZE = 10;

const EMPTY_RESULT: PaginatedDoctorProposals = {
  items: [],
  counts: {
    sent: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    expired: 0,
    cancelled: 0,
  },
  page: 1,
  pageSize: PAGE_SIZE,
  total: 0,
  totalPages: 0,
};

export function useDoctorProposals() {
  const [result, setResult] =
    useState<PaginatedDoctorProposals>(EMPTY_RESULT);
  const [status, setStatus] = useState<ProposalStatus | "">("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const filterByStatus = useCallback((nextStatus: ProposalStatus | "") => {
    setLoading(true);
    setError(null);
    setStatus(nextStatus);
    setPage(1);
  }, []);

  const goToPage = useCallback((nextPage: number) => {
    setLoading(true);
    setError(null);
    setPage(nextPage);
  }, []);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((current) => current + 1);
  }, []);

  const cancel = useCallback(async (id: string) => {
    await needService.cancelDoctorProposal(id);
    reload();
  }, [reload]);

  useEffect(() => {
    let active = true;
    needService
      .listProposalsForDoctor(status, page, PAGE_SIZE)
      .then((response) => {
        if (active) setResult(response);
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Impossible de charger vos propositions.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [page, reloadKey, status]);

  return {
    ...result,
    status,
    loading,
    error,
    filterByStatus,
    goToPage,
    reload,
    cancel,
  };
}
