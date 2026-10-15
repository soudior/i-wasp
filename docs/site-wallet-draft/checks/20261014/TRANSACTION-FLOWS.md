# Parcours Wallet, inscription et commande — récupération et nouvelle validation

## Provenance

Les fichiers ont été reconstruits le 14 octobre 2026 dans un nouveau checkout fondé sur `6c21852c7d85af9e59a3ac853767c0b59846f4e7`, après disparition du checkout précédent. Les transformations des fichiers de production ont été rejouées depuis les commandes de la tâche initiale, sans extension fonctionnelle.

Le blob Git de `src/pages/Signup.tsx` est exactement `9c1d02b887bc46d9b1d2daf991a8f2c88091abb9`, identique à la valeur attendue. Les empreintes SHA-256 des dix fichiers reconstitués figurent dans `recovery/transaction-files-sha256.txt`.

Les résultats ci-dessous proviennent exclusivement des nouvelles exécutions dans le checkout reconstruit. Les anciens journaux avant/après ont disparu et ne sont pas présentés comme preuves disponibles.

## Résultat vérifié à nouveau

- 37 tests ciblés passent : 22 interactions React/jsdom, 3 tests du contrat réel AuthProvider et 12 tests du service Wallet. Journal : `recovery/transaction-flows-tests.txt`.
- Lint ciblé : aucune erreur, un avertissement Fast Refresh préexistant dans AuthContext. Journal : `recovery/transaction-flows-lint.txt`.
- TypeScript application : `npx tsc --noEmit -p tsconfig.app.json` exécuté sans erreur. Journal : `recovery/transaction-flows-typecheck.txt`.
- Les deux scripts de test navigateur/serveur passent `node --check`.
- Serveur de fixtures : 5 contrôles HTTP locaux passent (`recovery/transaction-fixtures-smoke.json`). Client Supabase compilé vers loopback, CSP externe restrictive, réponse d’inscription fictive, erreur de paiement fictive et échec fermé des endpoints inconnus vérifiés. Le serveur a été arrêté après ces contrôles.
- Aucun prix, contenu client protégé, droit Pro ou mécanisme de paiement serveur n’a été changé dans ce lot.

## Corrections reconstituées

1. Wallet : verrou immédiat contre les doubles clics, retrait du verrou après erreur, annulation de la chaîne si l’utilisateur quitte la page. Le signal d’annulation est propagé à l’appel du fournisseur. Une réponse tardive ne redirige plus l’utilisateur après fermeture.
2. Inscription : doubles soumissions et clics OAuth verrouillés ; reprise possible après erreur ; valeurs conservées ; labels reliés aux champs et attributs d’autocomplétion ajoutés. Une inscription sans session demande de vérifier l’e-mail au lieu de lancer l’onboarding. Une réponse tardive ne force plus une navigation après fermeture.
3. Commande : double confirmation verrouillée ; échec de création de carte stoppe la commande avant le paiement. Une réussite partielle est réutilisée lors d’une nouvelle tentative sur le même récapitulatif, avec les mêmes données et le même compte. Les appels ne continuent plus vers commande/paiement après fermeture de la page.

## Isolation des tests

Toutes les identités sont inventées (`example.invalid`, UUID de test, adresse et téléphone fictifs). React/jsdom remplace les services par des mocks et interdit fetch. Aucun compte réel, e-mail réel, pass signé, commande distante ou paiement réel n’a été créé.

Le script Playwright utilise une API réservée `.invalid`, intercepte chaque requête distante, bloque les service workers et bloque la résolution DNS hors loopback. Il prévoit 22 scénarios à 390 et 1440 px : Wallet anonyme/non-propriétaire, URL fournisseur rejetée, navigation fournisseur simulée et retour, inscription invalide/confirmation, tunnel anonyme, paiement COD fictif, échecs/reprises.

## Limite navigateur : aucune validation visuelle revendiquée

Une nouvelle tentative du harness Playwright a été faite après reconstruction. Chromium échoue avant la première page sur `socket() failed: Operation not permitted` (AF_UNIX). Les 22 scénarios ne sont donc pas exécutés. Preuves fraîches : `recovery/transaction-flows-browser-console.txt` et `recovery/transaction-flows-browser.json`, avec zéro résultat de scénario.

Une tentative antérieure du navigateur cloud vers un serveur QA loopback avait également échoué (`ERR_CONNECTION_REFUSED`) ; elle n’a pas été comptée comme une validation dans cette récupération. Aucune capture, vérification responsive, audit de contraste ou installation Wallet mobile n’est revendiquée.

## Reproduction

```sh
npm ci
npx vitest run src/pages/transactionFlows.local.test.tsx src/contexts/AuthContext.signup.test.tsx src/lib/walletService.test.ts
npx tsc --noEmit -p tsconfig.app.json
```

Suite navigateur, sur une machine pouvant lancer Chromium et disposant de Playwright (axe-core facultatif) :

```sh
IWASP_BROWSER_PACKAGES=/chemin/vers/browser-tools/package.json \
IWASP_CHROME=/usr/bin/chromium \
node scripts/test-transaction-flows-local.mjs
```

Le script démarre et arrête son propre Vite sur 127.0.0.1:8087. `IWASP_TEST_PORT` et `IWASP_TEST_OUTPUT` sont facultatifs. Aucun package navigateur n’est ajouté aux dépendances de production.

Serveur manuel isolé, pour un navigateur partageant le même réseau loopback :

```sh
node scripts/serve-transaction-fixtures-local.mjs
```

Il écoute 127.0.0.1:8088, fournit les seuls faux endpoints `__qa-api`, et bloque les ressources/connexions externes par CSP. Les routes et fixtures sont documentées en tête du script. Ce serveur est réservé aux tests, jamais au déploiement.

## Limites fonctionnelles conservées

- Les checkpoints de reprise commande sont en mémoire, dans le récapitulatif actif. Ils ne garantissent pas une idempotence après rechargement, changement de moyen de paiement, retour depuis Stripe ou résultat réseau ambigu. Une garantie transactionnelle nécessite une clé idempotente et une orchestration côté serveur ; ce travail n’est pas revendiqué ici.
- Un abandon de page n’annule pas rétroactivement une écriture déjà acceptée par le serveur ; il empêche les étapes et redirections suivantes.
- Login et SaaSPricing continuent de lire le champ `error` existant d’AuthContext ; le retour enrichi reste compatible. Leur UX historique d’inscription hors de `/signup` n’a pas été refondue.
- La signature des passes, les règles réelles Supabase et la confirmation Stripe nécessitent une recette séparée autorisée sur un environnement de test adapté. Aucun comportement de production n’est déduit de ces mocks.
