# i-wasp : fiabilisation du brouillon, 14 octobre 2026

## Résultat et provenance

Lot fondé sur `6c21852c7d85af9e59a3ac853767c0b59846f4e7`, destiné uniquement à la PR12, branche `codex/site-wallet-draft-20261013`. Aucun déploiement, changement de DB distante, configuration de secret, compte, commande ou paiement réel.

Le premier checkout de ce lot et ses journaux ont disparu pendant une réinitialisation de l’environnement cloud, avant toute mise à jour de branche. Ce lot a donc été reconstruit depuis la tête de PR vérifiée, puis intégralement retesté. Les anciens 303 tests ne sont pas réutilisés comme preuve. Le helper HMAC a été récupéré depuis son blob exact `ef32c4fe90c761ba9a2ca32d61f373e9ebe67ac8` ; Signup retrouve le blob exact `9c1d02b887bc46d9b1d2daf991a8f2c88091abb9`. Le reste de l’arbre reconstruit est validé sur ses nouveaux octets. Deux régressions supplémentaires couvrent le nettoyage DB après un refus HTTP du fournisseur.

Les sources couvertes sont inventoriées par SHA-256 avant/après l’agrégat dans `checks/recovery-20261014/source-sha256-*.json`. Les dates UTC, commandes et codes de sortie sont dans `commands.json`. La description de PR donne le commit et l’arbre effectivement publiés.

## Preuves nouvelles

- **305 tests Vitest réussis, 24 fichiers**, mocks et fixtures uniquement : [journal complet](checks/recovery-20261014/unit-tests.txt).
- TypeScript application, configuration Node, handlers Wallet et WebStudio : quatre contrôles séparés, déclarations de runtime de test pour les imports Deno distants. Cela ne prouve pas une exécution Edge distante.
- Lint global : **0 erreur, 271 avertissements**, [journal complet](checks/recovery-20261014/global-lint.txt). Les avertissements existants ne sont pas présentés comme résolus.
- Build Vite/PWA : voir [journal](checks/recovery-20261014/build.txt). Les variables du build pointent sur `.invalid`, sans credential de production. Les avertissements sur les données Browserslist anciennes et classes Tailwind ambiguës restent documentés par le journal ; le précache compte 417 entrées (5 819,44 KiB).
- PostgreSQL 18.6/PGlite 0.5.9 local : **10 assertions SQL réussies**, [journal](checks/recovery-20261014/schema-local.txt). Vraie contrainte SQL sur une table de fixture minimale : neuf états historiques, refus initial des trois états de génération, migration additive, refus d’un état inconnu, réapplication, CAS et réconciliation obsolète. PGlite utilise une connexion locale unique ; ce n’est ni une répétition de toutes les migrations Supabase ni un test de concurrence distribuée.
- Parcours Wallet/commande/inscription : **37 tests ciblés**, inclus dans les 305, plus **5 contrôles HTTP locaux** distincts. [Rapport et limites](checks/20261014/TRANSACTION-FLOWS.md).
- Revue indépendante en lecture seule : auth, HMAC, liaison paiement/proposition, CAS, migration, transitions et notices relus ; 113 tests ciblés et les 10 assertions SQL réexécutés avec succès après le dernier correctif. Ces sous-ensembles ne s’ajoutent pas au total Vitest.

Les journaux anciens annonçant 128 tests/272 avertissements ont été déplacés sans modification sous `checks/historical-20261013/`. Ils ne soutenaient pas les 164/271 annoncés par le rapport ultérieur de la base. Aucun chiffre ancien n’est présenté comme résultat du lot actuel.

## Frontière d’accès de generate-website-code

Le handler authentifie **avant la lecture de la proposition et avant tout effet privilégié**. Il accepte trois contrats bornés :

1. Appel serveur avec le bearer exactement égal à la clé service configurée, pour conserver les vérifications de paiement existantes. Aucune simple lecture d’un claim JWT `role` ni clé transmise dans le JSON ne suffit.
2. Utilisateur validé par `auth.getUser`, non anonyme, et rôle administrateur vérifié via `has_role` côté serveur. `user_metadata.role` n’est pas une autorisation.
3. Capacité HMAC-SHA256 de 15 minutes liée à un seul UUID de proposition, émise par `webstudio-order` après création serveur de cette proposition. Elle est renvoyée à l’appelant puis passée dans le corps de la requête de génération, jamais dans une URL, dans `form_data` ou dans un journal ajouté. La signature utilise la clé serveur existante ; aucun secret persistant n’a été créé ou configuré durant le travail.

