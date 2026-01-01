import React, { useState, useEffect } from 'react';
import { Star, ExternalLink, MapPin, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface GoogleReviewsEditorProps {
  initialUrl?: string;
  initialRating?: number;
  initialReviewCount?: number;
  onUpdate?: (data: { url: string; rating: number; reviewCount: number }) => void;
}

const GoogleReviewsEditor: React.FC<GoogleReviewsEditorProps> = ({
  initialUrl = '',
  initialRating = 4.5,
  initialReviewCount = 0,
  onUpdate
}) => {
  const [googleUrl, setGoogleUrl] = useState(initialUrl);
  const [rating, setRating] = useState(initialRating);
  const [reviewCount, setReviewCount] = useState(initialReviewCount);
  const [isValidUrl, setIsValidUrl] = useState(false);

  useEffect(() => {
    const valid = googleUrl.includes('google.com/maps') || 
                  googleUrl.includes('g.page') || 
                  googleUrl.includes('goo.gl/maps') ||
                  googleUrl.includes('business.google.com');
    setIsValidUrl(valid && googleUrl.length > 0);
  }, [googleUrl]);

  useEffect(() => {
    onUpdate?.({ url: googleUrl, rating, reviewCount });
  }, [googleUrl, rating, reviewCount, onUpdate]);

  const renderStars = (value: number) => {
    const stars = [];
    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star 
            key={i} 
            className="w-5 h-5 fill-yellow-400 text-yellow-400" 
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-5 h-5">
            <Star className="absolute w-5 h-5 text-muted-foreground/30" />
            <div className="absolute overflow-hidden w-[50%]">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star 
            key={i} 
            className="w-5 h-5 text-muted-foreground/30" 
          />
        );
      }
    }
    return stars;
  };

  const openGooglePage = () => {
    if (isValidUrl) {
      window.open(googleUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Avis Google</h3>
          <p className="text-sm text-muted-foreground">Affichez vos avis clients</p>
        </div>
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Lien Google Business / Maps</Label>
        <div className="relative">
          <Input
            type="url"
            value={googleUrl}
            onChange={(e) => setGoogleUrl(e.target.value)}
            placeholder="https://g.page/votre-entreprise ou lien Google Maps"
            className="pr-10 h-12 rounded-xl border-border/50 bg-background/50"
          />
          {isValidUrl && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Check className="w-5 h-5 text-green-500" />
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Collez votre lien Google Business, g.page ou Google Maps
        </p>
      </div>

      {/* Rating Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Note moyenne</Label>
          <span className="text-lg font-bold text-foreground">{rating.toFixed(1)}</span>
        </div>
        <Slider
          value={[rating]}
          onValueChange={(v) => setRating(v[0])}
          min={1}
          max={5}
          step={0.1}
          className="py-2"
        />
        <div className="flex justify-center gap-1">
          {renderStars(rating)}
        </div>
      </div>

      {/* Review Count */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Nombre d'avis</Label>
        <Input
          type="number"
          value={reviewCount}
          onChange={(e) => setReviewCount(Math.max(0, parseInt(e.target.value) || 0))}
          placeholder="0"
          min={0}
          className="h-12 rounded-xl border-border/50 bg-background/50"
        />
      </div>

      {/* Preview Card */}
      {(isValidUrl || rating > 0) && (
        <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Aperçu sur votre carte
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-foreground">{rating.toFixed(1)}</span>
                  <div className="flex gap-0.5">
                    {renderStars(rating)}
                  </div>
                </div>
                {reviewCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {reviewCount.toLocaleString('fr-FR')} avis
                  </p>
                )}
              </div>
            </div>
          </div>

          {isValidUrl && (
            <Button
              onClick={openGooglePage}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-medium shadow-lg"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Voir les avis Google
            </Button>
          )}
        </div>
      )}

      {/* Quick Actions */}
      {isValidUrl && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={openGooglePage}
            className="flex-1 h-11 rounded-xl border-border/50"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Ouvrir le lien
          </Button>
        </div>
      )}
    </div>
  );
};

export default GoogleReviewsEditor;
