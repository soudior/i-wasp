# i-wasp — brouillon site et Wallet, 13 octobre 2026

## État et périmètre

Branche `codex/site-wallet-draft-20261013`, base `c82eadb1d3a1fd7c1fecda3c06bb72dace8f7813`.
Dossier dédié créé sans écraser de projet : `/Users/user/Documents/Codex/2026-10-13/task-2/i-wasp`.
Le clone initial a échoué (DNS puis transfert bloqué). Archive officielle du commit téléchargée ; arbre Git local vérifié identique à l’arbre amont `60b026fac0f999309a8fd188b8cc89d4e721dbc3`. L’objet commit exact a ensuite été reconstitué et son SHA vérifié, avec historique local shallow. Le snapshot initial reste conservé dans le tag local `local-archive-snapshot`.

Aucune fusion, publication, migration, activation de fournisseur, configuration de secret, modification de paiement, compte client réel ou envoi WhatsApp. Les workflows existants inspectés sont manuels. `vercel.json` désactive le déploiement Git pour cette seule branche de brouillon ; les en-têtes de sécurité restent inchangés. Ne pas déployer les fonctions Wallet de cette PR avant validation et revue de leurs prérequis.

Instructions : README, CLAUDE.md, PROTECTED_FILES.md et `.claude/skills/iwasp-nfc-client` lus. Aucun AGENTS.md ni `.agents/skills` dans cette révision. La demande explicite « brouillon uniquement » prévaut sur la publication recommandée dans la skill. Aucun fichier client protégé modifié.

## Changements visibles

- Accueil français : héros noir/graphite/champagne, téléphone frontal avec capture réelle du profil fictif, packshot sur socle clair, changement de vue recto/verso natif au clavier, CTA « Créer ma carte » vers `/order/offre`, lien d’inscription `/signup`, exemple `/demo`, étapes et FAQ.
- Accompagnement distinct : `/creer-ma-carte` est un formulaire pour préparer une demande à l’équipe via WhatsApp, pas une création autonome. Il n’annonce plus un envoi avant confirmation ; le message reste à ouvrir puis envoyer par l’utilisateur. Les données du formulaire restent modifiables et le lien préparé est invalidé après modification.
- Douze champs textuels étiquetés ; erreurs reliées et annoncées, focus sur le premier champ invalide, autocomplétion, boutons photo nommés, style choisi exposé via aria-pressed. Plus de confettis automatiques. La photo existante est toujours téléversée dès sélection : ce comportement est maintenant explicité, non testé avec des données réelles.
- Sur les pages concernées, la barre mobile globale ne masque plus les contrôles. Pas de WebGL, animation continue ou dépendance 3D ajoutée. Reduced-motion supprime les mouvements ; les photographies produit ne sont jamais tournées, car leur perspective et leurs ombres sont déjà intégrées.
- Pas de faux témoignages ni logos clients. Les nouvelles légendes Wallet sont explicitement illustratives.

Les actifs publics fournis ont été inspectés visuellement et comparés aux fichiers existants :

| Actif | SHA-1 identique public / dépôt |
| --- | --- |
| `card-front-9FAgPWOe.png` / `src/assets/card-front.png` | `08131e45f961928e8e26244455e4c206ef18496b` |
| `card-back-RY5KyHbQ.png` / `src/assets/card-back.png` | `bb96eba04cf7526728b95048e810dcce6f075ff2` |

## Tarifs : contradiction non arbitrée

À la base auditée, accueil/catalogue/commande exposent 29 / 49 / 79 € et le pack 119 € ; les commentaires historiques du catalogue mentionnent encore 29,90 / 49,90 € et d’autres montants MAD. `/pricing` présente une logique d’abonnement annuel 29,90 / 49,90 €. La PR ouverte #9 propose encore une autre restauration de grille, y compris côté paiement. Ces valeurs et conditions ne sont pas modifiées ici. Le composant PricingSection et le catalogue sont conservés. L’accueil distingue seulement la navigation cartes physiques / abonnements. La validation commerciale reste obligatoire avant toute publication.

