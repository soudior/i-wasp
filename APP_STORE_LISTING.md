# APP_STORE_LISTING — Contenu & conformité de la fiche App Store (i-wasp)

> Tout le contenu prêt à copier-coller dans **App Store Connect**. Rien ici n'est
> un secret. Les valeurs d'identité (Bundle ID, Team ID, App ID) sont dans
> `APP_STORE_CHECKLIST.md` §7.
> Statut : ☐ à saisir dans App Store Connect · ✅ prêt dans le dépôt.

---

## 1. Décision — Sign in with Apple (Guideline 4.8)

**Audit des méthodes de connexion réellement présentes dans le code :**

| Méthode | Où | Type |
|---------|-----|------|
| Email + mot de passe | `AuthContext.signUp` / `signInWithPassword` (Login, Signup, SaaSPricing, IWASPElite, AdminCreator) | Compte first-party i-wasp |
| Google OAuth | `useGoogleAuth` + `signInWithOAuth({provider:'google'})` (Login, IWASPElite) | **Social login tiers** |
| Sign in with Apple | `useAppleAuth` + `AppleSignInButton` (Login, Signup) | ✅ **Ajouté** |

**Règle Apple 4.8 (correcte) :** dès qu'une app propose un login social/tiers
(Google, Facebook…) pour **créer ou authentifier le compte principal**, elle
**doit** offrir une option de connexion équivalente respectueuse de la vie privée —
Sign in with Apple remplit ce rôle. L'exemption « compte propriétaire » ne
s'applique que si l'app utilise **exclusivement** son propre système de compte.

⚠️ **Correction d'une conclusion antérieure :** la simple présence d'une connexion
email/mot de passe **n'exempte pas** l'app tant que **Google OAuth** est proposé
pour le compte principal. La condition d'exclusivité n'est pas remplie → **Sign in
with Apple est requis**.

**Décision produit retenue : conserver Google ET ajouter Sign in with Apple.**
Implémentation faite dans le dépôt (bouton conforme HIG, web + iOS Capacitor,
nonce/state, gestion d'erreurs, liaison de compte, cas e-mail masqué). Les étapes
Apple Developer + Supabase (avec **secrets à placer dans les dashboards**, jamais
ici) sont détaillées dans **`SIGN_IN_WITH_APPLE.md`**.

**Ce qui reste à faire (nécessite secrets/dashboards, hors dépôt) :**
1. Apple Developer → activer **Sign In with Apple** sur l'App ID `app.iwasp.digital`,
   créer un **Services ID** + une **clé `.p8`**.
2. Supabase → Authentication → Providers → **Apple** : Services ID, Team ID
   `Y4JV4X2DJ6`, Key ID, clé `.p8`.
3. **Révocation des jetons Apple à la suppression de compte** (exigée par Apple) :
   secrets `APPLE_*` dans Supabase → Edge Functions → Secrets. Voir
   `SIGN_IN_WITH_APPLE.md` §Révocation.

---

## 2. Suppression de compte in-app (Guideline 5.1.1(v)) — ✅ implémentée

| Élément | Statut | Détail |
|---------|--------|--------|
| Bouton visible « Supprimer définitivement mon compte » | ✅ | `src/pages/Settings.tsx` → Zone de danger. |
| Confirmation explicite (saisie « SUPPRIMER ») | ✅ | Champ typé + bouton désactivé tant que non confirmé. |
| Suppression **réelle** côté serveur | ✅ | Edge function `delete-account` (service-role) : supprime cartes, leads, scans, stories, analytics, profil, abonnement, notifications push, webhooks, locations ; **anonymise** les commandes ; supprime les fichiers de stockage ; supprime le compte Auth (révoque toutes les sessions). |
| Ré-authentification | ✅ | La fonction exige le **JWT de l'appelant** (`admin.auth.getUser(token)`) ; `verify_jwt=true` au niveau passerelle. Un utilisateur ne peut supprimer que **son** compte. |
| Pas de fausse suppression côté UI | ✅ | Le compte `auth.users` est réellement supprimé côté serveur. |

**Reste à faire (déploiement — nécessite Supabase) :**
`supabase functions deploy delete-account` puis test end-to-end (voir §8 tests).

**Procédure de transfert d'une carte NFC (au lieu de la désactiver) :**
la carte physique pointe vers un profil ; supprimer le compte désactive ce profil.
Si l'utilisateur veut **céder** sa carte plutôt que la jeter, le dialogue de
suppression l'invite à écrire à **support@i-wasp.com avant** suppression : le
support ré-associe la puce (même URL courte `i-wasp.com/n/{public-id}`) au nouveau
titulaire, sans réimpression. Ce point est affiché dans l'app (encart ambre du
dialogue de suppression).

