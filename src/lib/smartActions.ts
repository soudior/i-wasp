import { getSocialUrl, isMobile, isIOS } from "./socialNetworks";

// Handle phone tap - opens call or shows options
export function handlePhoneTap(phone: string): void {
  // Clean phone number
  const cleanPhone = phone.replace(/\s/g, '');
  
  if (isMobile()) {
    // On mobile, directly call
    window.location.href = `tel:${cleanPhone}`;
  } else {
    // On desktop, try to open default handler
    window.location.href = `tel:${cleanPhone}`;
  }
}

// Handle WhatsApp tap
export function handleWhatsAppTap(phone: string): void {
  // Clean phone number and remove leading +
  const cleanPhone = phone.replace(/\s/g, '').replace(/^\+/, '');
  window.open(`https://wa.me/${cleanPhone}`, "_blank");
}

// Handle email tap
export function handleEmailTap(email: string, subject?: string, body?: string): void {
  let mailtoUrl = `mailto:${email}`;
  const params: string[] = [];
  
  if (subject) {
    params.push(`subject=${encodeURIComponent(subject)}`);
  }
  if (body) {
    params.push(`body=${encodeURIComponent(body)}`);
  }
  
  if (params.length > 0) {
    mailtoUrl += `?${params.join('&')}`;
  }
  
  window.location.href = mailtoUrl;
}

// Handle social network tap with smart fallback
export function handleSocialTap(networkId: string, value: string): void {
  // Get native app URL
  const nativeUrl = getSocialUrl(networkId, value, true);
  const webUrl = getSocialUrl(networkId, value, false);
  
  if (isMobile() && nativeUrl !== webUrl) {
    // Try native app first, fallback to web
    tryNativeAppWithFallback(nativeUrl, webUrl);
  } else {
    // Desktop: just open web URL
    window.open(webUrl, "_blank");
  }
}

// Try to open native app, fallback to web after timeout
function tryNativeAppWithFallback(nativeUrl: string, webUrl: string): void {
  const start = Date.now();
  
  // Create hidden iframe to try native URL
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = nativeUrl;
  document.body.appendChild(iframe);
  
  // If app doesn't open within 2s, fallback to web
  setTimeout(() => {
    document.body.removeChild(iframe);
    // Only fallback if we're still on the same page (app didn't open)
    if (Date.now() - start < 2500) {
      window.open(webUrl, "_blank");
    }
  }, 1500);
  
  // Also try direct location change for some schemes
  if (isIOS()) {
    window.location.href = nativeUrl;
  }
}

// Handle SMS tap
export function handleSmsTap(phone: string, body?: string): void {
  const cleanPhone = phone.replace(/\s/g, '');
  let smsUrl = `sms:${cleanPhone}`;
  
  if (body) {
    // iOS uses & for body, Android uses ?
    const separator = isIOS() ? '&' : '?';
    smsUrl += `${separator}body=${encodeURIComponent(body)}`;
  }
  
  window.location.href = smsUrl;
}

// Handle website tap
export function handleWebsiteTap(url: string): void {
  let fullUrl = url;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    fullUrl = `https://${url}`;
  }
  window.open(fullUrl, "_blank");
}

// Copy to clipboard with feedback
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
}