## Matrice Wallet

| Fonction | Dans ce brouillon | Ce qui n’est pas prouvé / prérequis |
| --- | --- | --- |
| Profil + lien + QR | Parcours et routes existants ; URL canonique `/card/<slug>` conservée, `/c/:slug` reste l’alias existant | Publication effective d’une nouvelle fiche non testée ; pas de carte client créée |
| Apple via PassKit | Contrôle session/propriétaire/droits ; données serveur ; champs masqués retirés ; identifiant externe stable ; retours fournisseur expurgés | Fournisseur commercial déjà présent mais compte, coût, modèle, certificats et rendu non vérifiés. Aucun abonnement souscrit. `PASSKIT_PROGRAM_ID` et `PASSKIT_TIER_ID` explicitement requis au lieu d’identifiants codés en dur ; aucune valeur configurée |
| Personnalisation Apple | Préférences enregistrées ; visibilité filtrée avant envoi | Les couleurs sont régies par le modèle PassKit, non envoyées arbitrairement avec un schéma non vérifié. Mapping du modèle et QR réel à inspecter chez le fournisseur avant publication |
| Google | JWT UTF-8 ; issuer explicite ; ID stable par carte ; URL canonique ; limite de 1800 caractères | Compte de service/issuer non inspectés ; classe `${issuer}.iwasp_business_card` préexistante requise. Le JWT référence cette classe et contient l’objet. Publishing access requis pour la production ; Demo Mode réservé aux testeurs |
| Gros pass Google | Refus explicite >1800 caractères, sans faux lien de succès | Si les données dépassent cette limite, préparer ultérieurement la création/mise à jour d’objet côté API ; aucune activation ou appel réel réalisé ici |
| Ouverture Wallet | Navigation dans le même onglet, sans popup après await ; toast d’instruction, jamais « ajouté » | L’utilisateur peut annuler. Aucun signal d’installation n’est disponible ni simulé comme réel |
| Téléchargement public `/pass/:slug` | Action explicite ; connexion propriétaire requise ; retour vers profil/connexion | Choix restrictif compatible avec la règle propriétaire : distribution anonyme de pass hors périmètre. Le service public WalletCard mentionné par la skill appartient à un autre dépôt et n’a pas été touché |
| vCard | Action distincte « Télécharger le contact (.vcf) » en cas d’échec | Ce n’est pas un pass Wallet |
| `walletMock` | Aucun import de production trouvé ; exécution limitée au dev/test, export JSON `.TEST-ONLY.json`, messages explicites | Ce fichier ne produit aucun `.pkpass` signé et ne doit jamais servir de démonstration de Wallet fonctionnel |
| NFC / appareils | Explication compatible téléphone + alternative QR | Aucun test physique NFC, iPhone, Android, VoiceOver réel ou installation Wallet réalisé |

### Contrôle serveur préparé, non déployé

Les handlers vérifient le bearer via Auth, puis relisent uniquement la carte active du propriétaire et son abonnement via le JWT utilisateur (pas de service-role). Ils ignorent les coordonnées et préférences envoyées par le navigateur au profit des données sauvegardées. Droits repris exactement du helper frontend actuel : plans `signature`, `gold`, `elite`, statut actif, expiration valide. Le nom historique `premium` n’est déjà pas accepté par `isPremiumPlan` ; aucune règle commerciale nouvelle inventée.

`supabase/config.toml` reste inchangé (`verify_jwt=false` pour ces endpoints) ; la vérification est préparée dans le code. Avant déploiement, faire valider les politiques RLS effectives des cartes et abonnements, la règle de distribution publique éventuelle et le contrat du fournisseur. Les retours 401/403/503 ne déclenchent jamais de fournisseur. Réessais Apple utilisent externalId stable ; le traitement de mise à jour/rejeu propre à PassKit reste à confirmer sur environnement autorisé.

