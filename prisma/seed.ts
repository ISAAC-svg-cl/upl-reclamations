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

  const passwordHashAdmin = await bcrypt.hash("12345678", 10);
  const passwordHashStaff = await bcrypt.hash("decanat123", 10);
  const passwordHashSecretariat = await bcrypt.hash("secretariat123", 10);
  const passwordHashStudent = await bcrypt.hash("etudiant123", 10);

  // 1. Création de la Faculté des Sciences Informatiques UPL
  const facultyFSI = await prisma.faculty.create({
    data: {
      name: "Faculté des Sciences Informatiques",
      code: "FSI",
      description: "Formation en Ingénierie Logicielle, Systèmes d'Information et Télécommunications",
    },
  });

  // 2. Création des Départements / Filières FSI
  const deptGL = await prisma.department.create({
    data: {
      facultyId: facultyFSI.id,
      name: "Génie Logiciel",
      code: "GL",
      description: "Conception, développement logiciel, web, mobile et architectures cloud",
    },
  });

  const deptIA = await prisma.department.create({
    data: {
      facultyId: facultyFSI.id,
      name: "Intelligence Artificielle",
      code: "IA",
      description: "Machine learning, data science, vision par ordinateur et automatisation",
    },
  });

  const deptSI = await prisma.department.create({
    data: {
      facultyId: facultyFSI.id,
      name: "Systèmes & Réseaux / Systèmes Informatiques",
      code: "SI",
      description: "Infrastructures réseaux, administration systèmes, sécurité et télécoms",
    },
  });

  const deptIG = await prisma.department.create({
    data: {
      facultyId: facultyFSI.id,
      name: "Informatique de Gestion",
      code: "IG",
      description: "Systèmes d'information d'entreprise, bases de données et gestion informatisée",
    },
  });

  // 3. Programmes UPL
  const progGL = await prisma.program.create({
    data: {
      departmentId: deptGL.id,
      name: "Génie Logiciel",
      code: "PROG-GL",
    },
  });

  const progIA = await prisma.program.create({
    data: {
      departmentId: deptIA.id,
      name: "Intelligence Artificielle",
      code: "PROG-IA",
    },
  });

  const progSI = await prisma.program.create({
    data: {
      departmentId: deptSI.id,
      name: "Systèmes & Réseaux / Systèmes Informatiques",
      code: "PROG-SI",
    },
  });

  const progIG = await prisma.program.create({
    data: {
      departmentId: deptIG.id,
      name: "Informatique de Gestion",
      code: "PROG-IG",
    },
  });

  // 4. Promotions UPL
  // Génie Logiciel
  const promoBAC1GL = await prisma.promotion.create({
    data: { programId: progGL.id, name: "BAC 1", yearLevel: "BAC 1" },
  });
  const promoBAC2GL = await prisma.promotion.create({
    data: { programId: progGL.id, name: "BAC 2", yearLevel: "BAC 2" },
  });
  const promoBAC3GL = await prisma.promotion.create({
    data: { programId: progGL.id, name: "BAC 3", yearLevel: "BAC 3" },
  });
  const promoBAC4GL = await prisma.promotion.create({
    data: { programId: progGL.id, name: "BAC 4", yearLevel: "BAC 4" },
  });

  // Intelligence Artificielle
  const promoBAC1IA = await prisma.promotion.create({
    data: { programId: progIA.id, name: "BAC 1", yearLevel: "BAC 1" },
  });
  const promoBAC2IA = await prisma.promotion.create({
    data: { programId: progIA.id, name: "BAC 2", yearLevel: "BAC 2" },
  });
  const promoBAC3IA = await prisma.promotion.create({
    data: { programId: progIA.id, name: "BAC 3", yearLevel: "BAC 3" },
  });
  const promoBAC4IA = await prisma.promotion.create({
    data: { programId: progIA.id, name: "BAC 4", yearLevel: "BAC 4" },
  });

  // Systèmes & Réseaux / Systèmes Informatiques
  const promoBAC1SI = await prisma.promotion.create({
    data: { programId: progSI.id, name: "BAC 1", yearLevel: "BAC 1" },
  });
  const promoBAC2SI = await prisma.promotion.create({
    data: { programId: progSI.id, name: "BAC 2", yearLevel: "BAC 2" },
  });
  const promoBAC3SI = await prisma.promotion.create({
    data: { programId: progSI.id, name: "BAC 3", yearLevel: "BAC 3" },
  });
  const promoBAC4SI = await prisma.promotion.create({
    data: { programId: progSI.id, name: "BAC 4", yearLevel: "BAC 4" },
  });

  // Informatique de Gestion
  const promoBAC1IG = await prisma.promotion.create({
    data: { programId: progIG.id, name: "BAC 1", yearLevel: "BAC 1" },
  });
  const promoBAC2IG = await prisma.promotion.create({
    data: { programId: progIG.id, name: "BAC 2", yearLevel: "BAC 2" },
  });
  const promoBAC3IG = await prisma.promotion.create({
    data: { programId: progIG.id, name: "BAC 3", yearLevel: "BAC 3" },
  });
  const promoBAC4IG = await prisma.promotion.create({
    data: { programId: progIG.id, name: "BAC 4", yearLevel: "BAC 4" },
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
      matricule: "upl@1234",
      firstName: "Admin",
      lastName: "UPL",
      phone: "+243 81 234 5678",
      role: "ADMIN",
      passwordHash: passwordHashAdmin,
    },
  });

  // Responsable Décanat FSI : Madame Rose
  const userStaffFSI = await prisma.user.create({
    data: {
      email: "decanat.fsi@upl-rdc.net",
      matricule: "upl@1234",
      firstName: "Madame",
      lastName: "Rose",
      phone: "+243 99 876 5432",
      role: "STAFF",
      serviceId: srvDecanatFSI.id,
      facultyId: facultyFSI.id,
      passwordHash: passwordHashStaff,
    },
  });

  // Secrétaire de la Faculté des Sciences Informatiques : Mr Junior
  const userStaffSecretariat = await prisma.user.create({
    data: {
      email: "secretariat.fsi@upl-rdc.net",
      matricule: "upl@1234",
      firstName: "Mr",
      lastName: "Junior",
      phone: "+243 81 999 8877",
      role: "STAFF",
      serviceId: srvDecanatFSI.id,
      facultyId: facultyFSI.id,
      passwordHash: passwordHashSecretariat,
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

  console.log("✅ Initialisation de la base de données UPL (Vierge) réussie !");
  console.log("--------------------------------------------------");
  console.log("👤 Administrateur Système : upl@1234 (12345678) / admin@upl-rdc.net");
  console.log("👤 Décanat FSI (Madame Rose) : upl@1234 (decanat123) / decanat.fsi@upl-rdc.net");
  console.log("👤 Secrétaire FSI (Mr Junior) : upl@1234 (secretariat123) / secretariat.fsi@upl-rdc.net");
  console.log("👤 Secrétariat Académique : STAFF-ACA-02 (decanat123) / sg.acad@upl-rdc.net");
  console.log("📋 0 Réclamations | 0 Étudiants fictifs (Prêt pour de vraies inscriptions)");
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
