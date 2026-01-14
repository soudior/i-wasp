/**
 * Blog Editor Page
 * Éditeur de blog pour les sites Web Studio
 * Accessible via token unique (pas besoin de login)
 */

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  FileText,
  Loader2,
  ArrowLeft,
  Globe,
  Image as ImageIcon,
  AlertCircle
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface BlogInfo {
  siteName: string;
  proposalId: string;
  posts: BlogPost[];
  totalPosts: number;
  publishedPosts: number;
}

const API_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/blog-editor-api`;

export default function BlogEditor() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const queryClient = useQueryClient();

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteConfirmPost, setDeleteConfirmPost] = useState<BlogPost | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formCoverImage, setFormCoverImage] = useState("");
  const [formPublished, setFormPublished] = useState(false);

  // Fetch blog info and posts
  const { data: blogData, isLoading, error } = useQuery<BlogInfo>({
    queryKey: ["blog-editor", token],
    queryFn: async () => {
      if (!token) throw new Error("Token manquant");
      
      const response = await fetch(`${API_BASE}?token=${token}&action=list`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur de chargement");
      }
      return response.json();
    },
    enabled: !!token,
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (isNew: boolean) => {
      const action = isNew ? "create" : "update";
      const body: Record<string, unknown> = {
        title: formTitle,
        content: formContent,
        excerpt: formExcerpt || undefined,
        cover_image_url: formCoverImage || undefined,
      };

      if (!isNew) {
        body.postId = editingPost?.id;
        body.published = formPublished;
      }

      const response = await fetch(`${API_BASE}?token=${token}&action=${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur de sauvegarde");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-editor", token] });
      toast.success(editingPost ? "Article mis à jour" : "Article créé");
      closeEditor();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erreur de sauvegarde");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`${API_BASE}?token=${token}&action=delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur de suppression");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-editor", token] });
      toast.success("Article supprimé");
      setDeleteConfirmPost(null);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erreur de suppression");
    },
  });

  // Toggle publish mutation
  const togglePublishMutation = useMutation({
    mutationFn: async ({ postId, published }: { postId: string; published: boolean }) => {
      const response = await fetch(`${API_BASE}?token=${token}&action=update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, published }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur de mise à jour");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blog-editor", token] });
      toast.success(variables.published ? "Article publié" : "Article dépublié");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Erreur");
    },
  });

  const openNewPost = () => {
    setEditingPost(null);
    setFormTitle("");
    setFormContent("");
    setFormExcerpt("");
    setFormCoverImage("");
    setFormPublished(false);
    setIsEditorOpen(true);
  };

  const openEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormContent(post.content);
    setFormExcerpt(post.excerpt || "");
    setFormCoverImage(post.cover_image_url || "");
    setFormPublished(post.published);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingPost(null);
  };

  const handleSave = () => {
    if (!formTitle.trim() || !formContent.trim()) {
      toast.error("Titre et contenu requis");
      return;
    }
    saveMutation.mutate(!editingPost);
  };

  // No token state
  if (!token) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-[#1D1D1F] mb-2">Accès refusé</h1>
            <p className="text-[#8E8E93]">
              Token d'accès manquant. Utilisez le lien fourni dans votre email de confirmation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#007AFF]" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-[#1D1D1F] mb-2">Erreur</h1>
            <p className="text-[#8E8E93]">
              {error instanceof Error ? error.message : "Impossible de charger l'éditeur"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const posts = blogData?.posts || [];

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E5E5EA]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#007AFF] to-[#5856D6] flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-[#1D1D1F]">{blogData?.siteName || "Mon Blog"}</h1>
              <p className="text-xs text-[#8E8E93]">Éditeur de blog</p>
            </div>
          </div>
          <Button onClick={openNewPost} className="gap-2 bg-[#007AFF] hover:bg-[#0056CC]">
            <Plus className="h-4 w-4" />
            Nouvel article
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-[#1D1D1F]">{posts.length}</div>
              <p className="text-sm text-[#8E8E93]">Articles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">
                {posts.filter(p => p.published).length}
              </div>
              <p className="text-sm text-[#8E8E93]">Publiés</p>
            </CardContent>
          </Card>
        </div>

        {/* Posts list */}
        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-[#8E8E93] mx-auto mb-4" />
              <h2 className="text-lg font-medium text-[#1D1D1F] mb-2">Aucun article</h2>
              <p className="text-[#8E8E93] mb-4">
                Créez votre premier article de blog
              </p>
              <Button onClick={openNewPost} className="bg-[#007AFF] hover:bg-[#0056CC]">
                <Plus className="h-4 w-4 mr-2" />
                Créer un article
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-[#1D1D1F] truncate">
                            {post.title}
                          </h3>
                          <Badge 
                            variant={post.published ? "default" : "secondary"}
                            className={post.published ? "bg-green-100 text-green-700" : ""}
                          >
                            {post.published ? "Publié" : "Brouillon"}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#8E8E93] line-clamp-2 mb-2">
                          {post.excerpt || post.content.substring(0, 150)}
                        </p>
                        <p className="text-xs text-[#8E8E93]">
                          {new Date(post.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => togglePublishMutation.mutate({
                            postId: post.id,
                            published: !post.published
                          })}
                          title={post.published ? "Dépublier" : "Publier"}
                        >
                          {post.published ? (
                            <EyeOff className="h-4 w-4 text-[#8E8E93]" />
                          ) : (
                            <Eye className="h-4 w-4 text-[#007AFF]" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditPost(post)}
                        >
                          <Edit className="h-4 w-4 text-[#8E8E93]" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteConfirmPost(post)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Modifier l'article" : "Nouvel article"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Titre de l'article"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Résumé</Label>
              <Textarea
                id="excerpt"
                value={formExcerpt}
                onChange={(e) => setFormExcerpt(e.target.value)}
                placeholder="Courte description (optionnel)"
                className="mt-1 h-20"
              />
            </div>

            <div>
              <Label htmlFor="cover">Image de couverture (URL)</Label>
              <Input
                id="cover"
                value={formCoverImage}
                onChange={(e) => setFormCoverImage(e.target.value)}
                placeholder="https://..."
                className="mt-1"
              />
              {formCoverImage && (
                <img
                  src={formCoverImage}
                  alt="Preview"
                  className="mt-2 h-32 w-full object-cover rounded-lg"
                  onError={(e) => e.currentTarget.style.display = 'none'}
                />
              )}
            </div>

            <div>
              <Label htmlFor="content">Contenu *</Label>
              <Textarea
                id="content"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="Écrivez votre article ici... (Markdown supporté)"
                className="mt-1 h-64 font-mono text-sm"
              />
            </div>

            {editingPost && (
              <div className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-lg">
                <div>
                  <Label htmlFor="published">Publier l'article</Label>
                  <p className="text-xs text-[#8E8E93]">
                    Les articles publiés sont visibles sur votre site
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={formPublished}
                  onCheckedChange={setFormPublished}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeEditor}>
              Annuler
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saveMutation.isPending}
              className="bg-[#007AFF] hover:bg-[#0056CC]"
            >
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {editingPost ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirmPost} onOpenChange={() => setDeleteConfirmPost(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Supprimer l'article ?</DialogTitle>
          </DialogHeader>
          <p className="text-[#8E8E93]">
            Cette action est irréversible. L'article "{deleteConfirmPost?.title}" sera définitivement supprimé.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmPost(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmPost && deleteMutation.mutate(deleteConfirmPost.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-[#E5E5EA] bg-white">
        <p className="text-sm text-[#8E8E93]">
          Powered by <span className="font-medium text-[#007AFF]">IWASP</span>
        </p>
      </footer>
    </div>
  );
}
