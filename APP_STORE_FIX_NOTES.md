# Préparation App Store — corrections locales du 1 octobre 2026

Aucune publication, modification de tarifs ou de paiements, ni modification des cartes clients protégées.

## Corrections

- Suppression de compte : les erreurs retournées par Supabase sont désormais contrôlées. Une étape en échec bloque la suppression Auth et produit une référence de support avec étapes terminées. Les lectures de dépendances sont également contrôlées.
- Réglages : afficher la référence de support lors d'un échec serveur, et ne déconnecter l'utilisateur qu'après une réponse explicite success:true.
- Apple : révocation préalable obligatoire pour les comptes ayant une identité Apple. L'absence de configuration ou de token n'est plus traitée comme un succès.
- Storage : parcours paginé et récursif des deux préfixes utilisateur existants ; erreurs de lecture/suppression contrôlées.
- CI : vérification Xcode et SDK iOS >= 26 ; version commerciale 1.0 explicite pour l'archive signée. Build toujours fourni par le numéro d'exécution.
- Notes reviewer : Apple/Google présentés de façon cohérente.
- Export vCard : omettre le champ URL si le serveur ne renvoie aucun slug ; correction d'une erreur de typage existante détectée par le contrôle explicite de tsconfig.app.
- Permissions : modes background fetch et remote-notification retirés. Le projet utilise Web Push, sans plugin natif APNs ni tâche native de fetch. Autres permissions conservées pour vérification sur appareil.

## Limites et actions avant déploiement

Le nettoyage multi-service (base, Storage, Apple, Auth) n'est pas une transaction atomique. Les suppressions déjà réussies ne sont pas annulées après un échec ; les opérations sont répétables. Si l'étape Auth échoue après suppression des enregistrements de tokens Apple, la reprise exige une procédure de support et la récupération d'un token valide. Une orchestration durable/transaction SQL doit être étudiée après validation du schéma réel.

Vérifier les tables/champs et tous les préfixes d'upload réellement employés : les deux buckets et préfixes userId proviennent de l'implémentation existante et ne prouvent pas l'absence d'autres données. La suppression des lignes d'abonnement ne résilie pas automatiquement un abonnement Stripe. Décision et mise en œuvre séparées nécessaires, sans modifier les paiements dans ce lot.

La table apple_auth_tokens et sa collecte sont à confirmer ; aucun secret ajouté. Déployer seulement après test sur une base de test et compte jetable, puis vérifier Auth, données, fichiers, anonymisation et révocation Apple.

Aucun PrivacyInfo.xcprivacy ajouté : établir les données collectées, les API natives et les manifests embarqués par les SDK dans l'archive avant de rédiger des déclarations. Aucun audit de l'archive native n'a été réalisé sur Windows.

Il reste à valider le backend attendu (domaine public et dépôt divergent), les providers OAuth, le modèle de vente numérique/iOS, les captures iPhone, les permissions, la signature et les essais réels NFC/Wallet/OAuth sur TestFlight. L'archive exige un Mac ou la CI macOS ; la publication exige le compte Apple.

## Validation locale

Typecheck réussi ; 84 tests réussis (dont 4 tests du contrôle d'erreurs serveur) ; build web réussi ; lint sans erreur, 272 avertissements préexistants. Les contrôles web ne compilent pas la fonction Deno ni l'application iOS ; ces validations restent séparées.
