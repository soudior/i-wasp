#!/bin/bash

# ============================================================
# 🛡️ IWASP - Installation des Git Hooks
# ============================================================
# Ce script installe le hook pre-commit pour protéger les
# fichiers clients contre les modifications accidentelles.
# ============================================================

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🛡️  IWASP - Installation Protection Clients                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Vérifier qu'on est dans un repo Git
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Ce dossier n'est pas un repository Git.${NC}"
    echo "   Initialisez Git avec: git init"
    exit 1
fi

# Créer le dossier hooks s'il n'existe pas
mkdir -p .git/hooks

# Copier le script pre-commit
cp scripts/pre-commit-protection.sh .git/hooks/pre-commit

# Rendre exécutable
chmod +x .git/hooks/pre-commit

echo -e "${GREEN}✓ Hook pre-commit installé avec succès!${NC}"
echo ""
echo -e "${BLUE}Protection active pour:${NC}"
echo "  • LuxePrestigeCard.tsx"
echo "  • MaisonBOpticCard.tsx"
echo "  • KechExcluCard.tsx"
echo "  • HerbalismCard.tsx"
echo "  • CharlesLazimiCard.tsx"
echo "  • AriellaCard.tsx"
echo "  • LaMaisonCupcakeCard.tsx"
echo "  • DualBrandShowcase.tsx"
echo ""
echo -e "${YELLOW}Pour modifier un fichier client intentionnellement:${NC}"
echo "  ALLOW_CLIENT_EDIT=1 git commit -m \"message\""
echo ""
