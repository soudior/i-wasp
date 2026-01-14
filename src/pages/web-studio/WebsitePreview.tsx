/**
 * Website Preview Page
 * Affiche le site généré dans un iframe avec contrôles
 */

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  ExternalLink, 
  Monitor, 
  Smartphone, 
  Tablet,
  Loader2,
  Copy,
  Check,
  Edit3
} from "lucide-react";
import { motion } from "framer-motion";

interface WebsiteData {
  id: string;
  slug: string;
  full_page_html: string | null;
  preview_url: string | null;
  status: string;
  proposal_id: string;
}

type ViewMode = 'desktop' | 'tablet' | 'mobile';

export default function WebsitePreview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const slug = searchParams.get('slug');
  const proposalId = searchParams.get('proposal');
  
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchWebsite = async () => {
      if (!slug && !proposalId) {
        setError("Aucun site spécifié");
        setLoading(false);
        return;
      }

      try {
        let query = supabase
          .from('generated_websites')
          .select('id, slug, full_page_html, preview_url, status, proposal_id');
        
        if (slug) {
          query = query.eq('slug', slug);
        } else if (proposalId) {
          query = query.eq('proposal_id', proposalId);
        }
        
        const { data, error: dbError } = await query.single();

        if (dbError) throw dbError;
        if (!data) throw new Error("Site non trouvé");
        
        setWebsite(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchWebsite();
  }, [slug, proposalId]);

  const getIframeWidth = () => {
    switch (viewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const handleCopyUrl = async () => {
    if (!website?.slug) return;
    const url = `${window.location.origin}/s/${website.slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du site...</p>
        </div>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-xl font-semibold mb-2">Site non trouvé</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground"
          >
            <ArrowLeft size={16} />
            Retour
          </button>
        </div>
      </div>
    );
  }

  const siteUrl = `/s/${website.slug}`;

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
      {/* Toolbar */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#111]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Retour</span>
          </button>
          
          <div className="h-5 w-px bg-white/20" />
          
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'desktop' 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/50 hover:text-white/70'
              }`}
              title="Vue desktop"
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'tablet' 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/50 hover:text-white/70'
              }`}
              title="Vue tablette"
            >
              <Tablet size={16} />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'mobile' 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/50 hover:text-white/70'
              }`}
              title="Vue mobile"
            >
              <Smartphone size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            <span>{copied ? 'Copié !' : 'Copier le lien'}</span>
          </button>
          
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm"
          >
            <ExternalLink size={14} />
            <span>Ouvrir</span>
          </a>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 flex items-start justify-center p-4 overflow-auto">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-2xl overflow-hidden"
          style={{
            width: getIframeWidth(),
            height: viewMode === 'desktop' ? 'calc(100vh - 6rem)' : '80vh',
            maxWidth: '100%',
          }}
        >
          {website.full_page_html ? (
            <iframe
              srcDoc={website.full_page_html}
              className="w-full h-full border-0"
              title="Website Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">Contenu non disponible</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Status bar */}
      <div className="h-8 border-t border-white/10 flex items-center justify-between px-4 text-xs text-white/50 bg-[#111]">
        <span>
          {website.status === 'completed' ? '✓ Site généré' : `Status: ${website.status}`}
        </span>
        <span className="font-mono">
          {website.slug}.i-wasp.com
        </span>
      </div>
    </div>
  );
}
