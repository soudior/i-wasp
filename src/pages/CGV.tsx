/**
 * CGV - Conditions Générales de Vente i-wasp
 */

import { ClubNavbar } from "@/components/ClubNavbar";
import { GlobalFooter } from "@/components/GlobalFooter";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function CGV() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <ClubNavbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300/80">Conditions générales</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-8">Conditions Générales de Vente</h1>
            
            <div className="space-y-8 text-white/70 leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">1. Objet</h2>
                <p>
                  Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits 
                  et services proposés par i-wasp, notamment les cartes NFC, tags, wearables et 
                  services de conciergerie digitale associés.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">2. Prix</h2>
                <p>
                  Les prix sont indiqués en euros (€) ou dirhams marocains (DH) selon la zone 
                  géographique, toutes taxes comprises (TTC). i-wasp se réserve le droit de 
                  modifier ses prix à tout moment, les produits étant facturés sur la base des 
                  tarifs en vigueur au moment de la validation de la commande.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">3. Commande</h2>
                <p>
                  La commande est validée après acceptation des présentes CGV et confirmation 
                  du paiement ou accord sur le mode de paiement (paiement à la livraison selon 
                  les zones éligibles). Un email de confirmation est envoyé à l'adresse indiquée.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">4. Paiement</h2>
                <p>
                  Les modes de paiement acceptés sont :<br /><br />
                  • Virement bancaire<br />
                  • Paiement à la livraison (zones éligibles)<br />
                  • Autres moyens selon les offres en cours
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">5. Livraison</h2>
                <p>
                  Les délais de livraison sont donnés à titre indicatif. i-wasp s'engage à 
                  livrer les produits dans un délai de 5 à 10 jours ouvrés après confirmation 
                  de la commande (hors personnalisation sur mesure).
                </p>
                <p className="mt-4">
                  Les frais de livraison sont indiqués lors de la commande et varient selon 
                  la destination et le mode de livraison choisi.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">6. Droit de rétractation</h2>
                <p>
                  Conformément à la législation en vigueur, vous disposez d'un délai de 14 jours 
                  à compter de la réception de votre commande pour exercer votre droit de rétractation, 
                  sans avoir à justifier de motifs ni à payer de pénalités.
                </p>
                <p className="mt-4">
                  <strong className="text-white">Exception :</strong> Les produits personnalisés 
                  (cartes avec logo, design sur mesure) ne sont pas éligibles au droit de rétractation.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">7. Garantie</h2>
                <p>
                  Les produits i-wasp bénéficient de la garantie légale de conformité et de la 
                  garantie des vices cachés. En cas de produit défectueux, contactez notre service 
                  client à contact@i-wasp.com.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">8. Service de conciergerie</h2>
                <p>
                  Les abonnements aux services de conciergerie (Essentiel, Signature, Élite) sont 
                  souscrits pour la durée indiquée et renouvelables. La résiliation est possible 
                  à tout moment avec un préavis de 30 jours avant la date de renouvellement.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">9. Responsabilité</h2>
                <p>
                  i-wasp ne saurait être tenue responsable des dommages résultant d'une mauvaise 
                  utilisation des produits ou d'une incompatibilité avec certains appareils.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">10. Litiges</h2>
                <p>
                  En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. 
                  À défaut, les tribunaux compétents seront ceux du siège social de i-wasp.
                </p>
              </section>

              <p className="text-sm text-white/40 pt-8 border-t border-white/10">
                Dernière mise à jour : Janvier 2026
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      
      <GlobalFooter variant="dark" />
    </div>
  );
}