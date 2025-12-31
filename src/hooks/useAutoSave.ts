/**
 * useAutoSave - Hook for auto-saving form data with debounce
 * 
 * Persists data to localStorage with visual feedback
 */

import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_PREFIX = "iwasp_order_draft_";
const DEBOUNCE_MS = 800;

export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutoSaveOptions<T> {
  /** Unique key for this form's storage */
  key: string;
  /** Current form data */
  data: T;
  /** Whether auto-save is enabled */
  enabled?: boolean;
  /** Debounce delay in ms */
  debounceMs?: number;
  /** Callback when data is restored */
  onRestore?: (data: T) => void;
}

interface UseAutoSaveReturn<T> {
  /** Current save status */
  status: SaveStatus;
  /** Last saved timestamp */
  lastSaved: Date | null;
  /** Manually trigger a save */
  saveNow: () => void;
  /** Clear saved data */
  clearSaved: () => void;
  /** Check if there's saved data */
  hasSavedData: () => boolean;
  /** Get saved data without auto-restore */
  getSavedData: () => T | null;
  /** Restore saved data (calls onRestore) */
  restoreSavedData: () => void;
}

export function useAutoSave<T>({
  key,
  data,
  enabled = true,
  debounceMs = DEBOUNCE_MS,
  onRestore,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn<T> {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const storageKey = `${STORAGE_PREFIX}${key}`;

  // Save to localStorage
  const saveToStorage = useCallback((dataToSave: T) => {
    try {
      const payload = {
        data: dataToSave,
        timestamp: new Date().toISOString(),
        version: 1,
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
      setLastSaved(new Date());
      setStatus("saved");
      
      // Reset to idle after 2 seconds
      setTimeout(() => setStatus("idle"), 2000);
    } catch (error) {
      console.error("Auto-save error:", error);
      setStatus("error");
    }
  }, [storageKey]);

  // Debounced save effect
  useEffect(() => {
    if (!enabled) return;

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Don't save if data is empty/null
    if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
      return;
    }

    setStatus("saving");

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      saveToStorage(data);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, debounceMs, saveToStorage]);

  // Save immediately
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    saveToStorage(data);
  }, [data, saveToStorage]);

  // Clear saved data
  const clearSaved = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      setLastSaved(null);
      setStatus("idle");
    } catch (error) {
      console.error("Clear saved data error:", error);
    }
  }, [storageKey]);

  // Check if saved data exists
  const hasSavedData = useCallback((): boolean => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved !== null;
    } catch {
      return false;
    }
  }, [storageKey]);

  // Get saved data
  const getSavedData = useCallback((): T | null => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.data as T;
      }
    } catch (error) {
      console.error("Get saved data error:", error);
    }
    return null;
  }, [storageKey]);

  // Restore saved data
  const restoreSavedData = useCallback(() => {
    const savedData = getSavedData();
    if (savedData && onRestore) {
      onRestore(savedData);
    }
  }, [getSavedData, onRestore]);

  // Load last saved timestamp on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.timestamp) {
          setLastSaved(new Date(parsed.timestamp));
        }
      }
    } catch {
      // Ignore
    }
  }, [storageKey]);

  return {
    status,
    lastSaved,
    saveNow,
    clearSaved,
    hasSavedData,
    getSavedData,
    restoreSavedData,
  };
}

/**
 * Format relative time for display
 */
export function formatRelativeTime(date: Date | null): string {
  if (!date) return "";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 10) return "À l'instant";
  if (diffSec < 60) return `Il y a ${diffSec}s`;
  if (diffMin < 60) return `Il y a ${diffMin}min`;
  if (diffHour < 24) return `Il y a ${diffHour}h`;
  
  return date.toLocaleDateString("fr-FR", { 
    day: "numeric", 
    month: "short", 
    hour: "2-digit", 
    minute: "2-digit" 
  });
}
