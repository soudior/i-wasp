# Implémentation IWASP

## Dépôts et responsabilités

Rechercher d'abord le workspace courant ; dans l'installation habituelle :

- `i-wasp/` contient la fiche publique, les templates, les données et le domaine canonique.
- `iwallet-card/` contient la génération serveur des pass Apple Wallet et l'entrée Telegram.

Ne pas fusionner arbitrairement les bases. Le résolveur est la source de vérité inter-systèmes.

## Contrat d'URL

- Fiche NFC : `https://i-wasp.com/card/<slug>`
- Résolveur de production : `https://i-wasp.pages.dev/api/resolve-card?id=<slug>`
- Téléchargement public Wallet : `https://walletcard.ssouhail-92.chatgpt.site/api/apple-wallet?slug=<slug>`

Le slug est une donnée contractuelle. Un tiret final peut être valide. Si une ancienne ligne de base utilise un alias sans tiret, essayer d'abord l'identifiant exact puis l'alias historique, tout en gardant le slug canonique dans le QR et le pass.

## Fiche publique

La fiche doit afficher au minimum le logo ou la photo officielle, le nom, la catégorie, la ville, les actions vérifiées, l'ajout aux contacts, Apple Wallet et le QR NFC. Éviter les initiales génériques, les grands espaces vides et les boutons sans données réelles.

Utiliser `qrcode.react` pour le QR visible et `publicCardUrl(slug)` pour sa valeur. Le bouton Wallet doit viser le téléchargement serveur public par slug. Ne pas réutiliser un ancien service Wallet qui remplace silencieusement le pass par une vCard.

Pour une PWA, exclure `/card/` du fallback de navigation du service worker et supprimer les anciens caches afin qu'une fiche publique ne reste pas bloquée sur un ancien bundle.

## Apple Wallet

Le serveur doit :

- résoudre la carte depuis le slug plutôt que faire confiance à des données de navigateur ;
- refuser de signer si le résolveur ne confirme pas exactement l'identifiant demandé ;
- omettre les champs inconnus ;
- signer avec le certificat PassKit et renvoyer le type MIME `.pkpass` ;
- inclure `barcodes` et `barcode` avec le lien NFC canonique ;
- conserver la vCard comme information secondaire uniquement.

Après déploiement, télécharger le pass de production et exécuter le décodeur QR du dépôt, par exemple `npm run test:pkpass-qr -- <fichier.pkpass>`.

## Publication habituelle

Pour i-Wasp, pousser la branche prévue puis publier le projet Lovable lié au domaine `i-wasp.com`. Le projet connu porte l'identifiant `17c6de15-2d85-46a1-a7d8-e5c478c6f024`.

Pour WalletCard, respecter `.openai/hosting.json`, pousser le commit exact vers le dépôt Sites, construire, empaqueter avec le script Sites, sauvegarder une version puis la déployer. Le projet connu porte l'identifiant `appgprj_6a8f45e10dd88191b11380f0793bf2fd`.

Les identifiants ne sont pas des secrets mais doivent être relus depuis les fichiers ou réponses du service lorsqu'ils changent. Ne jamais exposer ni persister les jetons temporaires de déploiement.

## Vérification minimale

1. Typecheck, tests et build dans chaque dépôt modifié.
2. Trois résolutions : carte native, carte WalletCard, identifiant inconnu.
3. HTTP et MIME du pass en production.
4. Décodage du QR du pass.
5. Rendu navigateur mobile de la fiche avec logo, Wallet et QR visibles.
6. Contrôle du bundle et du service worker réellement servis par la production, pas seulement du build local.

Si le navigateur montre encore une ancienne version, distinguer un échec de déploiement d'un service worker obsolète. Corriger le cache ; ne pas demander au client de vivre durablement avec une actualisation forcée.
