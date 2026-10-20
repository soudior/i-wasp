# IWASP — Dossier de reprise de la revue Apple

**Pas encore prêt à soumettre.** Ce dossier prépare la réponse, il ne certifie ni la connexion de production, ni un test iPad, ni une vidéo réalisée. Aucune fusion, publication, modification de compte/backend ou transmission à Apple n’est effectuée par cette intervention.

Les demandes connues, transmises après lecture d’App Store Connect, sont : le 26 août, une vidéo d’écran sur appareil physique avec le dernier OS et plusieurs réponses de revue ; le 28 août, le remplacement des icônes provisoires et une expérience native plus substantielle ; le 6 septembre, une capture du build 12 affichant **« Invalid API key »** lors de l’essai avec `apple-review@i-wasp.com`. Leur texte intégral n’est pas archivé ici. Les questions exactes doivent être recopiées par le titulaire, sans les deviner. Ce dossier ne résulte pas d’une nouvelle consultation du compte Apple.

## Ce que l’erreur permet réellement de conclure

Le formulaire de connexion appelle `supabase.auth.signInWithPassword` dans [`AuthContext.tsx`](src/contexts/AuthContext.tsx). [`client.ts`](src/integrations/supabase/client.ts) choisit séparément l’URL et la clé publique : une variable de build présente remplace sa valeur de repli, même si l’autre variable manque. Un build avec une seule variable peut donc incorporer une paire provenant de deux projets. Avant cette PR, aucun contrôle de cohérence ne précédait `npm run build` dans les workflows iOS.

Le commit `9640d896cb6911010b735d417d311a108afc3979`, associé au build refusé dans l’analyse de la PR #15, contient un repli vers un projet différent du code actuel. Le commit `f6b38fc` (« move production frontend to owned Supabase ») documente ensuite un changement de projet. **Ces différences sont vérifiables dans Git, mais elles ne révèlent pas les valeurs réellement incorporées au binaire 12.** Une branche à jour ne répare pas un binaire déjà livré.

L’erreur affichée ne démontre pas un mauvais mot de passe du compte de revue. Une clé manquante, non valide, révoquée ou associée au mauvais projet est compatible avec ce message. Le message seul ne permet pas de distinguer ces cas, ni d’attribuer définitivement l’erreur à Supabase sans la réponse réseau correspondante. Il ne faut pas la confondre avec la clé App Store Connect `.p8`, utilisée par l’outillage Apple et non par cette connexion email.

**Conclusion : risque de configuration démontré et désormais bloqué sur les chemins iOS du dépôt ; cause exacte du refus non établie.** Aucun appel au backend, secret, compte de revue ou donnée client n’a été utilisé pour établir ce diagnostic.

## Ce qui est corrigé sans toucher à la production

- `npm run build:ios` charge les mêmes variables publiques Vite en mode `production`, puis refuse une paire absente/incomplète, les espaces parasites, une URL non HTTPS/non origine, les valeurs de test reconnues, les clés serveur reconnues, et les incohérences vérifiables entre URL, project ID et ancien JWT anon. Il refuse également un JWT anon dont l’expiration déclarée est passée.
- Les deux workflows GitHub iOS et les deux chemins Codemagic appellent cette commande. Leurs déclenchements restent manuels ; aucune compilation macOS, signature ou étape d’envoi n’a été lancée.
- Le contrôle est **hors réseau** : il ne vérifie ni la signature d’un JWT, ni la validité/révocation d’une clé, ni l’appartenance d’une clé publishable opaque à un projet. Une clé de forme correcte peut encore être inutilisable. Il ne faut pas remplacer une valeur manquante par un exemple pour faire passer le contrôle.
- Les builds web habituels et la CI isolée conservent `npm run build`. Le client Supabase généré, ses replis et le backend restent inchangés. Un export iOS manuel qui contourne `build:ios` n’est pas protégé.
- L’ancienne source `public/app-icon-1024.png` est réellement un JPEG malgré son extension. Une source [`public/app-icon-ios-1024.png`](public/app-icon-ios-1024.png), vrai PNG RGB 1024×1024 sans alpha, contient exactement les mêmes pixels décodés. Les générateurs iOS l’utilisent désormais. **C’est une correction de format, pas un nouveau dessin, ni une preuve que les icônes provisoires signalées par Apple sont remplacées.** L’original web est préservé.
- Cette branche est explicitement exclue des déploiements Git Vercel. Les autres intégrations externes non décrites dans le dépôt ne sont pas attestées par ce fichier.

## Demandes Apple : ce qui est couvert, ce qui manque

