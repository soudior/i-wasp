/**
 * Public Website Page
 * Sert le HTML du site généré directement dans le navigateur
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function PublicWebsite() {
  const { slug } = useParams<{ slug: string }>();
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWebsite = async () => {
      if (!slug) {
        setError("Site non spécifié");
        setLoading(false);
        return;
      }

      try {
        const { data, error: dbError } = await supabase
          .from('generated_websites')
          .select('full_page_html, status')
          .eq('slug', slug)
          .eq('status', 'completed')
          .single();

        if (dbError || !data) {
          setError("Site non trouvé ou non publié");
          return;
        }

        if (data.full_page_html) {
          setHtml(data.full_page_html);
        } else {
          setError("Contenu du site non disponible");
        }
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchWebsite();
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F5F5F7 0%, #E5E5EA 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48,
            height: 48,
            border: '3px solid #E5E5EA',
            borderTopColor: '#007AFF',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: '#8E8E93', fontSize: 14 }}>Chargement...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F5F5F7 0%, #E5E5EA 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, SF Pro Display, sans-serif',
        padding: 20,
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: 400,
          background: 'white',
          padding: 48,
          borderRadius: 24,
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        }}>
          <div style={{
            width: 80,
            height: 80,
            margin: '0 auto 24px',
            background: '#F5F5F7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
          }}>
            🔍
          </div>
          <h1 style={{
            fontSize: 24,
            fontWeight: 600,
            marginBottom: 12,
            color: '#1D1D1F',
            letterSpacing: '-0.5px',
          }}>
            Site introuvable
          </h1>
          <p style={{
            color: '#8E8E93',
            fontSize: 16,
            lineHeight: 1.6,
            marginBottom: 32,
          }}>
            {error}
          </p>
          <a
            href="https://i-wasp.com"
            style={{
              display: 'inline-block',
              background: '#007AFF',
              color: 'white',
              padding: '14px 28px',
              borderRadius: 12,
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'background 0.2s ease',
            }}
          >
            Retour à IWASP
          </a>
          <div style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: '1px solid #E5E5EA',
            fontSize: 14,
            color: '#8E8E93',
          }}>
            Powered by <strong style={{ color: '#007AFF' }}>IWASP</strong>
          </div>
        </div>
      </div>
    );
  }

  // Render the website HTML
  if (html) {
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ minHeight: '100vh' }}
      />
    );
  }

  return null;
}
