# UPL Réclamations — Plateforme Web de Gestion des Réclamations Étudiantes

> **Projet de Fin d'Études (PFE) en Informatique**  
> **Institution :** Université Protestante de Lubumbashi (UPL)  
> **Localisation :** Lubumbashi, Haut-Katanga, République Démocratique du Congo  

---

## 1. Présentation du Projet

**« Conception et développement d’une application web de gestion des réclamations des étudiants : cas de l’Université Protestante de Lubumbashi (UPL) »**

La plateforme **UPL Réclamations** offre un système centralisé, sécurisé et traçable permettant :
- Aux **étudiants** de soumettre leurs réclamations académiques et administratives en ligne (notes, omissions, frais, cartes, documents), de joindre des pièces justificatives et de suivre en direct l'état d'avancement avec un numéro de référence unique (ex: `UPL-REC-2026-000001`).
- Aux **responsables de service / décanats** d'instruire les dossiers assignés, de changer les statuts de manière motivée, de dialoguer avec les étudiants et d'enregistrer des notes internes confidentielles.
- À l'**administration centrale et aux autorités décanales** de superviser l'ensemble des flux, de piloter les indicateurs de performance (SLA, taux de résolution) via des tableaux de bord analytiques dynamiques et d'administrer les référentiels institutionnels.

---

## 2. Stack Technique

### Frontend
- **Framework :** Next.js 15 (App Router, Server Components & Client Components)
- **Langage :** TypeScript (100% typage statique strict)
- **Design & Styles :** Tailwind CSS + Tokens institutionnels UPL
- **Composants UI :** Architecture type shadcn/ui + Radix UI + Lucide React
- **Graphiques & KPI :** Recharts (Visualisation réactive)
- **Validation :** Zod + React Hook Form

### Backend & Données
- **Architecture :** Next.js Server Actions (`"use server"`) + Route Handlers
- **ORM :** Prisma ORM v5
- **Base de Données :** PostgreSQL (support natif & SQLite local prêt à l'emploi)
- **Authentification :** Gestion de session sécurisée par cookies HttpOnly & Jetons chiffrés, hachage bcryptjs
- **Sécurité RBAC :** Contrôle d'accès strict côté serveur (Student, Staff, Admin)

---

## 3. Prérequis et Installation

### Prérequis
- Node.js (version 18.18+ ou 20+)
- npm ou yarn

### Étape 1 : Cloner et installer les dépendances
```bash
npm install
```

### Étape 2 : Configurer les variables d'environnement
Un fichier `.env` est configuré par défaut pour le développement local immédiat :
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="upl_reclamations_super_secret_jwt_key_2026_katanga_rdc"
NEXT_PUBLIC_APP_NAME="UPL Réclamations"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Pour basculer sur un serveur **PostgreSQL** en production :
1. Définir `DATABASE_URL="postgresql://user:password@localhost:5432/upl_reclamations?schema=public"` dans `.env`
2. Dans `prisma/schema.prisma`, remplacer `provider = "sqlite"` par `provider = "postgresql"`.

### Étape 3 : Initialiser la base de données et les données de test
```bash
# Synchroniser le schéma Prisma
npx prisma db push

# Peupler la base avec les données réelles UPL (Facultés, Services, Étudiants, Réclamations)
npm run db:seed
```

### Étape 4 : Lancer le serveur de développement
```bash
npm run dev
```
L'application est accessible sur : `http://localhost:3000`

---

## 4. Comptes Administrateurs & Décanat (Jury PFE)

Les comptes suivants sont préconfigurés pour la démonstration :

| Rôle | Email / Identifiant | Mot de passe | Description |
|---|---|---|---|
| **Administrateur Central** | `admin@upl-rdc.net` | `admin123` | Supervision globale UPL, analytics et gestion des utilisateurs |
| **Décanat FSI (Staff)** | `decanat.fsi@upl-rdc.net` | `staff123` | Instruction des réclamations de la Faculté des Sciences Informatiques |
| **Secrétariat Académique** | `sg.acad@upl-rdc.net` | `staff123` | Traitement des recours académiques et attestations |
| **Étudiant (Principal)** | `2024022105` ou `edmond.nkuna@etudiant.upl-rdc.net` | `etudiant123` | **Edmond NKUNA Isaac** (L3 Génie Logiciel & Systèmes d'Information) |

---

## 5. Architecture des Dossiers

```text
src/
  app/                     # Next.js App Router
    (auth)/                # Pages de connexion et inscription
    student/               # Espace étudiant (dashboard, réclamations, notifications)
    staff/                 # Espace responsable de service (file, instruction, notes)
    admin/                 # Espace administration (tour de contrôle, référentiels, analytics)
    profile/               # Espace profil et changement de mot de passe
    api/                   # Route handlers (Upload sécurisé de pièces jointes)
  components/              # Composants UI
    ui/                    # Primitives UI (Button, Card, Input, Textarea, Badge)
    layout/                # Navbar, Sidebar, Footer, NotificationBell
    complaints/            # TimelineHistory, ResponseThread, StatusUpdateDialog, NewComplaintForm
    dashboard/             # MetricCard, AnalyticsCharts
  config/                  # Configuration centralisée institutionnelle UPL (institution.ts, site.ts)
  lib/                     # Authentification, Client Prisma singleton, upload, utils
  schemas/                 # Schémas de validation déclarative Zod
  services/                # Couche de logique métier serveur (Clean Service Layer)
  actions/                 # Server Actions Next.js ('use server')
  types/                   # Déclarations TypeScript
prisma/
  schema.prisma            # Schéma relationnel Prisma
  seed.ts                  # Peuplement initial réaliste
```

---

## 6. Cycle de Vie d'une Réclamation

```mermaid
stateDiagram-v2
    [*] --> NOUVELLE: Dépôt par l'étudiant
    NOUVELLE --> EN_COURS: Prise en charge par le service
    NOUVELLE --> REJETEE: Motif irrecevable (hors délais, etc.)
    EN_COURS --> EN_ATTENTE_INFO: Demande de compléments à l'étudiant
    EN_ATTENTE_INFO --> EN_COURS: Réponse avec justificatifs
    EN_COURS --> TRANSMISE: Transfert vers autre service
    TRANSMISE --> EN_COURS: Instruction
    EN_COURS --> TRAITEE: Résolution et réponse officielle
    TRAITEE --> CLOTUREE: Confirmation et archivage
    REJETEE --> CLOTUREE: Archivage
    CLOTUREE --> [*]
```

---

## 7. Documentation Académique

La documentation complète du travail de fin d'études structurée selon les normes universitaires est disponible dans :
- [PFE_DOCUMENTATION.md](file:///d:/MES%20PROJET/gestion%20des%20r%C3%A9clamations%20des%20%C3%A9tudiants%20Cas%20UPL/docs/PFE_DOCUMENTATION.md)
- [UML_DIAGRAMS.md](file:///d:/MES%20PROJET/gestion%20des%20r%C3%A9clamations%20des%20%C3%A9tudiants%20Cas%20UPL/docs/UML_DIAGRAMS.md)
