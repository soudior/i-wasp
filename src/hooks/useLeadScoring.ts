/**
 * IWASP Lead Scoring System
 * Automatic real-time scoring based on visitor actions
 * Persists scores to database
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Scoring rules - exact values as requested
const SCORING_RULES = {
  nfc_scan: 5,           // NFC scan
  contact_added: 10,     // Contact added to phone
  whatsapp_click: 15,    // WhatsApp click
  phone_click: 20,       // Phone call click
  email_click: 10,       // Email click
  wallet_added: 25,      // Added to wallet
  visit: 5,              // Multiple visits (+5 per visit)
  time_on_card: 5,       // Time on card > 30s
  sms_click: 5,          // SMS click
  website_click: 5,      // Website click
  social_click: 3,       // Social network click
  location_click: 5,     // Maps/location click
  shared_contact: 10,    // Shared their contact info
} as const;

export type ActionName = keyof typeof SCORING_RULES;

// Get lead status based on score
export function getLeadStatus(score: number): "cold" | "warm" | "hot" {
  if (score >= 51) return "hot";
  if (score >= 21) return "warm";
  return "cold";
}

// Get status label in French
export function getLeadStatusLabel(score: number): string {
  const status = getLeadStatus(score);
  return status === "hot" ? "Chaud" : status === "warm" ? "Tiède" : "Froid";
}

// Get status color classes
export function getLeadStatusStyles(score: number): { bg: string; text: string; border: string } {
  const status = getLeadStatus(score);
  switch (status) {
    case "hot":
      return { bg: "bg-emerald-500/20", text: "text-emerald-500", border: "border-emerald-500/30" };
    case "warm":
      return { bg: "bg-amber-500/20", text: "text-amber-500", border: "border-amber-500/30" };
    case "cold":
      return { bg: "bg-muted", text: "text-muted-foreground", border: "border-muted" };
  }
}

interface UseLeadScoringOptions {
  cardId: string;
  leadId?: string; // If we already have a lead
  hasConsent: boolean;
}

export function useLeadScoring({ cardId, leadId, hasConsent }: UseLeadScoringOptions) {
  const [currentScore, setCurrentScore] = useState(0);
  const [trackedActions, setTrackedActions] = useState<ActionName[]>([]);
  const [currentLeadId, setCurrentLeadId] = useState<string | null>(leadId || null);
  const timeOnPageRef = useRef<number>(0);
  const hasTimeBonus = useRef(false);
  const startTimeRef = useRef<number>(Date.now());
  const visitCountRef = useRef(1);

  // Track time on card for 30s bonus
  useEffect(() => {
    if (!hasConsent) return;

    const interval = setInterval(() => {
      timeOnPageRef.current = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      // Award time bonus after 30 seconds (once)
      if (timeOnPageRef.current >= 30 && !hasTimeBonus.current) {
        hasTimeBonus.current = true;
        trackAction("time_on_card");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hasConsent]);

  // Track visit count from localStorage
  useEffect(() => {
    if (!cardId || !hasConsent) return;

    const visitKey = `iwasp_visits_${cardId}`;
    const stored = localStorage.getItem(visitKey);
    const visits = stored ? parseInt(stored, 10) + 1 : 1;
    visitCountRef.current = visits;
    localStorage.setItem(visitKey, visits.toString());

    // Add visit bonus for repeat visits
    if (visits > 1) {
      const visitBonus = (visits - 1) * SCORING_RULES.visit;
      setCurrentScore(prev => prev + visitBonus);
    }
  }, [cardId, hasConsent]);

  // Calculate score from action
  const calculateActionScore = useCallback((action: ActionName): number => {
    return SCORING_RULES[action] || 0;
  }, []);

  // Track an action and update score
  const trackAction = useCallback(async (action: ActionName) => {
    if (!hasConsent) return;

    // Prevent duplicate tracking of same action (except visits)
    if (action !== "visit" && trackedActions.includes(action)) {
      return;
    }

    const points = calculateActionScore(action);
    const newScore = currentScore + points;

    setTrackedActions(prev => [...prev, action]);
    setCurrentScore(newScore);

    // Update score in database if we have a lead
    if (currentLeadId) {
      try {
        await supabase
          .from("leads")
          .update({ 
            lead_score: newScore,
            message: `Actions: ${[...trackedActions, action].join(", ")}`
          })
          .eq("id", currentLeadId);
      } catch (error) {
        console.error("Error updating lead score:", error);
      }
    }
  }, [hasConsent, trackedActions, currentScore, currentLeadId, calculateActionScore]);

  // Create or update lead with current score
  const saveLeadWithScore = useCallback(async (leadData?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    message?: string;
  }) => {
    if (!hasConsent) return null;

    const deviceType = detectDeviceType();
    
    // Calculate initial score based on provided data
    let score = currentScore;
    if (leadData?.email) score += SCORING_RULES.contact_added;
    if (leadData?.phone) score += 15; // Phone provided bonus
    
    // Include NFC scan bonus
    if (!trackedActions.includes("nfc_scan")) {
      score += SCORING_RULES.nfc_scan;
    }

    try {
      if (currentLeadId) {
        // Update existing lead
        const { data, error } = await supabase
          .from("leads")
          .update({
            ...leadData,
            lead_score: score,
            message: trackedActions.length > 0 
              ? `Actions: ${trackedActions.join(", ")}${leadData?.message ? ` | ${leadData.message}` : ""}`
              : leadData?.message || null,
          })
          .eq("id", currentLeadId)
          .select()
          .single();

        if (error) throw error;
        setCurrentScore(score);
        return data;
      } else {
        // Create new lead
        const { data, error } = await supabase
          .from("leads")
          .insert({
            card_id: cardId,
            name: leadData?.name || null,
            email: leadData?.email || null,
            phone: leadData?.phone || null,
            company: leadData?.company || null,
            message: trackedActions.length > 0 
              ? `Actions: ${trackedActions.join(", ")}${leadData?.message ? ` | ${leadData.message}` : ""}`
              : leadData?.message || null,
            consent_given: true,
            consent_timestamp: new Date().toISOString(),
            source: "nfc",
            device_type: deviceType,
            lead_score: score,
            status: "new",
          })
          .select()
          .single();

        if (error) throw error;
        
        setCurrentLeadId(data.id);
        setCurrentScore(score);
        return data;
      }
    } catch (error) {
      console.error("Error saving lead:", error);
      return null;
    }
  }, [hasConsent, cardId, currentScore, currentLeadId, trackedActions]);

  // Set lead ID for existing lead
  const setLeadId = useCallback((id: string) => {
    setCurrentLeadId(id);
  }, []);

  return {
    currentScore,
    trackedActions,
    leadStatus: getLeadStatus(currentScore),
    trackAction,
    saveLeadWithScore,
    setLeadId,
    visitCount: visitCountRef.current,
    timeOnCard: timeOnPageRef.current,
  };
}

// Helper: Detect device type
function detectDeviceType(): string {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Android/i.test(ua)) return "Android";
  if (/Mac/i.test(ua)) return "Mac";
  if (/Windows/i.test(ua)) return "Windows";
  return "Other";
}
