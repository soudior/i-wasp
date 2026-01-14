/**
 * WebStudioCheckout - Page de paiement pour Web Studio
 * Redirige vers Stripe Checkout
 */

import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CreditCard, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function WebStudioCheckout() {
  const [searchParams] = useSearchParams();
  const proposalId = searchParams.get("proposal_id");
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initiatePayment = async () => {
      if (!proposalId) {
        setError("ID de commande manquant");
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fnError } = await supabase.functions.invoke('create-webstudio-payment', {
          body: { proposalId },
        });

        if (fnError) throw fnError;

        if (data?.error) {
          throw new Error(data.error);
        }

        if (data?.url) {
          window.location.href = data.url;
        } else {
          throw new Error("URL de paiement non reçue");
        }
      } catch (err) {
        console.error("Payment initiation error:", err);
        setError(err instanceof Error ? err.message : "Erreur lors de l'initialisation du paiement");
        setIsLoading(false);
      }
    };

    initiatePayment();
  }, [proposalId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/95 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="border-red-500/30 bg-card/80">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Erreur</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button asChild variant="outline">
                <Link to="/web-studio">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CreditCard className="w-8 h-8 text-primary animate-pulse" />
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Redirection vers le paiement...</h2>
        <p className="text-muted-foreground">Vous allez être redirigé vers Stripe</p>
      </motion.div>
    </div>
  );
}
