/**
 * Order Funnel Pages - 7 Steps STRICT
 * 
 * 1. /order/type - Customer type selection
 * 2. /order/identity - Personal info
 * 3. /order/digital - Digital links + geolocation
 * 4. /order/design - Card design
 * 5. /order/options - Quantity + promo
 * 6. /order/preview - Final Preview (premium mockup)
 * 7. /order/payment - Stripe payment
 */

export { default as OrderType } from "./OrderType";
export { default as OrderIdentity } from "./OrderIdentity";
export { default as OrderDigital } from "./OrderDigital";
export { default as OrderDesign } from "./OrderDesign";
export { default as OrderOptions } from "./OrderOptions";
export { default as OrderSummary } from "./OrderSummary";
export { default as OrderPreviewFinal } from "./OrderPreviewFinal";
export { default as OrderPayment } from "./OrderPayment";
