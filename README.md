# 🚀 Terraform Project - Infrastructure AWS Automatisée

> Application web 3-tier déployée automatiquement sur AWS avec Terraform et CI/CD complète.

## 📋 En Bref

Projet d'infrastructure as code qui déploie une application web (Frontend Nginx + API Node.js + Database PostgreSQL) sur AWS EC2. Le déploiement est **100% automatique** via GitHub Actions : chaque push déclenche les tests, build les images Docker, et déploie sur AWS.

## �️ Stack Technique

- **Infrastructure** : Terraform + AWS EC2 + Terraform Cloud
- **Frontend** : Nginx + JavaScript
- **Backend** : Node.js + Express + PostgreSQL
- **CI/CD** : GitHub Actions (3 workflows automatiques)
- **Containers** : Docker + Docker Compose
- **Registry** : GitHub Container Registry (GHCR)

## 🏗️ Architecture

```
Internet → [Frontend Nginx] → [API Node.js] → [Database PostgreSQL]
            Port 80 Public      Port 3000        Port 5432
                                VPC Privé        VPC Privé
```

**Sécurité** : Seul le frontend est accessible publiquement. L'API et la base de données communiquent via le VPC AWS privé.

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
Tests (npm test)
    ↓
Build Docker Images (tag SHA)
    ↓
Push vers GHCR
    ↓
Terraform Cloud (Plan + Apply auto)
    ↓
AWS EC2 Déployé ✅
```

### Caractéristiques

- ✅ **Versioning automatique** : Images Docker taguées avec SHA du commit
- ✅ **State centralisé** : Terraform Cloud (pas de state local)
- ✅ **Auto-apply** : Deploy automatique sans clic manuel
- ✅ **Traçabilité** : Chaque déploiement lié à un commit Git précis
- ✅ **Rollback facile** : Redéployer un ancien SHA si besoin

---

## 🗂️ Structure

```
.github/workflows/       # CI/CD Pipelines
  ├── ci.yml            # Tests automatiques
  ├── cd.yml            # Build & Push Docker
  └── terraform.yml     # Déploiement AWS

api/                    # Backend Node.js + PostgreSQL
frontend/               # Frontend Nginx + JavaScript
terraform/              # Infrastructure as Code
  ├── main.tf           # Config Terraform Cloud
  ├── instances.tf      # EC2 Instances
  ├── security.tf       # Security Groups
  └── providers.tf      # Backend Terraform Cloud
```

---

## 🎯 Ce Que J'ai Appris

- ✅ **Terraform** : Infrastructure as Code, modules, variables, outputs
- ✅ **Terraform Cloud** : Remote state, auto-apply, workspace management
- ✅ **CI/CD** : GitHub Actions, workflows multiples, déclencheurs automatiques
- ✅ **Docker** : Multi-stage builds, registries, versioning
- ✅ **AWS** : EC2, Security Groups, VPC, networking
- ✅ **DevOps** : Automatisation complète du déploiement

---

## 👤 Auteur

**Marine Langrez**  
GitHub: [@woorzz](https://github.com/woorzz)
