# 🚀 Terraform Project - Infrastructure AWS Automatisée

> Application web 3-tier déployée automatiquement sur AWS avec Terraform Cloud, CI/CD complète, et sécurité intégrée.

## 📋 Vue d'Ensemble

Projet d'infrastructure as code qui déploie une application web complète (Frontend + API + Database) sur AWS EC2. Le déploiement est **100% automatique** via GitHub Actions : chaque push déclenche les tests de sécurité, les tests unitaires, le build des images Docker, et le déploiement sur AWS via Terraform Cloud.

## 🛠️ Stack Technique Complète

### Infrastructure
- **IaC** : Terraform 1.9.0 + Terraform Cloud (remote state)
- **Cloud** : AWS EC2 (3 instances) + VPC + Security Groups
- **OS** : Ubuntu 22.04 LTS

### Application
- **Frontend** : Nginx 1.27-alpine + Vanilla JavaScript + CSS
- **API** : Node.js 20 + Express + PostgreSQL Driver
- **Database** : PostgreSQL 16-alpine

### CI/CD & Qualité
- **CI/CD** : GitHub Actions (4 workflows)
- **Qualité** : ESLint + Prettier
- **Tests** : Jest (tests unitaires)
- **Sécurité** : Gitleaks (secret scanning) + Semgrep (SAST)
- **Containers** : Docker + Docker Compose multi-stage builds
- **Registry** : GitHub Container Registry (GHCR)

## 🏗️ Architecture 3-Tier

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP (Port 80)
                         ▼
              ┌──────────────────────┐
              │  Frontend (Nginx)     │  ← Public (0.0.0.0/0)
              │  - Reverse Proxy      │
              │  - Static Files       │
              │  - Dashboard UI       │
              └──────────┬───────────┘
                         │ VPC Privé (172.31.0.0/16)
                         ▼
              ┌──────────────────────┐
              │   API (Node.js)       │  ← Privé (VPC only)
              │   - Express           │
              │   - REST endpoints    │
              │   - /health, /v1/*    │
              └──────────┬───────────┘
                         │ Port 5432 (VPC)
                         ▼
              ┌──────────────────────┐
              │  Database (PostgreSQL)│  ← Privé (VPC only)
              │  - PostgreSQL 16      │
              │  - Init scripts       │
              │  - Persistent volume  │
              └──────────────────────┘
```

**Sécurité** : 
- ✅ Seul le frontend est accessible publiquement (Security Group 0.0.0.0/0:80)
- 🔒 API accessible uniquement depuis le VPC (172.31.0.0/16:3000)
- 🔒 Database accessible uniquement depuis le VPC (172.31.0.0/16:5432)

---

## ⚡ Déploiement Automatique

```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main
```

**C'est tout !** Le pipeline CI/CD s'occupe de tout :

1. **CI** : Tests + Linting
2. **CD** : Build images Docker (tag: `sha-abc1234`)
3. **Terraform** : Déploiement automatique sur AWS

---

## 🔄 Pipeline CI/CD

### Workflow Complet

```
Push sur main
    ↓
1. Security (Gitleaks + Semgrep)
    ↓
2. Tests (ESLint + Prettier + Jest)
    ↓
3. Build Docker (tag sha-XXXXXXX)
    ↓
4. Push GHCR
    ↓
5. Terraform Cloud (Plan + Apply auto)
    ↓
✅ Déployé sur AWS
```

### Fonctionnalités Clés

- ✅ **Auto-apply** : Déploiement automatique sans confirmation manuelle
- ✅ **State centralisé** : Terraform Cloud (pas de corruption de state local)
- ✅ **Versioning Docker** : Chaque déploiement lié à un commit Git (tag SHA)
- ✅ **Rollback facile** : Redéployer un ancien tag en cas de problème
- ✅ **Sécurité intégrée** : Gitleaks (secrets) + Semgrep (vulnérabilités)
- ✅ **Tests automatiques** : ESLint + Prettier + Jest bloquent si échec

---

## 📚 Documentation

- **[SECURITY.md](./SECURITY.md)** : Sécurité (Gitleaks, Semgrep, Network)
- **[WORKFLOWS.md](./WORKFLOWS.md)** : Détails des workflows CI/CD

---

## 👤 Auteur

**Marine Langrez**  
GitHub: [@woorzz](https://github.com/woorzz)
