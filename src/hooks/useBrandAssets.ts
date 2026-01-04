import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BrandAsset {
  id: string;
  asset_type: 'logo_svg' | 'logo_png' | 'logo_pdf' | 'card_front' | 'card_back';
  file_url: string;
  file_name: string;
  uploaded_by: string | null;
  is_locked: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const ASSET_LABELS: Record<string, string> = {
  logo_svg: "Logo SVG",
  logo_png: "Logo PNG HD",
  logo_pdf: "Logo PDF",
  card_front: "Carte recto (PDF print)",
  card_back: "Carte verso (PDF print)",
};

export const BRAND_COLORS = [
  { name: "Noir principal", hex: "#0B0B0B", usage: "Fond principal, carte physique" },
  { name: "Noir secondaire", hex: "#121212", usage: "Surfaces, cartes UI" },
  { name: "Blanc", hex: "#FFFFFF", usage: "Texte principal" },
  { name: "Jaune signature", hex: "#FFC700", usage: "CTA, accent, logo" },
];

export function useBrandAssets() {
  return useQuery({
    queryKey: ["brand-assets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brand_assets")
        .select("*")
        .order("asset_type");

      if (error) throw error;
      return data as BrandAsset[];
    },
  });
}

export function useUploadBrandAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      assetType,
    }: {
      file: File;
      assetType: string;
    }) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${assetType}.${fileExt}`;
      const filePath = `official/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("brand-assets")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("brand-assets")
        .getPublicUrl(filePath);

      // Upsert metadata
      const { error: dbError } = await supabase
        .from("brand_assets")
        .upsert(
          {
            asset_type: assetType,
            file_url: urlData.publicUrl,
            file_name: file.name,
            is_locked: true,
          },
          { onConflict: "asset_type" }
        );

      if (dbError) throw dbError;

      return urlData.publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brand-assets"] });
      toast.success("Asset uploadé avec succès");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de l'upload");
    },
  });
}

export function useDeleteBrandAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assetType: string) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("brand-assets")
        .remove([`official/${assetType}.*`]);

      // Delete from database
      const { error: dbError } = await supabase
        .from("brand_assets")
        .delete()
        .eq("asset_type", assetType);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brand-assets"] });
      toast.success("Asset supprimé");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur lors de la suppression");
    },
  });
}
