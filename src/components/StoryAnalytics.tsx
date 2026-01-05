/**
 * StoryAnalytics - Composant d'affichage des statistiques détaillées des stories
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Eye, 
  MessageCircle, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  CheckCircle,
  Loader2
} from "lucide-react";
import { useStoryAnalytics, StoryStats, formatDuration } from "@/hooks/useStoryAnalytics";
import { cn } from "@/lib/utils";

interface Story {
  id: string;
  content_type: "image" | "text";
  image_url?: string;
  text_content?: string;
  text_background_color?: string;
  created_at: string;
  expires_at: string;
  view_count?: number;
}

interface StoryAnalyticsProps {
  stories: Story[];
  className?: string;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  color?: string;
}

function StatCard({ icon, label, value, subValue, color = "text-foreground" }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
      <div className={cn("p-2 rounded-lg bg-background", color)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className={cn("font-semibold", color)}>{value}</p>
        {subValue && (
          <p className="text-xs text-muted-foreground">{subValue}</p>
        )}
      </div>
    </div>
  );
}

export function StoryAnalytics({ stories, className }: StoryAnalyticsProps) {
  const { stats, loading, fetchStats } = useStoryAnalytics();
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  useEffect(() => {
    if (stories.length > 0) {
      const storyIds = stories.map(s => s.id);
      fetchStats(storyIds);
    }
  }, [stories, fetchStats]);

  // Calculate aggregated stats
  const aggregatedStats = Object.values(stats).reduce(
    (acc, stat) => ({
      total_views: acc.total_views + (stat?.total_views || 0),
      complete_views: acc.complete_views + (stat?.complete_views || 0),
      whatsapp_clicks: acc.whatsapp_clicks + (stat?.whatsapp_clicks || 0),
      email_clicks: acc.email_clicks + (stat?.email_clicks || 0),
      avg_duration_ms: acc.avg_duration_ms + (stat?.avg_duration_ms || 0),
      count: acc.count + 1
    }),
    { total_views: 0, complete_views: 0, whatsapp_clicks: 0, email_clicks: 0, avg_duration_ms: 0, count: 0 }
  );

  const averageDuration = aggregatedStats.count > 0 
    ? Math.round(aggregatedStats.avg_duration_ms / aggregatedStats.count) 
    : 0;

  const overallCompletionRate = aggregatedStats.total_views > 0
    ? Math.round((aggregatedStats.complete_views / aggregatedStats.total_views) * 100)
    : 0;

  const whatsappConversionRate = aggregatedStats.total_views > 0
    ? Math.round((aggregatedStats.whatsapp_clicks / aggregatedStats.total_views) * 100)
    : 0;

  if (stories.length === 0) {
    return null;
  }

  const selectedStats = selectedStoryId ? stats[selectedStoryId] : null;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-rose-500" />
          <span className="text-sm font-medium">Statistiques Stories</span>
        </div>
        {loading && <Loader2 size={14} className="animate-spin text-muted-foreground" />}
      </div>

      {/* Aggregated Stats */}
      <div className="grid grid-cols-2 gap-2">
        <StatCard
          icon={<Eye size={16} />}
          label="Vues totales"
          value={aggregatedStats.total_views}
          color="text-blue-500"
        />
        <StatCard
          icon={<CheckCircle size={16} />}
          label="Taux completion"
          value={`${overallCompletionRate}%`}
          subValue={`${aggregatedStats.complete_views} complètes`}
          color="text-green-500"
        />
        <StatCard
          icon={<MessageCircle size={16} />}
          label="Clics WhatsApp"
          value={aggregatedStats.whatsapp_clicks}
          subValue={`${whatsappConversionRate}% conversion`}
          color="text-emerald-500"
        />
        <StatCard
          icon={<Clock size={16} />}
          label="Durée moyenne"
          value={formatDuration(averageDuration)}
          color="text-amber-500"
        />
      </div>

      {/* Per-story stats (if multiple stories) */}
      {stories.length > 1 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Par story :</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {stories.map((story, idx) => {
              const storyStats = stats[story.id];
              const isSelected = selectedStoryId === story.id;
              
              return (
                <button
                  key={story.id}
                  onClick={() => setSelectedStoryId(isSelected ? null : story.id)}
                  className={cn(
                    "flex-shrink-0 w-16 rounded-lg overflow-hidden border-2 transition-all",
                    isSelected ? "border-rose-500" : "border-transparent"
                  )}
                >
                  {story.content_type === "image" && story.image_url && (
                    <div className="relative">
                      <img
                        src={story.image_url}
                        alt={`Story ${idx + 1}`}
                        className="w-full h-20 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
                        <div className="flex items-center justify-center gap-1 text-white text-[10px]">
                          <Eye size={10} />
                          {storyStats?.total_views || 0}
                        </div>
                      </div>
                    </div>
                  )}
                  {story.content_type === "text" && (
                    <div 
                      className="relative w-full h-20 flex items-center justify-center p-1"
                      style={{ backgroundColor: story.text_background_color }}
                    >
                      <p className="text-white text-[8px] text-center line-clamp-3">
                        {story.text_content}
                      </p>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
                        <div className="flex items-center justify-center gap-1 text-white text-[10px]">
                          <Eye size={10} />
                          {storyStats?.total_views || 0}
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected story details */}
          {selectedStats && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20"
            >
              <p className="text-xs font-medium text-rose-500 mb-2">Détails</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold">{selectedStats.total_views}</p>
                  <p className="text-[10px] text-muted-foreground">Vues</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{selectedStats.completion_rate}%</p>
                  <p className="text-[10px] text-muted-foreground">Completion</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{selectedStats.whatsapp_clicks}</p>
                  <p className="text-[10px] text-muted-foreground">WhatsApp</p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-rose-500/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Durée moyenne</span>
                  <span className="font-medium">{formatDuration(selectedStats.avg_duration_ms)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
