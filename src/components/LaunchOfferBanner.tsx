import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { formatLaunchCountdown, isLaunchOfferActive } from "@/lib/launchOffer";
import { useMarketCurrency } from "@/contexts/CurrencyContext";

/** Bandeau d'offre de lancement. Disparaît seul après la date de fin. */
export function LaunchOfferBanner() {
  const currency = useMarketCurrency();
  const [now, setNow] = useState(() => new Date());
  const barRef = useRef<HTMLAnchorElement>(null);
  const active = isLaunchOfferActive(now);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const bar = barRef.current;
    if (!active || !bar) {
      root.style.removeProperty("--launch-banner-h");
      return;
    }
    const apply = () => root.style.setProperty("--launch-banner-h", `${bar.offsetHeight}px`);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--launch-banner-h");
    };
  }, [active, currency]);

  if (!active) return null;
  const countdown = formatLaunchCountdown(now);
  const label = currency === "MAD"
    ? "Offre de lancement : Professionnelle à 249 DH"
    : "Offre de lancement : Professionnelle à 35 €";

  return (
    <>
      <div aria-hidden style={{ height: "var(--launch-banner-h, 48px)" }} />
      <Link
        ref={barRef}
        to="/order/offre"
        data-testid="launch-offer-banner"
        className="fixed inset-x-0 top-0 z-[70] flex items-center justify-between gap-3 px-4 py-3 text-[13px] leading-snug"
        style={{ backgroundColor: "#DCC7B0", color: "#14110E" }}
      >
        <span className="font-medium">{label}</span>
        <span className="shrink-0 font-mono text-[12px] tabular-nums">{countdown}</span>
      </Link>
    </>
  );
}

export function MarketShippingNote({
  currency,
  className,
}: {
  currency: "EUR" | "MAD";
  className?: string;
}) {
  return (
    <span className={className}>
      Livraison offerte
      {currency === "MAD" ? " · Livraison express 24-48h Marrakech & Casablanca" : null}
    </span>
  );
}

export function TarifMarocNote({ className }: { className?: string }) {
  return <span className={className}>Tarif Maroc</span>;
}
