"use client";

import { useEffect, useState } from "react";
import {
  availabilityService,
  type BlockedDate,
  type DoctorAppointmentView,
  type WeeklyAvailabilityInput,
  type WeeklyAvailabilityOutput,
} from "@/services/availability-service";
import { useToast } from "@/components/ui/use-toast";

export function useDoctorAvailability() {
  const { toast } = useToast();
  const [weekly, setWeekly] = useState<WeeklyAvailabilityOutput[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [appointments, setAppointments] = useState<DoctorAppointmentView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      availabilityService.getWeekly(),
      availabilityService.getBlocked(),
      availabilityService.getDoctorAppointments(),
    ])
      .then(([weeklyResult, blockedResult, appointmentsResult]) => {
        if (active) {
          setWeekly(weeklyResult);
          setBlockedDates(blockedResult);
          setAppointments(appointmentsResult);
          setLoading(false);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause.message
              : "Impossible de charger les disponibilités.",
          );
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  return {
    weekly,
    blockedDates,
    appointments,
    loading,
    error,
    saveWeekly: async (availabilities: WeeklyAvailabilityInput[]) => {
      try {
        await availabilityService.setWeekly(availabilities);
        toast({
          title: "Disponibilités enregistrées",
          description: "Vos horaires hebdomadaires ont été mis à jour.",
        });
      } catch (cause) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'enregistrer les disponibilités.",
        });
        throw cause;
      }
    },
    addBlockedDate: async (data: CreateBlockedDateInput) => {
      try {
        const created = await availabilityService.createBlocked(data);
        setBlockedDates((dates) => [...dates, created]);
        toast({
          title: "Date bloquée ajoutée",
          description: `${data.date} est désormais indisponible.`,
        });
        return created;
      } catch (cause) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'ajouter cette date bloquée.",
        });
        throw cause;
      }
    },
    removeBlockedDate: async (id: string) => {
      try {
        await availabilityService.deleteBlocked(id);
        setBlockedDates((dates) => dates.filter((item) => item.id !== id));
        toast({
          title: "Date bloquée supprimée",
          description: "L'indisponibilité a été retirée.",
        });
      } catch (cause) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de supprimer cette date bloquée.",
        });
        throw cause;
      }
    },
  };
}

type CreateBlockedDateInput = {
  date: string;
  reason?: string;
};
