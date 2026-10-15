import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addToAppleWallet, addToGoogleWallet } from "@/lib/walletService";
import { supabase } from "@/integrations/supabase/client";
import { publicCardUrl } from "@/lib/publicUrl";

/** A deliberate click is required: visiting a link never issues a pass. */
export default function WalletPassDownload() {
  const { slug } = useParams<{ slug: string }>();
  const [busy, setBusy] = useState(false);
  const request = useRef<AbortController | null>(null);
  const [message, setMessage] = useState('Connectez-vous au compte propriétaire de la carte. La disponibilité dépend de vos droits et de la configuration du service.');
  useEffect(() => {
    setBusy(false);
    return () => {
      request.current?.abort();
      request.current = null;
    };
  }, [slug]);
  const open = async (type: 'apple' | 'google') => {
    if (!slug || request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (controller.signal.aborted) return;
      if (authError || !user) { setMessage('Connexion requise au compte propriétaire.'); return; }
      const { data: card, error } = await supabase.from('digital_cards').select('id,slug,first_name,last_name')
        .eq('slug', slug).eq('user_id', user.id).eq('is_active', true).maybeSingle();
      if (controller.signal.aborted) return;
      if (error || !card) { setMessage('Carte introuvable ou indisponible pour ce compte.'); return; }
      const data = { id: card.id, slug: card.slug, firstName: card.first_name, lastName: card.last_name };
      const opened = await (type === 'apple' ? addToAppleWallet(data, undefined, controller.signal) : addToGoogleWallet(data, undefined, controller.signal));
      if (controller.signal.aborted) return;
      setMessage(opened ? 'Ouverture demandée. Confirmez l’ajout dans le Wallet ; aucune installation n’est vérifiée ici.' : 'Pass indisponible. Vous pouvez réessayer ou revenir à votre profil.');
    } catch { if (!controller.signal.aborted) setMessage('Impossible de préparer le pass. Réessayez plus tard.'); }
    finally {
      if (request.current === controller) { request.current = null; setBusy(false); }
    }
  };
  return <main className="min-h-dvh bg-[#101211] text-white flex items-center justify-center p-6"><div className="max-w-md space-y-6">
    <Link to="/" className="inline-block py-3 underline">← Accueil</Link>
    <h1 className="text-3xl">Votre carte dans le Wallet</h1>
    <p role="status" className="text-gray-300">{slug ? message : 'URL invalide : aucune carte indiquée.'}</p>
    <div className="grid gap-3">{(['apple','google'] as const).map(type => <button key={type} type="button" disabled={busy || !slug} onClick={() => open(type)} className="min-h-12 p-3 rounded border border-[#dcc7a8] focus-visible:outline focus-visible:outline-2 disabled:opacity-60">{busy ? 'Préparation…' : `Ouvrir ${type === 'apple' ? 'Apple' : 'Google'} Wallet`}</button>)}</div>
    <p className="text-sm text-gray-300">Vous pourrez accepter ou annuler dans le Wallet. Un fichier contact .vcf n’est pas un pass.</p>
    <div className="flex flex-wrap gap-5"><Link to="/login" className="py-3 underline">Se connecter</Link>{slug && <a className="py-3 underline" href={publicCardUrl(slug)}>Voir la carte</a>}</div>
  </div></main>;
}