## PR existantes et conflits

- #11 `codex/ios-login-backend-guard`, ouverte en brouillon, tête `8529a4ff827fe460a2e3cfbe25195e28b8c1f8ec`, non fusionnée : iOS, workflows, backend, vCard PublicCard. La dernière correction ajoute aussi la phrase de présentation dans `PublicCard.tsx`, fichier commun à la PR11 : conserver ses changements vCard lors de la revue. `vercel.json` se recoupe également : conserver les deux entrées de désactivation de branches lors d’une intégration ultérieure.
- #9 ouverte : tarifs, autonomie, suppression previewAuthStorage, fonction Google Wallet. Recouvre Index, google-wallet et potentiellement vercel.json. Revue manuelle nécessaire ; ne pas rétablir automatiquement ses changements de prix ni les écraser. Cette PR laisse les origines Google existantes intactes pour ne pas absorber sa décision.
- #8 et #10 ouvertes : suppression compte/confidentialité/iOS. Aucun workflow, paiement, politique de compte ou client protégé changé.
- `main` vérifié inchangé à `c82eadb1` avant préparation de la PR.

## Vérifications reproductibles

Commandes locales (Node 22.20.0, dépendances du lockfile via `npm ci --ignore-scripts`) :

```sh
npm test
npx tsc -p tsconfig.app.json --noEmit
npx tsc -p tsconfig.node.json --noEmit
npx tsc -p tsconfig.wallet-tests.json --noEmit
npm run lint
VITE_SUPABASE_URL=http://127.0.0.1:54321 VITE_SUPABASE_PUBLISHABLE_KEY=test-only-public-placeholder npm run build
```

- 128 tests réussis, dont 48 nouveaux tests Wallet : données forgées, sessions/droits, champs masqués, configuration absente, erreurs fournisseur, Unicode français/arabe/emoji, IDs stables, navigation, choix vCard. Mocks locaux uniquement.
- Typage frontend, configuration Vite et fonctions Wallet réussis. Pour Wallet, déclarations Deno de test dans `tests/wallet/runtime.d.ts` ; ce contrôle ne prouve pas une exécution Edge distante.
- Build web/PWA réussi avec URL et clé factices locales. Ce bundle de validation ne doit pas être publié.
- Lint global : **0 erreur, 272 warnings**. L’erreur préexistante `prefer-const` de `previewAuthStorage.ts` est corrigée sur demande du propriétaire : suppression de la déclaration `let` séparée, déclaration `const` au même appel setTimeout. Aucun changement de délai, ordre d’appel, message, origine, stockage ou comportement auth. La suppression de ce module prévue par #9 reste à traiter dans cette autre PR.
- Chromium/Chrome headless : 390×844 et 1440×1000, pas d’erreur JS, pas de débordement horizontal ; audit axe WCAG A/AA sans violation sur accueil et formulaire. Bouton carte via clavier, skip-link, CTA/retour navigateur, erreurs de formulaire/focus, préparation sans envoi, invalidation du message après édition, reduced-motion et refus Wallet anonyme vérifiés. Ce n’est pas une certification d’accessibilité ni un test Safari sur iPhone réel.

Script : `scripts/test-site-wallet-browser.mjs`, requêtes hors `http://127.0.0.1:8080` interceptées. Playwright et `@axe-core/playwright` requis dans l’environnement de test ; `IWASP_BROWSER_PACKAGES` peut pointer vers leur package.json temporaire. Aucun ajout de ces dépendances au produit.

Aperçu local : lancer `npm run dev -- --host 127.0.0.1` avec les mêmes variables factices. Dans ce Mac, Node temporaire se trouve dans `/tmp/node-v22.20.0-darwin-arm64/bin` (aucune installation système). Captures JPEG représentatives et résultats joints dans ce dossier. Les captures PNG intégrales restent dans le dossier local (transfert PNG expiré côté connecteur). Le texte du nouvel accueil est en français ; localisation complémentaire à valider avant publication internationale.

