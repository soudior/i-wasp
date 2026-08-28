---
name: iwasp-nfc-client
description: Créer, refaire et publier pour un commerçant une fiche NFC i-Wasp premium avec identité visuelle, informations vérifiées, QR canonique et véritable pass Apple Wallet. Utiliser dès que l'utilisateur demande un lien ou une carte NFC client, une fiche commerçant i-Wasp, un QR NFC ou une carte Wallet associée.
---

# IWASP Client NFC

Prendre la responsabilité produit de bout en bout. À partir du nom, d'un lien ou d'une fiche Google du commerçant, livrer une expérience prête à être montrée au client sans redemander à l'utilisateur les règles déjà définies ici.

## Résultat attendu

Livrer ensemble :

- une fiche publique mobile premium sous `https://i-wasp.com/card/<slug>` ;
- le logo officiel et des visuels de qualité adaptés à l'identité du commerçant ;
- les actions utiles réellement disponibles : site, itinéraire, contact et réseaux vérifiés ;
- un QR visible qui encode exactement l'URL NFC canonique ;
- un véritable fichier Apple Wallet `.pkpass` signé ;
- dans le pass Wallet, un QR qui encode la même URL NFC, jamais un téléphone ni une vCard ;
- une publication en production et des preuves de fonctionnement.

## Mode opératoire

1. Identifier le commerçant sans ambiguïté. Rechercher son site, ses réseaux sociaux et ses informations publiques actuelles. Privilégier les sources officielles et Google Business. Ne jamais inventer téléphone, e-mail, horaires, avis ou URL.
2. Auditer la fiche existante, les données i-Wasp et les deux dépôts avant de modifier. Préserver les changements utilisateur non liés.
3. Concevoir comme un directeur de produit : identité fidèle, hiérarchie claire, première impression forte, mobile-first, boutons utiles, logo non remplacé par une initiale lorsque le logo existe.
4. Produire ou adapter les images seulement si elles améliorent réellement la fiche. Ne jamais fabriquer un faux logo ni présenter une image générée comme une photo officielle.
5. Conserver une seule URL canonique i-Wasp. Traiter les anciens slugs ou alias côté résolution sans modifier l'URL déjà encodée dans les QR, Wallet ou puces.
6. Générer le pass Apple Wallet côté serveur avec le certificat configuré. Accepter l'absence de champs inconnus plutôt que d'ajouter de fausses coordonnées.
7. Publier les changements dans les systèmes concernés, puis valider la production. Corriger et recommencer jusqu'à satisfaction des contrôles ci-dessous.

## Contrôles obligatoires

- La fiche existe réellement et ne montre ni « Carte introuvable » ni écran vide.
- Le logo, le bouton Apple Wallet et le QR sont visibles dans un navigateur mobile.
- Le bouton Wallet renvoie HTTP 200, le type MIME `application/vnd.apple.pkpass` et un fichier ouvrable par iOS.
- Le QR visible et le QR extrait du `.pkpass` décodent tous deux vers `https://i-wasp.com/card/<slug>`.
- Le résolveur distingue une carte i-Wasp, une carte WalletCard et un identifiant inconnu avec un vrai 404 logique.
- Les tests, le typage et les builds des dépôts touchés passent.
- Une ancienne PWA ou un service worker ne peut pas continuer à servir une fiche NFC obsolète.

Ne jamais autoriser l'impression d'un QR ou l'encodage d'une puce NFC avant la validation en production de la fiche, du pass et des deux QR.

## Autonomie et arrêts

Avancer sans demander l'autorisation pour chaque modification normale de développement. Demander seulement lorsqu'il manque un secret, qu'un paiement est nécessaire, qu'une identité commerciale reste ambiguë ou qu'une action externe irréversible dépasse la demande.

Ne pas annoncer « terminé » sur la seule base du code local. Donner un rapport court avec URL publique, statut Wallet, destination QR et éventuel blocage réel.

Pour les chemins, services, commandes de validation et pièges connus de ce workspace, lire [references/implementation.md](references/implementation.md). Pour une demande reçue par Hermes ou Telegram, lire [references/telegram-hermes.md](references/telegram-hermes.md).
