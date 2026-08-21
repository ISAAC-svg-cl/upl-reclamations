import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du peuplement de la base de données UPL Réclamations...");

  // Nettoyage préalable (ordre inverse des clés étrangères)
  await prisma.notification.deleteMany();
  await prisma.complaintHistory.deleteMany();
  await prisma.complaintResponse.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.complaintCategory.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.program.deleteMany();
  await prisma.department.deleteMany();
  await prisma.faculty.deleteMany();
  await prisma.service.deleteMany();

  const passwordHashAdmin = await bcrypt.hash("admin123", 10);
  const passwordHashStaff = await bcrypt.hash("staff123", 10);
  const passwordHashStudent = await bcrypt.hash("etudiant123", 10);

  // 1. Création des Facultés UPL
  const facultyFSI = await prisma.faculty.create({
    data: {
      name: "Faculté des Sciences Informatiques",
      code: "FSI",
      description: "Formation en Ingénierie Logicielle, Systèmes d'Information et Télécommunications",
    },
  });

  const facultyFSE = await prisma.faculty.create({
    data: {
      name: "Faculté des Sciences Économiques et de Gestion",
      code: "FSEG",
      description: "Gestion Financière, Économie de Développement, Marketing et Management",
    },
  });

  const facultyDroit = await prisma.faculty.create({
    data: {
      name: "Faculté de Droit",
      code: "FDROIT",
      description: "Droit Public, Droit Privé et Judiciaire, Droit des Affaires",
    },
  });

  const facultyPoly = await prisma.faculty.create({
    data: {
      name: "Faculté Polytechnique",
      code: "FPOLY",
      description: "Génie Électrique, Génie Électronique, Génie Civil et Mines",
    },
  });

  const facultyTheo = await prisma.faculty.create({
    data: {
      name: "Faculté de Théologie Protestante",
      code: "FTHEO",
      description: "Théologie Pastorale, Éthique Chrétienne et Leadership",
    },
  });

  const facultySIC = await prisma.faculty.create({
    data: {
      name: "Faculté des Sciences de l'Information et de la Communication",
      code: "FSIC",
      description: "Journalisme, Communication des Organisations et Relations Publiques",
    },
  });

  // 2. Création des Départements
  const deptGLSI = await prisma.department.create({
    data: {
      facultyId: facultyFSI.id,
      name: "Génie Logiciel & Systèmes d'Information",
      code: "GLSI",
      description: "Développement web, mobile, architecture logicielle et cloud",
    },
  });

  const deptRT = await prisma.department.create({
    data: {
      facultyId: facultyFSI.id,
      name: "Réseaux & Télécommunications",
      code: "RT",
      description: "Infrastructures réseaux, sécurité et télécoms",
    },
  });

  const deptIG = await prisma.department.create({
    data: {
      facultyId: facultyFSI.id,
      name: "Informatique de Gestion",
      code: "IG",
      description: "Systèmes d'information d'entreprise et bases de données",
    },
  });

  const deptGestion = await prisma.department.create({
    data: {
      facultyId: facultyFSE.id,
      name: "Gestion Financière & Comptabilité",
      code: "GFC",
      description: "Comptabilité, audit, banque et ingénierie financière",
    },
  });

  const deptEcon = await prisma.department.create({
    data: {
      facultyId: facultyFSE.id,
      name: "Économie de Développement",
      code: "EDEV",
      description: "Macroéconomie, politiques de développement et statistiques",
    },
  });

  const deptDroitPrive = await prisma.department.create({
    data: {
      facultyId: facultyDroit.id,
      name: "Droit Privé & Judiciaire",
      code: "DPJ",
      description: "Procédure civile, droit pénal et droit des obligations",
    },
  });

  const deptDroitPublic = await prisma.department.create({
    data: {
      facultyId: facultyDroit.id,
      name: "Droit Public & International",
      code: "DPI",
      description: "Droit constitutionnel, administratif et international",
    },
  });

  const deptPoly = await prisma.department.create({
    data: {
      facultyId: facultyPoly.id,
      name: "Génie Appliqué",
      code: "GAPPL",
      description: "Tronc commun sciences pour l'ingénieur",
    },
  });

  const deptTheo = await prisma.department.create({
    data: {
      facultyId: facultyTheo.id,
      name: "Études Théologiques",
      code: "ETHEO",
      description: "Ancien & Nouveau Testament, histoire de l'Église",
    },
  });

  const deptSIC = await prisma.department.create({
    data: {
      facultyId: facultySIC.id,
      name: "Communication & Médias",
      code: "CMED",
      description: "Presse, audiovisuel et communication digitale",
    },
  });

  // 3. Programmes LMD
  const progInfo = await prisma.program.create({
    data: {
      departmentId: deptGLSI.id,
      name: "Licence en Sciences Informatiques (LMD)",
      code: "LIC-FSI",
    },
  });

  const progRT = await prisma.program.create({
    data: {
      departmentId: deptRT.id,
      name: "Licence Réseaux & Télécoms",
      code: "LIC-RT",
    },
  });

  const progIG = await prisma.program.create({
    data: {
      departmentId: deptIG.id,
      name: "Licence Informatique de Gestion",
      code: "LIC-IG",
    },
  });

  const progGestion = await prisma.program.create({
    data: {
      departmentId: deptGestion.id,
      name: "Licence en Sciences de Gestion",
      code: "LIC-GESTION",
    },
  });

  const progEcon = await prisma.program.create({
    data: {
      departmentId: deptEcon.id,
      name: "Licence en Économie",
      code: "LIC-ECON",
    },
  });

  const progDroitPrive = await prisma.program.create({
    data: {
      departmentId: deptDroitPrive.id,
      name: "Licence en Droit Privé",
      code: "LIC-DPJ",
    },
  });

  const progDroitPublic = await prisma.program.create({
    data: {
      departmentId: deptDroitPublic.id,
      name: "Licence en Droit Public",
      code: "LIC-DPI",
    },
  });

  const progPoly = await prisma.program.create({
    data: {
      departmentId: deptPoly.id,
      name: "Licence Polytechnique",
      code: "LIC-POLY",
    },
  });

  const progTheo = await prisma.program.create({
    data: {
      departmentId: deptTheo.id,
      name: "Licence en Théologie",
      code: "LIC-THEO",
    },
  });

  const progSIC = await prisma.program.create({
    data: {
      departmentId: deptSIC.id,
      name: "Licence en Communication",
      code: "LIC-SIC",
    },
  });

  // 4. Promotions / Classes UPL (Filières)
  const promoL3GLSI = await prisma.promotion.create({
    data: {
      programId: progInfo.id,
      name: "L3 Génie Logiciel & Systèmes d'Information",
      yearLevel: "L3",
    },
  });

  const promoL2Info = await prisma.promotion.create({
    data: {
      programId: progInfo.id,
      name: "L2 Informatique Générale",
      yearLevel: "L2",
    },
  });

  const promoL1Info = await prisma.promotion.create({
    data: {
      programId: progInfo.id,
      name: "L1 Informatique (Tronc Commun LMD)",
      yearLevel: "L1",
    },
  });

  const promoM1GLSI = await prisma.promotion.create({
    data: {
      programId: progInfo.id,
      name: "Master 1 Génie Logiciel & Cloud",
      yearLevel: "M1",
    },
  });

  const promoL3RT = await prisma.promotion.create({
    data: {
      programId: progRT.id,
      name: "L3 Réseaux & Télécommunications",
      yearLevel: "L3",
    },
  });

  const promoL3IG = await prisma.promotion.create({
    data: {
      programId: progIG.id,
      name: "L3 Informatique de Gestion",
      yearLevel: "L3",
    },
  });

  const promoL1FSEG = await prisma.promotion.create({
    data: {
      programId: progGestion.id,
      name: "L1 Économie & Gestion (Tronc Commun)",
      yearLevel: "L1",
    },
  });

  const promoL3GF = await prisma.promotion.create({
    data: {
      programId: progGestion.id,
      name: "L3 Gestion Financière & Comptabilité",
      yearLevel: "L3",
    },
  });

  const promoL3ED = await prisma.promotion.create({
    data: {
      programId: progEcon.id,
      name: "L3 Économie de Développement",
      yearLevel: "L3",
    },
  });

  const promoL1Droit = await prisma.promotion.create({
    data: {
      programId: progDroitPrive.id,
      name: "L1 Droit (Tronc Commun)",
      yearLevel: "L1",
    },
  });

  const promoL3DPJ = await prisma.promotion.create({
    data: {
      programId: progDroitPrive.id,
      name: "L3 Droit Privé & Judiciaire",
      yearLevel: "L3",
    },
  });

  const promoL3DPI = await prisma.promotion.create({
    data: {
      programId: progDroitPublic.id,
      name: "L3 Droit Public & International",
      yearLevel: "L3",
    },
  });

  const promoL1Poly = await prisma.promotion.create({
    data: {
      programId: progPoly.id,
      name: "L1 Préparatoire Polytechnique",
      yearLevel: "L1",
    },
  });

  const promoL3Poly = await prisma.promotion.create({
    data: {
      programId: progPoly.id,
      name: "L3 Génie Civil & Mines",
      yearLevel: "L3",
    },
  });

  const promoL3Theo = await prisma.promotion.create({
    data: {
      programId: progTheo.id,
      name: "L3 Théologie Pastorale",
      yearLevel: "L3",
    },
  });

  const promoL3SIC = await prisma.promotion.create({
    data: {
      programId: progSIC.id,
      name: "L3 Journalisme & Communication",
      yearLevel: "L3",
    },
  });

  // 5. Services Institutionnels UPL
  const srvAcad = await prisma.service.create({
    data: {
      name: "Secrétariat Général Académique",
      code: "SEC_ACAD",
      email: "sg.acad@upl-rdc.net",
      description: "Gestion des inscriptions, équivalences et coordination académique générale",
    },
  });

  const srvDecanatFSI = await prisma.service.create({
    data: {
      name: "Décanat Faculté des Sciences Informatiques",
      code: "DEC_FSI",
      email: "decanat.fsi@upl-rdc.net",
      description: "Organisation des jurys, publication des résultats et recours académiques FSI",
    },
  });

  const srvFinances = await prisma.service.create({
    data: {
      name: "Direction des Finances & Comptabilité",
      code: "FINANCES",
      email: "finances@upl-rdc.net",
      description: "Validation des frais académiques, droits d'enrôlement et bordereaux bancaires",
    },
  });

  const srvApparitorat = await prisma.service.create({
    data: {
      name: "Apparitorat Central",
      code: "APPARITORAT",
      email: "apparitorat@upl-rdc.net",
      description: "Délivrance des cartes d'étudiant, attestations et relevés de notes officiels",
    },
  });

  // 6. Catégories de Réclamations
  const catNotes = await prisma.complaintCategory.create({
    data: {
      name: "Erreur de cote / Note manquante",
      code: "NOTES",
      description: "Omission de note, erreur de transcription sur la grille ou contestation de délibération",
      slaDays: 3,
      defaultServiceId: srvDecanatFSI.id,
    },
  });

  const catFrais = await prisma.complaintCategory.create({
    data: {
      name: "Frais académiques et Enrôlement",
      code: "FRAIS",
      description: "Problème d'apurement de bordereau bancaire, blocage d'enrôlement aux sessions",
      slaDays: 4,
      defaultServiceId: srvFinances.id,
    },
  });

  const catDocs = await prisma.complaintCategory.create({
    data: {
      name: "Documents et Attestations",
      code: "DOCS",
      description: "Demande urgente ou réclamation relative aux relevés de cotes, attestations de fréquentation",
      slaDays: 5,
      defaultServiceId: srvApparitorat.id,
    },
  });

  const catCarte = await prisma.complaintCategory.create({
    data: {
      name: "Carte d'étudiant & Identité",
      code: "CARTE",
      description: "Erreur d'impression, retard de livraison ou duplicata de carte biométrique",
      slaDays: 7,
      defaultServiceId: srvApparitorat.id,
    },
  });

  const catTech = await prisma.complaintCategory.create({
    data: {
      name: "Problème technique / Portail",
      code: "TECH",
      description: "Difficultés de connexion, bug sur l'espace numérique ou application",
      slaDays: 2,
      defaultServiceId: srvAcad.id,
    },
  });

  // 7. Création des Utilisateurs
  // Administrateur Système UPL
  const userAdmin = await prisma.user.create({
    data: {
      email: "admin@upl-rdc.net",
      matricule: "ADM-001",
      firstName: "Admin",
      lastName: "UPL",
      phone: "+243 81 234 5678",
      role: "ADMIN",
      passwordHash: passwordHashAdmin,
    },
  });

  // Responsable Décanat FSI
  const userStaffFSI = await prisma.user.create({
    data: {
      email: "decanat.fsi@upl-rdc.net",
      matricule: "ENS-FSI-04",
      firstName: "Prof. Jean-Marc",
      lastName: "KABILA",
      phone: "+243 99 876 5432",
      role: "STAFF",
      serviceId: srvDecanatFSI.id,
      facultyId: facultyFSI.id,
      passwordHash: passwordHashStaff,
    },
  });

  // Responsable Secrétariat Académique
  const userStaffAcad = await prisma.user.create({
    data: {
      email: "sg.acad@upl-rdc.net",
      matricule: "STAFF-ACA-02",
      firstName: "Dr. Thérèse",
      lastName: "MWENZE",
      phone: "+243 82 111 2233",
      role: "STAFF",
      serviceId: srvAcad.id,
      passwordHash: passwordHashStaff,
    },
  });

  // Étudiant Principal : Edmond NKUNA Isaac (Matricule 2024022105)
  const userStudentEdmond = await prisma.user.create({
    data: {
      email: "edmond.nkuna@etudiant.upl-rdc.net",
      matricule: "2024022105",
      firstName: "Edmond Isaac",
      lastName: "NKUNA",
      phone: "+243 99 123 4567",
      role: "STUDENT",
      passwordHash: passwordHashStudent,
      studentProfile: {
        create: {
          promotionId: promoL3GLSI.id,
          academicYear: "2025-2026",
          currentLevel: "L3",
        },
      },
    },
  });

  // Deuxième étudiante : Grâce MUKENDI
  const userStudentGrace = await prisma.user.create({
    data: {
      email: "grace.mukendi@etudiant.upl-rdc.net",
      matricule: "2024018892",
      firstName: "Grâce",
      lastName: "MUKENDI",
      phone: "+243 84 555 4433",
      role: "STUDENT",
      passwordHash: passwordHashStudent,
      studentProfile: {
        create: {
          promotionId: promoL2Info.id,
          academicYear: "2025-2026",
          currentLevel: "L2",
        },
      },
    },
  });

  // 8. Création de Réclamations Réalistes pour Edmond NKUNA Isaac
  const comp1 = await prisma.complaint.create({
    data: {
      reference: "UPL-REC-2026-000001",
      subject: "Omission de la note de Conception Orientée Objet & UML (Examen Mi-Session)",
      description:
        "Monsieur le Doyen de la Faculté des Sciences Informatiques, lors de la publication des grilles de délibération de la session de mi-parcours, ma note pour l'évaluation de Conception Orientée Objet et UML apparaît comme 'ABS' (Absent) alors que j'ai bel et bien composé, signé la fiche d'émargement et remis ma copie d'examen.",
      priority: "HIGH",
      status: "IN_PROGRESS",
      studentId: userStudentEdmond.id,
      categoryId: catNotes.id,
      serviceId: srvDecanatFSI.id,
      facultyId: facultyFSI.id,
      departmentId: deptGLSI.id,
      promotionId: promoL3GLSI.id,
      history: {
        create: [
          {
            authorId: userStudentEdmond.id,
            fromStatus: null,
            toStatus: "NEW",
            reason: "Dépôt initial de la réclamation académique par l'étudiant Edmond NKUNA Isaac",
          },
          {
            authorId: userStaffFSI.id,
            fromStatus: "NEW",
            toStatus: "IN_PROGRESS",
            reason: "Prise en charge par le Décanat FSI pour vérification des procès-verbaux d'émargement",
          },
        ],
      },
      responses: {
        create: [
          {
            authorId: userStaffFSI.id,
            message:
              "Bonjour cher Edmond NKUNA Isaac. Votre réclamation a bien été reçue par le Décanat FSI. Nous avons ouvert le dossier et nous vérifions actuellement les fiches d'émargement physiques auprès de la chaire d'enseignement.",
            isInternal: false,
          },
        ],
      },
    },
  });

  // Réclamation Frais pour Grâce MUKENDI
  const comp2 = await prisma.complaint.create({
    data: {
      reference: "UPL-REC-2026-000002",
      subject: "Validation du bordereau de paiement 2ème tranche des frais académiques",
      description:
        "Bonjour, j'ai effectué le versement de la deuxième tranche des frais académiques à la banque le 10 février 2026. Cependant, mon statut sur le portail indique toujours des frais en suspens.",
      priority: "MEDIUM",
      status: "RESOLVED",
      studentId: userStudentGrace.id,
      categoryId: catFrais.id,
      serviceId: srvFinances.id,
      facultyId: facultyFSI.id,
      departmentId: deptGLSI.id,
      promotionId: promoL2Info.id,
      history: {
        create: [
          {
            authorId: userStudentGrace.id,
            fromStatus: null,
            toStatus: "NEW",
            reason: "Soumission avec bordereau bancaire",
          },
          {
            authorId: userStaffAcad.id,
            fromStatus: "NEW",
            toStatus: "RESOLVED",
            reason: "Bordereau vérifié et validé auprès de la comptabilité UPL",
          },
        ],
      },
      responses: {
        create: [
          {
            authorId: userStaffAcad.id,
            message:
              "Bonjour Grâce. Votre paiement a été vérifié et apuré auprès de la banque partenaire. Votre statut d'enrôlement est désormais en règle.",
            isInternal: false,
          },
        ],
      },
    },
  });

  // Notifications In-App
  await prisma.notification.create({
    data: {
      userId: userStudentEdmond.id,
      title: "Réclamation en cours de traitement",
      message: `Votre réclamation n° ${comp1.reference} a été prise en charge par le Décanat FSI.`,
      link: `/student/complaints/${comp1.id}`,
      type: "STATUS_UPDATE",
    },
  });

  await prisma.notification.create({
    data: {
      userId: userStaffFSI.id,
      title: "Nouvelle réclamation assignée",
      message: `Une réclamation urgente (${comp1.reference}) a été soumise par l'étudiant Edmond NKUNA Isaac.`,
      link: `/staff/complaints/${comp1.id}`,
      type: "NEW_ASSIGNMENT",
    },
  });

  console.log("✅ Peuplement UPL réussi !");
  console.log("--------------------------------------------------");
  console.log("👤 Administrateur : admin@upl-rdc.net (admin123)");
  console.log("👤 Décanat FSI : decanat.fsi@upl-rdc.net (staff123)");
  console.log("👤 Étudiant Principal : Edmond NKUNA Isaac");
  console.log("   Matricule : 2024022105");
  console.log("   Email : edmond.nkuna@etudiant.upl-rdc.net (etudiant123)");
  console.log("   Promotion : L3 Génie Logiciel & Systèmes d'Information");
  console.log("--------------------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le peuplement :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
