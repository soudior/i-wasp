/**
 * Guest Card Context
 * 
 * Stores temporary card data for non-authenticated users.
 * Persists through signup flow using localStorage.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface GuestCardData {
  first_name: string;
  last_name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  linkedin: string;
  whatsapp: string;
  website: string;
  photo_url: string | null;
}

const STORAGE_KEY = "iwasp_guest_card";

const initialGuestCard: GuestCardData = {
  first_name: "",
  last_name: "",
  title: "",
  company: "",
  phone: "",
  email: "",
  linkedin: "",
  whatsapp: "",
  website: "",
  photo_url: null,
};

interface GuestCardContextType {
  guestCard: GuestCardData;
  setGuestCard: (data: GuestCardData) => void;
  updateGuestCard: (field: keyof GuestCardData, value: string | null) => void;
  hasGuestCard: boolean;
  clearGuestCard: () => void;
}

const GuestCardContext = createContext<GuestCardContextType | undefined>(undefined);

export function GuestCardProvider({ children }: { children: ReactNode }) {
  const [guestCard, setGuestCardState] = useState<GuestCardData>(initialGuestCard);
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setGuestCardState(parsed);
      } catch {
        // Invalid JSON, ignore
      }
    }
    setInitialized(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guestCard));
    }
  }, [guestCard, initialized]);

  const setGuestCard = (data: GuestCardData) => {
    setGuestCardState(data);
  };

  const updateGuestCard = (field: keyof GuestCardData, value: string | null) => {
    setGuestCardState(prev => ({ ...prev, [field]: value }));
  };

  const hasGuestCard = Boolean(guestCard.first_name && guestCard.last_name);

  const clearGuestCard = () => {
    setGuestCardState(initialGuestCard);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <GuestCardContext.Provider value={{
      guestCard,
      setGuestCard,
      updateGuestCard,
      hasGuestCard,
      clearGuestCard,
    }}>
      {children}
    </GuestCardContext.Provider>
  );
}

export function useGuestCard() {
  const context = useContext(GuestCardContext);
  if (!context) {
    throw new Error("useGuestCard must be used within a GuestCardProvider");
  }
  return context;
}