## Sources de contrat

- Apple : https://developer.apple.com/documentation/walletpasses/building-a-pass
- Google : https://developers.google.com/wallet/generic/web (JWT signé, classe, objet, limite 1800 caractères, Demo Mode)
- Google : https://developers.google.com/wallet/generic/test-and-go-live/launch-checklist

## Validation encore requise

Décision tarifs/conditions par le propriétaire ; configuration et contrats fournisseurs sans exposer les secrets ; contrôle RLS et distribution Wallet ; rendu et installation sur véritables iPhone/Android ; parcours signup/commande avec environnement de test approuvé ; traduction éventuelle ; résolution des recouvrements de PR. Rien ne doit être fusionné ou publié avant cette validation.

## Complément de validation

Le test navigateur attend maintenant la fin du fondu d’entrée du formulaire avant de mesurer le contraste : le contrôle précédent pouvait capturer une opacité transitoire. Retournement recto/verso au clavier et absence de transform en reduced-motion retestés à 390 et 1440 px. Aucun changement fonctionnel d’authentification ; seul le correctif de style `const` est ajouté.

## Démonstration réelle et livrables média — complément

`/demo` réutilise `WizardPreview`, `StepIdentity` et `DigitalCard`/Signature. Aucun appel de création/enregistrement ; état uniquement en mémoire. Le compte n’est pas simulé comme créé : une légende explique la vraie étape d’inscription. Le nom Camille Exemple et les coordonnées example.invalid sont des données de démonstration. Le portrait illustré a été retiré à la demande du propriétaire. L’emplacement « Votre photo à ajouter » reste neutre, sans visage ; une vraie photo autorisée est attendue.

Les actions click/clavier et les déclencheurs de pressions longues sont neutralisés dans le profil de démonstration. Une région status explique qu’aucun contact, fichier ou Wallet n’est créé. Les captures proviennent de Chrome exécutant ces vrais composants, sans UI générée. Un défaut existant de LocationPicker est corrigé : le déclencheur inline est un bouton natif, accessible au clavier, au lieu d’un div portant aria-expanded.

La scène bleue Higgsfield a été retirée de l’interface et de l’arbre du brouillon suivant le retour du propriétaire. Sa provenance reste archivée localement dans media-source/ et dans Library. Elle n’est jamais présentée comme une photographie réelle. Les deux packshots officiels sont conservés, à partir de leur photographie originale, sans rotation ni double perspective. Le vrai écran Signature a été recapturé sans portrait artificiel.

Contenus sémantiques uniques dans `/demo` : usages accueil hôtelier et restauration, coordonnées utiles et liens vers menu/réservation existants. Aucun faux moteur de réservation ni garantie de classement. Direction validée pour cette itération : noir profond, graphite, champagne discret ; typographie affirmée « Votre nom. Votre signature. », composition éditoriale et cadres sobres. Logo produit doré conservé. Aucun achat, génération supplémentaire, mise à jour de dépendances ou déploiement effectué par cette tâche.

Validation complémentaire : Chrome 360/390/768/1440 px, saisie et propagation vers le vrai profil, aucune requête POST externe, absence de débordement horizontal et de violation axe WCAG A/AA sur le profil de démo. Les parcours accueil/formulaire/Wallet restent testés en 390/1440 px. Ce ne sont pas des tests Safari/iPhone physiques. Résultats : `demo-browser-results.json` et `browser-results.json`.

Captures review : `desktop-hero.jpg`, `mobile-hero.jpg`, `desktop-demo.jpg`, `mobile-demo.jpg`. Source écran pour média : `src/assets/demo-profile-capture.jpg`. Script supplémentaire : `scripts/test-demo-browser.cjs` (Chrome/Playwright/axe installés temporairement, résolution via IWASP_BROWSER_PACKAGES). La provenance source complète et ses identités Library sont conservées localement dans media-source/, exclu de Git.

