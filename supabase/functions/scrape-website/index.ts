/**
 * Edge Function: Website Scraper for Auto Template Generation
 * Uses Firecrawl to extract logo, colors, products, social links from a website URL
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapedData {
  logo?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
  };
  brandName?: string;
  tagline?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  instagram?: string;
  facebook?: string;
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  website?: string;
  products?: Array<{
    name: string;
    image?: string;
    price?: string;
    category?: string;
  }>;
  images?: string[];
  storyImages?: string[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log('Starting website scrape for:', formattedUrl);

    // Step 1: Scrape with branding to get colors and logo
    const brandingResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ['branding', 'links', 'markdown'],
        onlyMainContent: false,
        waitFor: 3000,
      }),
    });

    if (!brandingResponse.ok) {
      const errorData = await brandingResponse.text();
      console.error('Firecrawl branding error:', errorData);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to scrape website branding' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const brandingData = await brandingResponse.json();
    console.log('Branding data received');

    // Step 2: Extract structured data with JSON format
    const structuredResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: [{
          type: 'json',
          prompt: `Extract the following information from this business website:
          - Business name (brandName)
          - Tagline or slogan
          - Phone number (multiple formats: with +, spaces, dashes)
          - WhatsApp number if different from phone
          - Email address
          - Physical address
          - Instagram handle (just the username without @)
          - Facebook page URL or handle
          - Google Maps link
          - Up to 8 products or services with their names, images, and prices
          Return empty strings for missing fields, not null.`
        }],
        onlyMainContent: true,
      }),
    });

    let structuredData: any = {};
    if (structuredResponse.ok) {
      const jsonData = await structuredResponse.json();
      structuredData = jsonData.data?.json || jsonData.json || {};
      console.log('Structured data received');
    }

    // Process branding data
    const branding = brandingData.data?.branding || brandingData.branding || {};
    const links = brandingData.data?.links || brandingData.links || [];
    const markdown = brandingData.data?.markdown || brandingData.markdown || '';

    // Extract colors
    const colors = {
      primary: branding.colors?.primary || branding.colors?.accent || '#d4af37',
      secondary: branding.colors?.secondary || '#1a1a1a',
      accent: branding.colors?.accent || branding.colors?.primary || '#d4af37',
      background: branding.colors?.background || '#000000',
    };

    // Extract logo
    const logo = branding.images?.logo || branding.logo || '';

    // Extract social links from scraped links
    let instagram = structuredData.instagram || '';
    let facebook = structuredData.facebook || '';
    let googleMapsUrl = '';
    let whatsapp = structuredData.whatsapp || structuredData.phone || '';

    for (const link of links) {
      if (link.includes('instagram.com')) {
        const match = link.match(/instagram\.com\/([^\/\?]+)/);
        if (match) instagram = match[1];
      }
      if (link.includes('facebook.com')) {
        facebook = link;
      }
      if (link.includes('google.com/maps') || link.includes('maps.google.com') || link.includes('goo.gl/maps')) {
        googleMapsUrl = link;
      }
      if (link.includes('wa.me') || link.includes('whatsapp.com')) {
        const match = link.match(/wa\.me\/(\+?\d+)/);
        if (match) whatsapp = match[1];
      }
    }

    // Extract phone from markdown content if not found
    let phone = structuredData.phone || '';
    if (!phone && markdown) {
      const phoneMatch = markdown.match(/(\+?[\d\s\-\(\)]{10,})/);
      if (phoneMatch) phone = phoneMatch[1].trim();
    }

    // Extract images for products and stories
    const allImages: string[] = [];
    const imagePattern = /(https?:\/\/[^\s"']+\.(jpg|jpeg|png|webp|gif))/gi;
    const imageMatches = markdown.match(imagePattern) || [];
    allImages.push(...imageMatches.slice(0, 20));

    // Build products array
    const products = (structuredData.products || []).slice(0, 8).map((p: any) => ({
      name: p.name || '',
      image: p.image || allImages.shift() || '',
      price: p.price || '',
      category: p.category || '',
    }));

    // Fill remaining products with images
    while (products.length < 4 && allImages.length > 0) {
      const img = allImages.shift();
      if (img) {
        products.push({
          name: `Produit ${products.length + 1}`,
          image: img,
          price: '',
          category: '',
        });
      }
    }

    // Select images for stories (last 4 unique images)
    const storyImages = allImages.slice(0, 4);

    // Build final response
    const scrapedData: ScrapedData = {
      logo,
      colors,
      brandName: structuredData.brandName || branding.name || '',
      tagline: structuredData.tagline || branding.tagline || '',
      phone: phone.replace(/\s+/g, ''),
      whatsapp: whatsapp.replace(/\s+/g, ''),
      email: structuredData.email || '',
      address: structuredData.address || '',
      instagram,
      facebook,
      googleMapsUrl,
      website: formattedUrl,
      products,
      images: allImages,
      storyImages,
    };

    console.log('Scrape completed successfully');

    return new Response(
      JSON.stringify({ success: true, data: scrapedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in scrape-website function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
