# i-wasp — brouillon site et Wallet, 13 octobre 2026

## État et périmètre

Branche `codex/site-wallet-draft-20261013`, base `c82eadb1d3a1fd7c1fecda3c06bb72dace8f7813`.
Dossier dédié créé sans écraser de projet : `/Users/user/Documents/Codex/2026-10-13/task-2/i-wasp`.
Le clone initial a échoué (DNS puis transfert bloqué). Archive officielle du commit téléchargée ; arbre Git local vérifié identique à l’arbre amont `60b026fac0f999309a8fd188b8cc89d4e721dbc3`. L’objet commit exact a ensuite été reconstitué et son SHA vérifié, avec historique local shallow. Le snapshot initial reste conservé dans le tag local `local-archive-snapshot`.

Aucune fusion, publication, migration, activation de fournisseur, configuration de secret, modification de paiement, compte client réel ou envoi WhatsApp. Les workflows existants inspectés sont manuels. `vercel.json` désactive le déploiement Git pour cette seule branche de brouillon ; les en-têtes de sécurité restent inchangés. Ne pas déployer les fonctions Wallet de cette PR avant validation et revue de leurs prérequis.

Instructions : README, CLAUDE.md, PROTECTED_FILES.md et `.claude/skills/iwasp-nfc-client` lus. Aucun AGENTS.md ni `.agents/skills` dans cette révision. La demande explicite « brouillon uniquement » prévaut sur la publication recommandée dans la skill. Aucun fichier client protégé modifié.

## Changements visibles

- Accueil français : hiérarchie éditoriale sombre/champagne, photographie réelle en relief CSS léger, contrôle recto/verso natif au clavier, CTA « Créer ma carte » vers `/order/offre`, lien d’inscription `/signup`, exemple `/demo`, étapes et FAQ.
- Accompagnement distinct : `/creer-ma-carte` est un formulaire pour préparer une demande à l’équipe via WhatsApp, pas une création autonome. Il n’annonce plus un envoi avant confirmation ; le message reste à ouvrir puis envoyer par l’utilisateur. Les données du formulaire restent modifiables et le lien préparé est invalidé après modification.
- Douze champs textuels étiquetés ; erreurs reliées et annoncées, focus sur le premier champ invalide, autocomplétion, boutons photo nommés, style choisi exposé via aria-pressed. Plus de confettis automatiques. La photo existante est toujours téléversée dès sélection : ce comportement est maintenant explicité, non testé avec des données réelles.
- Sur les trois pages concernées, la barre mobile globale ne masque plus les contrôles. Pas de WebGL, animation continue ou dépendance 3D ajoutée. Reduced-motion retire la transformation ; repli CSS sans perspective.
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

- #11 `codex/ios-login-backend-guard`, ouverte en brouillon, tête `8529a4ff827fe460a2e3cfbe25195e28b8c1f8ec`, non fusionnée : iOS, workflows, backend, vCard PublicCard. Aucun de ces fichiers applicatifs n’est touché. Seul `vercel.json` se recoupe : conserver les deux entrées de désactivation de branches lors d’une intégration ultérieure.
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