CI GitHub : les workflows inspectés sont manuels. Aucun résultat vide/pending n’est présenté comme un succès CI ; les vérifications locales sont distinctes. Le commit a1dafdf8e738a4886252c30248660922ab196c20 avait zéro check, zéro status et zéro workflow run. Recontrôler le dernier SHA avant fusion, qui reste interdite sans validation.

## Retour propriétaire : direction noire et photo réelle attendue

La direction blanche/bleue précédente est remplacée dans l’accueil et la démonstration. Aucun nouveau visage généré, aucune photo client récupérée, aucune image stock présentée comme cliente. Les cinq captures sont remplacées dans les mêmes fichiers et les mêmes identités Library ; leurs versions précédentes restent l’historique. La vraie photo autorisée constitue le seul élément visuel demandé encore manquant. Aucun coût supplémentaire ni changement commercial.

## Visuel principal de la carte — cadrage rapproché

Révision limitée à HeroProductVisual et sa présentation CSS. Le grand panneau blanc est remplacé par un cadrage de détail de la photographie officielle frontale : fenêtre source x=272, y=152, largeur 482, hauteur 288. Logo et surface photographiée inchangés ; fichier source SHA-1 toujours 08131e45f961928e8e26244455e4c206ef18496b. Aucun fichier raster retouché, aucune image générée, aucune dépense ni promesse de matériau/finition. La légende dit explicitement « détail de la photo officielle ». L’encadrement et l’ombre sont des éléments de présentation CSS.

La photo verso conserve son cadrage complet et sa perspective d’origine. Le changement de vue est utilisable au clavier, sans animation de faux retournement. Mobile : carte séparée du téléphone, aucune légende masquée. Contrôles affectés : lint global, typecheck app, build/PWA, scripts navigateur accueil/formulaire/Wallet et contrôle de débordement aux largeurs 360/390/768/1440. Aucun changement aux tarifs, Wallet, profil, formulaire ou données client.

Livrables : card-closeup.jpg (gros plan de la composition native, ~430 px de large), mobile-hero.jpg, desktop-hero.jpg. Le cadrage est limité par la résolution de la photographie fournie ; pour une vue ou un éclairage produit véritablement nouveau, une nouvelle photo autorisée ou une retouche raster validée serait nécessaire.


## Audit du parcours actif et corrections — 13 octobre, complément

Le CTA d’accueil utilise `/order/offre` → `/order/identite` → `/order/template` → `/order/carte` → `/order/livraison` → `/order/recap` → confirmation. Cela représente six étapes avant confirmation. `CardWizard` n’est pas monté dans ce parcours ; `/create` redirige vers le tunnel Express et `/editor` vers CardStudio. Le texte de `/demo` est corrigé : c’est une démonstration locale de composants, pas une copie exacte du formulaire actif ni une preuve de création de compte.

### Corrections concrètes

- Identité : prénom et nom requis, photo/activité/liens regroupés dans une section facultative. Labels, attributs required, erreurs associées et focus premier champ invalide ; liens http/https validés, pas de code pays inventé.
- Coordonnées publiques explicitement séparées de l’email de compte et du téléphone de livraison. Confirmation de visibilité requise et invalidée après chaque modification. Une valeur publique vide reste `null` ; aucune récupération implicite de l’email privé du compte.
- Aperçu des informations en direct sur ordinateur et bascule mobile. Il annonce que le rendu final peut différer ; aucune action de contact active.
- Brouillon de l’identité dans sessionStorage du même onglet, conservé sur Retour, navigateur précédent/suivant et rechargement. Bouton effacer ; erreur quota signalée, saisie en mémoire préservée. Le brouillon n’est pas une sauvegarde serveur ni une reprise multiappareil.
- Photo locale jusqu’à Continuer ; formats/poids vérifiés. Le transfert exige une session existante, utilise le préfixe utilisateur prévu par le stockage et un nom aléatoire. Échec : message sans perte des champs. Retirer une photo ne supprime pas un ancien média déjà public. Aucun transfert réel exécuté.
- Verrou synchrone contre doubles clics ; état de route resynchronisé après Retour navigateur.
- `orderProfileFields` mappe désormais photo, phrase et modèle choisi vers l’insertion existante. La phrase apparaît aussi sur la fiche publique standard. Aucune modification des prix, paiements, drapeaux Wallet/NFC, authentification ou RLS.

