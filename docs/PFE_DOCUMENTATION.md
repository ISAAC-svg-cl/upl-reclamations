# DOCUMENTATION DU PROJET DE FIN D'ÉTUDES (PFE)
## CONCEPTION ET DÉVELOPPEMENT D’UNE APPLICATION WEB DE GESTION DES RÉCLAMATIONS DES ÉTUDIANTS : CAS DE L’UNIVERSITÉ PROTESTANTE DE LUBUMBASHI (UPL)

---

## RÉSUMÉ EXÉCUTIF

Ce travail de fin d'études porte sur la conception et le déploiement d'une solution numérique fullstack destinée à optimiser, sécuriser et tracer le traitement des réclamations estudiantines au sein de l'**Université Protestante de Lubumbashi (UPL)**. Face aux limites inhérentes aux procédures traditionnelles manuelles (pertes de requêtes, lenteur d'instruction, opacité et absence de statistiques décisionnelles), la plateforme **UPL Réclamations** implémente un système modulaire basé sur Next.js, TypeScript, Tailwind CSS, Prisma ORM et PostgreSQL/SQLite.

---

## INTRODUCTION GÉNÉRALE

### 1. Contexte de l'Étude
L’Université Protestante de Lubumbashi (UPL), sise au 2179 Avenue 30 Juin Coin Kimbangu dans la ville de Lubumbashi (Haut-Katanga, RDC), dispense des formations d'excellence dans plusieurs filières universitaires. La croissance continue des effectifs étudiants génère des flux quotidiens de requêtes académiques (contestations de notes, réclamations d'omissions, bordereaux de frais académiques, cartes d'étudiant et attestations).

### 2. Problématique
Le mode de gestion physique ou informel des réclamations présente plusieurs vulnérabilités majeures :
- **Perte ou altération physique** des fiches de contestation ;
- **Absence de traçabilité** : l'étudiant ne sait pas quel service ou quel agent instruit son dossier ;
- **Non-respect des délais de recours** : absence d'indicateur sur le temps moyen d'attente (SLA) ;
- **Manque de visibilité globale** pour le Décanat et le Secrétariat Général Académique sur les causes racines des litiges.

### 3. Hypothèse de Recherche
L'implémentation d'une plateforme web centralisée, intégrant un contrôle d'accès basé sur les rôles (RBAC), un workflow d'instruction chronologique immuable (Audit Trail) et des tableaux de bord décisionnels, permet de réduire significativement les délais de résolution, d'éliminer les déperditions de dossiers et d'accroître la confiance des étudiants envers l'institution.

### 4. Objectifs de Recherche
- **Objectif général :** Concevoir et développer une application web fullstack moderne dénommée « UPL Réclamations ».
- **Objectifs spécifiques :**
  1. Modéliser formellement le système avec le formalisme UML ;
  2. Fournir aux étudiants un portail ergonomique de dépôt de réclamations avec génération automatique d'une référence unique (`UPL-REC-YYYY-XXXXXX`) ;
  3. Fournir aux responsables de services un espace d'instruction avec fil de discussion interactif et gestion des statuts ;
  4. Mettre à disposition de l'administration des tableaux de bord analytiques générés en temps réel par le SGBD.

---

## CHAPITRE I : PRÉSENTATION DE L'UPL ET GÉNÉRALITÉS

### 1.1 Présentation de l'Université Protestante de Lubumbashi
L'UPL est un établissement d'enseignement supérieur d'inspiration chrétienne protestante établi à Lubumbashi. Elle organise des formations de cycles de Licence et Master dans divers domaines :
- Faculté des Sciences Informatiques (FSI) ;
- Faculté des Sciences Économiques et de Gestion (FSEG) ;
- Faculté de Droit, etc.

### 1.2 Organisation des Services Concernés par les Réclamations
- **Secrétariat Général Académique (SG Acad)** : Supervision des inscriptions, homologations et recours généraux ;
- **Décanats de Facultés** : Organisation des jurys d'examens, vérification des feuilles d'émargement et des notes d'évaluation continue ;
- **Direction des Finances & Comptabilité** : Validation des paiements bancaires et apurement des frais académiques ;
- **Apparitorat Central** : Délivrance des cartes d'étudiant biométriques, des relevés de notes et attestations.

---

## CHAPITRE II : ANALYSE ET SPÉCIFICATION DES BESOINS

### 2.1 Besoins Fonctionnels
1. **Module d'Authentification & Gestion des Profils** : Connexion par matricule ou email, chiffrement des mots de passe, attribution de rôle (Étudiant, Responsable de service, Administrateur).
2. **Module de Dépôt de Réclamation** : Formulaire à étapes, catégorisation (Notes, Frais, Cartes, etc.), degré de priorité, upload de pièces justificatives (PDF/JPG/PNG max 5 Mo).
3. **Module de Suivi & Dialogue** : Visualisation en direct de l'état d'avancement, timeline chronologique, fil d'échange avec l'administration.
4. **Module d'Instruction (Staff)** : File d'attente assignée, modification du statut avec motif obligatoire, formulation de notes internes confidentielles.
5. **Module d'Administration & Reporting** : CRUD des facultés/départements/services, activation/désactivation de comptes, graphiques analytiques (répartition par faculté, statut et taux de résolution).

