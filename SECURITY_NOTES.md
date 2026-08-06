# SECURITY_NOTES — i-wasp

> Correctifs de sécurité identifiés lors de l'audit. Certains touchent des données
> de production ou des dépendances frontend : ils sont **préparés ici avec leurs
> mises en garde**, à appliquer délibérément côté Supabase après relecture.
> Réf. : `AUDIT.md`.

## ✅ Appliqué dans le dépôt

### P1-RLS — Tokens d'édition de blog world-readable
- **Migration :** `supabase/migrations/20260806000000_fix_blog_tokens_rls_lockdown.sql`
- Supprime les policies `FOR ALL USING(true)` (appliquées à `anon` faute de clause `TO`) qui annulaient le verrou `USING(false)`. Le `service_role` des edge functions contourne la RLS, donc aucune régression fonctionnelle.
- **Vérification après application :** avec la clé anon, `select * from website_blog_tokens` doit renvoyer 0 ligne ; `blog-editor-api` doit continuer de fonctionner (utilise le service-role).

---

## 🔒 À appliquer après décision (drafts + mises en garde)

### P0-2 — Webhook Stripe sans vérification de signature
- **Fichier :** `supabase/functions/stripe-webhook/index.ts`
- **Nécessite le secret `STRIPE_WEBHOOK_SECRET`.**
- Remplacer `const event = JSON.parse(body)` par une vérification de signature :
  ```ts
  const signature = req.headers.get("stripe-signature");
  const event = await stripe.webhooks.constructEventAsync(
    body, signature, Deno.env.get("STRIPE_WEBHOOK_SECRET")!
  );
  ```
- **Mise en garde :** tester avec le CLI Stripe (`stripe listen`) avant mise en prod ; sans le secret configuré, tous les webhooks échoueront.

### P1-ACT — Code d'activation dérivable de l'UUID
- **Problème :** `serial_code = 12 premiers hex de l'UUID`, et l'UUID est renvoyé aux visiteurs anonymes par `get_public_card`.
- **⚠️ Mise en garde forte :** NE PAS régénérer les `serial_code` des cartes **déjà imprimées/livrées** — cela invaliderait les codes gravés au dos. La randomisation ne doit s'appliquer qu'aux **nouvelles** cartes.
- **Draft (nouvelles cartes uniquement) :**
  ```sql
  CREATE OR REPLACE FUNCTION public.generate_serial_code()
  RETURNS trigger LANGUAGE plpgsql AS $$
  BEGIN
    IF NEW.serial_code IS NULL THEN
      -- Aléatoire, indépendant de l'UUID (ex. 12 caractères base32)
      NEW.serial_code := upper(substr(encode(gen_random_bytes(9), 'hex'), 1, 12));
    END IF;
    RETURN NEW;
  END; $$;
  ```
- **Complément (frontend + RPC) :** cesser d'exposer l'UUID brut via `get_public_card`. **Attention** : `usePublicCard`/`PublicCard` utilisent `card.id` (scan, stories). Il faut d'abord introduire un identifiant public dédié (ou faire résoudre le scan/stories côté serveur par slug) avant de retirer l'UUID, sinon on casse l'enregistrement des scans et les stories.

### P1-ACT (suite) — Activation ne liant pas la carte au compte
- `verify_activation_code` renvoie seulement nom/slug ; l'activation n'associe pas `user_id`.
- **Draft d'orientation :** créer une RPC `claim_card(p_serial, p_user)` en `SECURITY DEFINER` qui, sur code valide, écrit `digital_cards.user_id = auth.uid()` si la carte n'est pas déjà revendiquée, et journalise l'activation. Adapter `Activation.tsx` pour appeler cette RPC (utilisateur authentifié requis).

### P2-STORAGE — Écriture non scoping-owner sur `card-assets`
- **✅ Durcissement sûr appliqué (migration `20260806000002`)** : `file_size_limit` (10 Mo)
  + `allowed_mime_types` (images) sur les buckets `card-assets` et `stories`. Ne touche
  ni aux chemins ni à la RLS → aucun flux cassé.
- **🔒 Scoping owner NON appliqué — bloqué par des chemins d'upload hétérogènes.**
  Audit des 13 écrivains de `card-assets` : les chemins ne sont pas tous préfixés
  par `{user.id}/` :
  - ✅ `PhotoUpload`, `StepMedia`, `OnboardingPhotoUpload` → `${user.id}/…`
  - ❌ `order/OrderIdentite` → `order-photos/…` (flux commande, parfois invité)
  - ❌ `ClientForm` → `form-photos/…` (invité)
  - ❌ `AdminCreator`, `AdminInstantCard`, `AdminCardGenerator` → `admin-uploads/…` (admin agissant pour un client)
  - Appliquer `auth.uid()::text = (storage.foldername(name))[1]` **casserait** ces flux.
- **Pré-requis avant scoping owner :** unifier les chemins (ex. `{user.id}/…` pour les
  utilisateurs authentifiés ; un bucket/préfixe dédié + policy adaptée pour les uploads
  invités du tunnel de commande), puis appliquer :
  ```sql
  CREATE POLICY "card-assets owner insert" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'card-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
  -- + policy distincte pour les préfixes invités/admin
  ```

### P2-WIFI — Lecture publique de tous les mots de passe wifi
- `wifi_configs` (`USING(true)`) et `rental_properties` (`USING(is_active=true)`) exposent tous les SSID/mots de passe.
- **Orientation :** créer une RPC `SECURITY DEFINER get_wifi_for_slug(p_slug)` renvoyant uniquement la config du slug demandé, restreindre le `SELECT` direct des tables, et adapter `LuxuryWifiPage`/hooks pour utiliser la RPC.
- **⚠️ Mise en garde :** la page `/wifi/:slug` est publique — ne pas simplement supprimer le `SELECT` public sans fournir la RPC de remplacement, sinon la page casse.

### P1-AI / P2 — Fonctions IA publiques sans garde
- Fonctions `verify_jwt=false` appelant des API payantes (Lovable) sans auth ni rate-limit → risque de drain de crédits (`generate-image`, `generate-website(-code)`, `regenerate-text`, `webstudio-chat`, `smart-suggestions`).
- **Orientation :** exiger un JWT quand l'appelant est censé être authentifié, ou un rate-limiting par IP (table `analytics_events`/edge KV), ou un secret partagé. **Mise en garde :** certaines sont appelées anonymement par le funnel Web Studio — vérifier chaque appelant avant de forcer l'auth.

### P2-EMAIL-RELAY — `test-email` public
- **Orientation :** retirer la fonction de la prod, ou passer `verify_jwt=true` dans `supabase/config.toml` (vérifier qu'aucun appel anonyme légitime n'existe).

---

## Rappel — secrets requis (voir ENVIRONMENT.md)

- `STRIPE_WEBHOOK_SECRET` (P0-2)
- Accès Supabase (SQL editor / migrations) pour appliquer les correctifs RLS/RPC.
