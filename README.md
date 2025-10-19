# 🚀 Terraform Project - Déploiement Automatique AWS

Application web 3-tier (Frontend + API + Database) déployée automatiquement sur AWS via Terraform et GitHub Actions.

## 📦 Stack Technique

- **Infrastructure** : Terraform + AWS EC2
- **Frontend** : Nginx + Vanilla JavaScript
- **API** : Node.js + Express + PostgreSQL
- **CI/CD** : GitHub Actions (Tests → Build Docker → Deploy AWS)
- **Conteneurisation** : Docker + Docker Compose

## 🏗️ Architecture

```
Internet → Frontend (Nginx) → API (Node.js) → Database (PostgreSQL)
  HTTP      Port 80             Port 3000       Port 5432
  Public    Reverse Proxy       VPC Privé       VPC Privé
```

**Sécurité** : Seul le frontend est accessible publiquement. API et Database communiquent uniquement via le VPC privé AWS.

---

## 🚀 Quick Start


### 1. Déploiement automatique

```bash
git add .
git commit -m "feat: nouvelle feature"
git push origin main
```

**C'est tout !** GitHub Actions s'occupe de :
1. ✅ Tester le code (CI)
2. ✅ Builder les images Docker avec tag SHA (CD)
3. ✅ Déployer sur AWS (Terraform)


### 2. Accéder à l'application

Récupère l'IP dans GitHub Actions → Workflow "Terraform" → Outputs :
```
frontend_public_ip = "3.65.38.248"
```

Ouvre : `http://3.65.38.248` 🎉

---

## 🔄 Comment ça fonctionne ?

### Workflow CI/CD Automatique

```
Push → CI (Tests) → CD (Build Docker) → Terraform (Deploy AWS)
```

#### 1. CI - Tests
- npm ci, lint, test
- Validation du code

#### 2. CD - Build Docker
- Build images API + Frontend
- Tag automatique : `sha-abc1234` (basé sur commit SHA)
- Push vers GitHub Container Registry (GHCR)

#### 3. Terraform - Deploy
- Détecte automatiquement le tag SHA
- `terraform apply -var="image_tag=sha-abc1234"`
- Les instances EC2 pull les nouvelles images
- Redémarrage automatique

**Avantage** : Chaque déploiement est lié à un commit Git précis → Traçabilité complète !


---

## 💻 Développement Local

### Prérequis

- Node.js 20+
- Docker + Docker Compose
- Terraform 1.0+
- AWS CLI configuré

### Lancer l'API en local

```bash
cd api
npm install
npm run dev
```

### Lancer le Frontend en local

```bash
cd frontend
npm install
npm run dev
```

### Tests

```bash
cd api
npm test
npm run lint
```

---

## 🗂️ Structure du Projet

```
terraform-project/
├── .github/workflows/    # CI/CD GitHub Actions
│   ├── ci.yml           # Tests automatiques
│   ├── cd.yml           # Build & Push Docker
│   └── terraform.yml    # Déploiement AWS
├── api/                 # Backend Node.js
│   ├── index.js         # Point d'entrée Express
│   ├── routes.js        # Routes API
│   ├── db.js            # Connexion PostgreSQL
│   └── Dockerfile       # Image Docker API
├── frontend/            # Frontend Nginx
│   ├── public/          # Fichiers statiques
│   ├── src/             # JavaScript + CSS
│   └── Dockerfile       # Image Docker Frontend
├── terraform/           # Infrastructure as Code
│   ├── main.tf          # Configuration principale
│   ├── instances.tf     # Définition des instances EC2
│   ├── security.tf      # Security Groups
│   ├── variables.tf     # Variables configurables
│   └── outputs.tf       # Outputs (IPs, etc.)
├── README.md            # Ce fichier
```

---

## 🔒 Sécurité

### Architecture en couches

- ✅ **Frontend** : Accessible depuis Internet (port 80)
- 🔒 **API** : Accessible uniquement depuis le VPC (172.31.0.0/16)
- 🔒 **Database** : Accessible uniquement depuis le VPC (172.31.0.0/16)

### Bonnes pratiques

- ✅ Secrets chiffrés dans GitHub
- ✅ Credentials AWS via IAM (pas de root)
- ✅ Fichiers sensibles exclus (.gitignore)
- ✅ Communication interne via IP privées

---

## 🛠️ Commandes Utiles

### Déployer manuellement

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### Déployer une version spécifique (Rollback)

```bash
terraform apply -var="image_tag=sha-abc1234"
```

### SSH dans les instances

```bash
ssh -i ~/.ssh/marinelangrez-forum-keypair.pem ubuntu@<instance_ip>
```

### Voir les logs

```bash
ssh ubuntu@<instance_ip>
cd /opt/frontend  # ou /opt/api ou /opt/db
sudo docker compose logs -f
```

### Détruire l'infrastructure

```bash
cd terraform
terraform destroy
```

## 🎯 Fonctionnalités Clés

- ✅ **Déploiement 100% automatique** via GitHub Actions
- ✅ **Versioning des images Docker** avec SHA du commit
- ✅ **Infrastructure as Code** avec Terraform
- ✅ **Rollback facile** en redéployant un ancien tag
- ✅ **Sécurité par défaut** (VPC privé pour API/DB)
- ✅ **Tests automatiques** avant chaque déploiement
- ✅ **Traçabilité complète** Git → Docker → AWS

## 👤 Auteur

**Marine Langrez**
- GitHub: [@woorzz](https://github.com/woorzz)
- Projet: [terraform-project](https://github.com/woorzz/terraform-project)
