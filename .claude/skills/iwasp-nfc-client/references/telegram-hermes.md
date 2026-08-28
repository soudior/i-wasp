# Habitude Hermes et Telegram

## Déclencheurs

Activer cette procédure pour toute formulation équivalente à :

- « Fais un lien NFC pour ce client »
- « Recrée la carte de ce commerçant »
- « Fais sa carte Wallet »
- `/carte <nom ou URL du commerçant>`

Le nom, l'URL ou la fiche Google fournie constitue le point de départ. Ne pas redemander à l'utilisateur de répéter les exigences de design, Wallet, QR, domaine et publication contenues dans le skill principal.

## Dialogue

Répondre d'abord par un accusé bref : commerçant identifié, recherche en cours, fiche NFC et Wallet prévus. Poser une question seulement si plusieurs entreprises portent le même nom ou si une information non publique est indispensable.

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