Les politiques historiques permettent de modifier `user_id`/`session_id` des propositions. Ces champs, y compris un identifiant de session public ou prévisible, ne sont donc délibérément pas utilisés comme preuve d’autorisation. `verify_jwt=false` reste nécessaire au contrat mixte capacité/admin/serveur ; ce réglage ne dispense plus le handler de son contrôle. CORS n’est pas traité comme une authentification.

Tests négatifs : ID seul, JWT anonyme/invalide/forgé, fausse propriété, rôle placé dans le corps ou les métadonnées utilisateur, lookup de rôle indisponible, mauvaise proposition, mauvaise clé, signature altérée, token mal formé, expiré ou daté hors fenêtre. Aucun de ces tests ne lance de fournisseur ou ne lit la proposition avant validation.

## Paiement lié à sa proposition

Les deux vérificateurs relisent la Checkout Session via Stripe puis exigent `status=complete` et `payment_status=paid`. L’identifiant cible vient uniquement des métadonnées de cette session :

- WebStudio standard : `type=webstudio`, `proposal_id` UUID valide ; plus de fallback sur `proposalId` du navigateur.
- WebStudio IA : `proposalId` UUID valide et `isInstant` strictement `true` ou `false` ; égalité obligatoire avec la proposition demandée.

Une session payée pour A ne peut pas déclencher B, même si B est envoyé dans le corps. Type ou métadonnées manquants/invalides, session ouverte/impayée, échec Stripe et échec de mise à jour n’autorisent pas la génération. Les retries d’une proposition déjà payée peuvent reprendre l’appel ; `generating`/`site_generated` ne sont pas régressés vers `paid`. Les écritures utilisent un CAS sur l’état lu. **62 tests locaux** couvrent ces contrats, l’émission de capacité et les erreurs, avec Stripe/Supabase/fetch simulés.

Le webhook existant `stripe-webhook` n’est pas modifié : `nfc_order` concerne les commandes de cartes ; `webstudio_direct` crée des commandes `webstudio_orders`. Il ne remplace pas les vérifications navigateur des deux flux de propositions ci-dessus. Aucune nouvelle route, aucun abonnement webhook ni secret de signature n’a été configuré. L’émission de paiements IA accepte encore des paramètres catalogue côté client et modifie historiquement `session_id` : audit distinct nécessaire, pas validation de prix serveur revendiquée ici.

## Concurrence, erreurs et livraison partielle

- Le CAS de proposition vers `generating` précède toute création de site/appel fournisseur. Les requêtes concurrentes simulées donnent un gagnant et un 409.
- Le contrôle SQL initial n’autorisait pas `generating`, `generation_failed` ni `site_generated`. La migration additive `20261014044343_website_generation_statuses.sql` conserve les neuf états existants et ajoute ces trois valeurs. **Migration non appliquée hors fixture locale.**
- Les écritures de démarrage et de fin de génération sont vérifiées. Les échecs jetés et les réponses HTTP fournisseur non-ok utilisent le même nettoyage vérifié, limité aux lignes encore `generating`. Si le reset DB échoue, le diagnostic de récupération est journalisé ; le code ne prétend pas avoir levé le verrou. Les 402/429 restent conservés.
- Un appel non-admin sur un site déjà complété ne relance ni IA, ni e-mail, ni rotation du token blog. La réconciliation de statut utilise aussi un CAS et refuse de toucher une proposition `generating`, pour ne pas effacer une régénération administrateur concurrente.
- Un token blog dont l’upsert échoue n’est jamais exposé comme lien utilisable, ni inclus dans l’e-mail. `blogEditorAvailable=false` et `emailSent=false` signalent les livraisons partielles.
- Si le site est sauvegardé mais que la fin de proposition échoue, un retry peut réconcilier l’état **sans réparer automatiquement l’accès blog ou l’e-mail**. Il renvoie `notificationRetried=false`. Les deux écrans WebStudio rendent une notice persistante et ne promettent plus une livraison complète. Une erreur de génération après enregistrement ne promet plus non plus un site/e-mail automatique.

