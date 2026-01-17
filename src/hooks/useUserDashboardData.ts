import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardData {
  card: {
    id: string;
    firstName: string;
    lastName: string;
    title: string | null;
    company: string | null;
    viewCount: number;
    slug: string;
    linkedin: string | null;
    instagram: string | null;
    twitter: string | null;
    whatsapp: string | null;
    photoUrl: string | null;
  } | null;
  stats: {
    monthlyVisitors: number;
    totalContacts: number;
    auraScore: number;
  };
  weeklyData: { day: string; value: number }[];
  isLoading: boolean;
  error: string | null;
}

const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export function useUserDashboardData(): DashboardData {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>({
    card: null,
    stats: {
      monthlyVisitors: 0,
      totalContacts: 0,
      auraScore: 0,
    },
    weeklyData: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!user) {
      setData(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch user's digital card
        const { data: cardData, error: cardError } = await supabase
          .from('digital_cards')
          .select('id, first_name, last_name, title, company, view_count, slug, linkedin, instagram, twitter, whatsapp, photo_url, email, phone')
          .eq('user_id', user.id)
          .maybeSingle();

        if (cardError) throw cardError;

        if (!cardData) {
          setData({
            card: null,
            stats: { monthlyVisitors: 0, totalContacts: 0, auraScore: 0 },
            weeklyData: [],
            isLoading: false,
            error: null,
          });
          return;
        }

        // Calculate aura score based on profile completeness
        const calculateAuraScore = () => {
          let score = 0;
          const maxScore = 100;
          const fields = [
            { value: cardData.first_name, weight: 10 },
            { value: cardData.last_name, weight: 10 },
            { value: cardData.title, weight: 15 },
            { value: cardData.company, weight: 15 },
            { value: cardData.email, weight: 10 },
            { value: cardData.phone, weight: 10 },
            { value: cardData.linkedin, weight: 10 },
            { value: cardData.instagram, weight: 5 },
            { value: cardData.twitter, weight: 5 },
            { value: cardData.photo_url, weight: 10 },
          ];

          fields.forEach(field => {
            if (field.value && field.value.trim() !== '') {
              score += field.weight;
            }
          });

          return Math.min(score, maxScore);
        };

        // Fetch monthly visitors (scans from last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count: monthlyScans } = await supabase
          .from('card_scans')
          .select('*', { count: 'exact', head: true })
          .eq('card_id', cardData.id)
          .gte('scanned_at', thirtyDaysAgo.toISOString());

        // Fetch total leads/contacts
        const { count: totalLeads } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('card_id', cardData.id);

        // Fetch weekly scan data for chart
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: weeklyScans } = await supabase
          .from('card_scans')
          .select('scanned_at')
          .eq('card_id', cardData.id)
          .gte('scanned_at', sevenDaysAgo.toISOString())
          .order('scanned_at', { ascending: true });

        // Group scans by day
        const weeklyDataMap: { [key: string]: number } = {};
        
        // Initialize all 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayName = DAYS_FR[date.getDay()];
          weeklyDataMap[dayName] = 0;
        }

        // Count scans per day
        weeklyScans?.forEach(scan => {
          const date = new Date(scan.scanned_at);
          const dayName = DAYS_FR[date.getDay()];
          weeklyDataMap[dayName] = (weeklyDataMap[dayName] || 0) + 1;
        });

        // Convert to array format for chart
        const weeklyData = Object.entries(weeklyDataMap).map(([day, value]) => ({
          day,
          value,
        }));

        setData({
          card: {
            id: cardData.id,
            firstName: cardData.first_name,
            lastName: cardData.last_name,
            title: cardData.title,
            company: cardData.company,
            viewCount: cardData.view_count,
            slug: cardData.slug,
            linkedin: cardData.linkedin,
            instagram: cardData.instagram,
            twitter: cardData.twitter,
            whatsapp: cardData.whatsapp,
            photoUrl: cardData.photo_url,
          },
          stats: {
            monthlyVisitors: monthlyScans || cardData.view_count || 0,
            totalContacts: totalLeads || 0,
            auraScore: calculateAuraScore(),
          },
          weeklyData,
          isLoading: false,
          error: null,
        });
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: err.message || 'Erreur lors du chargement',
        }));
      }
    };

    fetchDashboardData();
  }, [user]);

  return data;
}
