# 🔄 Workflows CI/CD - Documentation Technique

## Vue d'Ensemble

3 workflows GitHub Actions automatisent le cycle complet : Tests → Build → Deploy.

---

## 1️⃣ Workflow CI (`ci.yml`)

**Déclenchement** : Push ou Pull Request sur `main`

### Jobs

#### Job 1 : `security-checks`
**Objectif** : Vérifier la sécurité du code

```yaml
steps:
  - Checkout du code (historique complet)
  - Gitleaks : Scan secrets/credentials
  - Semgrep : SAST (vulnérabilités)
```

**Résultat** :
- ❌ **Bloque** si Gitleaks trouve un secret
- ⚠️ **Warning** si Semgrep trouve une vulnérabilité (ne bloque pas)

#### Job 2 : `lint-and-test`
**Objectif** : Vérifier la qualité du code

**Strategy Matrix** : Tests parallèles pour `api` et `frontend`

```yaml
steps:
  - Checkout du code
  - Setup Node.js 20
  - npm ci (installation)
  - npm run lint (ESLint)
  - npm run test (Jest)
```

**Résultat** :
- ❌ **Bloque** si ESLint trouve des erreurs
- ❌ **Bloque** si tests Jest échouent

#### Job 3 : `docker-build`
**Objectif** : Tester le build Docker (sans push)

**Dépend de** : `security-checks` + `lint-and-test`

```yaml
steps:
  - Checkout du code
  - Setup Docker Buildx
  - Build image API (test uniquement)
  - Build image Frontend (test uniquement)
```

**Cache** : GitHub Actions cache pour builds rapides

---

## 2️⃣ Workflow CD (`cd.yml`)

**Déclenchement** : Push sur `main` uniquement

### Jobs

#### Job : `build-and-push`
**Objectif** : Builder et pusher les images Docker

```yaml
steps:
  - Checkout du code
  - Setup QEMU (multi-arch)
  - Setup Docker Buildx
  - Login GHCR (GitHub Container Registry)
  - Metadata API (génération tags)
  - Build + Push API
  - Metadata Frontend (génération tags)
  - Build + Push Frontend
```

### Tagging Strategy

**Metadata Action** génère automatiquement :
- `sha-abc1234` : Tag basé sur commit SHA (7 chars)
- `latest` : Tag latest

**Exemple** :
```
Commit : abc1234567890...
Tag    : sha-abc1234
Image  : ghcr.io/woorzz/terraform-project/api:sha-abc1234
```

---

## 3️⃣ Workflow Terraform (`terraform.yml`)

**Déclenchement** : 
- Automatique après succès du workflow CD
- Manuel via `workflow_dispatch`

### Jobs

#### Job : `terraform`
**Objectif** : Déployer l'infrastructure sur AWS

```yaml
steps:
  1. Checkout du code
  2. Détection du tag Docker (git rev-parse --short=7 HEAD)
  3. Configure AWS credentials
  4. Setup Terraform 1.9.0 + TF_API_TOKEN
  5. terraform init
  6. terraform validate
  7. terraform plan -var="image_tag=sha-XXX"
  8. terraform apply -auto-approve
  9. terraform output (IPs publiques)
```

### Variables Passées

```hcl
-var="image_tag=sha-abc1234"      # Tag Docker détecté
-var="aws_region=eu-central-1"    # Région AWS
-var="db_password=${{ secrets.TF_DB_PASSWORD }}"
-var="key_pair_name=${{ secrets.TF_KEY_PAIR_NAME }}"
```

### Terraform Cloud

- **Backend** : Remote state dans Terraform Cloud
- **Auto-apply** : Activé (pas de confirmation manuelle)
- **Workspace** : `terraform-project-aws`

### Déploiement EC2

Les instances EC2 :
1. Reçoivent le nouveau `image_tag` via user_data
2. Pull les nouvelles images Docker depuis GHCR
3. Redémarrent les conteneurs via `docker compose up -d`

---

## 🔄 Flux Complet

### Push sur main

```
1. CI démarre
   ├─ security-checks (Gitleaks + Semgrep)
   ├─ lint-and-test (ESLint + Jest)
   └─ docker-build (test build)
   
2. Si CI ✅ → CD démarre
   ├─ Build API (sha-abc1234)
   ├─ Build Frontend (sha-abc1234)
   └─ Push vers GHCR
   
3. Si CD ✅ → Terraform démarre (auto)
   ├─ Détecte tag sha-abc1234
   ├─ terraform plan
   ├─ terraform apply (auto)
   └─ EC2 pull nouvelles images
   
4. Application déployée ✅
```

---

## 🎯 Points Clés

### Sécurité
- ✅ Secrets chiffrés (GitHub + Terraform Cloud)
- ✅ Scan avant chaque déploiement
- ✅ Pas de credentials dans le code

### Automatisation
- ✅ Zero-touch deployment
- ✅ Auto-trigger entre workflows
- ✅ Auto-apply Terraform Cloud

### Traçabilité
- ✅ Chaque déploiement lié à un commit
- ✅ Tag SHA pour versioning
- ✅ Logs complets dans GitHub Actions

### Rollback
- ✅ Redéployer un ancien tag facilement
- ✅ Historique complet des runs
- ✅ State sauvegardé dans Terraform Cloud
