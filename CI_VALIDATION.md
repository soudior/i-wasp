# Valider i-WASP avant une fusion

La CI `PR validation` vérifie chaque PR, y compris les brouillons, sans secret Apple, sans données client, sans déploiement et sans envoi TestFlight/App Store. Les six contrôles restent indépendants : un échec n’empêche pas les autres de donner leur résultat. Les exécutions obsolètes sont annulées et chaque job Linux est limité à 15 minutes.

## Reproduire les contrôles

Avec Node 22 et un checkout propre :

```sh
npm ci --no-audit --no-fund
export VITE_SUPABASE_URL=https://ci.invalid
export VITE_SUPABASE_PUBLISHABLE_KEY=ci-placeholder-not-a-secret
export VITE_SUPABASE_PROJECT_ID=ci-placeholder
npm run test:auth
npm test
node scripts/test-resolver-core.mjs
npm run test:ci
npm run typecheck
npm run lint
git diff --check
npm run build
npm run check:ios
npx --no-install cap add ios  # une seule fois, si ios/ est absent
npx --no-install cap sync ios
node scripts/configure-ios-native.mjs
npm run check:ios -- --generated
```

`typecheck` analyse explicitement `tsconfig.app.json` et `tsconfig.node.json`. L’ancien `tsc --noEmit` sur le fichier racine à `files: []` ne validait pas réellement l’application. Les règles de lint existantes sont conservées : les erreurs bloquent, les avertissements constituent une dette visible, pas un échec masqué. Les fonctions Edge Deno restent hors du périmètre TypeScript/lint frontend existant.

## Quand une étape échoue

Ouvrir Actions → `PR validation` → le job rouge. L’annotation et le résumé donnent le contrôle en échec et le lien vers l’exécution. Reproduire la commande ci-dessus, corriger sur la branche, puis pousser : les six contrôles repartent automatiquement. Ne pas fusionner sur un échec.

Le workflow séparé `PR validation failure alert` publie ou actualise un commentaire de PR avec le nom exact de l’étape, le lien direct de ses logs et l’action attendue. **Il ne devient actif qu’une fois présent sur la branche par défaut** : avant cela, utiliser les annotations et résumés de la CI. Il n’exécute aucun code de PR et ne télécharge aucun artefact ; il lit seulement les métadonnées GitHub. Une ancienne révision n’est pas commentée si une nouvelle a déjà été poussée. Sans PR associée à l’exécution, seul son résumé est produit. Le commentaire décrit la dernière panne et ne constitue pas un statut courant : les checks GitHub font foi.

Pour rendre ces contrôles obligatoires, un administrateur pourra sélectionner `auth`, `regression`, `typescript`, `quality`, `web` et `ios-config` dans les règles de protection de branche après leur première exécution. Cette PR ne modifie pas ces règles.

## Ce que le contrôle iOS ne prouve pas

Sur Linux, la CI vérifie la cohérence de la configuration des retours d’authentification, des fichiers d’association et du projet iOS généré, puis applique la configuration native. Cela **n’est pas une compilation Xcode**, un test de signature, un test réseau de Supabase ou un test sur appareil.

Le workflow existant `iOS Build (unsigned validation)` reste **manuel** et inchangé. Il nécessite macOS/Xcode. Ne le lancer qu’après autorisation et vérification d’un plafond de coût adapté ; cette tâche ne le déclenche pas. Les workflows signés, TestFlight et captures App Store ne sont pas déclenchés ni modifiés.

Avant une nouvelle soumission Apple, il reste à vérifier manuellement :

- Sur un **vrai iPad**, avec le build iOS concerné : connexion de revue par e-mail, démarrage à froid et à chaud, restauration de session, erreur réseau et possibilité de réessayer.
- Sur cet appareil : OAuth Apple/Google, annulation puis nouvelle tentative, retour du navigateur système vers l’app, liens universels et redémarrage après retour. Un navigateur web ou un simulateur ne remplace pas cette validation.
- Dans **Supabase**, avec un accès administrateur : liste réelle des URL de redirection autorisées et configuration des fournisseurs Apple/Google. Les tests locaux utilisent des doubles, pas les comptes ni les données de production.
- Avec les accès Apple appropriés : compilation Xcode, entitlements effectivement signés, provisioning, identifiants de fournisseur et compte de revue actif. Le NFC doit être testé sur un iPhone compatible ; l’iPad ne permet pas de valider cette lecture NFC.

## Retour arrière

Avant fusion : fermer la PR de CI ; la PR d’authentification #15 et `main` restent intactes. La branche CI est issue de `fix/app-review-login-reliability` : réviser son diff par rapport à cette branche, pas les corrections d’authentification déjà présentes.

Après une fusion future : créer une nouvelle branche et une PR de `git revert` du commit de CI (ou `git revert -m 1 <commit-de-fusion>` si c’est une fusion classique). Revenir sur les seuls fichiers de CI/scripts/docs et la commande npm ; ne pas rétablir d’anciennes données client ni annuler les changements d’authentification. Si les checks sont devenus obligatoires entre-temps, faire coordonner leur retrait avec le revert par l’administrateur. Pour suspendre seulement l’alerte, désactiver son workflow dans Actions. Aucun rollback de production ou Apple n’est nécessaire : cette CI ne publie rien.

## Résultats vérifiés sur cette branche

Sous Node **22.23.3**, les contrôles locaux passent : authentification **100 tests**, suite complète **543 tests** (elle inclut les 100 précédents), tests des garde-fous iOS et de l’alerte **13 tests**, TypeScript application/outillage, lint, build web, contrôle statique iOS et génération/synchronisation du projet iOS avec ses vrais plugins puis validation `--generated`. Le résolveur passe aussi ses scénarios et les deux workflows passent `actionlint 1.7.7`.

Le lint conserve **266 avertissements préexistants**, mais **aucune erreur** après la correction minimale `let` → `const` du timer de stockage de prévisualisation. L’installation initiale a signalé **59 vulnérabilités npm** (1 faible, 15 modérées, 37 élevées, 6 critiques) : pas de mise à jour massive ni de `npm audit fix --force` dans cette PR. Ce chantier de dépendances reste distinct ; la CI verte ne vaut pas certification de sécurité.

L’alerte a été testée avec des réponses GitHub simulées : nom de l’étape, lien des logs, action attendue, mise à jour sans doublon, révision obsolète, absence de PR et expiration. Son envoi réel par `workflow_run` attend l’activation du workflow sur la branche par défaut. La compilation Xcode et les validations physiques/externes ci-dessus ne sont pas déclarées réussies.