### Preuves et limites

140 tests unitaires réussis, dont 12 nouveaux cas identité/mapping. Lint : zéro erreur, 272 avertissements existants. Typechecks app/node/Wallet et build/PWA réussis. `scripts/test-identity-flow.cjs` teste les routes réelles à 390 et 1440 px avec réduction du mouvement : champs obligatoires/facultatifs, erreur email et focus, Tab/Enter, photo invalide et refus sans session, retour/rechargement, consentement, double clic, quota sessionStorage, propagation vers l’état, puis fiche publique servie par RPC fictif. Zéro erreur JS et zéro violation axe sur le formulaire testé. Les requêtes externes, y compris les tentatives de statistiques, sont interceptées ; aucune écriture distante n’a eu lieu. Pas de test humain VoiceOver ni de Safari/iPhone physique.

Captures Chrome locales avec **Camille Test, données fictives** : `creation-mobile.jpg`, `creation-desktop.jpg`, `creation-preview-mobile.jpg`, `creation-recipient-mobile.jpg`. La dernière montre le renderer public standard existant avec un RPC simulé : elle ne prouve pas une persistance serveur. Le profil standard ne reproduit pas tous les styles proposés dans le sélecteur ; la PR conserve ce renderer et signale cette limite au lieu de promettre un aperçu exact.

La commande complète et le signup restent non exécutés. Le handler existant crée le profil avant certaines opérations de commande ; son atomicité demande une revue dédiée avant publication. Les autres tunnels Express/CardStudio restent à harmoniser : CardStudio conserve notamment un risque de saisie écrasée lors d’un refetch et des valeurs de nom par défaut. Ces constats ne sont pas présentés comme corrigés. Les fichiers clients protégés ne sont pas modifiés. La photo réelle autorisée, les prérequis Wallet et les validations commerciales restent attendus.

PR11 revérifiée, tête inchangée `8529a4ff827fe460a2e3cfbe25195e28b8c1f8ec`. Le petit ajout `PublicCard.tsx` est un nouveau recouvrement à examiner, sans absorber le travail iOS/vCard de cette branche.

## Fermeture des écarts de cohérence — complément final

### Chemins réellement accessibles

- Express est actif : `/contact`, `/about` et `/a-propos`, `/produit`, `/iwasp/produit`, `/conversion` et certaines pages historiques contiennent des liens vers `/express/offre`. `/create` redirige également vers Express, y compris depuis des liens du guide et du dashboard. Le navigateur local vérifie Contact → Express et la redirection `/create`.
- `/editor` et `/card-studio` sont déclarés mais protégés par `DashboardGuard` : anonyme → `/login`, utilisateur sans carte → `/onboarding`. Aucun lien vers ces deux routes n’a été trouvé dans les composants/pages publics ni Studio. Les deux redirections anonymes sont testées. CardStudio n’est donc pas refondu ; ses risques de refetch/valeurs par défaut restent à traiter avant de l’exposer davantage. Aucune session réelle ouverte.

### Harmonisations limitées aux divergences prouvées

