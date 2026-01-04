import { MessageCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WHATSAPP_URL = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20des%20informations%20sur%20i-wasp.";

export function FloatingWhatsApp() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-20 right-4 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform md:bottom-6"
            aria-label="Contacter via WhatsApp"
          >
            <MessageCircle className="w-7 h-7" />
          </a>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-foreground text-background">
          <p>Besoin d'aide ?</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
