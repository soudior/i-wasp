/**
 * StepIdentity - Étape 1: Informations personnelles
 * 
 * Design IWASP premium avec validation
 */

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CardFormData } from "../CardWizard";
import { User, Briefcase, Building2, Mail, Phone, MapPin, MessageSquare } from "lucide-react";

interface StepIdentityProps {
  data: CardFormData;
  onChange: (updates: Partial<CardFormData>) => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function StepIdentity({ data, onChange }: StepIdentityProps) {
  return (
    <Card className="border-border/50 shadow-xl">
      <CardContent className="p-6 space-y-5">
        {/* Required fields */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm flex items-center gap-2">
              <User size={14} className="text-accent" />
              Prénom *
            </Label>
            <Input
              id="firstName"
              placeholder="Alexandre"
              value={data.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              className="h-12 bg-muted/50 border-border/50 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm flex items-center gap-2">
              <User size={14} className="text-accent" />
              Nom *
            </Label>
            <Input
              id="lastName"
              placeholder="Dubois"
              value={data.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              className="h-12 bg-muted/50 border-border/50 rounded-xl"
            />
          </div>
        </motion.div>

        {/* Title & Company */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <Label htmlFor="title" className="text-sm flex items-center gap-2">
            <Briefcase size={14} className="text-muted-foreground" />
            Fonction
          </Label>
          <Input
            id="title"
            placeholder="Directeur Général"
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="h-12 bg-muted/50 border-border/50 rounded-xl"
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.25 }}
          className="space-y-2"
        >
          <Label htmlFor="company" className="text-sm flex items-center gap-2">
            <Building2 size={14} className="text-muted-foreground" />
            Entreprise
          </Label>
          <Input
            id="company"
            placeholder="Prestige Corp"
            value={data.company}
            onChange={(e) => onChange({ company: e.target.value })}
            className="h-12 bg-muted/50 border-border/50 rounded-xl"
          />
        </motion.div>

        {/* Contact */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm flex items-center gap-2">
              <Mail size={14} className="text-muted-foreground" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@example.com"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="h-12 bg-muted/50 border-border/50 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm flex items-center gap-2">
              <Phone size={14} className="text-muted-foreground" />
              Téléphone
            </Label>
            <Input
              id="phone"
              placeholder="+33 6 12 34 56 78"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="h-12 bg-muted/50 border-border/50 rounded-xl"
            />
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.35 }}
          className="space-y-2"
        >
          <Label htmlFor="location" className="text-sm flex items-center gap-2">
            <MapPin size={14} className="text-muted-foreground" />
            Localisation
          </Label>
          <Input
            id="location"
            placeholder="Paris, France"
            value={data.location}
            onChange={(e) => onChange({ location: e.target.value })}
            className="h-12 bg-muted/50 border-border/50 rounded-xl"
          />
        </motion.div>

        {/* Tagline */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <Label htmlFor="tagline" className="text-sm flex items-center gap-2">
            <MessageSquare size={14} className="text-muted-foreground" />
            Phrase signature
          </Label>
          <Input
            id="tagline"
            placeholder="L'excellence en toute simplicité"
            value={data.tagline}
            onChange={(e) => onChange({ tagline: e.target.value })}
            className="h-12 bg-muted/50 border-border/50 rounded-xl"
          />
          <p className="text-xs text-muted-foreground">
            Une phrase qui vous représente
          </p>
        </motion.div>
      </CardContent>
    </Card>
  );
}

export default StepIdentity;