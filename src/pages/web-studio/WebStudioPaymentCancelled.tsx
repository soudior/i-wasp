/**
 * WebStudioPaymentCancelled - Page affichée quand le paiement est annulé
 */

import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function WebStudioPaymentCancelled() {
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get("proposal_id");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-500/30 p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <XCircle className="w-8 h-8 text-amber-400" />
            </motion.div>
            <h1 className="text-2xl font-bold text-amber-400">Paiement annulé</h1>
            <p className="text-muted-foreground mt-2">Votre commande n'a pas été facturée</p>
          </div>

          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                Vous avez annulé le paiement. Votre commande est toujours 
                disponible et vous pouvez reprendre le processus de paiement 
                à tout moment.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {proposalId && (
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full gap-2"
                >
                  <Link to={`/web-studio/checkout?proposal_id=${proposalId}`}>
                    <CreditCard className="w-5 h-5" />
                    Reprendre le paiement
                  </Link>
                </Button>
              )}

              <Button asChild variant="outline" className="w-full gap-2">
                <Link to="/web-studio">
                  <ArrowLeft className="w-4 h-4" />
                  Retour au Web Studio
                </Link>
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Des questions ? Contactez-nous sur{" "}
                <a 
                  href="https://wa.me/212600000000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  WhatsApp
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
