#!/bin/bash

# ============================================================
# 🛡️ IWASP CLIENT CARD PROTECTION - Pre-commit Hook
# ============================================================
# Ce script bloque les commits qui modifient des fichiers clients protégés
# Pour forcer un commit (modification autorisée), utilisez:
#   git commit --no-verify -m "votre message"
# ou
#   ALLOW_CLIENT_EDIT=1 git commit -m "votre message"
# ============================================================

# Couleurs pour les messages
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Liste des fichiers clients protégés
PROTECTED_FILES=(
    "src/pages/LuxePrestigeCard.tsx"
    "src/pages/MaisonBOpticCard.tsx"
    "src/pages/KechExcluCard.tsx"
    "src/pages/HerbalismCard.tsx"
    "src/pages/CharlesLazimiCard.tsx"
    "src/pages/AriellaCard.tsx"
    "src/pages/LaMaisonCupcakeCard.tsx"
    "src/pages/DualBrandShowcase.tsx"
    "src/pages/KhokhaSignatureCard.tsx"
)

# Templates protégés
PROTECTED_TEMPLATES=(
    "src/components/templates/HerbalismEliteTemplate.tsx"
    "src/components/templates/DarkLuxuryBusinessTemplate.tsx"
    "src/components/templates/AutoschluesselTemplate.tsx"
    "src/components/templates/VCardAirbnbBookingTemplate.tsx"
)

# Vérifier si le bypass est activé
if [ "$ALLOW_CLIENT_EDIT" = "1" ]; then
    echo -e "${YELLOW}⚠️  ALLOW_CLIENT_EDIT activé - Bypass de la protection${NC}"
    exit 0
fi

# Récupérer les fichiers modifiés dans le commit
STAGED_FILES=$(git diff --cached --name-only)

# Variables pour stocker les violations
VIOLATIONS=()
TEMPLATE_VIOLATIONS=()

# Vérifier chaque fichier stagé
for file in $STAGED_FILES; do
    # Vérifier les fichiers clients
    for protected in "${PROTECTED_FILES[@]}"; do
        if [ "$file" = "$protected" ]; then
            VIOLATIONS+=("$file")
        fi
    done
    
    # Vérifier les templates
    for template in "${PROTECTED_TEMPLATES[@]}"; do
        if [ "$file" = "$template" ]; then
            TEMPLATE_VIOLATIONS+=("$file")
        fi
    done
done

# Si des violations sont détectées
if [ ${#VIOLATIONS[@]} -gt 0 ] || [ ${#TEMPLATE_VIOLATIONS[@]} -gt 0 ]; then
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  🛡️  PROTECTION CARTES CLIENTS - COMMIT BLOQUÉ                 ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    if [ ${#VIOLATIONS[@]} -gt 0 ]; then
        echo -e "${YELLOW}📁 Fichiers clients protégés modifiés:${NC}"
        for file in "${VIOLATIONS[@]}"; do
            echo -e "   ${RED}✗${NC} $file"
        done
        echo ""
    fi
    
    if [ ${#TEMPLATE_VIOLATIONS[@]} -gt 0 ]; then
        echo -e "${YELLOW}🎨 Templates protégés modifiés:${NC}"
        for file in "${TEMPLATE_VIOLATIONS[@]}"; do
            echo -e "   ${RED}✗${NC} $file"
        done
        echo ""
    fi
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Ces fichiers contiennent des données clients spécifiques.${NC}"
    echo -e "${YELLOW}   Ils ne doivent pas être modifiés lors de mises à jour générales.${NC}"
    echo ""
    echo -e "${GREEN}✓ Si cette modification est INTENTIONNELLE et AUTORISÉE:${NC}"
    echo ""
    echo -e "   Option 1: ${BLUE}ALLOW_CLIENT_EDIT=1 git commit -m \"message\"${NC}"
    echo -e "   Option 2: ${BLUE}git commit --no-verify -m \"message\"${NC}"
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    exit 1
fi

# Tout est OK
echo -e "${GREEN}✓ Vérification protection clients: OK${NC}"
exit 0
