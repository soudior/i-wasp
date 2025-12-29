import { 
  getTemplateComponent, 
  TemplateType, 
  CardData,
  ExecutiveTemplate 
} from "./templates/CardTemplates";

interface DigitalCardProps {
  data?: CardData;
  template?: TemplateType;
  showWalletButtons?: boolean;
  onShareInfo?: () => void;
}

const defaultData: CardData = {
  firstName: "Alexandre",
  lastName: "Dubois",
  title: "Directeur Général",
  company: "Prestige Corp",
  email: "a.dubois@prestige.com",
  phone: "+33 6 12 34 56 78",
  location: "Paris, France",
  website: "prestige-corp.com",
  linkedin: "alexandre-dubois",
  instagram: "@adubois",
  tagline: "L'excellence en toute simplicité",
};

export function DigitalCard({ 
  data = defaultData, 
  template = "executive", 
  showWalletButtons = true,
  onShareInfo
}: DigitalCardProps) {
  const TemplateComponent = getTemplateComponent(template);
  const cardData = { ...defaultData, ...data };

  return (
    <TemplateComponent 
      data={cardData} 
      showWalletButtons={showWalletButtons}
      onShareInfo={onShareInfo}
    />
  );
}