| Demande | Preuve dans le dépôt | État réel / prochaine preuve |
|---|---|---|
| 26 août — vidéo sur appareil physique, dernier OS | Scénario ci-dessous ; aucun enregistrement App Review correspondant n’est attesté | **À faire** sur appareil réel. Consigner modèle, version exacte de l’OS, date et build ; vérifier la dernière version publique disponible au moment du test. Un simulateur ne remplace pas cette demande. |
| 26 août — réponses de revue | Questions intégrales non présentes dans le contexte ni les documents inspectés | **À compléter** : reprendre chaque question exacte dans le tableau ci-dessous et répondre avec une preuve. Ne pas envoyer le modèle incomplet. |
| 28 août — icônes provisoires | Source PNG corrigée ; génération `capacitor-assets` prévue dans les workflows | **Partiel** : le titulaire doit identifier toutes les icônes visées, approuver l’identité finale et contrôler l’archive installée, le launch screen et la fiche Apple. Pas de validation esthétique ou Apple déduite du seul format PNG. |
| 28 août — expérience native substantielle | Route protégée `/nfc-studio`, [`NativeNfcStudio.tsx`](src/pages/NativeNfcStudio.tsx), plugin NFC natif ; flux OAuth navigateur système + retour deep link | **Code présent, résultat non démontré.** Montrer un parcours utile complet sur appareil. L’acceptabilité reste une décision Apple. Ne pas présenter le simple emballage Capacitor ou un bouton OAuth comme preuve suffisante. |
| 6 septembre — connexion build 12 | PR #15 : fiabilisation UI/session/OAuth ; cette PR : garde-fou de build | **Blocage de sortie** : le compte exact et le binaire candidat doivent être testés réellement, sans « Invalid API key ». Les tests simulés ne suffisent pas. |

### Fonctions natives à décrire sans surpromesse

Le studio NFC possède des appels de lecture/écriture NDEF reliés à l’interface. Leur présence n’atteste ni l’autorisation iOS correcte dans l’archive signée ni un essai matériel réussi. Le NFC doit être montré sur **iPhone compatible**, pas revendiqué comme test NFC sur iPad. Vérifier que le studio est accessible depuis un parcours visible du compte de revue ; l’existence de la route ne suffit pas.

La connexion Apple iOS actuellement codée utilise le navigateur système (`@capacitor/browser`), PKCE et `iwasp://auth/callback`, **pas une feuille native Sign in with Apple**. Le plugin Haptics figure dans les dépendances, mais les appels UI audités utilisent `navigator.vibrate` : ne pas promettre un retour haptique natif iOS vérifié. Les fonctions Wallet, la suppression de compte et la révocation Apple ont des dépendances serveur ; ce dossier n’en atteste ni le déploiement ni le bon fonctionnement.

## À remplir par le titulaire avant de préparer une réponse finale

Ne mettre **aucun mot de passe, jeton ou clé** dans ce dossier ou la PR. Les identifiants de revue vérifiés se renseignent uniquement dans les champs sécurisés d’App Review Information. Aucune création/modification de compte n’est autorisée par ce dossier.

| Champ | Valeur à fournir / validation attendue |
|---|---|
| Titulaire ou responsable de la réponse | **[À REMPLIR]** |
| Version, build candidat, commit source et origine de l’archive | **[À REMPLIR]** — ne pas réutiliser automatiquement « build 1 » des anciens guides |
| Projet attendu et source des variables du build | **[À VALIDER PAR LE RESPONSABLE]** — confirmer la paire dans l’environnement autorisé, sans copier de valeurs ici |
| Compte de revue exact | **[À CONFIRMER]** — Apple a essayé `apple-review@i-wasp.com` ; l’autre modèle cite `demo-appstore@i-wasp.com`. Aucun des deux n’est déclaré fonctionnel ici. Choisir et vérifier le compte réellement fourni, sans en créer un dans cette intervention. |
| Login de revue depuis une installation sans session | **[NON TESTÉ]** — appareil, OS, build, date, résultat |
| Données de démonstration autorisées | **[À CONFIRMER PAR LE TITULAIRE]** — pas de données client, pas d’accès payant requis non expliqué |
| iPad physique / iPadOS exact | **[NON TESTÉ]** — connexion, clavier, rotation, annulation/reprise OAuth, retour dans l’app |
| iPhone compatible / iOS exact | **[NON TESTÉ]** — parcours utile et NFC avec puce de test autorisée |
| Vidéo demandée | **[NON RÉALISÉE]** — lien accessible à Apple, modèle, OS, version/build, date ; contrôler l’accès au lien avant l’envoi |
| Icônes finales et captures du build réel | **[À APPROUVER ET VÉRIFIER]** — icône installée, tailles générées, absence d’icônes provisoires dans les écrans visés |
| Questions Apple du 26 août | **[À RECOPIER INTÉGRALEMENT]** depuis App Store Connect |
| Métadonnées et déclarations | **[À VÉRIFIER]** — description, catégories/âge, URLs support/confidentialité, App Privacy, droits et statut trader si applicables ; les anciens modèles ne prouvent pas leur saisie côté Apple |

### Réponses à préparer pour le 26 août

Ajouter autant de lignes que de questions réelles. Ne pas déduire leur contenu d’autres demandes Apple.

| Question Apple exacte | Réponse factuelle, courte | Preuve / minute vidéo | Responsable et état |
|---|---|---|---|
| **[COLLER LA PREMIÈRE QUESTION EXACTE]** | **[À REMPLIR]** | **[À REMPLIR]** | **[OUVERT]** |
| **[AJOUTER CHAQUE AUTRE QUESTION EXACTE]** | **[À REMPLIR]** | **[À REMPLIR]** | **[OUVERT]** |

