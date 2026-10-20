# IWASP — Dossier de reprise de la revue Apple

**Pas encore prêt à soumettre.** Ce dossier prépare la réponse, il ne certifie ni la connexion de production, ni un test iPad, ni une vidéo réalisée. Aucune fusion, publication, modification de compte/backend ou transmission à Apple n’est effectuée par cette intervention.

Les trois messages ont maintenant été **relus directement, en lecture seule**, dans [la soumission App Store Connect](https://appstoreconnect.apple.com/apps/6799452085/distribution/reviewsubmissions/details/8228ea14-c602-4263-8a2e-f3377fd4e02a), identifiant `8228ea14-c602-4263-8a2e-f3377fd4e02a`. La page affiche toujours **version 1.0 (12), refusée**, avec trois messages Apple : 26 août à 02:00, 28 août à 13:16 et 6 septembre à 16:48, selon les dates affichées par l’interface. Les sept demandes exactes du 26 août sont reproduites plus bas. Aucun champ Apple n’a été rempli ou enregistré, aucune réponse envoyée, aucun contrat accepté. L’utilisateur réalisera lui-même la vidéo après préparation du reste ; la vidéo ne remplace pas les validations du compte, du build et des appareils.

Le 28 août, Apple a examiné **1.0 (8)** sur **iPad Air 11-inch (M3)**. Le message dit précisément : « **Specifically, the icons are placeholders.** » Il demande de finaliser le contenu de l’app **et les métadonnées**. Pour 4.2, il précise que l’app n’est pas suffisamment différente d’une navigation web et que « **Including features such as push notifications, Core Location, or sharing do not provide a robust enough experience to be appropriate for the App Store.** » La simple présence de ces fonctions n’est donc pas une réponse suffisante.

Le 6 septembre, Apple a examiné **1.0 (12)** sur **iPad Air 11-inch (M3), iPadOS 26.6, connexion Internet active**. Son texte indique : « **We were unable to access the app because the app displayed an error message when we attempted to log in.** » L’expression **« Invalid API key »** et l’adresse `apple-review@i-wasp.com` proviennent de la capture déjà examinée lors de l’intervention précédente ; elles ne sont pas citées dans le corps de ce message. Apple demande un test sur appareils compatibles et, pour une nouvelle app, une désinstallation des versions précédentes avant réinstallation pour reproduire le problème. Ces essais restent non réalisés ici.

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
| 26 août — sept réponses de revue | Demandes exactes relues dans App Store Connect et reproduites ci-dessous, avec réponses proposées et limites | **Préparé dans le dossier**, sans envoi. Tests matériels, accès réel, marchés et droits restent à confirmer selon chaque réponse. |
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
| Questions Apple du 26 août | **[RECOPIÉES CI-DESSOUS]** — sept demandes exactes ; réponses étayées préparées, éléments non démontrés marqués à confirmer |
| Métadonnées et déclarations | **[À VÉRIFIER]** — description, catégories/âge, URLs support/confidentialité, App Privacy, droits et statut trader si applicables ; les anciens modèles ne prouvent pas leur saisie côté Apple |

### Réponses à préparer pour le 26 août

**Source : message Apple du 26 août, « Guideline 2.1 - Information Needed - New App Submission ».** Apple écrit : « Reply in App Store Connect with all of the following information: ». Les citations numérotées ci-dessous sont transcrites à l’identique depuis le texte rendu dans le navigateur, pas reconstituées à partir de modèles. Les réponses anglaises sont des **brouillons non envoyés** ; tout élément entre crochets empêche de les utiliser comme attestation finale.

#### 1. Vidéo sur appareil physique

> 1. A screen recording captured on a physical device, running the latest operating system, demonstrating the app's functionality. The recording must begin with launching the app and show the typical user flow through its core features. If the app has any of the following, include them in the recording:
>
> - Account registration, login, and account deletion flows
> - Accessing paid content or features within the app, including any purchase or subscription flows
> - User-generated content, including content reporting and blocking mechanisms
> - Any prompts requesting access to sensitive data or device capabilities (for example, location, contacts, camera, or App Tracking Transparency)

**État : vidéo à faire par l’utilisateur.** Le dossier précédent ne couvrait pas explicitement toutes ces conditions ; le scénario ci-dessous est corrigé. Les écrans d’inscription, de connexion et de suppression de compte existent dans le dépôt. Leur fonctionnement réel et les autres branches applicables doivent être vérifiés dans le candidat. Montrer seulement l’emplacement du bouton de suppression ne démontre pas le parcours complet demandé par Apple.

**Réponse proposée après réalisation, à compléter :** “The physical-device recording is available at **[VIDEO LINK]**. It starts with launching IWASP version **[VERSION]**, build **[BUILD]**, on **[DEVICE]** running **[OS VERSION, VERIFIED AS CURRENT ON TEST DATE]**. The core user flow is shown at **[TIMESTAMPS]**. Registration, login and account deletion are shown at **[TIMESTAMPS]**. The applicable paid-feature, user-generated-content and permission flows are demonstrated at **[TIMESTAMPS]**, with the following verified limitations: **[LIMITATIONS OR JUSTIFIED NOT-APPLICABLE ITEMS]**.”

Ne pas remplir « not applicable » pour éviter de filmer une fonction présente. La disponibilité de ces fonctions et les moyens d’effectuer leurs essais sans données client ni paiement non autorisé restent à confirmer.

#### 2. Appareils et systèmes testés avant soumission

> 2. A list of the device models and operating systems the app was tested on before submitting for review

**État : à confirmer par l’équipe.** Les tests locaux et la CI ne constituent pas une liste d’essais matériels avant soumission. Le modèle iPad Air 11-inch (M3) et iPadOS 26.6 sont ceux indiqués par **Apple pour sa revue du 6 septembre**, pas un test réussi effectué par l’équipe. Il serait faux de les présenter comme tel.

**Réponse finale non établie :** “Our pre-submission physical-device test matrix is **[MODEL / OS / EXACT BUILD / TEST DATE / RESULT FOR EACH DEVICE]**.” Ne renseigner ce tableau qu’à partir d’un historique réel ou de nouveaux essais autorisés. À ce stade, **aucun test physique réussi de l’équipe n’est attesté dans ce dossier**.

#### 3. Fonctions, public visé et valeur

> 3. A description of the app's functions and target audience, including the problem it solves and the value it provides

**Réponse proposée, étayée par le code et les descriptions du dépôt :** “IWASP is a digital business-card and professional contact-sharing app for independent professionals, entrepreneurs and business teams. Users manage a digital contact profile and share it through a QR code or an NFC business card so recipients can access up-to-date contact information without installing the app. The app provides profile/card management and tools for following contact activity. A dedicated NFC studio is implemented for reading and programming compatible NFC tags on supported devices. Its purpose is to reduce reliance on printed cards and make professional contact details easier to share and update.”

**Preuves :** [`APP_STORE_LISTING.md`, description](APP_STORE_LISTING.md), routes dans [`src/App.tsx`](src/App.tsx), gestion des cartes et tableau de bord, [`NativeNfcStudio.tsx`](src/pages/NativeNfcStudio.tsx). La dernière phrase NFC décrit une implémentation ; elle ne revendique pas de test matériel réussi ni une acceptation au titre de 4.2. Les fonctionnalités réellement incluses dans le futur binaire doivent rester cohérentes avec cette réponse.

#### 4. Accès aux fonctions principales

> 4. Instructions for setting up and accessing the app's main features, including any required login credentials or sample files

**Réponse proposée, partielle :** “Launch IWASP and open the sign-in screen. Use the dedicated review account supplied in the secure App Review Information fields: **[CONFIRM EXACT ACCOUNT OUTSIDE THIS DOCUMENT]**. After signing in, open the account dashboard and select the dedicated demonstration card to view its profile and sharing options. Open Settings to locate the account-deletion flow. The NFC studio requires a supported physical device and a compatible test NFC tag. **[ADD THE EXACT VISIBLE MENU PATHS VERIFIED ON THE CANDIDATE, REQUIRED ACCOUNT TYPE, SAMPLE DATA AND ANY ENTITLEMENTS.]**”

**Faits prouvés et limites :** les routes `/login`, `/signup`, `/dashboard`, `/settings` et `/nfc-studio` sont présentes ; le studio NFC est protégé par une session. Les chemins de code ne garantissent pas que chaque entrée de menu soit visible pour le compte fourni. Aucun compte n’a été créé, modifié ou essayé ici. Le mot de passe ne doit pas être copié dans le dépôt. L’adresse utilisée par Apple et l’ancien modèle diffèrent : régler ce point avant de figer les instructions. Un compte ou un fichier d’exemple requis doit être réellement disponible, pas seulement annoncé.

#### 5. Services externes

> 5. A list of the external services, tools, or platforms the app uses to deliver its core functionality (for example, data providers, authentication services, payment processors, or AI services)

**Réponse proposée à partir du dépôt :** “IWASP integrates Supabase for authentication and application data, with Apple and Google as optional OAuth identity providers. The mobile app is packaged with Capacitor and includes bridges for the system browser, app links and NFC. The frontend also includes Stripe-related checkout, subscription and customer-portal flows and uses ipapi for country-based currency selection. The repository documents optional Wallet, transactional-email and AI/scraping integrations. Audience measurement includes Metricool on selected public website pages, application events recorded through Supabase, and conditional Google/Meta tracking-script helpers. **[OWNER TO IDENTIFY WHICH OPTIONAL SERVICES AND MEASUREMENT FLOWS ARE ACTUALLY ENABLED IN THE EXACT IOS CANDIDATE, USING THE INVENTORY BELOW.]**”

**Statut : inventaire de code disponible, activation réelle à confirmer.** Un import ou une fonction serveur versionnée ne prouve pas qu’un service soit configuré dans le build candidat. La liste finale doit inclure les services effectivement utilisés, sans copier de secret, et ne doit pas revendiquer de service fonctionnel non vérifié. Les fonctions supplémentaires et leurs preuves sont détaillées dans l’inventaire ci-dessous.

| Service ou outil | Preuve consultée | Ce qu’on peut dire / ce qui reste à confirmer |
|---|---|---|
| Supabase | `src/contexts/AuthContext.tsx`, `src/integrations/supabase/client.ts`, appels `supabase.functions.invoke` dans Settings et Subscription | Client d’authentification/données et appels à des fonctions distantes présents. Disponibilité du projet, validité de la clé et déploiement des fonctions non testés. |
| Apple / Google OAuth | `src/pages/Login.tsx`, `src/lib/nativeOAuth.ts` | Boutons et orchestration présents. Fournisseurs et redirections réellement configurés à confirmer ; pas de feuille Apple native dans ce parcours. |
| Capacitor et plugin NFC | `package.json`, `capacitor.config.ts`, `src/pages/NativeNfcStudio.tsx` | Outillage/bridges natifs présents, NFC relié à l’interface. Ce ne sont pas une preuve de fonctionnement matériel ni, à eux seuls, une réponse suffisante à 4.2. |
| Stripe | `src/hooks/useStripeSubscription.ts`, `src/pages/Subscription.tsx`, `src/pages/express/ExpressPayer.tsx` | Appels `check-subscription`, `payment-history`, `customer-portal`, `create-nfc-payment` présents ; traitement serveur et modes de test/production non vérifiés. Le code contient des abonnements en plus des commandes NFC physiques. |
| ipapi | `src/contexts/CurrencyContext.tsx` | Requête frontend pour déduire le pays et choisir une devise ; ne pas confondre géolocalisation par IP et permission GPS. Aucune requête exécutée pour cet audit. |
| PassKit / Apple Wallet, Google Wallet | `ENVIRONMENT.md` et modèles Wallet des documents existants | Dépendances/configurations décrites dans le dépôt ; activation et fonctionnement non attestés. Ne pas copier de jeton ni prétendre qu’un pass a été généré. |
| Resend | `ENVIRONMENT.md`, variables des fonctions d’email décrites | Service documenté pour les emails transactionnels ; disponibilité dans le candidat à confirmer par le responsable. Aucun email envoyé. |
| Passerelle IA Lovable / Firecrawl | `ENVIRONMENT.md`, fonctions `generate-*`, `webstudio-chat`, `scrape-website` documentées | Intégrations IA/scraping déclarées, pas preuve qu’elles soient actives ou exposées dans le candidat. Ne pas les annoncer comme fonctions testées ni déduire des droits sur les résultats. |
| Metricool | `index.html:16–31` | Script prévu uniquement sur `i-wasp.com` / `www.i-wasp.com`, sur une liste de pages marketing, sans query/hash. Son chargement effectif dans le binaire natif n’a pas été vérifié ; ne pas l’assimiler automatiquement à un suivi iOS actif ou à une absence de suivi. |
| Événements applicatifs / Google / Meta | `src/hooks/useAnalyticsEvents.ts`, `src/lib/analytics.ts:231–265` | Le hook écrit des événements dans Supabase ; le helper construit des scripts Google/Meta conditionnellement à des identifiants. La présence du helper n’est pas la preuve de son activation. Auditer le binaire candidat avant de figer App Privacy/ATT. |

#### 6. Différences régionales

> 6. Describe any regional differences in the app’s features or content, or confirm that the app functions consistently across all regions

**Réponse finale non établie.** Le dépôt ne suffit pas à confirmer des conditions identiques dans tous les pays, notamment pour monnaies, livraison, paiements, plateformes Wallet, langues et disponibilité des fournisseurs. **Ne pas répondre “the app functions consistently across all regions” sans validation produit et essais.**

**Réponse proposée sur les différences réellement présentes dans le code :** “The code supports French and English as complete translations. Other language resources are marked incomplete and should not be represented as fully supported. Currency presentation can vary by country: the currency context handles EUR, MAD, USD and GBP, with country detection and manual preferences. NFC pricing also includes EUR/MAD prices. Therefore we do not describe all regional presentation as identical. **[OWNER TO CONFIRM THE ACTUAL APP STORE TERRITORIES, SHIPPING/PAYMENT COVERAGE, SERVICE AVAILABILITY AND ANY FEATURE OR CONTENT RESTRICTIONS IN THE CANDIDATE.]**”

**Preuves :** `src/i18n/index.ts:56–74` marque FR/EN complets et ES/IT/NL/DE/AR incomplets ; `src/contexts/CurrencyContext.tsx` gère quatre devises et une détection par pays, alors que `src/components/CurrencySelector.tsx:23–25` expose EUR/USD/GBP ; `src/lib/nfcPricing.ts` définit des prix EUR/MAD. Ces variations ne prouvent ni la liste des marchés Apple, ni les pays où une livraison ou un paiement fonctionne. Aucun réglage de territoire n’a été ouvert/modifié.

#### 7. Industrie réglementée et droits de tiers

> 7. If the app operates in a highly regulated industry or includes protected third-party material, provide any relevant documentation or credentials to demonstrate you are authorized to provide these services or protected material

**État : validation indispensable du titulaire.** Le cœur décrit dans le dépôt est le partage de cartes de visite, pas la preuve d’une activité réglementée ni d’une autorisation. Les visuels, marques, profils et autres contenus de tiers exigent une validation des droits par le titulaire. Aucun contrat ou document de licence n’a été ouvert, signé ou accepté ici ; aucune donnée client n’a été inspectée pour répondre à cette question.

**Aucune réponse catégorique établie.** Préparer : “**[OWNER TO CONFIRM WHETHER THE ACTUAL APP OPERATES IN ANY HIGHLY REGULATED INDUSTRY AND TO IDENTIFY PROTECTED THIRD-PARTY MATERIAL.]** Authorisation documentation for any applicable services or protected material is **[DOCUMENTS OR VERIFIED REASON THIS DOES NOT APPLY]**.” Ne pas déclarer « not applicable », « all rights secured » ou une absence de contenu tiers à partir du code seul.

**Instruction Apple finale, également exacte :** “Include this information in the Notes field of the App Review Information section in App Store Connect for future submissions.” Le dossier prépare cette saisie ultérieure ; aucun Notes field n’a été modifié.

### Contrôles complémentaires : ne pas transformer des hypothèses en réponses

**Achats et abonnements.** Le tunnel NFC prévoit des commandes de biens physiques, avec Stripe ou paiement à la livraison (`src/contexts/OrderFunnelContext.tsx`, `src/pages/express/ExpressPayer.tsx`). Des routes et appels de gestion d’abonnement existent aussi (`/subscription`, `src/pages/Subscription.tsx`, `src/hooks/useStripeSubscription.ts`). Aucun parcours StoreKit/IAP n’a été identifié dans les écrans consultés ; ce constat limité n’établit ni son absence dans une archive native ni la conformité des fonctions numériques payantes. Le responsable doit préciser ce qui est réellement vendu et accessible dans le candidat. Aucun achat ni changement d’abonnement effectué.

**Profils publics et modération.** Des profils/cartes personnalisés peuvent être publics (`/card/:slug`). Aucun parcours de signalement de contenu ou de blocage d’utilisateur n’est démontré dans le périmètre frontend inspecté. Cela ne prouve pas l’absence de tout mécanisme ailleurs ; cela interdit en revanche d’annoncer ces fonctions comme disponibles, ou de conclure automatiquement que la demande conditionnelle d’Apple est sans objet. Le titulaire doit valider la nature des contenus et la réponse à donner ; aucune carte client n’a été ouverte ou modifiée.

**Permissions.** `ios-config/Info.plist.template` contient des textes caméra, photos, ajout à la photothèque, contacts, NFC et localisation ; les entitlements déclarent NFC et domaines associés. Le frontend comporte des appels de géolocalisation (`src/hooks/useGeolocation.ts`) et de permission de notifications web (`src/hooks/usePushNotifications.ts`), ainsi que le studio NFC déjà cité. Une déclaration plist, une API web et un prompt iOS effectivement observé sont trois preuves différentes. L’audit ne démontre pas l’apparition des prompts caméra/contacts/photos dans l’archive. Les permissions réellement demandées doivent être notées pendant les essais, avec leur motif et le comportement en cas de refus.

**App Privacy / ATT et captures.** La déclaration générale « aucun suivi, pas de prompt ATT requis » des anciens modèles ne peut pas être certifiée pour un build non inspecté alors que le dépôt contient de la mesure d’audience et des helpers de pixels conditionnels. La documentation de fiche est donc marquée à revalider, sans modifier la fiche Apple ni décider artificiellement d’ajouter un prompt. Apple rappelle aussi le 26 août que les captures doivent montrer l’app en usage, pas uniquement le titre, le login ou le splash. Aucun nouveau visuel, aucune icône finale, capture ou métadonnée de production n’a été changé ou envoyé.

## Scénario simple pour la vidéo sur un vrai appareil

**À faire par l’utilisateur, pas réalisé ici.** Avant de filmer, choisir le build candidat, le vrai appareil et des données de démonstration autorisées, vérifier la version actuelle de l’OS et préparer un compte jetable distinct pour les essais de création/suppression. Ne jamais employer un compte client ni supprimer le compte de revue que devra utiliser Apple. Les moyens de test des achats, de la modération et des permissions doivent être confirmés avant l’enregistrement. Aucun compte, paiement, abonnement ou backend n’est modifié dans cette intervention.

**L’enregistrement doit commencer par le lancement de l’app**, comme Apple le demande explicitement : ne pas commencer par les Réglages de l’appareil. Les informations modèle/OS peuvent être montrées ensuite ou renseignées séparément, sans retarder cette première séquence.

1. **Lancer et se connecter.** Depuis l’écran d’accueil, ouvrir IWASP sans session préalable. Indiquer « IWASP [version/build], [appareil physique], [OS/version] ». Montrer la connexion avec le compte de test autorisé, sans mot de passe visible, jusqu’au tableau de bord. En cas d’« Invalid API key » ou autre échec, arrêter et corriger le blocage : ne pas masquer le résultat ni fabriquer une réussite.
2. **Montrer les fonctions principales.** Ouvrir la carte de démonstration, son profil et son QR code. Si le propriétaire autorise la modification de cette seule donnée de test, changer un champ, enregistrer et rouvrir pour prouver la persistance. Montrer le parcours depuis un menu visible et pas seulement une URL entrée à la main. Ajouter la lecture NFC sur iPhone compatible et une puce de test ; toute écriture nécessite une puce autorisée et un contrôle de lecture après écriture. Ne pas simuler le NFC sur iPad.
3. **Inscription et suppression de compte.** Avec le compte jetable que le propriétaire aura prévu, filmer l’inscription, la confirmation email si requise, la session, puis Réglages → suppression → confirmation « SUPPRIMER » → résultat réel. Ce scénario est une préparation, **pas une autorisation donnée à l’assistant de créer ou supprimer un compte**. Si la suppression ne peut pas être démontrée sans risque, consigner ce blocage : la demande Apple n’est alors pas couverte.
4. **Fonctions payantes, achats et abonnements applicables.** Montrer l’offre, ses conditions et le parcours réellement accessible dans le candidat. Pour une opération complète, utiliser uniquement un environnement de test officiellement pris en charge et confirmé par le responsable. Ne pas effectuer de vrai paiement ni changer un abonnement sans autorisation spécifique et plafond. Si seul le parcours jusqu’à la confirmation peut être montré, le dire ; ne pas le présenter comme une transaction réussie. Ne pas qualifier tous les achats de « cartes physiques » tant que l’inventaire des fonctions numériques n’est pas validé.
5. **Contenu utilisateur et permissions applicables.** Montrer les contenus que l’utilisateur peut publier et, si présents, le signalement et le blocage. S’ils manquent ou ne sont pas accessibles, ne pas les inventer ni les déclarer inutiles sans justification produit. Montrer les vraies demandes système qui surviennent dans les parcours caméra/photos/localisation/NFC/contacts/ATT effectivement présents ; une simple clé Info.plist ne prouve pas qu’un prompt apparaisse. Ne pas annoncer une permission ou un suivi absent du candidat, ni réinitialiser des comptes pour créer artificiellement une démonstration.
6. **Terminer et consigner les preuves.** Après les parcours, relever modèle, OS exact, version/build et date, puis noter les minutages correspondant aux demandes Apple. Vérifier le fichier final et l’accès au lien destiné à Apple. Garder une liste explicite de toute fonction non démontrée ou limite. La vidéo reste locale jusqu’à une autorisation séparée de transmission ; aucun fichier n’est téléversé ici.

Prévoir une validation dédiée sur **iPad physique**, même si la séquence NFC est filmée sur iPhone. Le modèle et l’OS de l’appareil utilisé par Apple sont connus, mais ne sont pas ajoutés à la liste de tests réussis de l’équipe. Le pied de message Apple annonçait des bêtas iOS/iPadOS 27 ; cette annonce historique n’établit pas la dernière version disponible le jour du futur tournage et ne justifie aucune mise à jour automatique.

## Brouillon de réponse Apple — ne pas envoyer en l’état

> Thank you for your feedback. The candidate is version **[VERSION]**, build **[BUILD]**. We have **[DESCRIBE ONLY VERIFIED CHANGES]**. The review account entered in App Review Information was tested on **[PHYSICAL DEVICE, OS, DATE]**, with the following result: **[ACTUAL RESULT]**.
>
> The physical-device screen recording is available at **[ACCESSIBLE VIDEO LINK]**. It shows **[ACTUAL FLOWS AND TIMESTAMPS]**. For the August 26 questions: **[EACH EXACT QUESTION AND VERIFIED ANSWER]**.
>
> Regarding the August 28 feedback, the final icons were checked in **[EXACT BUILD / SCREENS]** and the useful native workflow demonstrated is **[ACTUAL DEVICE-VERIFIED WORKFLOW]**. Remaining limitations are **[HONEST LIMITATIONS]**.

## Vérifications techniques et ordre de reprise

Les résultats locaux sont consignés dans le corps de la PR associée. Les valeurs de test sont entièrement factices ; un build web réussi avec ces valeurs n’est pas un build utilisable pour la revue. La CI Ubuntu de la PR #16 valide la régression, pas la connexion de production ni Xcode.

**Les tâches documentaires accessibles sont terminées ; cela ne signifie pas que seule la vidéo manque.** Les sept demandes sont transcrites, les réponses fondées sur le dépôt sont rédigées, les autres sont explicitement bornées. Le complément actuel ne change que la documentation locale et ne modifie ni les corrections de code de la PR #17 ni son état de fusion.

| Condition avant de pouvoir annoncer le candidat prêt | Pourquoi elle ne peut pas être cochée ici |
|---|---|
| Compte de revue exact fonctionnel et paire de build validée | Nécessite le contrôle autorisé de l’environnement et un essai réel ; aucun accès backend ni compte modifié autorisé dans cette intervention. |
| Build signé identifié et installé | Aucun nouveau build, signature, distribution ou envoi autorisé ; un build web/CI ne remplace pas l’archive candidate. |
| Essais sur iPad et iPhone compatible | Matériel physique absent de cette intervention ; l’essai Apple du build refusé n’est pas un succès de l’équipe. |
| Icônes finales et parcours natif convaincant | Le format PNG est corrigé, pas l’approbation de l’identité ni la démonstration matérielle ; Apple garde l’évaluation de 4.2. Aucune icône finale modifiée ici. |
| Paiements/abonnements, contenus publics, permissions et confidentialité bornés pour le candidat | Le code montre des parcours et des dépendances mais ne prouve pas leur activation réelle, leur fonctionnement ou les réponses App Privacy/ATT. Aucun test payant, destructif ou de modération en production effectué. |
| Marchés et droits/justificatifs validés par le titulaire | Ne peuvent pas être déduits de traductions, devises ou fichiers d’assets ; aucune validation de contrat ou de droits réalisée à sa place. |
| Vidéo avec tous les parcours applicables | À réaliser par l’utilisateur une fois les prérequis réglés ; ni enregistrée ni chargée ici. |

1. Faire relire séparément les PR #15, #16 et cette PR empilée ; aucune fusion automatique. Cette PR a pour base `ci/pr-validation-guardrails` et ne doit pas être fusionnée isolément sans traiter ses dépendances.
2. Le responsable de l’environnement confirme la paire publique URL/clé du projet attendu, la provenance du build refusé si encore disponible et la validité du compte de revue. Cela exige un contrôle autorisé hors de cette intervention ; aucune configuration Supabase n’a été ouverte/modifiée ici.
3. Les questions exactes sont désormais transcrites. Le titulaire confirme les réponses encore ouvertes, les marchés, les droits de tiers, les icônes finales, les champs de revue et le build candidat. Un nouveau build signé et toute distribution exigent une autorisation séparée, un environnement Apple et un plafond pour les services payants.
4. Effectuer les essais physiques, enregistrer la vidéo et remplir les preuves. Aucune soumission tant que la connexion, la vidéo, les réponses et les validations matérielles restent ouvertes.
5. Toute publication, transmission de captures, TestFlight ou soumission App Store reste une action ultérieure à autoriser. Ne lancer aucun des workflows Apple pour simplement lire ce dossier.
