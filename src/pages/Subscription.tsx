/**
 * Subscription - Page dédiée à la gestion de l'abonnement
 * Affiche les détails de l'abonnement et l'historique des paiements
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  CreditCard, 
  Calendar, 
  Download, 
  ExternalLink, 
  Loader2, 
  Settings,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Sparkles,
  Shield
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useStripeSubscription } from '@/hooks/useStripeSubscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatStripePrice, STRIPE_PRODUCTS } from '@/lib/stripeConfig';
import { SubscriptionUpgrade } from '@/components/SubscriptionUpgrade';

interface Invoice {
  id: string;
  number: string | null;
  amount_due: number;
  amount_paid: number;
  currency: string;
  status: string;
  created: string;
  hosted_invoice_url: string | null;
  invoice_pdf: string | null;
  period_start: string | null;
  period_end: string | null;
}

interface SubscriptionDetails {
  id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  price_amount: number;
  price_currency: string;
  price_interval: string | null;
  product_id: string;
}

interface PaymentHistoryData {
  payments: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    created: string;
    description: string | null;
  }>;
  invoices: Invoice[];
  subscription: SubscriptionDetails | null;
}

export default function Subscription() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isGold, subscription: stripeStatus, refresh } = useStripeSubscription();
  const [historyData, setHistoryData] = useState<PaymentHistoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchPaymentHistory();
  }, [user, navigate]);

  const fetchPaymentHistory = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('payment-history');
      if (error) throw error;
      setHistoryData(data);
    } catch (err) {
      console.error('Error fetching payment history:', err);
      toast.error('Impossible de charger l\'historique');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsOpeningPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Portal error:', err);
      toast.error('Impossible d\'ouvrir le portail');
    } finally {
      setIsOpeningPortal(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
      case 'succeeded':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle className="w-3 h-3 mr-1" />Payé</Badge>;
      case 'open':
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'failed':
      case 'uncollectible':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Échoué</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPlanName = (productId: string | null) => {
    if (productId === STRIPE_PRODUCTS.GOLD_MONTHLY.product_id) return 'Gold Mensuel';
    if (productId === STRIPE_PRODUCTS.GOLD_ANNUAL.product_id) return 'Gold Annuel';
    return 'Gold';
  };

  return (
    <div className="min-h-screen bg-[#050807]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0A0F0D]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-white">Mon Abonnement</h1>
            </div>
            {isGold && (
              <Button 
                onClick={handleManageSubscription}
                disabled={isOpeningPortal}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                {isOpeningPortal ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Settings className="w-4 h-4 mr-2" />
                )}
                Gérer l'abonnement
                <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Current Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {isLoading ? (
            <Card className="bg-[#0A0F0D] border-white/10">
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-white/10" />
                <Skeleton className="h-4 w-32 bg-white/10 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full bg-white/10" />
              </CardContent>
            </Card>
          ) : isGold && historyData?.subscription ? (
            <Card className="bg-[#0A0F0D] border-[#D4AF37]/30 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <CardHeader className="relative">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center">
                    <Crown className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <CardTitle className="text-white">
                      {getPlanName(historyData.subscription.product_id)}
                    </CardTitle>
                    <CardDescription className="text-[#A5A9B4]">
                      Abonnement actif
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5">
                    <p className="text-sm text-[#A5A9B4] mb-1">Montant</p>
                    <p className="text-lg font-semibold text-white">
                      {formatCurrency(historyData.subscription.price_amount, historyData.subscription.price_currency)}
                      <span className="text-sm text-[#A5A9B4] font-normal">
                        /{historyData.subscription.price_interval === 'year' ? 'an' : 'mois'}
                      </span>
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <p className="text-sm text-[#A5A9B4] mb-1">Prochain renouvellement</p>
                    <p className="text-lg font-semibold text-white">
                      {formatDate(historyData.subscription.current_period_end)}
                    </p>
                  </div>
                </div>
                {historyData.subscription.cancel_at_period_end && (
                  <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-sm text-yellow-400">
                      ⚠️ Votre abonnement sera annulé le {formatDate(historyData.subscription.current_period_end)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[#0A0F0D] border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-[#A5A9B4]" />
                  </div>
                  <div>
                    <CardTitle className="text-white">Plan Gratuit</CardTitle>
                    <CardDescription className="text-[#A5A9B4]">
                      Passez à Gold pour débloquer toutes les fonctionnalités
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setShowUpgrade(true)}
                  className="w-full py-6 text-lg font-semibold gap-2"
                  style={{ 
                    background: 'linear-gradient(135deg, #D4AF37, #F4D03F)',
                    color: '#050807'
                  }}
                >
                  <Sparkles className="w-5 h-5" />
                  Passer à Gold
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-[#0A0F0D] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                Historique des factures
              </CardTitle>
              <CardDescription className="text-[#A5A9B4]">
                Vos factures et reçus de paiement
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-16 w-full bg-white/10" />
                  ))}
                </div>
              ) : historyData?.invoices && historyData.invoices.length > 0 ? (
                <div className="space-y-3">
                  {historyData.invoices.map((invoice) => (
                    <div 
                      key={invoice.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[#A5A9B4]" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {invoice.number || `Facture ${invoice.id.slice(-8)}`}
                          </p>
                          <p className="text-sm text-[#A5A9B4]">
                            {formatDate(invoice.created)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-white">
                            {formatCurrency(invoice.amount_paid || invoice.amount_due, invoice.currency)}
                          </p>
                          {getStatusBadge(invoice.status)}
                        </div>
                        {invoice.invoice_pdf && (
                          <a 
                            href={invoice.invoice_pdf} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <Download className="w-4 h-4 text-[#A5A9B4]" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-[#A5A9B4]">Aucune facture pour le moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Security note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 text-sm text-[#A5A9B4]"
        >
          <Shield className="w-4 h-4" />
          <span>Paiements sécurisés par Stripe</span>
        </motion.div>
      </div>

      {/* Upgrade Modal */}
      <SubscriptionUpgrade 
        isOpen={showUpgrade} 
        onClose={() => setShowUpgrade(false)}
        onSuccess={() => {
          refresh();
          fetchPaymentHistory();
        }}
      />
    </div>
  );
}
