/**
 * IWASP Visitor Tracking Hook
 * RGPD-compliant automatic visitor data capture
 * Only captures data when explicit consent is given
 */

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VisitorData {
  deviceType: string;
  browser: string;
  os: string;
  screenSize: string;
  language: string;
  referrer: string;
  timestamp: string;
  actionsClicked: string[];
}

interface LocationData {
  city?: string;
  country?: string;
}

// Detect device type
function detectDeviceType(): string {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  if (/Mac/i.test(ua)) return "Mac";
  if (/Windows/i.test(ua)) return "Windows";
  if (/Linux/i.test(ua)) return "Linux";
  return "Other";
}

// Detect browser
function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Other";
}

// Detect OS
function detectOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "Other";
}

// Get visitor data (no personal info)
function getVisitorData(): VisitorData {
  return {
    deviceType: detectDeviceType(),
    browser: detectBrowser(),
    os: detectOS(),
    screenSize: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language || "unknown",
    referrer: document.referrer || "direct",
    timestamp: new Date().toISOString(),
    actionsClicked: [],
  };
}

export function useVisitorTracking(cardId: string) {
  const [hasConsent, setHasConsent] = useState(false);
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [actionsTracked, setActionsTracked] = useState<string[]>([]);

  // Initialize visitor data on mount
  useEffect(() => {
    const data = getVisitorData();
    setVisitorData(data);
    
    // Check existing consent
    const consentKey = `iwasp_consent_banner_${cardId}`;
    const consent = localStorage.getItem(consentKey);
    if (consent === "accepted") {
      setHasConsent(true);
    }
  }, [cardId]);

  // Track action click
  const trackAction = useCallback((actionName: string) => {
    if (!hasConsent) return;
    
    setActionsTracked(prev => {
      if (!prev.includes(actionName)) {
        return [...prev, actionName];
      }
      return prev;
    });
  }, [hasConsent]);

  // Handle consent given
  const giveConsent = useCallback(() => {
    setHasConsent(true);
    localStorage.setItem(`iwasp_consent_banner_${cardId}`, "accepted");
  }, [cardId]);

  // Handle consent declined
  const declineConsent = useCallback(() => {
    setHasConsent(false);
    localStorage.setItem(`iwasp_consent_banner_${cardId}`, "declined");
  }, [cardId]);

  // Save anonymous visitor lead (only with consent)
  const saveVisitorLead = useCallback(async () => {
    if (!hasConsent || !visitorData) return null;

    try {
      const { data, error } = await supabase.from("leads").insert({
        card_id: cardId,
        name: null,
        email: null,
        phone: null,
        company: null,
        message: actionsTracked.length > 0 ? `Actions: ${actionsTracked.join(", ")}` : null,
        consent_given: true,
        consent_timestamp: new Date().toISOString(),
        source: "nfc",
        device_type: visitorData.deviceType,
        location_city: locationData?.city || null,
        location_country: locationData?.country || null,
        lead_score: 5, // Low score for anonymous visits
        status: "new",
      }).select().single();

      if (error) {
        console.error("Error saving visitor lead:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error saving visitor lead:", error);
      return null;
    }
  }, [hasConsent, visitorData, cardId, actionsTracked, locationData]);

  return {
    hasConsent,
    visitorData,
    locationData,
    actionsTracked,
    giveConsent,
    declineConsent,
    trackAction,
    saveVisitorLead,
  };
}
