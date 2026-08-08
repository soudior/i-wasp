-- SÉCURITÉ (P2-STORAGE) — Durcissement des buckets d'images (sûr, sans effet de bord).
--
-- Contexte : les buckets d'images n'avaient ni limite de type MIME ni limite de
-- taille au niveau serveur (validation seulement côté client, contournable).
--
-- Correctif SÛR : restreindre les types MIME aux images et fixer une taille max.
-- On NE touche PAS aux policies RLS ni aux chemins d'upload — donc aucun flux
-- existant (order-photos/, form-photos/, admin-uploads/, {user.id}/…) n'est cassé.
--
-- Note : le scoping « owner » (auth.uid() = 1er segment du chemin) N'EST PAS
-- appliqué ici car les écrivains utilisent des préfixes hétérogènes
-- (voir SECURITY_NOTES.md) ; l'appliquer casserait le tunnel de commande, le
-- formulaire client et l'admin. Il nécessite d'abord d'unifier les chemins.

UPDATE storage.buckets
SET
  file_size_limit = 10485760, -- 10 Mo
  allowed_mime_types = ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif','image/svg+xml']
WHERE id IN ('card-assets', 'stories');
