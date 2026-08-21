# DIAGRAMMES UML — PROJET DE FIN D'ÉTUDES
## Application Web de Gestion des Réclamations des Étudiants (UPL)

---

## 1. Diagramme de Cas d'Utilisation Global

```mermaid
flowchart TB
    subgraph Acteurs
        E["👨‍🎓 Étudiant UPL"]
        S["👔 Responsable de Service / Staff"]
        A["🛡️ Administrateur Central UPL"]
        SYS["⚙️ Système (Automate)"]
    end

    subgraph "Système UPL Réclamations"
        UC1(["S'authentifier / Gérer son profil"])
        UC2(["Déposer une réclamation avec justificatifs"])
        UC3(["Consulter le suivi de ses dossiers"])
        UC4(["Répondre et dialoguer sur un dossier"])
        UC5(["Recevoir des notifications"])
        
        UC6(["Consulter la file des dossiers du service"])
        UC7(["Mettre à jour le statut (En cours, Traitée, etc.)"])
        UC8(["Demander un complément d'information"])
        UC9(["Transférer à un autre service"])
        UC10(["Rédiger une note interne"])
        
        UC11(["Superviser toutes les réclamations"])
        UC12(["Gérer les utilisateurs et rôles"])
        UC13(["Gérer les référentiels (Facultés, Services, Catégories)"])
        UC14(["Consulter les statistiques et rapports décanaux"])
        
        UC15(["Générer la référence unique UPL-REC"])
        UC16(["Enregistrer l'historique inaltérable (Audit Trail)"])
    end

    E --> UC1
    E --> UC2
    E --> UC3
    E --> UC4
    E --> UC5

    S --> UC1
    S --> UC6
    S --> UC7
    S --> UC8
    S --> UC9
    S --> UC10
    S --> UC5

    A --> UC1
    A --> UC11
    A --> UC12
    A --> UC13
    A --> UC14

    UC2 -.->|déclenche| UC15
    UC7 -.->|déclenche| UC16
    UC8 -.->|déclenche| UC5
    UC7 -.->|déclenche| UC5
```

---

## 2. Diagramme de Classes du Domaine

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +String matricule
        +String passwordHash
        +String firstName
        +String lastName
        +String phone
        +Role role
        +Boolean isActive
        +DateTime createdAt
    }

    class StudentProfile {
        +String id
        +String academicYear
        +String currentLevel
    }

    class Faculty {
        +String id
        +String name
        +String code
        +String description
        +Boolean isActive
    }

    class Department {
        +String id
        +String name
        +String code
    }

    class Promotion {
        +String id
        +String name
        +String yearLevel
    }

    class Service {
        +String id
        +String name
        +String code
        +String email
    }

    class ComplaintCategory {
        +String id
        +String name
        +String code
        +Int slaDays
    }

    class Complaint {
        +String id
        +String reference
        +String subject
        +String description
        +ComplaintPriority priority
        +ComplaintStatus status
        +DateTime resolvedAt
        +DateTime closedAt
        +DateTime createdAt
    }

    class ComplaintResponse {
        +String id
        +String message
        +Boolean isInternal
        +DateTime createdAt
    }

    class ComplaintHistory {
        +String id
        +ComplaintStatus fromStatus
        +ComplaintStatus toStatus
        +String reason
        +DateTime createdAt
    }

    class Attachment {
        +String id
        +String fileName
        +String fileUrl
        +Int fileSize
        +String mimeType
    }

    class Notification {
        +String id
        +String title
        +String message
        +String link
        +Boolean isRead
        +DateTime createdAt
    }

    User "1" -- "0..1" StudentProfile : possède
    User "1" -- "0..*" Complaint : dépose
    User "1" -- "0..*" ComplaintResponse : rédige
    User "1" -- "0..*" Notification : reçoit
    User "0..*" -- "0..1" Service : appartient à
    User "0..*" -- "0..1" Faculty : rattaché à

    Faculty "1" -- "1..*" Department : regroupe
    Department "1" -- "1..*" Promotion : organise
    Promotion "1" -- "0..*" StudentProfile : inscrit

    Service "1" -- "0..*" ComplaintCategory : gère par défaut
    Service "1" -- "0..*" Complaint : instruit

    ComplaintCategory "1" -- "0..*" Complaint : catégorise
    Complaint "1" -- "0..*" ComplaintResponse : contient
    Complaint "1" -- "1..*" ComplaintHistory : trace
    Complaint "1" -- "0..*" Attachment : comprend
    ComplaintResponse "1" -- "0..*" Attachment : peut joindre
