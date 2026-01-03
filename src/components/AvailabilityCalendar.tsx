/**
 * AvailabilityCalendar - Real-time Airbnb/Booking availability display
 * 
 * Fetches iCal data and displays a visual calendar with availability
 * Green = Available, Red = Booked
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Loader2,
  Check,
  X,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AvailabilityDay {
  date: string;
  available: boolean;
}

interface AvailabilitySummary {
  total_days: number;
  available_days: number;
  booked_days: number;
  next_available: string | null;
  occupancy_rate: number;
}

interface AvailabilityCalendarProps {
  airbnbIcalUrl?: string;
  bookingIcalUrl?: string;
  daysAhead?: number;
  onAvailabilityLoaded?: (summary: AvailabilitySummary) => void;
  compact?: boolean;
}

const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export function AvailabilityCalendar({
  airbnbIcalUrl,
  bookingIcalUrl,
  daysAhead = 60,
  onAvailabilityLoaded,
  compact = false
}: AvailabilityCalendarProps) {
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [summary, setSummary] = useState<AvailabilitySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAvailability = useCallback(async () => {
    if (!airbnbIcalUrl && !bookingIcalUrl) {
      setError("Aucune URL de calendrier configurée");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase.functions.invoke('fetch-ical', {
        body: {
          airbnb_ical_url: airbnbIcalUrl,
          booking_ical_url: bookingIcalUrl,
          days_ahead: daysAhead
        }
      });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (data?.success) {
        setAvailability(data.availability);
        setSummary(data.summary);
        setLastUpdated(new Date());
        
        if (onAvailabilityLoaded) {
          onAvailabilityLoaded(data.summary);
        }
      } else {
        throw new Error(data?.error || "Erreur lors de la récupération des disponibilités");
      }
    } catch (err) {
      console.error("Error fetching availability:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [airbnbIcalUrl, bookingIcalUrl, daysAhead, onAvailabilityLoaded]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // Get availability map for quick lookup
  const availabilityMap = new Map(
    availability.map(day => [day.date, day.available])
  );

  // Get days for current month view
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: { date: Date; dayOfMonth: number; isCurrentMonth: boolean }[] = [];

    // Add padding for days before first of month
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const padDate = new Date(year, month, -i);
      days.push({ date: padDate, dayOfMonth: padDate.getDate(), isCurrentMonth: false });
    }

    // Add days of current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push({ date: new Date(year, month, d), dayOfMonth: d, isCurrentMonth: true });
    }

    // Add padding for days after last of month
    const endPadding = 6 - lastDay.getDay();
    for (let i = 1; i <= endPadding; i++) {
      const padDate = new Date(year, month + 1, i);
      days.push({ date: padDate, dayOfMonth: padDate.getDate(), isCurrentMonth: false });
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isDateAvailable = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availabilityMap.get(dateStr);
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatNextAvailable = (dateStr: string | null) => {
    if (!dateStr) return "Aucune";
    const date = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Demain";
    if (diffDays < 7) return `Dans ${diffDays} jours`;
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  // Compact view for template integration
  if (compact) {
    return (
      <div className="rounded-2xl p-4 border border-white/10 bg-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#d4af37]" />
            <span className="text-white font-medium text-sm">Disponibilités</span>
          </div>
          {loading ? (
            <Loader2 size={16} className="text-[#d4af37] animate-spin" />
          ) : (
            <button onClick={fetchAvailability} className="p-1.5 rounded-lg hover:bg-white/10">
              <RefreshCw size={14} className="text-white/50" />
            </button>
          )}
        </div>

        {error ? (
          <div className="flex items-center gap-2 text-red-400 text-xs">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        ) : summary ? (
          <>
            {/* Quick summary */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-lg font-bold text-green-400">{summary.available_days}</p>
                <p className="text-[10px] text-white/50">Disponibles</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-lg font-bold text-red-400">{summary.booked_days}</p>
                <p className="text-[10px] text-white/50">Réservés</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-[#d4af37]/10 border border-[#d4af37]/20">
                <p className="text-lg font-bold text-[#d4af37]">{summary.occupancy_rate}%</p>
                <p className="text-[10px] text-white/50">Occupation</p>
              </div>
            </div>

            {/* Next 14 days mini calendar */}
            <div className="flex flex-wrap gap-1">
              {availability.slice(0, 14).map((day, idx) => (
                <motion.div
                  key={day.date}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-medium ${
                    day.available 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                  title={`${new Date(day.date).toLocaleDateString('fr-FR')} - ${day.available ? 'Disponible' : 'Réservé'}`}
                >
                  {new Date(day.date).getDate()}
                </motion.div>
              ))}
            </div>

            {summary.next_available && (
              <p className="text-xs text-white/50 mt-3 text-center">
                Prochaine dispo: <span className="text-green-400 font-medium">{formatNextAvailable(summary.next_available)}</span>
              </p>
            )}
          </>
        ) : null}
      </div>
    );
  }

  // Full calendar view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-5 border border-white/10 bg-white/5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-[#d4af37]" />
          <span className="text-white font-semibold">Calendrier des Disponibilités</span>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-white/40">
              Mis à jour {lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button 
            onClick={fetchAvailability}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw size={16} className={`text-white/60 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
          <AlertCircle size={24} className="text-red-400 mx-auto mb-2" />
          <p className="text-red-400 text-sm">{error}</p>
          <button 
            onClick={fetchAvailability}
            className="mt-3 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30"
          >
            Réessayer
          </button>
        </div>
      ) : loading ? (
        <div className="py-12 text-center">
          <Loader2 size={32} className="text-[#d4af37] animate-spin mx-auto mb-3" />
          <p className="text-white/50 text-sm">Chargement des disponibilités...</p>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          {summary && (
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Check size={16} className="text-green-400" />
                  <span className="text-xs text-white/60">Disponible</span>
                </div>
                <p className="text-2xl font-bold text-green-400">{summary.available_days} <span className="text-sm font-normal">jours</span></p>
              </div>
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <X size={16} className="text-red-400" />
                  <span className="text-xs text-white/60">Réservé</span>
                </div>
                <p className="text-2xl font-bold text-red-400">{summary.booked_days} <span className="text-sm font-normal">jours</span></p>
              </div>
            </div>
          )}

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={goToPreviousMonth}
              className="p-2 rounded-lg hover:bg-white/10"
            >
              <ChevronLeft size={20} className="text-white/60" />
            </button>
            <h3 className="text-white font-medium">
              {MONTHS_FR[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button 
              onClick={goToNextMonth}
              className="p-2 rounded-lg hover:bg-white/10"
            >
              <ChevronRight size={20} className="text-white/60" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS_FR.map(day => (
              <div key={day} className="text-center text-xs text-white/40 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((day, idx) => {
              const dateStr = day.date.toISOString().split('T')[0];
              const isAvailable = availabilityMap.get(dateStr);
              const isPast = isPastDate(day.date);
              const hasData = availabilityMap.has(dateStr);
              
              return (
                <motion.div
                  key={`${dateStr}-${idx}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.01 }}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                    ${!day.isCurrentMonth ? 'opacity-30' : ''}
                    ${isPast ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    ${hasData && !isPast
                      ? isAvailable 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-white/5 text-white/50 border border-white/10'
                    }
                  `}
                >
                  {day.dayOfMonth}
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500/50" />
              <span className="text-xs text-white/60">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500/30 border border-red-500/50" />
              <span className="text-xs text-white/60">Réservé</span>
            </div>
          </div>

          {/* Next Available */}
          {summary?.next_available && (
            <div className="mt-4 p-3 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 text-center">
              <p className="text-sm text-white/70">
                Prochaine disponibilité: <span className="text-[#d4af37] font-semibold">{formatNextAvailable(summary.next_available)}</span>
              </p>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

export default AvailabilityCalendar;
