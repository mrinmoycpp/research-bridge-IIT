import { useCallback, useEffect, useState } from "react";

export interface SavedNote {
  professorId: string;
  note: string;
}

interface SavedState {
  professors: string[];
  iits: string[];
  areas: string[];
  publications: string[];
  notes: SavedNote[];
  compare: string[];
}

const STORAGE_KEY = "research-platform:saved";

const emptyState: SavedState = {
  professors: [],
  iits: [],
  areas: [],
  publications: [],
  notes: [],
  compare: [],
};

function readState(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    return { ...emptyState, ...JSON.parse(raw) };
  } catch {
    return emptyState;
  }
}

function writeState(state: SavedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota errors
  }
}

// Simple event bus so multiple hook instances stay in sync
const listeners = new Set<() => void>();
function notify() {
  listeners.forEach((fn) => fn());
}

export function useSaved() {
  const [state, setState] = useState<SavedState>(readState);

  useEffect(() => {
    const listener = () => setState(readState());
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const update = useCallback((updater: (s: SavedState) => SavedState) => {
    const next = updater(readState());
    writeState(next);
    setState(next);
    notify();
  }, []);

  const toggleProfessor = useCallback(
    (id: string) =>
      update((s) => ({
        ...s,
        professors: s.professors.includes(id)
          ? s.professors.filter((x) => x !== id)
          : [...s.professors, id],
      })),
    [update]
  );

  const toggleIIT = useCallback(
    (id: string) =>
      update((s) => ({
        ...s,
        iits: s.iits.includes(id)
          ? s.iits.filter((x) => x !== id)
          : [...s.iits, id],
      })),
    [update]
  );

  const toggleArea = useCallback(
    (id: string) =>
      update((s) => ({
        ...s,
        areas: s.areas.includes(id)
          ? s.areas.filter((x) => x !== id)
          : [...s.areas, id],
      })),
    [update]
  );

  const toggleCompare = useCallback(
    (id: string) =>
      update((s) => {
        if (s.compare.includes(id)) {
          return { ...s, compare: s.compare.filter((x) => x !== id) };
        }
        if (s.compare.length >= 4) return s;
        return { ...s, compare: [...s.compare, id] };
      }),
    [update]
  );

  const setNote = useCallback(
    (professorId: string, note: string) =>
      update((s) => {
        const others = s.notes.filter((n) => n.professorId !== professorId);
        return {
          ...s,
          notes: note.trim() ? [...others, { professorId, note }] : others,
        };
      }),
    [update]
  );

  const getNote = useCallback(
    (professorId: string) =>
      state.notes.find((n) => n.professorId === professorId)?.note ?? "",
    [state.notes]
  );

  return {
    saved: state,
    isProfessorSaved: (id: string) => state.professors.includes(id),
    isIITSaved: (id: string) => state.iits.includes(id),
    isAreaSaved: (id: string) => state.areas.includes(id),
    isInCompare: (id: string) => state.compare.includes(id),
    toggleProfessor,
    toggleIIT,
    toggleArea,
    toggleCompare,
    setNote,
    getNote,
  };
}
