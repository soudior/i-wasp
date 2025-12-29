import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Camera, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  type: "photo" | "logo";
  className?: string;
}

export function PhotoUpload({ value, onChange, type, className }: PhotoUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${type}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("card-assets")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("card-assets")
        .getPublicUrl(filePath);

      onChange(publicUrl);
      toast.success(`${type === "photo" ? "Photo" : "Logo"} uploaded!`);
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className={cn("relative", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />

      {value ? (
        <div className="relative group">
          <div
            className={cn(
              "overflow-hidden border-2 border-white/20 bg-white/5 backdrop-blur-xl",
              type === "photo" ? "w-24 h-24 rounded-full" : "w-32 h-16 rounded-xl"
            )}
          >
            <img
              src={value}
              alt={type}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
          >
            <Camera className="w-6 h-6 text-white" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all",
            type === "photo" ? "w-24 h-24 rounded-full" : "w-32 h-16 rounded-xl"
          )}
        >
          {uploading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Upload className="w-5 h-5 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">
                {type === "photo" ? "Photo" : "Logo"}
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