```

---

## 3. Diagramme de Séquence : Soumission d'une Réclamation

```mermaid
sequenceDiagram
    autonumber
    actor Etudiant as 👨‍🎓 Étudiant
    participant UI as 🖥️ Interface Client
    participant Action as ⚙️ Server Action (createComplaint)
    participant Srv as 🧩 ComplaintService
    participant DB as 🗄️ PostgreSQL / Prisma
    participant Notif as 🔔 NotificationService

    Etudiant->>UI: Remplit formulaire + Upload pièces jointes
    UI->>Action: createComplaintAction(data)
    Action->>Action: Valide schéma Zod + Vérifie session JWT
    Action->>Srv: createComplaint(user, data)
    Srv->>DB: count() pour générer la référence (ex: UPL-REC-2026-000001)
    DB-->>Srv: Retourne numéro d'ordre
    Srv->>DB: $transaction [create Complaint + create History + create Notif]
    DB-->>Srv: Confirmation transaction
    Srv-->>Action: Objet Complaint créé
    Action-->>UI: Succès + Redirection vers /student/complaints/[id]
    UI-->>Etudiant: Affichage du dossier et timeline
```

---

## 4. Diagramme de Séquence : Instruction et Changement de Statut

```mermaid
sequenceDiagram
    autonumber
    actor Staff as 👔 Responsable Service
    actor Etudiant as 👨‍🎓 Étudiant
    participant UI as 🖥️ Portail Staff
    participant Action as ⚙️ Server Action (updateStatus)
    participant DB as 🗄️ PostgreSQL / Prisma

    Staff->>UI: Sélectionne un statut (ex: RESOLVED) + Saisit motif
    UI->>Action: updateStatusAction(complaintId, status, reason)
    Action->>Action: Vérifie RBAC (Agent autorisé sur ce service)
    Action->>DB: $transaction [update Complaint + create ComplaintHistory + create Notification]
    DB-->>Action: Confirmation mise à jour
    Action-->>UI: Notification visuelle de succès
    DB-->>Etudiant: Notification in-app temps réel reçue
```

---

## 5. Diagramme d'Activité : Cycle Complet du Traitement

```mermaid
stateDiagram-v2
    [*] --> Redaction: L'étudiant formule sa réclamation
    Redaction --> Verification: Soumission du formulaire
    
    state Verification {
        [*] --> ControleFormat
        ControleFormat --> AttributionRef: Données conformes
        AttributionRef --> [*]
    }
    
    Verification --> AttributionService: Notification au service compétent
    
    state Instruction {
        AttributionService --> ExamenDossier: Prise en charge (IN_PROGRESS)
        ExamenDossier --> DemandeComplement: Pièce manquante
        DemandeComplement --> ReponseEtudiant: L'étudiant fournit la pièce (WAITING_INFO)
        ReponseEtudiant --> ExamenDossier: Reprise de l'instruction
        
        ExamenDossier --> TransfertService: Compétence d'un autre décanat (FORWARDED)
        TransfertService --> ExamenDossier
    }
    
    Instruction --> Decision: Évaluation finale par le jury / service
    Decision --> Traitee: Réclamation fondée (RESOLVED)
    Decision --> Rejetee: Réclamation infondée (REJECTED)
    
    Traitee --> Cloture: Confirmation ou délai écoulé (CLOSED)
    Rejetee --> Cloture: Archivage
    Cloture --> [*]
```