---

## 3. Fiche App Store — textes prêts

**Nom de l'app :** IWASP — Carte de visite NFC

**Sous-titre (30 car. max) :** Votre carte de visite connectée

**Catégorie principale :** Business
**Catégorie secondaire :** Productivity

**Texte promotionnel (170 car. max, modifiable sans revue) :**
> Partagez vos coordonnées d'un simple contact. Carte NFC premium + profil digital
> personnalisable. Zéro papier, mise à jour instantanée.

**Description :**
```
IWASP transforme votre mise en réseau. D'un simple contact de votre carte NFC
sur un smartphone, partagez instantanément vos coordonnées, réseaux sociaux,
site web et bien plus — sans application à installer pour votre interlocuteur.

CARTE NFC PREMIUM
• Carte physique haut de gamme avec puce NFC intégrée
• Design entièrement personnalisable (logo, couleurs, visuels)
• Compatible iPhone et Android (aucune app requise côté destinataire)

PROFIL DIGITAL COMPLET
• Coordonnées, entreprise, fonction, bio
• Liens vers vos réseaux sociaux et votre site
• Bouton d'ajout aux contacts en un tap (vCard)
• Mise à jour en temps réel : changez vos infos, la carte reste la même

SUIVI & CONTACTS
• Statistiques de scan de votre carte
• Récupération des contacts intéressés (leads)
• Export et intégrations CRM

POUR LES ÉQUIPES
• Cartes cohérentes pour toute une équipe
• Gestion centralisée des profils

Fini les cartes en papier jetées et vite obsolètes. Avec IWASP, votre identité
professionnelle tient dans une carte, toujours à jour.
```

**Mots-clés (100 car. max, séparés par des virgules) :**
```
carte visite,nfc,carte connectée,networking,contact,vcard,digital,qr,professionnel,business
```

**URL marketing :** https://i-wasp.com
**URL de support :** https://i-wasp.com/support  *(☐ créer une page /support stable, ou utiliser mailto:support@i-wasp.com)*
**URL politique de confidentialité :** https://i-wasp.com/privacy  *(✅ page `/privacy` existante)*

**Classification par âge :** 4+ (aucun contenu sensible ; pas de contenu généré
par les utilisateurs partagé publiquement de façon non modérée au sens Apple —
à confirmer dans le questionnaire).

**Droits (copyright) :** © 2026 i-wasp

---

## 4. App Privacy — réponses au questionnaire « Données collectées »

> À renseigner dans App Store Connect → App Privacy. Basé sur les données
> **réellement** manipulées (auth Supabase, commandes, scans, leads, paiements Stripe).

