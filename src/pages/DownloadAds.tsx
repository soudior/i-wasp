import iwaspSquare from "@/assets/ads/iwasp-square.png";
import iwaspHorizontal from "@/assets/ads/iwasp-horizontal.png";
import iwaspLogo from "@/assets/ads/iwasp-logo.png";
import { Download } from "lucide-react";

const DownloadAds = () => {
  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const images = [
    {
      src: iwaspSquare,
      name: "iwasp-square.png",
      label: "Image Carrée",
      size: "1024 × 1024",
    },
    {
      src: iwaspHorizontal,
      name: "iwasp-horizontal.png",
      label: "Image Horizontale",
      size: "1920 × 1080",
    },
    {
      src: iwaspLogo,
      name: "iwasp-logo.png",
      label: "Logo",
      size: "1024 × 1024",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Images Google Ads
        </h1>
        <p className="text-muted-foreground mb-8">
          Cliquez sur "Télécharger" pour sauvegarder chaque image
        </p>

        <div className="grid gap-6">
          {images.map((image) => (
            <div
              key={image.name}
              className="bg-card rounded-2xl border border-border p-4 md:p-6"
            >
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <img
                  src={image.src}
                  alt={image.label}
                  className="w-full md:w-48 h-auto rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-foreground">
                    {image.label}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {image.size}
                  </p>
                  <button
                    onClick={() => handleDownload(image.src, image.name)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DownloadAds;
