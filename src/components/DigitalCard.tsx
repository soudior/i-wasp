import { 
  getTemplateComponent, 
  TemplateType, 
  CardData,
  ExecutiveTemplate 
} from "./templates/CardTemplates";
import { SmartContext } from "@/hooks/useSmartContext";

interface DigitalCardProps {
  data: CardData; // REQUIRED - no default fallback
  template?: TemplateType;
  showWalletButtons?: boolean;
  onShareInfo?: () => void;
  cardId?: string;
  enableLeadCapture?: boolean;
  smartContext?: SmartContext;
}

export function DigitalCard({ 
  data, 
  template = "signature",
  showWalletButtons = true,
  onShareInfo,
  cardId,
  enableLeadCapture = false,
  smartContext
}: DigitalCardProps) {
  // CRITICAL: No default data - card requires explicit data
  if (!data || !data.firstName || !data.lastName) {
    return null;
  }

  const TemplateComponent = getTemplateComponent(template);

  return (
    <TemplateComponent 
      data={data} 
      showWalletButtons={showWalletButtons}
      onShareInfo={onShareInfo}
      cardId={cardId}
      enableLeadCapture={enableLeadCapture}
      smartContext={smartContext}
    />
  );
}