### 2.2 Besoins Non Fonctionnels
- **Sécurité** : Contrôle RBAC côté serveur sur chaque Server Action, isolation logique des requêtes par étudiant, assainissement Zod, tokens de session sécurisés.
- **Performance** : Temps de chargement < 500ms, Server-Side Rendering avec Next.js App Router.
- **Disponibilité** : Interface responsive adaptée aux écrans de 320px (smartphones) jusqu'aux grands moniteurs de bureau.
- **Ergonomie** : Respect de l'identité visuelle de l'UPL (palette Bleu institutionnel et Ocre/Or, typographies statutaires, feedback visuel immédiat).

---

## CHAPITRE III : CONCEPTION DU SYSTÈME (UML & MODÈLE RELATIONNEL)

### 3.1 Démarche Méthodologique
Le système a été modélisé selon l'approche orientée objet avec le langage **UML (Unified Modeling Language)** :
- **Diagramme de Cas d'Utilisation** : Formalisation des interactions entre acteurs et fonctionnalités ;
- **Diagramme de Classes** : Structure statique du domaine ;
- **Diagrammes de Séquence** : Scénarios dynamiques (dépôt, instruction, clôture) ;
- **Diagramme d'Activité** : Workflow complet du cycle de vie.

*(Voir le document technique `docs/UML_DIAGRAMS.md` pour le code source Mermaid complet des diagrammes).*

### 3.2 Modèle Relationnel des Données (Prisma / PostgreSQL)
Le schéma relationnel est articulé autour des tables principales :
- `User` & `StudentProfile`
- `Faculty`, `Department`, `Program`, `Promotion`
- `Service` & `ComplaintCategory`
- `Complaint`, `ComplaintResponse`, `ComplaintHistory`, `Attachment`, `Notification`

---

## CHAPITRE IV : IMPLÉMENTATION LOGICIELLE

### 4.1 Architecture du Code (Clean Architecture)
Le projet applique une séparation claire des responsabilités :
- **Couche Présentation** : Composants React & Pages App Router Next.js ;
- **Couche Application / Contrôleurs** : Server Actions Next.js (`auth.actions.ts`, `complaint.actions.ts`, `admin.actions.ts`) ;
- **Couche Domaine & Services** : Logique métier pure (`ComplaintService`, `NotificationService`, `StatsService`) ;
- **Couche Persistance** : Prisma ORM avec requêtes optimisées et transactions ACID (`prisma.$transaction`).

### 4.2 Génération de la Référence Unique
Chaque réclamation se voit attribuer un identifiant unique calculé selon la formule :
$$\text{Référence} = \text{"UPL-REC"} - \text{Année} - \text{Séquence (sur 6 chiffres)}$$
Exemple : `UPL-REC-2026-000001`.

### 4.3 Système de Notifications In-App
Chaque transition d'état ou ajout de réponse déclenche l'écriture d'une notification ciblée avec compteur dynamique sur la barre de navigation.

---

## CHAPITRE V : TESTS ET RÉSULTATS

### 5.1 Plan de Tests Validés
1. **Tests d'authentification et de sécurité** : Vérification de l'impossibilité pour un étudiant d'accéder à l'espace `/admin` ou aux réclamations d'un tiers (rejet 403 / redirection sécurisée).
2. **Tests du workflow complet** :
   - Dépôt par l'étudiant avec pièce jointe $\rightarrow$ État `NEW` ;
   - Prise en charge par le Staff FSI $\rightarrow$ État `IN_PROGRESS` avec écriture dans l'historique ;
   - Demande de complément $\rightarrow$ État `WAITING_INFO` $\rightarrow$ Réponse de l'étudiant $\rightarrow$ Retour automatique en `IN_PROGRESS` ;
   - Résolution $\rightarrow$ État `RESOLVED` $\rightarrow$ Clôture définitive $\rightarrow$ État `CLOSED`.
3. **Tests de responsive design** : Testé avec succès sur formats 320px, 375px (iPhone), 768px (iPad) et 1440px (Desktop).

---

## CONCLUSION ET RECOMMANDATIONS

Le projet **« UPL Réclamations »** répond rigoureusement aux exigences académiques et techniques d'un travail de fin d'études en informatique. Il apporte une réponse concrète, moderne et déployable pour améliorer la gouvernance des flux estudiantins à l'Université Protestante de Lubumbashi.

### Recommandations pour les évolutions futures :
1. Interconnexion par API REST/GraphQL avec le logiciel central de scolarité de l'UPL ;
2. Intégration d'un module d'envoi d'alertes par SMS pour les convocations urgentes ;
3. Mise en place d'une application mobile native complémentaire (React Native).
