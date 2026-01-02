import { useState, useEffect } from 'react';
import { Calendar, Check, X, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AvailabilityCalendarProps {
  airbnbIcalUrl?: string | null;
  bookingIcalUrl?: string | null;
  className?: string;
}

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

export function AvailabilityCalendar({ airbnbIcalUrl, bookingIcalUrl, className = '' }: AvailabilityCalendarProps) {
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [summary, setSummary] = useState<AvailabilitySummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (!airbnbIcalUrl && !bookingIcalUrl) return;

    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke('fetch-ical', {
          body: {
            airbnb_ical_url: airbnbIcalUrl,
            booking_ical_url: bookingIcalUrl,
            days_ahead: 60
          }
        });

        if (fnError) throw fnError;

        if (data?.success) {
          setAvailability(data.availability);
          setSummary(data.summary);
        } else {
          throw new Error(data?.error || 'Failed to fetch availability');
        }
      } catch (err: any) {
        console.error('Error fetching availability:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [airbnbIcalUrl, bookingIcalUrl]);

  if (!airbnbIcalUrl && !bookingIcalUrl) {
    return null;
  }

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAvailabilityForDate = (date: Date): boolean | null => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const day = availability.find(d => d.date === dateStr);
    return day?.available ?? null;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newMonth;
    });
  };

  return (
    <div className={`bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/10 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Disponibilités</h3>
            <p className="text-sm text-zinc-400">Calendrier en temps réel</p>
          </div>
        </div>
        
        {loading && (
          <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
        )}
      </div>

      {error ? (
        <div className="text-center py-8 text-red-400 text-sm">
          Impossible de charger les disponibilités
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          {summary && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-emerald-500/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-emerald-400">{summary.available_days}</div>
                <div className="text-xs text-zinc-400">Disponibles</div>
              </div>
              <div className="bg-red-500/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-red-400">{summary.booked_days}</div>
                <div className="text-xs text-zinc-400">Réservés</div>
              </div>
              <div className="bg-amber-500/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-amber-400">{summary.occupancy_rate}%</div>
                <div className="text-xs text-zinc-400">Occupation</div>
              </div>
            </div>
          )}

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
            >
              ←
            </button>
            <span className="text-white font-medium capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
            >
              →
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
              <div key={i} className="text-center text-xs text-zinc-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Month days */}
            {monthDays.map(date => {
              const isAvailable = getAvailabilityForDate(date);
              const isPast = isBefore(date, new Date()) && !isToday(date);
              
              return (
                <div
                  key={date.toISOString()}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-sm font-medium
                    transition-all duration-200
                    ${isPast ? 'opacity-30' : ''}
                    ${isToday(date) ? 'ring-2 ring-amber-500' : ''}
                    ${isAvailable === true ? 'bg-emerald-500/20 text-emerald-400' : ''}
                    ${isAvailable === false ? 'bg-red-500/20 text-red-400' : ''}
                    ${isAvailable === null ? 'bg-zinc-800/50 text-zinc-500' : ''}
                  `}
                >
                  {format(date, 'd')}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
              <span className="text-xs text-zinc-400">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/40" />
              <span className="text-xs text-zinc-400">Réservé</span>
            </div>
          </div>

          {/* Next Available */}
          {summary?.next_available && (
            <div className="mt-4 p-3 bg-emerald-500/10 rounded-xl text-center">
              <span className="text-sm text-zinc-400">Prochaine disponibilité: </span>
              <span className="text-emerald-400 font-medium">
                {format(parseISO(summary.next_available), 'EEEE d MMMM', { locale: fr })}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
