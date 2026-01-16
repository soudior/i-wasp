/**
 * PricingSection - Section pricing pour la landing page
 * Toggle mensuel/annuel avec 3 offres : Identity, Professional, Enterprise
 * Tableau comparatif détaillé des fonctionnalités
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Sparkles, Crown, Building2, Zap, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/contexts/CurrencyContext";

// Feature comparison data
interface FeatureRow {
  category?: string;
  feature: string;
  identity: boolean | string;
  professional: boolean | string;
  enterprise: boolean | string;
}

const featureComparison: FeatureRow[] = [
  { category: "NFC Cards", feature: "Monthly card allocation", identity: "10 cards", professional: "25 cards", enterprise: "75 cards" },
  { feature: "Premium PVC cards", identity: true, professional: true, enterprise: true },
  { feature: "Metal cards", identity: false, professional: false, enterprise: true },
  { feature: "Custom logo printing", identity: false, professional: true, enterprise: true },
  { feature: "Laser engraving", identity: false, professional: false, enterprise: true },
  
  { category: "Digital Profile", feature: "Digital business card", identity: true, professional: true, enterprise: true },
  { feature: "vCard download", identity: true, professional: true, enterprise: true },
  { feature: "Apple & Google Wallet", identity: true, professional: true, enterprise: true },
  { feature: "Custom design templates", identity: "Basic", professional: "Premium", enterprise: "Unlimited" },
  { feature: "QR code generation", identity: true, professional: true, enterprise: true },
  
  { category: "Website", feature: "Landing page builder", identity: "1 page", professional: "5-10 pages", enterprise: "20+ pages" },
  { feature: "Blog system", identity: false, professional: true, enterprise: true },
  { feature: "E-commerce store", identity: false, professional: false, enterprise: true },
  { feature: "Custom domain", identity: "1 domain", professional: "Unlimited", enterprise: "Unlimited" },
  { feature: "SSL certificate", identity: true, professional: true, enterprise: true },
  
  { category: "AI & Automation", feature: "AI credits/month", identity: "5 credits", professional: "20 credits", enterprise: "Unlimited" },
  { feature: "AI content generation", identity: true, professional: true, enterprise: true },
  { feature: "Marketing automation", identity: false, professional: false, enterprise: true },
  { feature: "API access", identity: false, professional: false, enterprise: true },
  
  { category: "Analytics & Support", feature: "Analytics dashboard", identity: "Basic", professional: "Detailed", enterprise: "Advanced" },
  { feature: "Email support", identity: true, professional: true, enterprise: true },
  { feature: "24/7 chat support", identity: false, professional: true, enterprise: true },
  { feature: "Dedicated manager", identity: false, professional: false, enterprise: true },
  { feature: "Priority support", identity: false, professional: false, enterprise: true },
];

interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  isPopular: boolean;
  icon: React.ReactNode;
  included: string[];
  excluded: string[];
  cta: string;
  gradient: string;
}

const plans: PricingPlan[] = [
  {
    id: "identity",
    name: "Identity",
    tagline: "Freelancers & Solo",
    monthlyPrice: 29,
    yearlyPrice: 290, // ~17% discount
    currency: "USD",
    isPopular: false,
    icon: <Zap className="h-6 w-6" />,
    included: [
      "10 NFC cards/month",
      "5 AI credits/month",
      "Digital profile + vCard",
      "Apple & Google Wallet",
      "1-page landing site",
      "Custom .com domain",
      "Basic analytics",
    ],
    excluded: [
      "Logo on cards",
      "Metal cards",
      "Multi-page website",
      "Priority support",
    ],
    cta: "Start with Identity",
    gradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "SMBs & Teams",
    monthlyPrice: 79,
    yearlyPrice: 790, // ~17% discount
    currency: "USD",
    isPopular: true,
    icon: <Crown className="h-6 w-6" />,
    included: [
      "25 NFC cards/month",
      "20 AI credits/month",
      "Premium custom design",
      "Logo printed on cards",
      "5-10 page website + Blog",
      "Unlimited domains",
      "SEO & detailed analytics",
      "24/7 chat support",
    ],
    excluded: [
      "Premium metal cards",
      "E-commerce",
      "Dedicated manager",
    ],
    cta: "Go Professional",
    gradient: "from-primary/10 to-purple-500/10",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Agencies & Startups",
    monthlyPrice: 249,
    yearlyPrice: 2490, // ~17% discount
    currency: "USD",
    isPopular: false,
    icon: <Building2 className="h-6 w-6" />,
    included: [
      "75 NFC cards/month",
      "Unlimited AI credits",
      "Premium metal cards",
      "Logo printed + engraved",
      "20+ page e-commerce site",
      "Stripe payments",
      "Marketing automation",
      "Advanced analytics + API",
      "Dedicated manager 24/7",
    ],
    excluded: [],
    cta: "Contact Sales",
    gradient: "from-amber-500/10 to-orange-500/10",
  },
];

export function PricingSection() {
  const { t } = useTranslation();
  const { currency, formatPrice } = useCurrency();
  const [isYearly, setIsYearly] = useState(false);

  const getDisplayPrice = (plan: PricingPlan) => {
    const basePrice = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    
    // Convert USD to other currencies
    const rates: Record<string, number> = {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
    };
    
    const rate = rates[currency] || 1;
    const convertedPrice = Math.round(basePrice * rate);
    
    return convertedPrice;
  };

  const formatCurrency = (amount: number) => {
    const symbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    return `${symbols[currency] || "$"}${amount}`;
  };

  // Helper function to render feature values in comparison table
  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === "string") {
      return <span className="text-sm font-medium text-foreground">{value}</span>;
    }
    if (value === true) {
      return (
        <div className="flex justify-center">
          <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
            <Check className="h-4 w-4 text-green-600" />
          </div>
        </div>
      );
    }
    return (
      <div className="flex justify-center">
        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
          <Minus className="h-4 w-4 text-muted-foreground/50" />
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            {t("pricing.badge", "Simple, transparent pricing")}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {t("pricing.title", "Choose your plan")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("pricing.subtitle", "Scale your digital identity with the right plan for your needs")}
          </p>
        </motion.div>

        {/* Toggle Monthly/Yearly */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span className={`text-sm font-medium transition-colors ${!isYearly ? "text-foreground" : "text-muted-foreground"}`}>
            {t("pricing.monthly", "Monthly")}
          </span>
          
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              isYearly ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          >
            <motion.div
              layout
              className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
              animate={{ left: isYearly ? "calc(100% - 24px)" : "4px" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium transition-colors ${isYearly ? "text-foreground" : "text-muted-foreground"}`}>
              {t("pricing.yearly", "Yearly")}
            </span>
            <span className="bg-green-500/10 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
              {t("pricing.save", "Save 17%")}
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence mode="wait">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-card rounded-2xl border overflow-hidden ${
                  plan.isPopular 
                    ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]" 
                    : "border-border"
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center text-sm font-medium py-1.5">
                    ⭐ {t("pricing.popular", "Most Popular")}
                  </div>
                )}

                {/* Card Content */}
                <div className={`p-6 ${plan.isPopular ? "pt-12" : ""}`}>
                  {/* Icon & Name */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${plan.gradient}`}>
                    <span className="text-foreground">{plan.icon}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.tagline}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <motion.span
                        key={`${plan.id}-${isYearly}-${currency}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold text-foreground"
                      >
                        {formatCurrency(getDisplayPrice(plan))}
                      </motion.span>
                      <span className="text-muted-foreground">
                        /{isYearly ? t("pricing.year", "year") : t("pricing.month", "mo")}
                      </span>
                    </div>
                    {isYearly && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {t("pricing.billedAnnually", "Billed annually")}
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full mb-6 ${
                      plan.isPopular 
                        ? "bg-primary hover:bg-primary/90" 
                        : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                    }`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.included.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.excluded.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3 opacity-50">
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Feature Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {t("pricing.compareTitle", "Compare all features")}
            </h3>
            <p className="text-muted-foreground">
              {t("pricing.compareSubtitle", "Find the perfect plan for your needs")}
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[640px]">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-medium text-muted-foreground w-1/3">
                    {t("pricing.feature", "Feature")}
                  </th>
                  <th className="text-center p-4 font-medium text-foreground">
                    <div className="flex flex-col items-center gap-1">
                      <Zap className="h-5 w-5 text-blue-500" />
                      <span>Identity</span>
                    </div>
                  </th>
                  <th className="text-center p-4 font-medium text-foreground bg-primary/5 border-x border-primary/10">
                    <div className="flex flex-col items-center gap-1">
                      <Crown className="h-5 w-5 text-primary" />
                      <span>Professional</span>
                      <span className="text-xs text-primary font-normal">Most Popular</span>
                    </div>
                  </th>
                  <th className="text-center p-4 font-medium text-foreground">
                    <div className="flex flex-col items-center gap-1">
                      <Building2 className="h-5 w-5 text-amber-500" />
                      <span>Enterprise</span>
                    </div>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {featureComparison.map((row, index) => (
                  <>
                    {row.category && (
                      <tr key={`cat-${index}`} className="bg-muted/50">
                        <td colSpan={4} className="p-3 font-semibold text-foreground text-sm">
                          {row.category}
                        </td>
                      </tr>
                    )}
                    <tr 
                      key={`row-${index}`}
                      className={`border-b border-border/50 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                    >
                      <td className="p-4 text-sm text-foreground">{row.feature}</td>
                      <td className="p-4 text-center">{renderFeatureValue(row.identity)}</td>
                      <td className="p-4 text-center bg-primary/5 border-x border-primary/10">{renderFeatureValue(row.professional)}</td>
                      <td className="p-4 text-center">{renderFeatureValue(row.enterprise)}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Bottom Trust */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            {t("pricing.guarantee", "30-day money-back guarantee • No hidden fees • Cancel anytime")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
