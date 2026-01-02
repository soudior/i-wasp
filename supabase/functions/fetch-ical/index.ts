import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CalendarEvent {
  start: string;
  end: string;
  summary?: string;
}

function parseICalDate(dateStr: string): Date {
  // Handle both DATE and DATE-TIME formats
  // DATE format: YYYYMMDD
  // DATE-TIME format: YYYYMMDDTHHMMSSZ or YYYYMMDDTHHMMSS
  const cleanDate = dateStr.replace(/[^0-9T]/g, '');
  
  if (cleanDate.length === 8) {
    // DATE format
    const year = parseInt(cleanDate.substring(0, 4));
    const month = parseInt(cleanDate.substring(4, 6)) - 1;
    const day = parseInt(cleanDate.substring(6, 8));
    return new Date(year, month, day);
  } else {
    // DATE-TIME format
    const year = parseInt(cleanDate.substring(0, 4));
    const month = parseInt(cleanDate.substring(4, 6)) - 1;
    const day = parseInt(cleanDate.substring(6, 8));
    const hour = parseInt(cleanDate.substring(9, 11)) || 0;
    const minute = parseInt(cleanDate.substring(11, 13)) || 0;
    const second = parseInt(cleanDate.substring(13, 15)) || 0;
    
    if (dateStr.endsWith('Z')) {
      return new Date(Date.UTC(year, month, day, hour, minute, second));
    }
    return new Date(year, month, day, hour, minute, second);
  }
}

function parseICalContent(icalContent: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const lines = icalContent.split(/\r?\n/);
  
  let inEvent = false;
  let currentEvent: Partial<CalendarEvent> = {};
  let currentLine = '';
  
  for (const line of lines) {
    // Handle line folding (lines starting with space/tab are continuations)
    if (line.startsWith(' ') || line.startsWith('\t')) {
      currentLine += line.substring(1);
      continue;
    }
    
    // Process the previous complete line
    if (currentLine) {
      processLine(currentLine);
    }
    currentLine = line;
  }
  
  // Process the last line
  if (currentLine) {
    processLine(currentLine);
  }
  
  function processLine(line: string) {
    if (line.startsWith('BEGIN:VEVENT')) {
      inEvent = true;
      currentEvent = {};
    } else if (line.startsWith('END:VEVENT')) {
      if (currentEvent.start && currentEvent.end) {
        events.push(currentEvent as CalendarEvent);
      }
      inEvent = false;
    } else if (inEvent) {
      if (line.startsWith('DTSTART')) {
        const value = line.split(':')[1];
        if (value) {
          currentEvent.start = parseICalDate(value).toISOString();
        }
      } else if (line.startsWith('DTEND')) {
        const value = line.split(':')[1];
        if (value) {
          currentEvent.end = parseICalDate(value).toISOString();
        }
      } else if (line.startsWith('SUMMARY')) {
        currentEvent.summary = line.split(':').slice(1).join(':');
      }
    }
  }
  
  return events;
}

function getAvailability(events: CalendarEvent[], daysAhead: number = 30): { date: string; available: boolean }[] {
  const availability: { date: string; available: boolean }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < daysAhead; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    // Check if this date falls within any booked event
    const isBooked = events.some(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(0, 0, 0, 0);
      
      return checkDate >= eventStart && checkDate < eventEnd;
    });
    
    availability.push({ date: dateStr, available: !isBooked });
  }
  
  return availability;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { airbnb_ical_url, booking_ical_url, days_ahead = 30 } = await req.json();
    
    console.log('Fetching iCal data...', { airbnb_ical_url, booking_ical_url });
    
    const allEvents: CalendarEvent[] = [];
    
    // Fetch Airbnb calendar
    if (airbnb_ical_url) {
      try {
        console.log('Fetching Airbnb iCal...');
        const response = await fetch(airbnb_ical_url);
        if (response.ok) {
          const icalContent = await response.text();
          const events = parseICalContent(icalContent);
          console.log(`Parsed ${events.length} events from Airbnb`);
          allEvents.push(...events);
        } else {
          console.error('Failed to fetch Airbnb iCal:', response.status);
        }
      } catch (error) {
        console.error('Error fetching Airbnb calendar:', error);
      }
    }
    
    // Fetch Booking.com calendar
    if (booking_ical_url) {
      try {
        console.log('Fetching Booking.com iCal...');
        const response = await fetch(booking_ical_url);
        if (response.ok) {
          const icalContent = await response.text();
          const events = parseICalContent(icalContent);
          console.log(`Parsed ${events.length} events from Booking.com`);
          allEvents.push(...events);
        } else {
          console.error('Failed to fetch Booking.com iCal:', response.status);
        }
      } catch (error) {
        console.error('Error fetching Booking.com calendar:', error);
      }
    }
    
    const availability = getAvailability(allEvents, days_ahead);
    
    // Calculate summary stats
    const availableDays = availability.filter(d => d.available).length;
    const bookedDays = availability.filter(d => !d.available).length;
    
    // Find next available date
    const nextAvailable = availability.find(d => d.available)?.date || null;
    
    return new Response(
      JSON.stringify({
        success: true,
        availability,
        summary: {
          total_days: days_ahead,
          available_days: availableDays,
          booked_days: bookedDays,
          next_available: nextAvailable,
          occupancy_rate: Math.round((bookedDays / days_ahead) * 100)
        },
        events_count: allEvents.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in fetch-ical function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