Récupération manuelle à valider avant production : un opérateur autorisé doit examiner l’état de la proposition, du site sauvegardé, du token blog et de la notification. Il faut confirmer qu’aucune génération n’est encore active avant tout déverrouillage. Ne pas régénérer aveuglément un site pour réparer un e-mail. Une réparation ciblée d’accès/notification doit être préparée, approuvée et testée séparément, avec protection contre les doublons ; aucune procédure distante n’a été exécutée ici.

Ce CAS n’est pas un bail durable : crash/timeout ou reset refusé peuvent laisser `generating`. L’émetteur public `webstudio-order` n’a pas de quota ; la capacité protège l’accès à une proposition existante, pas le volume de nouvelles propositions/crédits. Les anciennes RLS ne sont pas globalement corrigées. Il n’y a pas de nouvelle contrainte d’unicité de site par proposition. Aucune idempotence transactionnelle complète n’est revendiquée.

## Compatibilité et prérequis de mise en service future

- Les propositions historiques n’obtiennent pas rétroactivement une capacité. L’ID ou la propriété alléguée ne permettent plus de les générer : une session payée réellement liée ou un administrateur vérifié reste nécessaire. Les clients anciens ne doivent pas être laissés sans coordination avec le nouveau contrat.
- Un futur déploiement autorisé devra d’abord appliquer/valider la migration additive, puis coordonner l’émetteur, les handlers et le frontend. Une capacité expirée n’a pas de fallback non authentifié. Aucune application automatique de migration n’est incluse.
- Les deux frontends consomment le `previewUrl` synchrone du succès au lieu de dépendre d’un polling anonyme bloqué par RLS ; le fallback historique reste présent pour l’ancien format. Les champs de retour existants sont conservés, avec informations de livraison additionnelles.
- Les contrôles de commande côté UI gardent une reprise en mémoire tant que le même récapitulatif reste monté avec les mêmes données/compte. Ils ne garantissent pas une reprise après reload, changement de paiement ou résultat réseau ambigu. L’abandon empêche les étapes suivantes sans annuler une écriture serveur déjà acceptée.

## Limites de recette et périmètre conservé

Chromium échoue dans ce runtime sur la création d’un socket AF_UNIX avant le premier scénario. La nouvelle tentative est enregistrée ; **les 22 scénarios navigateur préparés ne sont pas exécutés**. Un essai antérieur du navigateur cloud vers le listener de l’autre runtime avait aussi reçu `ERR_CONNECTION_REFUSED`. Cela ne vaut pas recette : aucune nouvelle capture, validation visuelle/responsive, mesure axe, Safari/iPhone, installation Wallet ou NFC physique.

Les tests React/jsdom ne remplacent pas ces tests navigateur. Aucun appel réel Supabase/Auth, Stripe, Resend, IA ou fournisseur Wallet ; aucune exploitation distante, donnée client réelle, inscription, signature de pass ou transaction.

Les neuf fonctions dépendantes de la passerelle Lovable, leurs endpoints/modèles/contrats et les licences restent préservés. Le retrait des mentions publiques réalisé auparavant n’est pas une migration de fournisseur. Le choix du fournisseur, budget, rétention et transfert de données restent à décider. Tarifs, fichiers clients protégés, photographies et direction noir/graphite/champagne conservés.

`vercel.json` désactive le déploiement Git de cette branche. Les trois workflows iOS présents sont manuels ; aucun n’a été lancé. Les résultats sont locaux et ne constituent pas une CI GitHub réussie. La branche reste en brouillon, sans fusion ni mise en production.

## Reproduction

```sh
npm ci --ignore-scripts
npm test
npx --no-install tsc -p tsconfig.app.json --noEmit
npx --no-install tsc -p tsconfig.node.json --noEmit
npx --no-install tsc -p tsconfig.wallet-tests.json --noEmit
npx --no-install tsc -p tsconfig.webstudio-tests.json --noEmit
npm run lint
VITE_SUPABASE_URL=https://supabase.example.invalid VITE_SUPABASE_PUBLISHABLE_KEY=TEST-ONLY-NOT-A-CREDENTIAL npm run build
git diff --check
```

SQL isolé : installer `@electric-sql/pglite@0.5.9` dans un répertoire temporaire distinct, puis `PGLITE_MODULE=file:///chemin/node_modules/@electric-sql/pglite/dist/index.js node scripts/test-website-statuses-local.mjs`. Cette dépendance de validation n’est pas ajoutée au lockfile de production. Protocole navigateur et fixtures : rapport des parcours lié ci-dessus.
