/**
 * Mentions Légales - Page légale i-wasp
 */

import { ClubNavbar } from "@/components/ClubNavbar";
import { GlobalFooter } from "@/components/GlobalFooter";
import { motion } from "framer-motion";
import { Scale } from "lucide-react";

export default function MentionsLegales() {
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
              <Scale className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300/80">Mentions légales</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-8">Mentions légales</h1>
            
            <div className="space-y-8 text-white/70 leading-relaxed">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">1. Éditeur du site</h2>
                <p>
                  Le site i-wasp.com est édité par :<br /><br />
                  <strong className="text-white">i-wasp</strong><br />
                  Société par actions simplifiée (SAS)<br />
                  Capital social : 10 000 €<br />
                  Siège social : Paris, France<br />
                  Email : contact@i-wasp.com<br />
                  Téléphone : +33 6 26 42 43 94
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">2. Directeur de la publication</h2>
                <p>
                  Le directeur de la publication est le représentant légal de la société i-wasp.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">3. Hébergement</h2>
                <p>
                  Le site est hébergé par :<br /><br />
                  <strong className="text-white">Vercel Inc.</strong><br />
                  340 S Lemon Ave #4133<br />
                  Walnut, CA 91789, USA<br />
                  Site : vercel.com
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">4. Propriété intellectuelle</h2>
                <p>
                  L'ensemble des éléments constituant le site i-wasp.com (textes, graphismes, logiciels, 
                  photographies, images, sons, plans, logos, marques, etc.) ainsi que le site lui-même, 
                  sont la propriété exclusive de i-wasp ou de ses partenaires.
                </p>
                <p className="mt-4">
                  Toute reproduction, représentation, modification, publication, transmission, dénaturation, 
                  totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, et sur 
                  quelque support que ce soit est interdite sans autorisation écrite préalable.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">5. Données personnelles</h2>
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez 
                  d'un droit d'accès, de rectification, de suppression et de portabilité de vos données 
                  personnelles. Pour exercer ces droits, contactez-nous à : contact@i-wasp.com
                </p>
                <p className="mt-4">
                  Pour plus d'informations, consultez notre{" "}
                  <a href="/privacy" className="text-amber-400 hover:underline">politique de confidentialité</a>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">6. Cookies</h2>
                <p>
                  Le site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. 
                  En continuant à naviguer sur ce site, vous acceptez l'utilisation de cookies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">7. Loi applicable</h2>
                <p>
                  Les présentes mentions légales sont régies par la loi française. En cas de litige, 
                  les tribunaux français seront seuls compétents.
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