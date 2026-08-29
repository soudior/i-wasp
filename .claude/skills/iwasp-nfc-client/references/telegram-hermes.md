# Habitude Hermes et Telegram

## Déclencheurs

Activer cette procédure pour toute formulation équivalente à :

- « Fais un lien NFC pour ce client »
- « Recrée la carte de ce commerçant »
- « Fais sa carte Wallet »
- `/carte <nom ou URL du commerçant>`

Le nom, l'URL ou la fiche Google fournie constitue le point de départ. Ne pas redemander à l'utilisateur de répéter les exigences de design, Wallet, QR, domaine et publication contenues dans le skill principal.

## Commandes permanentes

- /carte <nom ou URL> : rechercher les sources officielles, préremplir uniquement les données vérifiées, récupérer le logo PNG officiel lorsqu'il existe, préparer l'aperçu puis demander confirmation avant création.
- /statut [id ou lien] : résoudre la carte dans les deux systèmes et afficher son état réel.
- /qr [id ou lien] : vérifier que la carte existe, puis envoyer un QR encodant exactement le lien NFC canonique.
- /wallet [id ou lien] : résoudre la carte puis envoyer le pass Apple Wallet signé dont le QR encode le même lien.

Sans argument, les trois commandes de contrôle utilisent la dernière carte créée dans la conversation. Chaque nouvelle commande `/carte` invalide le brouillon et les boutons précédents, puis efface toutes les données du client précédent avant la recherche ; seule la dernière carte réellement créée reste disponible pour les commandes de contrôle. Ne jamais produire de QR ou de pass pour un identifiant que le résolveur ne connaît pas.

## Dialogue

Répondre d'abord par un accusé bref : commerçant identifié, recherche en cours, fiche NFC et Wallet prévus. Si une coordonnée manque sur l'accueil du site officiel, parcourir automatiquement les pages Contact, À propos et équivalentes du même domaine avant de poser une question. Poser une question seulement si plusieurs entreprises portent le même nom ou si une information reste réellement non publique après cette recherche.

Pendant l'exécution, envoyer des jalons utiles :

1. identité et sources vérifiées ;
2. fiche et visuels prêts ;
3. Wallet et QR validés ;
4. production publiée.

Le message final doit inclure :

- le lien NFC canonique ;
- la confirmation du logo, du QR visible et du bouton Apple Wallet ;
- la destination décodée du QR du pass ;
- l'autorisation ou l'interdiction d'imprimer/encoder.

Si un secret, un crédit ou une authentification bloque réellement, demander une seule action précise et reprendre automatiquement dès qu'elle est disponible. Ne pas noyer l'utilisateur dans des choix d'architecture.

## Règle de sécurité commerciale

Hermes ne doit jamais déclarer une fiche prête à être gravée ou imprimée sur la base d'un aperçu. Il faut une validation production et un QR décodé. Les numéros, e-mails et avis non vérifiés restent absents plutôt que fictifs.