Express utilisait les données de livraison comme coordonnées publiques lors de l’insertion d’une carte pour un utilisateur connecté. Désormais, l’option distincte `publishNameOnly` est décochée par défaut, y compris pour les anciens brouillons. Sans confirmation, aucune insertion de profil n’est préparée par ce tunnel. Avec confirmation, seuls prénom et nom sont publiés ; email et téléphone de commande restent null dans le profil. Modifier les données invalide ce choix. Prix, abonnements, paiement et logique de commande inchangés ; aucun de ces handlers n’a été déclenché pendant les tests.

Les six labels Express sont associés aux champs/erreurs ; focus sur première erreur. Le numéro n’est plus transformé automatiquement en +212 ni tronqué. Brouillon sauvegardé dans le même onglet, quota signalé. La barre mobile globale est masquée dans le tunnel Express pour ne pas recouvrir son CTA. La mention « +500 cartes livrées » non étayée et le délai arbitraire « 2 minutes » ont été retirés de cette étape.

Les quatre choix `/order/template` deviennent explicitement des **palettes du profil public à mise en page commune**, plutôt que de promettre quatre renderers distincts. La même définition sert aux vignettes et aux `custom_styles` du nouveau profil. Le renderer PublicCard existant applique ces styles. Aucun recalcul des cartes existantes, aucune modification des templates clients ou de PublicCard dans ce complément. Les choix exposent aria-pressed, le numéro d’étape est corrigé à 03, les entrées animées respectent reduced-motion et le badge « Populaire » non prouvé est retiré. Les captures montrent Executive choisi puis rendu, avec Camille Test.

### Compatibilité précise avec PR11

Tête PR11 revérifiée : `8529a4ff827fe460a2e3cfbe25195e28b8c1f8ec`, ouverte/draft. Son seul hunk PublicCard remplace l’URL vCard inconditionnelle par `vcardData.slug ? URL : null`, vers la ligne 161. Cette condition est **déjà présente dans notre base c82eadb1**, puis conservée dans PR12 ; notre unique ajout PublicCard se situe vers la ligne 435 (phrase de présentation). Le patch ne s’applique pas en avant parce qu’il est déjà présent ; `git apply --reverse --check` réussit sans rien modifier. Le test navigateur télécharge deux vCards locales fictives : sans slug, aucune ligne URL ; avec slug, une ligne URL, jamais « undefined ». Aucun contact installé. Aucun fichier iOS/workflow ni PR11 modifié. Cela vérifie ce hunk, pas une fusion générale des deux branches.

### Preuves finales de ce complément

- 149 tests unitaires (17 fichiers) réussis ; 9 nouveaux cas consentement Express, absence de copie des coordonnées et correspondance des palettes.
- Typechecks app/node/Wallet et build/PWA réussis. Lint : zéro erreur, 271 avertissements.
- `scripts/test-creation-consistency.cjs` et `consistency-browser-results.json` : Chrome 390/1440 px, routes, erreurs/focus Express, conservation du téléphone et du brouillon, invalidation du consentement, quatre palettes sélectionnées → mapping réel → RPC fictif → CSS destinataire vérifié, vCards avec/sans slug. Zéro erreur JS ; axe sans violation sur la nouvelle section confidentialité Express. Aucun POST vers orders/digital_cards/subscriptions/signup. Toutes les requêtes externes, y compris analytics, sont interceptées. Les handlers de paiement/commande ne sont pas cliqués.
- Captures natives : `express-privacy-{390,1440}.jpg`, `palette-choice-{390,1440}.jpg`, `palette-recipient-{390,1440}.jpg`. Données exclusivement fictives. Les trois captures 390 px sont aussi conservées dans Library.

Restent non exécutés : compte authentifié réel, sauvegarde distante, commande, transfert photo, installation Wallet/NFC et Safari/iPhone physique. Le traitement historique Express des abonnements avant finalisation de commande, les erreurs d’insertion ignorées et l’atomicité restent hors modification, à revoir séparément avant publication. La correspondance ajoutée porte sur les quatre palettes du tunnel principal, pas sur l’ensemble des templates du catalogue/CardStudio. Aucune fusion ni production.
