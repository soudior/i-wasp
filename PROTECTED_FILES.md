# 🛡️ Fichiers Clients Protégés - IWASP

> ⚠️ **ATTENTION**: Les fichiers listés ci-dessous contiennent des données spécifiques à des clients.
> Ils ne doivent **JAMAIS** être modifiés lors de mises à jour générales du site.

---

## 📋 Liste des Cartes Clients Protégées

| Client | Fichier | Slug | Notes |
|--------|---------|------|-------|
| **Luxe Prestige** | `src/pages/LuxePrestigeCard.tsx` | `luxe-prestige` | Conciergerie de luxe Marrakech |
| **Maison B Optic** | `src/pages/MaisonBOpticCard.tsx` | `maison-b-optic` | Opticien Paris-Marrakech (BADI) |
| **Kech Exclu** | `src/pages/KechExcluCard.tsx` | `kech-exclu` | Immobilier exclusif Marrakech |
| **Herbalism** | `src/pages/HerbalismCard.tsx` | `herbalism-marrakech` | Boutique naturelle Médina |
| **Charles Lazimi** | `src/pages/CharlesLazimiCard.tsx` | `charles-lazimi` | Data Architect Kompass |
| **Ariella KC** | `src/pages/AriellaCard.tsx` | `ariella-khiat-cohen` | Avocat Cabinet AKC |
| **La Maison Cupcake** | `src/pages/LaMaisonCupcakeCard.tsx` | `la-maison-cupcake` | Pâtisserie artisanale |
| **Medina Travertin** | `src/pages/DualBrandShowcase.tsx` | `medina-travertin` | Dual-brand showcase |
| **Khokha Signature** | `src/pages/KhokhaSignatureCard.tsx` | `khokha-signature` | Fashion Luxury Marrakech |

---

## 🎨 Templates Protégés

Ces templates sont utilisés par des clients spécifiques:

- `src/components/templates/HerbalismEliteTemplate.tsx`
- `src/components/templates/DarkLuxuryBusinessTemplate.tsx`
- `src/components/templates/AutoschluesselTemplate.tsx`
- `src/components/templates/VCardAirbnbBookingTemplate.tsx`

---

## 🔒 Règles de Protection

### ❌ Ce qu'il ne faut PAS faire

1. Modifier les données de contact (nom, email, téléphone, etc.)
2. Changer le design spécifique au client
3. Remplacer les données client par des données génériques
4. Supprimer ou renommer ces fichiers

### ✅ Ce qui est autorisé

1. Corriger un bug technique (avec validation du client)
2. Mettre à jour à la demande explicite du client
3. Améliorer les performances sans changer le visuel

---

## 🛠️ Protection Automatique

### Installation du hook Git

```bash
chmod +x scripts/install-hooks.sh
./scripts/install-hooks.sh
```

### Bypass pour modification autorisée

Si vous devez modifier un fichier client de manière **intentionnelle et autorisée**:

```bash
# Option 1: Variable d'environnement
ALLOW_CLIENT_EDIT=1 git commit -m "Fix: correction bug client X"

# Option 2: Flag no-verify
git commit --no-verify -m "Fix: correction bug client X"
```

---

## 📝 Registre TypeScript

Le registre complet est disponible dans:
```
src/lib/clientCardProtection.ts
```

Utilisez les fonctions exportées pour vérifier programmatiquement:

```typescript
import { isProtectedFile, getProtectedCardBySlug } from '@/lib/clientCardProtection';

if (isProtectedFile('pages/LuxePrestigeCard.tsx')) {
  console.warn('⚠️ Fichier client protégé!');
}
```

---

## 📞 Contact

En cas de doute, contactez l'équipe IWASP avant toute modification.

---

*Dernière mise à jour: Janvier 2025*
