/**
 * Smart Contextual NFC Actions Hook
 * Detects context from time, location, device, and visitor history
 * Makes the card feel intelligent and alive
 */

import { useState, useEffect, useMemo } from "react";

// Context types
export type ContextMode = "hotel" | "event" | "business" | "default";
export type TimeMode = "day" | "night";

export interface SmartContext {
  // Time-based
  timeMode: TimeMode;
  isNight: boolean;
  hour: number;
  
  // Visitor history
  isReturningVisitor: boolean;
  visitCount: number;
  lastVisitDate: string | null;
  
  // Context detection
  contextMode: ContextMode;
  
  // Device info
  isMobile: boolean;
  isIOS: boolean;
  
  // Personalized greeting
  greeting: string;
  
  // Action priority order based on context
  actionPriority: string[];
  
  // Special features based on context
  showWifi: boolean;
  showConcierge: boolean;
  prioritizeLinkedIn: boolean;
  prioritizeContactCapture: boolean;
}

// Storage keys
const VISIT_COUNT_KEY = "iwasp_visit_count";
const LAST_VISIT_KEY = "iwasp_last_visit";
const VISITOR_ID_KEY = "iwasp_visitor_id";

// Detect context from URL params or card data
function detectContextMode(searchParams: URLSearchParams, cardCompany?: string): ContextMode {
  // Check URL params first
  const contextParam = searchParams.get("context");
  if (contextParam) {
    if (contextParam === "hotel") return "hotel";
    if (contextParam === "event") return "event";
    if (contextParam === "business") return "business";
  }
  
  // Check card company for hints
  if (cardCompany) {
    const companyLower = cardCompany.toLowerCase();
    if (
      companyLower.includes("hotel") || 
      companyLower.includes("resort") ||
      companyLower.includes("spa") ||
      companyLower.includes("concierge")
    ) {
      return "hotel";
    }
    if (
      companyLower.includes("event") || 
      companyLower.includes("conference") ||
      companyLower.includes("salon") ||
      companyLower.includes("expo")
    ) {
      return "event";
    }
  }
  
  return "default";
}

// Get time-based info
function getTimeInfo(): { timeMode: TimeMode; hour: number; isNight: boolean } {
  const hour = new Date().getHours();
  const isNight = hour >= 20 || hour < 7;
  return {
    timeMode: isNight ? "night" : "day",
    hour,
    isNight,
  };
}

// Get visitor history from localStorage
function getVisitorHistory(cardSlug: string): { 
  isReturning: boolean; 
  visitCount: number; 
  lastVisit: string | null;
} {
  const storageKey = `${VISIT_COUNT_KEY}_${cardSlug}`;
  const lastVisitKey = `${LAST_VISIT_KEY}_${cardSlug}`;
  
  const storedCount = localStorage.getItem(storageKey);
  const lastVisit = localStorage.getItem(lastVisitKey);
  const visitCount = storedCount ? parseInt(storedCount, 10) : 0;
  
  return {
    isReturning: visitCount > 0,
    visitCount,
    lastVisit,
  };
}

// Record a visit
function recordVisit(cardSlug: string): number {
  const storageKey = `${VISIT_COUNT_KEY}_${cardSlug}`;
  const lastVisitKey = `${LAST_VISIT_KEY}_${cardSlug}`;
  
  const storedCount = localStorage.getItem(storageKey);
  const newCount = storedCount ? parseInt(storedCount, 10) + 1 : 1;
  
  localStorage.setItem(storageKey, newCount.toString());
  localStorage.setItem(lastVisitKey, new Date().toISOString());
  
  // Ensure visitor ID exists
  if (!localStorage.getItem(VISITOR_ID_KEY)) {
    localStorage.setItem(VISITOR_ID_KEY, crypto.randomUUID());
  }
  
  return newCount;
}

// Get personalized greeting based on context
function getGreeting(
  isReturning: boolean, 
  timeMode: TimeMode, 
  firstName?: string
): string {
  const name = firstName ? `, ${firstName}` : "";
  
  if (isReturning) {
    return `Ravi de vous revoir${name} !`;
  }
  
  if (timeMode === "night") {
    return `Bonsoir${name}`;
  }
  
  const hour = new Date().getHours();
  if (hour < 12) {
    return `Bonjour${name}`;
  } else if (hour < 18) {
    return `Bon après-midi${name}`;
  }
  return `Bonsoir${name}`;
}

// Get action priority based on context
function getActionPriority(contextMode: ContextMode): string[] {
  switch (contextMode) {
    case "hotel":
      // WiFi and concierge first for hotel guests
      return ["wifi", "concierge", "call", "whatsapp", "location", "email", "website", "linkedin"];
    case "event":
      // LinkedIn and contact capture first for networking
      return ["linkedin", "call", "whatsapp", "email", "website", "instagram", "twitter", "location"];
    case "business":
      // Professional contact first
      return ["call", "email", "linkedin", "whatsapp", "website", "location"];
    default:
      // Default order
      return ["call", "whatsapp", "sms", "email", "location", "website", "linkedin", "instagram", "twitter"];
  }
}

// Device detection
function getDeviceInfo(): { isMobile: boolean; isIOS: boolean } {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /iphone|ipad|ipod|android|webos|blackberry|windows phone/i.test(userAgent);
  const isIOS = /iphone|ipad|ipod/i.test(userAgent);
  return { isMobile, isIOS };
}

export function useSmartContext(
  cardSlug: string,
  searchParams: URLSearchParams,
  cardCompany?: string,
  visitorFirstName?: string
): SmartContext {
  const [visitCount, setVisitCount] = useState(0);
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);
  const [lastVisitDate, setLastVisitDate] = useState<string | null>(null);

  // Record visit on mount
  useEffect(() => {
    if (!cardSlug) return;
    
    const history = getVisitorHistory(cardSlug);
    setIsReturningVisitor(history.isReturning);
    setLastVisitDate(history.lastVisit);
    
    const newCount = recordVisit(cardSlug);
    setVisitCount(newCount);
  }, [cardSlug]);

  // Compute context values
  const context = useMemo((): SmartContext => {
    const timeInfo = getTimeInfo();
    const deviceInfo = getDeviceInfo();
    const contextMode = detectContextMode(searchParams, cardCompany);
    const actionPriority = getActionPriority(contextMode);
    const greeting = getGreeting(isReturningVisitor, timeInfo.timeMode, visitorFirstName);
    
    return {
      // Time
      timeMode: timeInfo.timeMode,
      isNight: timeInfo.isNight,
      hour: timeInfo.hour,
      
      // Visitor
      isReturningVisitor,
      visitCount,
      lastVisitDate,
      
      // Context
      contextMode,
      
      // Device
      isMobile: deviceInfo.isMobile,
      isIOS: deviceInfo.isIOS,
      
      // Personalization
      greeting,
      actionPriority,
      
      // Special features
      showWifi: contextMode === "hotel",
      showConcierge: contextMode === "hotel",
      prioritizeLinkedIn: contextMode === "event",
      prioritizeContactCapture: contextMode === "event",
    };
  }, [searchParams, cardCompany, visitorFirstName, isReturningVisitor, visitCount, lastVisitDate]);

  return context;
}

// Utility to sort actions by context priority
export function sortActionsByPriority<T extends { id: string }>(
  actions: T[],
  priority: string[]
): T[] {
  return [...actions].sort((a, b) => {
    const aIndex = priority.indexOf(a.id);
    const bIndex = priority.indexOf(b.id);
    
    // If not in priority list, put at end
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    
    return aIndex - bIndex;
  });
}
