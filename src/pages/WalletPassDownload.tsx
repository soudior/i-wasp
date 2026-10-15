import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, Smartphone } from "lucide-react";
import { addToAppleWallet, addToGoogleWallet } from "@/lib/walletService";
import { supabase } from "@/integrations/supabase/client";
import { publicCardUrl } from "@/lib/publicUrl";
import { useWalletRequest } from "@/hooks/useWalletRequest";

/** A deliberate click is required: visiting a link never issues a pass. */
export default function WalletPassDownload() {
  const { slug } = useParams<{ slug: string }>();
  const { start, isBusy: busy, accountEpoch } = useWalletRequest(slug ?? '');
  const [message, setMessage] = useState('Connectez-vous au compte propriétaire de la carte. La disponibilité dépend de vos droits et de la configuration du service.');
  useEffect(() => {
    if (accountEpoch) setMessage('Session modifiée. Cliquez à nouveau pour préparer le pass avec le compte connecté.');
  }, [accountEpoch]);
  const open = async (type: 'apple' | 'google') => {
    if (!slug) return;
    const operation = start(type);
    if (!operation) return;
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (!operation.isCurrent()) return;
      if (authError || !user) { setMessage('Connexion requise au compte propriétaire.'); return; }
      if (!operation.acceptOwner(user.id)) {
        setMessage('Session modifiée. Cliquez à nouveau pour préparer le pass avec le compte connecté.');
        return;
      }
      const { data: card, error } = await supabase.from('digital_cards').select('id,slug,first_name,last_name')
        .eq('slug', slug).eq('user_id', user.id).eq('is_active', true).maybeSingle();
      if (!operation.isCurrent()) return;
      if (error || !card) { setMessage('Carte introuvable ou indisponible pour ce compte.'); return; }
      const data = { id: card.id, slug: card.slug, firstName: card.first_name, lastName: card.last_name };
      const opened = await (type === 'apple' ? addToAppleWallet(data, undefined, operation.signal) : addToGoogleWallet(data, undefined, operation.signal));
      if (!operation.isCurrent()) return;
      setMessage(opened ? 'Ouverture demandée. Confirmez l’ajout dans le Wallet ; aucune installation n’est vérifiée ici.' : 'Pass indisponible. Vous pouvez réessayer ou revenir à votre profil.');
    } catch { if (operation.isCurrent()) setMessage('Impossible de préparer le pass. Réessayez plus tard.'); }
    finally {
      operation.finish();
    }
  };
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        {/* Keep the existing IWASP envelope; only Wallet actions and feedback change. */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="text-white font-bold text-xl">iW</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
          {busy ? (
            <Loader2 className="w-12 h-12 mx-auto text-amber-500 mb-4 animate-spin" />
          ) : (
            <Smartphone className="w-12 h-12 mx-auto text-amber-500 mb-4" />
          )}
          <h1 className="text-white text-xl font-medium mb-2">
            {busy ? 'Préparation du pass…' : 'Votre carte dans le Wallet'}
          </h1>
          <p role="status" className="text-white/60 text-sm">
            {slug ? message : 'URL invalide : aucune carte indiquée.'}
          </p>
          <div className="grid gap-3 mt-6">
            {(['apple', 'google'] as const).map(type => (
              <button
                key={type}
                type="button"
                disabled={busy || !slug}
                onClick={() => open(type)}
                className="inline-block px-6 py-3 bg-amber-500 text-black font-medium rounded-xl hover:bg-amber-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 disabled:opacity-60"
              >
                {busy ? 'Préparation…' : `Ouvrir ${type === 'apple' ? 'Apple' : 'Google'} Wallet`}
              </button>
            ))}
          </div>
          <p className="text-white/60 text-sm mt-4">
            Vous pourrez accepter ou annuler dans le Wallet. Un fichier contact .vcf n’est pas un pass.
          </p>
          <div className="flex flex-wrap justify-center gap-5 text-white/60 text-sm mt-4">
            <Link to="/" className="py-3 underline">← Accueil</Link>
            <Link to="/login" className="py-3 underline">Se connecter</Link>
            {slug && <a className="py-3 underline" href={publicCardUrl(slug)}>Voir la carte</a>}
          </div>
        </div>

        <p className="text-white/30 text-xs mt-6">Powered by IWASP</p>
      </div>
    </div>
  );
}
