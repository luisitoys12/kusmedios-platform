#!/bin/bash
set -e

# KusMedios Platform — Deploy completo a Fly.io
# Región: mia (Miami) | GitHub: luisitoys12

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${GREEN}🎙  KusMedios Streaming Platform — Fly.io Deploy${NC}"
echo "================================================"
echo ""

# Verificar flyctl
if ! command -v fly &> /dev/null; then
  echo -e "${RED}✗ flyctl no encontrado. Instalar con:${NC}"
  echo "  curl -L https://fly.io/install.sh | sh"
  exit 1
fi

# Verificar autenticación
if ! fly auth whoami &> /dev/null; then
  echo -e "${RED}✗ No autenticado. Ejecuta: fly auth login${NC}"
  exit 1
fi

echo -e "${GREEN}✓ flyctl OK — $(fly version)${NC}"
echo ""

# Deploy API
echo -e "${YELLOW}▶ [1/2] Desplegando API (kusmedios-api)...${NC}"
cd apps/api
fly deploy --app kusmedios-api
echo -e "${GREEN}✓ API → https://kusmedios-api.fly.dev${NC}"
echo ""

# Deploy Frontend
echo -e "${YELLOW}▶ [2/2] Desplegando Frontend (kusmedios-web)...${NC}"
cd ../web
fly deploy --app kusmedios-web
echo -e "${GREEN}✓ Frontend → https://kusmedios-web.fly.dev${NC}"
echo ""

# Estado final
echo "Estado de apps:"
echo "---"
fly status --app kusmedios-api
echo "---"
fly status --app kusmedios-web
echo ""
echo -e "${GREEN}✅ Deploy completo. EstacionKusMedios activa en Fly.io 🚀${NC}"
echo ""
