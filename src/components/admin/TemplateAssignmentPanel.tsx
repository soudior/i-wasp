/**
 * Admin Panel for Template Assignments
 * Allows admins to assign private templates to clients
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Key, 
  Lock, 
  Unlock,
  Trash2, 
  Plus,
  Search,
  Check,
  X,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  useAllTemplateAssignments,
  useAssignTemplate,
  useRemoveTemplateAssignment,
  useUpdateTemplateAssignment,
  useApplyTemplateToCard,
} from "@/hooks/useTemplateAssignments";
import {
  getPrivateTemplates,
  getVisibilityLabel,
  getVisibilityColor,
  type TemplateRegistryEntry,
} from "@/lib/templateRegistry";

interface UserWithCard {
  id: string;
  email: string;
  cards: Array<{
    id: string;
    first_name: string;
    last_name: string;
    template: string;
  }>;
}

export function TemplateAssignmentPanel() {
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [isLocked, setIsLocked] = useState(true);
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: assignments, isLoading: assignmentsLoading } = useAllTemplateAssignments();
  const assignTemplate = useAssignTemplate();
  const removeAssignment = useRemoveTemplateAssignment();
  const updateAssignment = useUpdateTemplateAssignment();
  const applyToCard = useApplyTemplateToCard();

  const privateTemplates = useMemo(() => getPrivateTemplates(), []);

  // Fetch users with their cards
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users-with-cards"],
    queryFn: async () => {
      // Get all users from profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name");

      if (profilesError) throw profilesError;

      // Get all cards
      const { data: cards, error: cardsError } = await supabase
        .from("digital_cards")
        .select("id, user_id, first_name, last_name, template");

      if (cardsError) throw cardsError;

      // Get user emails from auth (we'll use card names as fallback)
      const usersMap = new Map<string, UserWithCard>();

      // Add users from cards
      cards?.forEach((card) => {
        if (!usersMap.has(card.user_id)) {
          usersMap.set(card.user_id, {
            id: card.user_id,
            email: `${card.first_name} ${card.last_name}`,
            cards: [],
          });
        }
        usersMap.get(card.user_id)?.cards.push({
          id: card.id,
          first_name: card.first_name,
          last_name: card.last_name,
          template: card.template,
        });
      });

      return Array.from(usersMap.values());
    },
  });

  const handleAssign = async () => {
    if (!selectedUser || !selectedTemplate) return;

    await assignTemplate.mutateAsync({
      userId: selectedUser,
      templateId: selectedTemplate,
      isLocked,
      notes: notes || undefined,
    });

    // Apply template to user's first card
    const user = users?.find((u) => u.id === selectedUser);
    if (user?.cards[0]) {
      await applyToCard.mutateAsync({
        cardId: user.cards[0].id,
        templateId: selectedTemplate,
      });
    }

    setShowAssignDialog(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedUser("");
    setSelectedTemplate("");
    setIsLocked(true);
    setNotes("");
  };

  const handleToggleLock = async (assignmentId: string, currentLock: boolean) => {
    await updateAssignment.mutateAsync({
      assignmentId,
      isLocked: !currentLock,
    });
  };

  const handleRemove = async (assignmentId: string) => {
    if (confirm("Supprimer cette assignation ?")) {
      await removeAssignment.mutateAsync(assignmentId);
    }
  };

  const filteredAssignments = useMemo(() => {
    if (!assignments) return [];
    if (!searchQuery) return assignments;

    const query = searchQuery.toLowerCase();
    return assignments.filter((a) => {
      const user = users?.find((u) => u.id === a.user_id);
      const template = privateTemplates.find((t) => t.id === a.template_id);
      return (
        user?.email.toLowerCase().includes(query) ||
        template?.name.toLowerCase().includes(query) ||
        a.template_id.toLowerCase().includes(query)
      );
    });
  }, [assignments, searchQuery, users, privateTemplates]);

  const getTemplateName = (templateId: string): string => {
    const template = privateTemplates.find((t) => t.id === templateId);
    return template?.name || templateId;
  };

  const getUserName = (userId: string): string => {
    const user = users?.find((u) => u.id === userId);
    return user?.email || userId.substring(0, 8) + "...";
  };

  if (assignmentsLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-[#FFC700] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Assignation des Templates</h2>
          <p className="text-sm text-gray-400">
            Assignez des templates privés aux comptes clients
          </p>
        </div>
        <Button
          onClick={() => setShowAssignDialog(true)}
          className="bg-[#FFC700] hover:bg-[#FFD633] text-black"
        >
          <Plus className="w-4 h-4 mr-2" />
          Assigner un template
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Rechercher par client ou template..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-[#1F1F1F] border-0 text-white"
        />
      </div>

      {/* Private Templates List */}
      <Card className="bg-[#1F1F1F] border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Key className="w-4 h-4" />
            Templates Privés Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {privateTemplates.map((template) => (
              <Badge
                key={template.id}
                className="bg-amber-500/20 text-amber-400 border-0"
              >
                {template.name}
              </Badge>
            ))}
            {privateTemplates.length === 0 && (
              <p className="text-gray-500 text-sm">Aucun template privé</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <Card className="bg-[#1F1F1F] border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Assignations Actives ({filteredAssignments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAssignments.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">
              Aucune assignation pour le moment
            </p>
          ) : (
            <div className="space-y-3">
              {filteredAssignments.map((assignment) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 bg-[#2A2A2A] rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#3A3A3A] flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        {getUserName(assignment.user_id)}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge className="bg-amber-500/20 text-amber-400 border-0 text-xs">
                          {getTemplateName(assignment.template_id)}
                        </Badge>
                        {assignment.is_locked ? (
                          <Badge className="bg-red-500/20 text-red-400 border-0 text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            Verrouillé
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                            <Unlock className="w-3 h-3 mr-1" />
                            Déverrouillé
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleLock(assignment.id, assignment.is_locked)}
                      className="text-gray-400 hover:text-white"
                    >
                      {assignment.is_locked ? (
                        <Unlock className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(assignment.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent className="bg-[#1F1F1F] border-0 text-white">
          <DialogHeader>
            <DialogTitle>Assigner un Template Privé</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* User Selection */}
            <div className="space-y-2">
              <Label>Client</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="bg-[#2A2A2A] border-0 text-white">
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2A2A] border-0">
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.email}
                      {user.cards.length > 0 && (
                        <span className="text-gray-400 ml-2">
                          ({user.cards.length} carte{user.cards.length > 1 ? "s" : ""})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template Selection */}
            <div className="space-y-2">
              <Label>Template Privé</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="bg-[#2A2A2A] border-0 text-white">
                  <SelectValue placeholder="Sélectionner un template" />
                </SelectTrigger>
                <SelectContent className="bg-[#2A2A2A] border-0">
                  {privateTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                      <span className="text-gray-400 ml-2">
                        ({template.category})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lock Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Verrouiller le template</Label>
                <p className="text-xs text-gray-400">
                  Empêche le client de changer de template
                </p>
              </div>
              <Switch
                checked={isLocked}
                onCheckedChange={setIsLocked}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label>Notes (optionnel)</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes internes..."
                className="bg-[#2A2A2A] border-0 text-white resize-none"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setShowAssignDialog(false);
                resetForm();
              }}
              className="text-gray-400"
            >
              Annuler
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedUser || !selectedTemplate || assignTemplate.isPending}
              className="bg-[#FFC700] hover:bg-[#FFD633] text-black"
            >
              {assignTemplate.isPending ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Assigner
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TemplateAssignmentPanel;
