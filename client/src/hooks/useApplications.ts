import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import {
  fetchApplications,
  addApplication,
  updateApplication,
  removeApplication,
} from "../services/api";
import type { SavedApplication, ApplicationStatus } from "../types";

export function useApplications() {
  const { token } = useAuth();
  const [applications, setApplications] = useState<SavedApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) {
      setApplications([]);
      setLoading(false);
      return;
    }
    try {
      const apps = await fetchApplications(token);
      setApplications(apps);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(
    async (professorId: string, status?: ApplicationStatus, notes?: string) => {
      if (!token) return;
      await addApplication(token, professorId, status, notes);
      await load();
    },
    [token, load]
  );

  const update = useCallback(
    async (appId: number, status?: ApplicationStatus, notes?: string) => {
      if (!token) return;
      await updateApplication(token, appId, status, notes);
      await load();
    },
    [token, load]
  );

  const remove = useCallback(
    async (professorId: string) => {
      if (!token) return;
      await removeApplication(token, professorId);
      await load();
    },
    [token, load]
  );

  const isTracked = useCallback(
    (professorId: string) =>
      applications.some((a) => a.professor.id === professorId),
    [applications]
  );

  return { applications, loading, add, update, remove, isTracked };
}