## Scénario simple pour la vidéo sur un vrai appareil

**Préparation.** Le responsable installe le build candidat autorisé, vérifie le dernier OS public adapté à l’appareil au moment du test et n’utilise que des données de démonstration autorisées. Masquer les notifications personnelles. Aucun enregistrement n’a été fait ici. Si le build ne se connecte pas, arrêter la démonstration et noter l’échec, sans le masquer par un montage ou un faux écran.

1. **Identifier le test.** Montrer le modèle et la version exacte de l’OS dans Réglages, puis la version/build de l’application. Dire : « Voici IWASP [version/build], installé sur un [modèle] physique sous [OS/version]. » Ne pas prétendre « dernier OS » sans vérification faite ce jour-là.
2. **Démarrer à froid.** Revenir à l’écran d’accueil, montrer l’icône installée et ouvrir l’app sans session préalable. Montrer le compte de revue autorisé sans exposer son mot de passe ; ouvrir la session et attendre le tableau de bord. Constater l’absence ou la présence de l’erreur, sans inventer de réussite.
3. **Montrer une utilité complète.** Ouvrir une carte de démonstration existante, consulter son profil et son QR code. Si une modification sur les seules données de démo a été autorisée séparément, modifier un champ de test, sauvegarder et rouvrir pour montrer le résultat ; sinon rester en lecture seule. Montrer les actions réellement disponibles dans ce build, pas une maquette.
4. **Montrer la fonction native revendiquée.** Sur iPhone compatible, accéder au studio NFC par le parcours visible de l’app et lire une puce de test. Écrire uniquement si le responsable dispose d’une puce vierge et de l’autorisation explicite de la modifier ; vérifier ensuite la lecture. Montrer le résultat réel. Sur iPad, ne pas simuler le NFC ; démontrer plutôt la connexion, la navigation et le retour OAuth s’ils fonctionnent.
5. **Répondre aux questions exactes.** Pour chaque question du 26 août : « Concernant “[question exacte]”, voici [réponse vérifiée] ». Montrer la preuve et noter le minutage dans le tableau. Expliquer honnêtement toute fonction non disponible ou non testée.
6. **Terminer sans action destructive.** Montrer où se trouvent l’aide et les réglages si utile. Ne pas supprimer un compte, modifier un abonnement ni déclencher un paiement pour cette vidéo sans autorisation spécifique. Vérifier que le fichier final se lit et que son lien est consultable par la revue Apple.

Prévoir une validation dédiée sur **iPad physique**, même si la séquence NFC est filmée sur iPhone. Ce scénario ne permet pas de cocher ce test à distance.

## Brouillon de réponse Apple — ne pas envoyer en l’état

> Thank you for your feedback. The candidate is version **[VERSION]**, build **[BUILD]**. We have **[DESCRIBE ONLY VERIFIED CHANGES]**. The review account entered in App Review Information was tested on **[PHYSICAL DEVICE, OS, DATE]**, with the following result: **[ACTUAL RESULT]**.
>
> The physical-device screen recording is available at **[ACCESSIBLE VIDEO LINK]**. It shows **[ACTUAL FLOWS AND TIMESTAMPS]**. For the August 26 questions: **[EACH EXACT QUESTION AND VERIFIED ANSWER]**.
>
> Regarding the August 28 feedback, the final icons were checked in **[EXACT BUILD / SCREENS]** and the useful native workflow demonstrated is **[ACTUAL DEVICE-VERIFIED WORKFLOW]**. Remaining limitations are **[HONEST LIMITATIONS]**.

## Vérifications techniques et ordre de reprise

Les résultats locaux sont consignés dans le corps de la PR associée. Les valeurs de test sont entièrement factices ; un build web réussi avec ces valeurs n’est pas un build utilisable pour la revue. La CI Ubuntu de la PR #16 valide la régression, pas la connexion de production ni Xcode.

1. Faire relire séparément les PR #15, #16 et cette PR empilée ; aucune fusion automatique. Cette PR a pour base `ci/pr-validation-guardrails` et ne doit pas être fusionnée isolément sans traiter ses dépendances.
2. Le responsable de l’environnement confirme la paire publique URL/clé du projet attendu, la provenance du build refusé si encore disponible et la validité du compte de revue. Cela exige un contrôle autorisé hors de cette intervention ; aucune configuration Supabase n’a été ouverte/modifiée ici.
3. Le titulaire Apple confirme les questions exactes, les icônes finales, les champs de revue et le build candidat. Un nouveau build signé et toute distribution exigent une autorisation séparée, un environnement Apple et un plafond pour les services payants.
4. Effectuer les essais physiques, enregistrer la vidéo et remplir les preuves. Aucune soumission tant que la connexion, la vidéo, les réponses et les validations matérielles restent ouvertes.
5. Toute publication, transmission de captures, TestFlight ou soumission App Store reste une action ultérieure à autoriser. Ne lancer aucun des workflows Apple pour simplement lire ce dossier.
