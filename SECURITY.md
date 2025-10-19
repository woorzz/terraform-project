# 🔒 Sécurité du Projet

## Vue d'Ensemble

Ce projet intègre plusieurs couches de sécurité : scan de secrets, analyse de vulnérabilités (SAST), et architecture réseau sécurisée.

---

## 🛡️ Sécurité dans la CI/CD

### 1. Gitleaks - Secret Scanning

**Objectif** : Détecter les secrets/credentials hardcodés dans le code

**Ce qui est détecté** :
- API keys (AWS, GitHub, etc.)
- Tokens d'accès
- Mots de passe
- Clés SSH privées
- Certificats

**Configuration** : `.github/workflows/ci.yml`
```yaml
- name: Gitleaks Secret Scanner
  uses: gitleaks/gitleaks-action@v2
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  continue-on-error: false  # Bloque si secrets détectés
```

**Résultat** : Le workflow échoue si un secret est trouvé → **bloque le push**

### 2. Semgrep - SAST (Static Analysis)

**Objectif** : Détecter les vulnérabilités dans le code

**Ce qui est détecté** :
- Injections SQL
- Cross-Site Scripting (XSS)
- Command Injection
- Path Traversal
- Mauvaises pratiques de sécurité

**Configuration** : `.github/workflows/ci.yml`
```yaml
- name: Semgrep SAST
  uses: returntocorp/semgrep-action@v1
  with:
    config: auto  # Règles automatiques selon le langage
  continue-on-error: true  # Warning mais ne bloque pas
```

**Résultat** : Donne des warnings mais ne bloque pas le déploiement

---

## 🌐 Sécurité Réseau (AWS)

### Architecture Sécurisée

```
Internet (0.0.0.0/0)
    ↓ Port 80 uniquement
[Frontend] ← Public
    ↓ VPC privé (172.31.0.0/16)
[API] ← Privé (VPC only)
    ↓ Port 5432 (VPC only)
[Database] ← Privé (VPC only)
```

### Security Groups Configurés

#### Frontend Security Group
```hcl
# Ingress : Internet → Frontend
- Port 80 (HTTP) depuis 0.0.0.0/0
- Port 22 (SSH) depuis 0.0.0.0/0 (admin uniquement)

# Egress : Frontend → Anywhere
- Tous les ports vers 0.0.0.0/0
```

#### API Security Group
```hcl
# Ingress : VPC uniquement
- Port 3000 depuis 172.31.0.0/16 (VPC privé)
- Port 22 depuis 172.31.0.0/16

# Egress : API → Anywhere
- Tous les ports vers 0.0.0.0/0
```

#### Database Security Group
```hcl
# Ingress : VPC uniquement
- Port 5432 depuis 172.31.0.0/16 (VPC privé)
- Port 22 depuis 172.31.0.0/16

# Egress : Database → Anywhere
- Tous les ports vers 0.0.0.0/0
```

**Principe** : Seul le frontend est accessible depuis Internet. API et DB communiquent uniquement via le réseau privé AWS.

---

## 🔐 Gestion des Secrets

### Secrets GitHub (CI/CD)
```
AWS_ACCESS_KEY_ID          → Credentials AWS
AWS_SECRET_ACCESS_KEY      → Credentials AWS
TF_API_TOKEN               → Token Terraform Cloud
TF_DB_PASSWORD             → Mot de passe PostgreSQL
TF_KEY_PAIR_NAME           → Nom de la key pair SSH
```

**Stockage** : Chiffrés dans GitHub Settings → Secrets

### Variables Terraform Cloud
```
# Variables Terraform
aws_region                 → eu-central-1
image_tag                  → latest
db_password                → (sensitive)
key_pair_name              → marinelangrez-keypair

# Variables d'environnement
AWS_ACCESS_KEY_ID          → (sensitive)
AWS_SECRET_ACCESS_KEY      → (sensitive)
```

**Stockage** : Chiffrées dans Terraform Cloud workspace

---

## ✅ Bonnes Pratiques Implémentées

### Code
- ✅ Pas de secrets hardcodés (vérifié par Gitleaks)
- ✅ Pas de vulnérabilités critiques (vérifié par Semgrep)
- ✅ `.gitignore` pour fichiers sensibles (`.env`, `*.pem`, `terraform.tfstate`)

### Infrastructure
- ✅ VPC privé pour API/Database
- ✅ Security Groups restrictifs (principe du moindre privilège)
- ✅ Pas de root account AWS (IAM user)
- ✅ SSH désactivé en production (peut être activé pour debug)

### CI/CD
- ✅ Secrets chiffrés dans GitHub et Terraform Cloud
- ✅ Scan de sécurité avant chaque déploiement
- ✅ Tests automatiques bloquent si échec