| Type de données | Collecté ? | Usage | Lié à l'identité ? | Suivi (tracking) ? |
|-----------------|-----------|-------|--------------------|--------------------|
| Adresse email | Oui | Fonctionnement de l'app (compte), communications transactionnelles | Oui | Non |
| Nom | Oui | Fonctionnement de l'app (profil, livraison) | Oui | Non |
| Numéro de téléphone | Oui (si fourni) | Fonctionnement de l'app (profil/livraison) | Oui | Non |
| Adresse postale | Oui (commandes physiques) | Expédition de la carte | Oui | Non |
| Coordonnées de paiement | **Non stocké par l'app** | Traité par **Stripe** (l'app ne conserve pas le n° de carte) | — | Non |
| Identifiants utilisateur (user ID) | Oui | Fonctionnement de l'app | Oui | Non |
| Données d'usage / analytics de scan | Oui | Statistiques produit fournies à l'utilisateur (nb de scans de SA carte) | Oui | Non |
| Contacts (carnet d'adresses de l'appareil) | **Non** | L'app génère une vCard mais n'importe pas le carnet | — | Non |
| Localisation | Optionnel (si l'utilisateur ajoute une adresse à son profil) | Affichage sur le profil | Oui | Non |

**Tracking (App Tracking Transparency) :** l'app **ne suit pas** les utilisateurs
à travers apps/sites tiers → pas de framework de tracking publicitaire → **pas**
de prompt ATT requis. (À reconfirmer si un SDK analytics tiers est ajouté.)

---

## 5. Compte de démonstration pour App Review

> Apple teste avec un compte réel. Créer un compte de démo **dédié** (pas un compte
> personnel) et le fournir dans « App Review Information ».

- ☐ Créer le compte : email `demo-appstore@i-wasp.com` (ou similaire), mot de passe
  robuste, pré-rempli avec **au moins une carte digitale** de démonstration.
- ☐ Renseigner identifiant + mot de passe dans App Store Connect → App Review Information.
- ☐ S'assurer que le compte permet de tester : création/édition de profil,
  aperçu de carte, et la **suppression de compte** (Apple vérifie 5.1.1(v)).
  ⚠️ Si Apple supprime le compte démo pendant le test, en recréer un avant re-soumission.

🔒 Le mot de passe du compte démo se saisit **dans App Store Connect**, jamais ici.

---

## 6. Statut « trader » UE (Digital Services Act)

> Depuis le DSA, App Store Connect exige de déclarer si vous agissez en tant que
> **trader** (professionnel) pour distribuer dans l'UE.

- ☐ App Store Connect → Business → **Trader Status** : déclarer **Trader** (i-wasp
  vend des produits/services contre paiement dans l'UE).
- ☐ Fournir : raison sociale, adresse, email et **téléphone** vérifiables (affichés
  publiquement sur la fiche UE). Doivent correspondre aux **Mentions légales**
  (`/mentions-legales`, ✅ page existante).
- ☐ Vérifier la cohérence avec les CGV (`/cgv`, ✅ page existante).

---

## 7. App Review Information — notes à laisser au reviewer

```
Bonjour,

• Compte de démonstration : demo-appstore@i-wasp.com (mot de passe fourni ci-dessus).
• Connexion : l'app propose une authentification first-party (email + mot de passe)
  ainsi qu'une connexion Google optionnelle. Sign in with Apple n'est pas requis au
  titre de la Guideline 4.8 car l'app n'utilise PAS exclusivement un login social :
  un compte email/mot de passe natif est disponible.
• Suppression de compte (5.1.1(v)) : Réglages → Zone de danger → « Supprimer
  définitivement mon compte » (confirmation par saisie de « SUPPRIMER »). La
  suppression est effectuée côté serveur (compte et données personnelles supprimés,
  commandes anonymisées pour obligations comptables).
• NFC : l'app lit/écrit des puces NFC pour partager un profil de contact. Une carte
  physique de test peut être fournie sur demande.
• Aucune fonctionnalité cachée, aucun contenu réservé nécessitant un code hors app.

Merci de votre revue.
```

---

## 8. Tests de conformité à exécuter (voir aussi `APP_STORE_CHECKLIST.md`)

- ✅ `npm run build` · `npm run typecheck` · `npm run lint` · `npm run test`
- ☐ **Suppression de compte end-to-end** (après déploiement de la fonction) :
  créer un compte test → créer une carte → supprimer → vérifier que
  (a) l'utilisateur `auth.users` n'existe plus, (b) `digital_cards`/leads/etc. sont
  vides pour cet utilisateur, (c) les commandes sont anonymisées (`user_id` =
  sentinelle, email = `deleted@anonymized.local`), (d) la reconnexion est impossible.
- ☐ **AASA** servi sur `https://i-wasp.com/.well-known/apple-app-site-association`
  en `application/json`, HTTP 200 sans redirection (nécessite le site déployé).
